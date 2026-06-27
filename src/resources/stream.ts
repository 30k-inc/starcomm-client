import type { BaseClient } from "../base";
import type { PublicTokenResponse } from "../types/stream";

/**
 * Event streaming (SSE) and public token management.
 * @category Resources
 */
export class StreamResource {
  readonly #http: BaseClient;
  constructor(http: BaseClient) {
    this.#http = http;
  }

  /**
   * Opens the raw SSE Response for manual consumption.
   * Most users should use `client.connect()` instead.
   * @returns The raw fetch Response with `text/event-stream` content.
   */
  async openRaw(): Promise<Response> {
    return this.#http.getRawResponse("/api/v1/stream", this.#http.getOwnerHeaders());
  }

  /** Fetches the shard's public embed token and associated URLs. */
  async getPublicToken(): Promise<PublicTokenResponse> {
    return this.#http.ownerGet<PublicTokenResponse>("/api/v1/public-token");
  }
}
