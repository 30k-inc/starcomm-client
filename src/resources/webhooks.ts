import type { BaseClient } from "../base";
import type { RegisterWebhookPayload, ShardWebhooksResponse } from "../types";

/**
 * Webhook registration and management.
 * @category Resources
 */
export class WebhooksResource {
  readonly #http: BaseClient;
  constructor(http: BaseClient) {
    this.#http = http;
  }

  /** Lists all registered webhooks. */
  async list(): Promise<ShardWebhooksResponse> {
    return this.#http.ownerGet<ShardWebhooksResponse>("/api/v1/webhooks");
  }

  /** Registers a new webhook for shard events. */
  async register(payload: RegisterWebhookPayload): Promise<Record<string, unknown>> {
    return this.#http.ownerPost<Record<string, unknown>>("/api/v1/webhooks", payload);
  }

  /**
   * Removes a registered webhook.
   * @param id Webhook ID to remove.
   */
  async remove(id: string): Promise<Record<string, unknown>> {
    return this.#http.ownerDelete<Record<string, unknown>>(
      `/api/v1/webhooks/${encodeURIComponent(id)}`,
    );
  }
}
