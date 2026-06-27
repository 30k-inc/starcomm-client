import type { BaseClient } from "../base";
import type {
  ShardWebhookRegisterResponse,
  ShardWebhookRemoveResponse,
  ShardWebhooksResponse,
} from "../types";

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

  /**
   * Registers a new webhook for shard events.
   * @param url Webhook delivery URL.
   * @param events Array of event types to subscribe to.
   * @param secret Optional shared secret for webhook signature verification.
   * @returns The created webhook entry and its generated secret.
   */
  async register(url: string, events: string[], secret?: string): Promise<ShardWebhookRegisterResponse> {
    return this.#http.ownerPost<ShardWebhookRegisterResponse>("/api/v1/webhooks", {
      url,
      events,
      ...(secret && { secret }),
    });
  }

  /**
   * Removes a registered webhook.
   * @param id Webhook ID to remove.
   */
  async remove(id: string): Promise<ShardWebhookRemoveResponse> {
    return this.#http.ownerDelete<ShardWebhookRemoveResponse>(
      `/api/v1/webhooks/${encodeURIComponent(id)}`,
    );
  }
}
