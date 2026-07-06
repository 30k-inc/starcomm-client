import { StarCommsError } from "./error";

/**
 * Configuration options for the Star Comms client.
 */
export interface StarCommsClientConfig {
  /** Base URL of the shard (e.g., `"http://your-shard:25588"`). No trailing slash. */
  baseUrl: string;
  /** Owner API key (`scok_...`) for authenticated endpoints. */
  ownerApiKey: string;
  /** Service key (`scsk_...`) for listen-only audio connections. */
  serviceKey?: string;
  /** Shard token (`scsh_...`) for the `/debug` endpoint. */
  shardToken?: string;
  /** Request timeout in milliseconds. @default 10000 */
  timeoutMs?: number;
  /** Connection timeout for streaming endpoints in ms. @default 30000 */
  connectTimeoutMs?: number;
  /** Custom fetch implementation. @default globalThis.fetch */
  fetch?: typeof fetch;
}

/**
 * Low-level HTTP transport for the Star Comms Shard API.
 * Resource classes receive an instance and delegate all HTTP work here.
 * @category Internals
 */
export class BaseClient {
  readonly baseUrl: string;
  readonly #ownerApiKey: string;
  readonly #serviceKey?: string;
  readonly #shardToken?: string;
  readonly #timeoutMs: number;
  readonly #connectTimeoutMs: number;
  readonly #fetch: typeof fetch;

  constructor(config: StarCommsClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.#ownerApiKey = config.ownerApiKey;
    this.#serviceKey = config.serviceKey;
    this.#shardToken = config.shardToken;
    this.#timeoutMs = config.timeoutMs ?? 10_000;
    this.#connectTimeoutMs = config.connectTimeoutMs ?? 30_000;
    this.#fetch = config.fetch ?? globalThis.fetch;
  }

  async get<T>(path: string, bearerToken?: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = { accept: "application/json" };
    if (bearerToken) headers.authorization = `Bearer ${bearerToken}`;

    const response = await this.#fetch(url, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(this.#timeoutMs),
    });

    return this.#handleResponse<T>(response);
  }

  async ownerGet<T>(path: string): Promise<T> {
    this.#requireOwnerKey();
    return this.get<T>(path, this.#ownerApiKey);
  }

  async ownerPost<T>(path: string, body: unknown): Promise<T> {
    this.#requireOwnerKey();
    const url = `${this.baseUrl}${path}`;
    const response = await this.#fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${this.#ownerApiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.#timeoutMs),
    });
    return this.#handleResponse<T>(response);
  }

  async ownerPut<T>(path: string, body: unknown): Promise<T> {
    this.#requireOwnerKey();
    const url = `${this.baseUrl}${path}`;
    const response = await this.#fetch(url, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${this.#ownerApiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.#timeoutMs),
    });
    return this.#handleResponse<T>(response);
  }

  async ownerPatch<T>(path: string, body: unknown): Promise<T> {
    this.#requireOwnerKey();
    const url = `${this.baseUrl}${path}`;
    const response = await this.#fetch(url, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${this.#ownerApiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.#timeoutMs),
    });
    return this.#handleResponse<T>(response);
  }

  async ownerDelete<T>(path: string): Promise<T> {
    this.#requireOwnerKey();
    const url = `${this.baseUrl}${path}`;
    const response = await this.#fetch(url, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${this.#ownerApiKey}`,
      },
      signal: AbortSignal.timeout(this.#timeoutMs),
    });
    return this.#handleResponse<T>(response);
  }

  async getRawText(path: string, bearerToken?: string): Promise<string> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {};
    if (bearerToken) headers.authorization = `Bearer ${bearerToken}`;

    const response = await this.#fetch(url, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(this.#timeoutMs),
    });
    if (!response.ok) {
      throw new StarCommsError(response.status, `Request failed: HTTP ${response.status}`);
    }
    return response.text();
  }

  /**
   * Fetches a raw Response for long-lived streaming connections.
   * Uses `connectTimeoutMs` to abort if the server never responds,
   * but does not limit the duration of the stream itself.
   */
  async getRawResponse(path: string, headers: Record<string, string>): Promise<Response> {
    const url = `${this.baseUrl}${path}`;
    // Use a manual AbortController so we can clear the timeout once connected.
    // AbortSignal.timeout() would kill the entire stream after connectTimeoutMs.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.#connectTimeoutMs);

    let response: Response;
    try {
      response = await this.#fetch(url, {
        method: "GET",
        headers,
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      if (controller.signal.aborted) {
        throw new StarCommsError(408, `Connection timed out after ${this.#connectTimeoutMs}ms`);
      }
      throw err;
    }

    // Connection established — clear the timeout so the stream body lives indefinitely
    clearTimeout(timer);

    if (!response.ok) {
      throw new StarCommsError(response.status, `Request failed: HTTP ${response.status}`);
    }
    return response;
  }

  /** Returns auth headers for owner-authenticated requests. Used by resource classes. */
  getOwnerHeaders(): Record<string, string> {
    this.#requireOwnerKey();
    return {
      accept: "text/event-stream",
      authorization: `Bearer ${this.#ownerApiKey}`,
    };
  }

  /** Returns the shard token for debug endpoints, or undefined if not configured. */
  getShardToken(): string | undefined {
    return this.#shardToken;
  }

  /** Returns the service key for audio listener connections, or undefined if not configured. */
  getServiceKey(): string | undefined {
    return this.#serviceKey;
  }

  /** Returns the owner API key for bearer-token authenticated requests. */
  getOwnerApiKey(): string {
    this.#requireOwnerKey();
    return this.#ownerApiKey;
  }

  #requireOwnerKey(): void {
    if (!this.#ownerApiKey) {
      throw new StarCommsError(500, "Owner API key not configured.");
    }
  }

  async #handleResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    let payload: unknown;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { error: text };
    }

    if (!response.ok) {
      const errorMessage =
        ((payload as Record<string, unknown>)?.error as string) ??
        `Star Comms shard returned HTTP ${response.status}`;
      throw new StarCommsError(response.status, errorMessage);
    }

    return payload as T;
  }
}
