import { BaseClient, type StarCommsClientConfig } from "./base";
import {
  StatusResource,
  AssignmentsResource,
  NetsResource,
  OperationsResource,
  PresetsResource,
  CommsResource,
  MetricsResource,
  WebhooksResource,
  ArchiveResource,
  StreamResource,
  PublicNetResource,
} from "./resources";
import type { OwnerEvent, OwnerEventMap, OwnerEventType } from "./types/stream";

export type { StarCommsClientConfig } from "./base";

/**
 * Handler for wildcard event listeners.
 * @category Stream
 */
export type WildcardHandler = (event: OwnerEvent) => void;

/**
 * Star Comms Shard Owner API Client.
 *
 * A framework-agnostic TypeScript client for interacting with a Star Comms shard.
 * Uses the native `fetch` API (Node 18+, Bun, Deno, or browser).
 *
 * Supports event-emitter style event handling with Type Safety:
 *
 * @example
 * ```typescript
 * import { StarCommsClient } from "@30k/starcomm-client";
 *
 * const client = new StarCommsClient({
 *   baseUrl: "http://your-shard:1234",
 *   ownerApiKey: "scok_your_key_here",
 * });
 *
 * client.on("user.joined", (event) => {
 *   console.log(`${event.data.displayName} connected`);
 * });
 *
 * client.on("ptt.start", (event) => {
 *   console.log(`${event.data.userId} transmitting on net ${event.data.netId}`);
 * });
 *
 * await client.connect(); // opens SSE stream and starts dispatching events
 *
 * // Resource calls
 * const status = await client.status.get();
 * await client.assignments.set("discord_user_id", 1);
 *
 * // Later: disconnect
 * client.disconnect();
 * ```
 */
export class StarCommsClient {
  /** Shard health, status, roster, and embed endpoints. */
  readonly status: StatusResource;
  /** Net assignment operations (assign, unassign, bulk, temporary). */
  readonly assignments: AssignmentsResource;
  /** Voice net management (create, rename, remove). */
  readonly nets: NetsResource;
  /** Operation lifecycle, feature flags, and auto-assignment rules. */
  readonly operations: OperationsResource;
  /** Operation preset management (save, apply, remove). */
  readonly presets: PresetsResource;
  /** Communication operations (ACARS alerts, client disconnect). */
  readonly comms: CommsResource;
  /** Shard metrics, Prometheus export, audit log, and debug. */
  readonly metrics: MetricsResource;
  /** Webhook registration and management. */
  readonly webhooks: WebhooksResource;
  /** Net archive CRUD and sync status. */
  readonly archive: ArchiveResource;
  /** Event streaming (SSE) and public token management. */
  readonly stream: StreamResource;
  /** Public net feature management (show, hide, remove, restore). */
  readonly publicNet: PublicNetResource;

  private readonly listeners = new Map<string, Set<(event: never) => void>>();
  private readonly wildcardListeners = new Set<WildcardHandler>();
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private consuming = false;

  constructor(config: StarCommsClientConfig) {
    const http = new BaseClient(config);

    this.status = new StatusResource(http);
    this.assignments = new AssignmentsResource(http);
    this.nets = new NetsResource(http);
    this.operations = new OperationsResource(http);
    this.presets = new PresetsResource(http);
    this.comms = new CommsResource(http);
    this.metrics = new MetricsResource(http);
    this.webhooks = new WebhooksResource(http);
    this.archive = new ArchiveResource(http);
    this.stream = new StreamResource(http);
    this.publicNet = new PublicNetResource(http);
  }

  /**
   * Register a type-safe handler for a specific event type.
   *
   * @example
   * ```typescript
   * client.on("user.joined", (event) => {
   *   event.data.userId;  // string
   *   event.data.nets;    // number[]
   * });
   * ```
   */
  on<K extends OwnerEventType>(event: K, handler: (event: OwnerEventMap[K]) => void): this;
  /** Register a handler for all events. */
  on(event: "*", handler: WildcardHandler): this;
  on(event: string, handler: (event: never) => void): this {
    if (event === "*") {
      this.wildcardListeners.add(handler as WildcardHandler);
    } else {
      let set = this.listeners.get(event);
      if (!set) {
        set = new Set();
        this.listeners.set(event, set);
      }
      set.add(handler);
    }
    return this;
  }

  /** Remove a previously registered handler. */
  off<K extends OwnerEventType>(event: K, handler: (event: OwnerEventMap[K]) => void): this;
  off(event: "*", handler: WildcardHandler): this;
  off(event: string, handler: (event: never) => void): this {
    if (event === "*") {
      this.wildcardListeners.delete(handler as WildcardHandler);
    } else {
      this.listeners.get(event)?.delete(handler);
    }
    return this;
  }

  /**
   * Opens the SSE event stream and begins dispatching events to registered handlers.
   * Call this after registering your `.on()` handlers.
   *
   * @throws {StarCommsError} If the connection fails.
   */
  async connect(): Promise<void> {
    if (this.consuming) return;
    const response = await this.stream.openRaw();
    this.reader = response.body!.getReader();
    this.consuming = true;
    this.consume();
  }

  /** Whether the event stream is currently connected. */
  get connected(): boolean {
    return this.consuming;
  }

  /**
   * Closes the SSE event stream. REST methods remain usable.
   */
  disconnect(): void {
    this.consuming = false;
    this.reader?.cancel().catch(() => {});
    this.reader = null;
  }

  private async consume(): Promise<void> {
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (this.consuming && this.reader) {
        const { done, value } = await this.reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop()!;

        for (const block of blocks) {
          const event = parseSSEBlock(block);
          if (event) this.emit(event);
        }
      }
    } catch {
      // Stream closed or network error
    } finally {
      this.consuming = false;
      this.reader = null;
    }
  }

  private emit(event: OwnerEvent): void {
    const handlers = this.listeners.get(event.type);
    if (handlers) {
      for (const handler of handlers) (handler as (event: OwnerEvent) => void)(event);
    }
    for (const handler of this.wildcardListeners) handler(event);
  }
}

function parseSSEBlock(block: string): OwnerEvent | null {
  let eventType = "";
  let data = "";

  for (const line of block.split("\n")) {
    if (line.startsWith(":")) continue;
    if (line.startsWith("event: ")) {
      eventType = line.slice(7);
    } else if (line.startsWith("data: ")) {
      data = line.slice(6);
    }
  }

  if (!eventType || !data) return null;

  try {
    return JSON.parse(data) as OwnerEvent;
  } catch {
    return null;
  }
}
