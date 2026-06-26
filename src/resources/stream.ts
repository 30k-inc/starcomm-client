import type { BaseClient } from "../base";
import type { PublicTokenResponse } from "../types/stream";

/**
 * Event streaming (SSE) and public token management.
 * @category Resources
 */
export class StreamResource {
  constructor(private readonly http: BaseClient) {}

  /**
   * Opens the raw SSE Response for manual consumption.
   * Most users should use `client.connect()` instead.
   * @returns The raw fetch Response with `text/event-stream` content.
   */
  async openRaw(): Promise<Response> {
    this.http.requireOwnerKey();
    return this.http.getRawResponse("/api/v1/stream", {
      accept: "text/event-stream",
      authorization: `Bearer ${this.http.ownerApiKey}`,
    });
  }

  /** Fetches the shard's public embed token and associated URLs. */
  async getPublicToken(): Promise<PublicTokenResponse> {
    return this.http.ownerGet<PublicTokenResponse>("/api/v1/public-token");
  }
}
