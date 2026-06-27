import type { BaseClient } from "../base";
import type { AcarsResult, DisconnectClientResult } from "../types";

/**
 * Communication operations (ACARS alerts, client disconnect).
 * @category Resources
 */
export class CommsResource {
  readonly #http: BaseClient;
  constructor(http: BaseClient) {
    this.#http = http;
  }

  /**
   * Broadcasts an ACARS text alert to all connected operators.
   * @param text Alert text (max 280 chars).
   * @param options Optional sender name and display duration.
   */
  async sendAcars(
    text: string,
    options?: { senderName?: string; durationMs?: number },
  ): Promise<AcarsResult> {
    return this.#http.ownerPost<AcarsResult>("/api/v1/acars", {
      text,
      ...options,
    });
  }

  /**
   * Force-disconnects a client from the shard.
   * @param userId Discord user ID to disconnect.
   */
  async disconnect(userId: string): Promise<DisconnectClientResult> {
    return this.#http.ownerPost<DisconnectClientResult>("/api/v1/clients/disconnect", { userId });
  }
}
