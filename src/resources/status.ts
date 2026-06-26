import type { BaseClient } from "../base";
import type {
  ShardHealthResponse,
  ShardOpenApiResponse,
  ShardEmbedStatusResponse,
  ShardStatusResponse,
  ShardRosterResponse,
} from "../types";

/**
 * Shard status, health, roster, and embed endpoints.
 * @category Resources
 */
export class StatusResource {
  readonly #http: BaseClient;
  constructor(http: BaseClient) {
    this.#http = http;
  }

  /** Checks shard liveness. Unauthenticated. */
  async getHealth(): Promise<ShardHealthResponse> {
    return this.#http.get<ShardHealthResponse>("/health");
  }

  /** Fetches the shard's OpenAPI specification document. Unauthenticated. */
  async getOpenApi(): Promise<ShardOpenApiResponse> {
    return this.#http.get<ShardOpenApiResponse>("/api/v1/openapi.json");
  }

  /**
   * Fetches embed status for a public token.
   * @param token Public embed token issued by the shard.
   */
  async getEmbedStatus(token: string): Promise<ShardEmbedStatusResponse> {
    return this.#http.get<ShardEmbedStatusResponse>(
      `/api/v1/embed/status?token=${encodeURIComponent(token)}`,
    );
  }

  /**
   * Fetches the embeddable HTML widget for a public token.
   * @param token Public embed token issued by the shard.
   * @returns Raw HTML string of the widget.
   */
  async getEmbedWidget(token: string): Promise<string> {
    return this.#http.getRawText(`/api/v1/embed/widget?token=${encodeURIComponent(token)}`);
  }

  /** Fetches live net status, occupancy, and feature config from the shard. */
  async get(): Promise<ShardStatusResponse> {
    return this.#http.ownerGet<ShardStatusResponse>("/api/v1/status");
  }

  /** Fetches the full operator roster with transport and transmission state. */
  async getRoster(): Promise<ShardRosterResponse> {
    return this.#http.ownerGet<ShardRosterResponse>("/api/v1/roster");
  }
}
