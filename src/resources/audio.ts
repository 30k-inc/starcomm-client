import type { BaseClient } from "../base";
import type {
  AudioEventMap,
  AudioEventType,
  AudioFrame,
  AudioListenOptions,
  AudioPttEvent,
} from "../types/audio";

/**
 * Minimum bytes for a valid server audio envelope.
 * Layout: netId (1 byte) + senderId (20 bytes) + SCOP magic (4 bytes) + seq (2 bytes) + Opus payload.
 */
const ENVELOPE_MIN_BYTES = 28;
const SENDER_ID_LENGTH = 20;
const SCOP_HEADER_LENGTH = 6; // 4 bytes magic "SCOP" + 2 bytes sequence

/**
 * Listen-only voice audio resource.
 *
 * Opens a dedicated WebSocket to the shard in `serviceListen` mode,
 * receives Opus audio frames and PTT events, and supports dynamic
 * net add/remove without reconnecting.
 *
 * @example
 * ```typescript
 * const client = new StarCommsClient({ baseUrl, ownerApiKey, serviceKey: "scsk_..." });
 *
 * client.audio.on("audio", (frame) => {
 *   console.log(`Net ${frame.netId} — ${frame.userId} transmitting ${frame.opus.byteLength} bytes`);
 * });
 * client.audio.on("ptt.start", (evt) => {
 *   console.log(`${evt.displayName} keyed up on net ${evt.netId}`);
 * });
 *
 * await client.audio.listen({ guildId: "123456", nets: [1, 2] });
 * await client.audio.addNet(3);
 * await client.audio.removeNet(1);
 * await client.audio.stop();
 * ```
 *
 * @category Resources
 */
export class AudioResource {
  readonly #http: BaseClient;
  readonly #serviceKey: string;
  readonly #listeners = new Map<AudioEventType, Set<(data: never) => void>>();

  #ws: WebSocket | null = null;
  #consuming = false;
  #intentionalDisconnect = false;
  #guildId = "";
  #serviceUserId = "";
  #nets = new Set<number>();
  #reconnectOpts = {
    autoReconnect: true,
    initialDelayMs: 2_000,
    maxDelayMs: 30_000,
    maxAttempts: Infinity,
  };

  constructor(http: BaseClient, serviceKey: string) {
    this.#http = http;
    this.#serviceKey = serviceKey;
  }

  /** Whether the audio listener is currently connected. */
  get listening(): boolean {
    return this.#consuming;
  }

  /** Current set of net IDs being listened to. */
  get nets(): number[] {
    return Array.from(this.#nets);
  }

  /** The guild ID this listener is connected to (empty if not connected). */
  get guildId(): string {
    return this.#guildId;
  }

  /**
   * Register an event handler.
   *
   * @example
   * ```typescript
   * client.audio.on("audio", (frame) => { ... });
   * client.audio.on("ptt.start", (evt) => { ... });
   * client.audio.on("ptt.stop", (evt) => { ... });
   * client.audio.on("connected", (data) => { ... });
   * client.audio.on("disconnected", ({ reason }) => { ... });
   * client.audio.on("reconnected", ({ attempt }) => { ... });
   * client.audio.on("error", ({ reason }) => { ... });
   * ```
   */
  on<K extends AudioEventType>(event: K, handler: (data: AudioEventMap[K]) => void): this {
    let set = this.#listeners.get(event);
    if (!set) {
      set = new Set();
      this.#listeners.set(event, set);
    }
    set.add(handler as (data: never) => void);
    return this;
  }

  /** Remove a previously registered handler. */
  off<K extends AudioEventType>(event: K, handler: (data: AudioEventMap[K]) => void): this {
    this.#listeners.get(event)?.delete(handler as (data: never) => void);
    return this;
  }

  /**
   * Connect to the shard and start receiving audio.
   *
   * @param options Connection options including guildId and initial nets.
   * @throws If already listening or serviceKey is not configured.
   */
  async listen(options: AudioListenOptions): Promise<void> {
    if (this.#consuming) throw new Error("Audio listener is already active. Call stop() first.");
    if (!this.#serviceKey) throw new Error("serviceKey (scsk_...) is required for audio listening.");

    this.#guildId = options.guildId;
    this.#nets = new Set(options.nets ?? []);
    this.#intentionalDisconnect = false;
    this.#reconnectOpts = {
      autoReconnect: options.autoReconnect ?? true,
      initialDelayMs: options.initialDelayMs ?? 2_000,
      maxDelayMs: options.maxDelayMs ?? 30_000,
      maxAttempts: options.maxAttempts ?? Infinity,
    };

    await this.#connect(options.displayName ?? "");
  }

  /**
   * Add a net to listen on (without reconnecting).
   * Calls the assignments API to assign the service listener to the net.
   */
  async addNet(netId: number): Promise<void> {
    if (!this.#consuming) throw new Error("Audio listener is not active. Call listen() first.");
    if (this.#nets.has(netId)) return;

    await this.#http.ownerPost("/api/v1/assignments", {
      userId: this.#serviceUserId,
      netId,
      action: "assign",
    });
    this.#nets.add(netId);
  }

  /**
   * Remove a net from listening (without reconnecting).
   * Calls the assignments API to unassign the service listener from the net.
   */
  async removeNet(netId: number): Promise<void> {
    if (!this.#consuming) throw new Error("Audio listener is not active. Call listen() first.");
    if (!this.#nets.has(netId)) return;

    await this.#http.ownerPost("/api/v1/assignments", {
      userId: this.#serviceUserId,
      netId,
      action: "unassign",
    });
    this.#nets.delete(netId);
  }

  /**
   * Stop the audio listener. Unassigns from all nets and closes the WebSocket.
   * Will not trigger reconnection.
   */
  async stop(): Promise<void> {
    this.#intentionalDisconnect = true;
    this.#consuming = false;

    // Unassign from all nets (best-effort)
    for (const netId of this.#nets) {
      try {
        await this.#http.ownerPost("/api/v1/assignments", {
          userId: this.#serviceUserId,
          netId,
          action: "unassign",
        });
      } catch {
        // Best-effort cleanup
      }
    }
    this.#nets.clear();

    if (this.#ws) {
      try {
        this.#ws.close(1000, "client-stop");
      } catch {
        // Already closed
      }
      this.#ws = null;
    }

    this.#guildId = "";
    this.#serviceUserId = "";
  }

  // ─── Private ────────────────────────────────────────────────────────

  async #connect(displayName: string): Promise<void> {
    const wsUrl = this.#http.baseUrl.replace(/^http/, "ws") + "/ws";

    return new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(wsUrl, { headers: { authorization: `Bearer ${this.#serviceKey}` } } as any);
      this.#ws = ws;

      let joined = false;

      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        // Wait for hello from shard
      };

      ws.onmessage = (event) => {
        if (typeof event.data === "string") {
          this.#handleTextMessage(event.data, displayName, () => {
            joined = true;
            this.#consuming = true;
            this.#emit("connected", { guildId: this.#guildId });
            resolve();
          });
        } else {
          // Binary audio frame
          this.#handleBinaryMessage(event.data);
        }
      };

      ws.onerror = (err) => {
        const reason = (err as any)?.message ?? "WebSocket error";
        this.#emit("error", { reason });
        if (!joined) reject(new Error(reason));
      };

      ws.onclose = () => {
        this.#consuming = false;
        this.#ws = null;

        if (!this.#intentionalDisconnect) {
          this.#emit("disconnected", { reason: "Connection closed" });
          if (this.#reconnectOpts.autoReconnect) {
            this.#attemptReconnect(displayName);
          }
        }
      };
    });
  }

  async #attemptReconnect(displayName: string): Promise<void> {
    const { initialDelayMs, maxDelayMs, maxAttempts } = this.#reconnectOpts;
    let attempt = 0;

    while (attempt < maxAttempts && !this.#intentionalDisconnect) {
      attempt++;
      const delay = Math.min(initialDelayMs * 2 ** (attempt - 1), maxDelayMs);
      await new Promise((r) => setTimeout(r, delay));

      if (this.#intentionalDisconnect) return;

      try {
        await this.#connect(displayName);
        this.#emit("reconnected", { attempt });
        // Re-assign nets after reconnect
        for (const netId of this.#nets) {
          try {
            await this.#http.ownerPost("/api/v1/assignments", {
              userId: this.#serviceUserId,
              netId,
              action: "assign",
            });
          } catch {
            // Best-effort
          }
        }
        return;
      } catch {
        this.#emit("error", { reason: `Reconnect attempt ${attempt} failed` });
      }
    }

    this.#emit("disconnected", { reason: `Failed to reconnect after ${attempt} attempts` });
  }

  #handleTextMessage(raw: string, displayName: string, onJoined: () => void): void {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }

    const type = parsed.type as string;

    if (type === "hello") {
      // Send codec negotiation
      this.#send({ type: "audio.codec", codec: "opus" });
      // Send join
      this.#send({
        type: "join",
        guildId: this.#guildId,
        mode: "voice",
        serviceListen: true,
        displayName,
      });
      return;
    }

    if (type === "joined" || type === "voice.ready") {
      // Extract user ID from the join response
      const user = parsed.user as Record<string, unknown> | undefined;
      if (user?.id) this.#serviceUserId = String(user.id);

      // Assign to initial nets
      this.#assignInitialNets();
      onJoined();
      return;
    }

    if (type === "ptt.start" || type === "ptt.stop") {
      const data = (parsed.data ?? parsed) as Record<string, unknown>;
      const evt: AudioPttEvent = {
        userId: String(data.userId ?? ""),
        displayName: String(data.displayName ?? ""),
        netId: Number(data.netId ?? 0),
      };
      this.#emit(type as "ptt.start" | "ptt.stop", evt);
      return;
    }

    if (type === "pong" || type === "config" || type === "voice.heartbeat") {
      // Ignored control messages
      return;
    }

    if (type === "error") {
      this.#emit("error", { reason: String(parsed.message ?? "Unknown shard error") });
      return;
    }
  }

  #handleBinaryMessage(data: ArrayBuffer): void {
    const buf = new Uint8Array(data);
    if (buf.byteLength < ENVELOPE_MIN_BYTES) return;

    // Server envelope: byte 0 = netId, bytes 1..20 = senderId (20-byte zero-padded ASCII),
    // bytes 21..24 = SCOP magic, bytes 25..26 = sequence, bytes 27+ = Opus
    const netId = buf[0];
    const userId = new TextDecoder().decode(buf.slice(1, 1 + SENDER_ID_LENGTH)).replace(/\0/g, "").replace(/^0+/, "");
    const opus = buf.slice(1 + SENDER_ID_LENGTH + SCOP_HEADER_LENGTH);

    if (opus.byteLength === 0) return;

    const frame: AudioFrame = { netId, userId, opus };
    this.#emit("audio", frame);
  }

  async #assignInitialNets(): Promise<void> {
    for (const netId of this.#nets) {
      try {
        await this.#http.ownerPost("/api/v1/assignments", {
          userId: this.#serviceUserId,
          netId,
          action: "assign",
        });
      } catch {
        // Best-effort — net may already be assigned or not exist
      }
    }
  }

  #send(payload: Record<string, unknown>): void {
    if (this.#ws && this.#ws.readyState === WebSocket.OPEN) {
      this.#ws.send(JSON.stringify(payload));
    }
  }

  #emit<K extends AudioEventType>(event: K, data: AudioEventMap[K]): void {
    const handlers = this.#listeners.get(event);
    if (handlers) {
      for (const handler of handlers) (handler as (data: AudioEventMap[K]) => void)(data);
    }
  }
}
