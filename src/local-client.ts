import WebSocket from "ws";
import type {
  LocalCommand,
  LocalEventMap,
  LocalEventType,
  LocalMessage,
  LocalSnapshot,
} from "./types/local";

/**
 * Configuration for the local StarComm WebSocket client.
 * @category Local Client
 */
export interface StarCommsLocalClientConfig {
  /**
   * Host/IP of the machine running StarComm.
   * @default "127.0.0.1"
   */
  host?: string;
  /**
   * LAN control port configured in StarComm's Mobile Remote settings.
   * @default 8798
   */
  port?: number;
  /**
   * Pairing token from StarComm's Mobile Remote settings.
   * Required for authentication — the connection will receive a 401 without it.
   */
  token: string;
  /** Whether to automatically reconnect on connection loss. @default true */
  autoReconnect?: boolean;
  /** Initial delay before first reconnect attempt in ms. @default 1000 */
  initialDelayMs?: number;
  /** Maximum delay between reconnect attempts in ms. @default 15000 */
  maxDelayMs?: number;
  /** Maximum consecutive reconnect attempts before giving up. @default Infinity */
  maxAttempts?: number;
  /**
   * Enable debug logging to console.
   * @default false
   */
  debug?: boolean;
}

/**
 * Lifecycle events emitted by the local client.
 * @category Local Client
 */
export type LocalLifecycleEventType =
  | "connected"
  | "disconnected"
  | "reconnecting"
  | "reconnected"
  | "error";

/**
 * Detail payload for lifecycle events.
 * @category Local Client
 */
export interface LocalLifecycleDetail {
  reason?: string;
  attempt?: number;
}

/**
 * Handler for lifecycle events.
 * @category Local Client
 */
export type LocalLifecycleHandler = (detail: LocalLifecycleDetail) => void;

/**
 * Standalone WebSocket client for the StarComm desktop application.
 *
 * Connects to the StarComm desktop app's Mobile Remote WebSocket endpoint
 * (`ws://<host>:<port>/control?token=<pairing_token>`).
 *
 * This client is completely independent from {@link StarCommsClient} (the shard Owner API client).
 * It requires only the pairing token from StarComm's settings (Settings → Mobile Remote).
 *
 * ## PTT Modes
 *
 * - **`pttStart(netId)`** — Momentary mode. Mimics holding a physical PTT button. Releases
 *   automatically if not sustained (used by the phone app's press-and-hold gesture).
 * - **`pttHold(netId)`** — Toggle/latch mode. Tap once to lock transmission on, call
 *   `pttStop(netId)` to release. Use this for programmatic PTT.
 * - **`pttStop(netId)`** — Release transmission on a net.
 *
 * @example
 * ```typescript
 * import { StarCommsLocalClient } from "@30k/starcomm-client";
 *
 * const local = new StarCommsLocalClient({
 *   token: "your_pairing_token",
 *   // host: "127.0.0.1",  // default
 *   // port: 8798,          // default
 * });
 *
 * local.on("snapshot", (snapshot) => {
 *   console.log(`Connected as ${snapshot.displayName}`);
 *   console.log(`Active net: ${snapshot.ptt.channel}`);
 * });
 *
 * local.onLifecycle("disconnected", ({ reason }) => {
 *   console.warn("Lost connection to StarComm:", reason);
 * });
 *
 * await local.connect();
 *
 * // PTT control (use pttHold for sustained transmission)
 * local.pttHold(255);   // latch on
 * local.pttStop(255);   // release
 *
 * // Admin commands (only work if user has admin access)
 * local.adminAssign("user123", 2);
 * local.adminAcars("Fleet depart in 5 minutes");
 *
 * // Disconnect when done
 * local.disconnect();
 * ```
 *
 * @category Local Client
 */
export class StarCommsLocalClient {
  readonly #url: string;
  readonly #autoReconnect: boolean;
  readonly #initialDelayMs: number;
  readonly #maxDelayMs: number;
  readonly #maxAttempts: number;
  readonly #debug: boolean;

  readonly #listeners = new Map<string, Set<(data: never) => void>>();
  readonly #wildcardListeners = new Set<(type: string, data: LocalMessage) => void>();
  readonly #lifecycleListeners = new Map<LocalLifecycleEventType, Set<LocalLifecycleHandler>>();

  #ws: WebSocket | null = null;
  #intentionalDisconnect = false;
  #reconnectAttempt = 0;
  #reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  #connectResolve: (() => void) | null = null;
  #connectReject: ((err: Error) => void) | null = null;

  /** The most recent snapshot received from the local client. */
  snapshot: LocalSnapshot | null = null;

  constructor(config: StarCommsLocalClientConfig) {
    const host = config.host ?? "127.0.0.1";
    const port = config.port ?? 8798;
    this.#url = `ws://${host}:${port}/control?token=${encodeURIComponent(config.token)}`;
    this.#autoReconnect = config.autoReconnect ?? true;
    this.#initialDelayMs = config.initialDelayMs ?? 1_000;
    this.#maxDelayMs = config.maxDelayMs ?? 15_000;
    this.#maxAttempts = config.maxAttempts ?? Infinity;
    this.#debug = config.debug ?? false;
    this.#log("init", `url=${this.#url}`);
  }

  #log(tag: string, ...args: unknown[]): void {
    if (this.#debug) {
      console.log(`[StarComm:Local][${tag}]`, ...args);
    }
  }

  /** Whether the WebSocket is currently open. */
  get connected(): boolean {
    return this.#ws?.readyState === 1; // WebSocket.OPEN
  }

  /**
   * Open the WebSocket connection to the local StarComm app.
   * Resolves when the connection is open and the hello handshake has been sent.
   * Rejects if the initial connection fails.
   */
  connect(): Promise<void> {
    if (this.#ws && (this.#ws.readyState === 0 || this.#ws.readyState === 1)) {
      this.#log("connect", "already connected/connecting, skipping");
      return Promise.resolve();
    }
    this.#intentionalDisconnect = false;
    this.#log("connect", "opening WebSocket...");
    return new Promise<void>((resolve, reject) => {
      this.#connectResolve = resolve;
      this.#connectReject = reject;
      this.#createSocket();
    });
  }

  /** Close the connection. Will not trigger automatic reconnection. */
  disconnect(): void {
    this.#log("disconnect", "closing intentionally");
    this.#intentionalDisconnect = true;
    this.#clearReconnectTimer();
    if (this.#ws) {
      this.#ws.close(1000, "Client disconnect");
      this.#ws = null;
    }
  }

  // ─── Event Registration ───────────────────────────────────────────────────

  /** Register a typed handler for a specific message type. */
  on<K extends LocalEventType>(event: K, handler: (data: LocalEventMap[K]) => void): this;
  /** Register a wildcard handler for all messages. */
  on(event: "*", handler: (type: string, data: LocalMessage) => void): this;
  on(event: string, handler: (...args: never[]) => void): this {
    if (event === "*") {
      this.#wildcardListeners.add(handler as (type: string, data: LocalMessage) => void);
    } else {
      let set = this.#listeners.get(event);
      if (!set) {
        set = new Set();
        this.#listeners.set(event, set);
      }
      set.add(handler as (data: never) => void);
    }
    return this;
  }

  /** Remove a previously registered handler. */
  off<K extends LocalEventType>(event: K, handler: (data: LocalEventMap[K]) => void): this;
  off(event: "*", handler: (type: string, data: LocalMessage) => void): this;
  off(event: string, handler: (...args: never[]) => void): this {
    if (event === "*") {
      this.#wildcardListeners.delete(handler as (type: string, data: LocalMessage) => void);
    } else {
      this.#listeners.get(event)?.delete(handler as (data: never) => void);
    }
    return this;
  }

  /** Register a handler for connection lifecycle events. */
  onLifecycle(event: LocalLifecycleEventType, handler: LocalLifecycleHandler): this {
    let set = this.#lifecycleListeners.get(event);
    if (!set) {
      set = new Set();
      this.#lifecycleListeners.set(event, set);
    }
    set.add(handler);
    return this;
  }

  /** Remove a lifecycle handler. */
  offLifecycle(event: LocalLifecycleEventType, handler: LocalLifecycleHandler): this {
    this.#lifecycleListeners.get(event)?.delete(handler);
    return this;
  }

  // ─── Commands ─────────────────────────────────────────────────────────────

  /** Send a raw command object to the local StarComm app. */
  send(command: LocalCommand): void {
    if (!this.#ws || this.#ws.readyState !== 1) {
      throw new Error("StarCommsLocalClient is not connected");
    }
    this.#log("send", command.type, command);
    this.#ws.send(JSON.stringify(command));
  }

  /** Request a fresh snapshot from the local client. */
  requestSnapshot(): void {
    this.send({ type: "snapshot" });
  }

  /**
   * Start momentary push-to-talk on a net.
   * This mimics holding a physical PTT button — releases automatically if not sustained.
   * For programmatic PTT, use {@link pttHold} instead.
   */
  pttStart(netId: number): void {
    this.send({ type: "ptt.start", netId });
  }

  /**
   * Toggle/latch PTT on a net.
   * Locks transmission on until {@link pttStop} is called.
   * Use this for programmatic or sustained PTT.
   */
  pttHold(netId: number): void {
    this.send({ type: "ptt.hold", netId });
  }

  /** Release push-to-talk on a net. */
  pttStop(netId: number): void {
    this.send({ type: "ptt.stop", netId });
  }

  /** Admin: assign a user to a net. */
  adminAssign(userId: string, netId: number): void {
    this.send({ type: "admin.assign", userId, netId });
  }

  /** Admin: unassign a user from a net. */
  adminUnassign(userId: string, netId: number): void {
    this.send({ type: "admin.unassign", userId, netId });
  }

  /** Admin: disconnect a user. */
  adminDisconnect(userId: string): void {
    this.send({ type: "admin.disconnect", userId });
  }

  /** Admin: send an ACARS alert to all users. */
  adminAcars(text: string): void {
    this.send({ type: "admin.acars", text });
  }

  // ─── Internals ────────────────────────────────────────────────────────────

  #createSocket(): void {
    this.#ws = new WebSocket(this.#url);

    this.#ws.onopen = () => {
      const isReconnect = this.#reconnectAttempt > 0;
      this.#reconnectAttempt = 0;
      this.#clearReconnectTimer();

      this.#log("socket", "open");

      // Send hello handshake
      this.#ws!.send(JSON.stringify({ type: "hello" }));
      this.#log("send", "hello");

      // Resolve the connect() promise
      if (this.#connectResolve) {
        this.#connectResolve();
        this.#connectResolve = null;
        this.#connectReject = null;
      }

      if (isReconnect) {
        this.#emitLifecycle("reconnected", {});
      } else {
        this.#emitLifecycle("connected", {});
      }
    };

    this.#ws.onmessage = (event) => {
      let message: LocalMessage;
      try {
        message = JSON.parse(event.data as string) as LocalMessage;
      } catch {
        this.#log("recv", "unparseable message", event.data);
        return;
      }

      this.#log("recv", message.type, message);

      // Cache snapshot
      if (message.type === "snapshot") {
        this.snapshot = message;
      }

      // Dispatch to typed listeners
      const handlers = this.#listeners.get(message.type);
      if (handlers) {
        for (const handler of handlers) (handler as (data: LocalMessage) => void)(message);
      }

      // Dispatch to wildcard listeners
      for (const handler of this.#wildcardListeners) handler(message.type, message);
    };

    this.#ws.on("error", (err: Error) => {
      this.#log("socket", "error:", err.message);
      this.#emitLifecycle("error", { reason: err.message });

      // Reject the connect() promise if still pending
      if (this.#connectReject) {
        this.#connectReject(new Error(`WebSocket connection failed: ${err.message}`));
        this.#connectResolve = null;
        this.#connectReject = null;
      }
    });

    this.#ws.on("unexpected-response", (_req, res) => {
      const status = res.statusCode ?? 0;
      this.#log("socket", `unexpected HTTP response: ${status}`);
      const msg = status === 401
        ? "Authentication failed (401) — check your pairing token"
        : `Server returned HTTP ${status} instead of upgrading to WebSocket`;
      this.#emitLifecycle("error", { reason: msg });

      if (this.#connectReject) {
        this.#connectReject(new Error(msg));
        this.#connectResolve = null;
        this.#connectReject = null;
      }
      this.#ws?.close();
    });

    this.#ws.onclose = (event) => {
      this.#log("socket", `closed code=${event.code} reason=${event.reason}`);
      this.#ws = null;

      if (this.#intentionalDisconnect) {
        this.#emitLifecycle("disconnected", { reason: "Intentional disconnect" });
        return;
      }

      this.#emitLifecycle("disconnected", {
        reason: event.reason || `Code ${event.code}`,
      });

      if (this.#autoReconnect) {
        this.#scheduleReconnect();
      }
    };
  }

  #scheduleReconnect(): void {
    if (this.#reconnectAttempt >= this.#maxAttempts) {
      this.#emitLifecycle("disconnected", {
        reason: `Gave up after ${this.#reconnectAttempt} attempts`,
      });
      return;
    }

    this.#reconnectAttempt++;
    const delay = Math.min(
      this.#initialDelayMs * 2 ** (this.#reconnectAttempt - 1),
      this.#maxDelayMs,
    );

    this.#emitLifecycle("reconnecting", { attempt: this.#reconnectAttempt });
    this.#log("reconnect", `attempt ${this.#reconnectAttempt} in ${delay}ms`);

    this.#reconnectTimer = setTimeout(() => {
      if (!this.#intentionalDisconnect) {
        this.#createSocket();
      }
    }, delay);
  }

  #clearReconnectTimer(): void {
    if (this.#reconnectTimer) {
      clearTimeout(this.#reconnectTimer);
      this.#reconnectTimer = null;
    }
  }

  #emitLifecycle(event: LocalLifecycleEventType, detail: LocalLifecycleDetail): void {
    const handlers = this.#lifecycleListeners.get(event);
    if (handlers) {
      for (const handler of handlers) handler(detail);
    }
  }
}
