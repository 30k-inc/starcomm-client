/**
 * A registered webhook entry.
 * @category Webhooks
 */
export interface WebhookEntry {
  id: string;
  url: string;
  events: string[];
  createdAt: string;
}

/**
 * List of webhooks and available event types.
 * @category Webhooks
 */
export interface ShardWebhooksResponse {
  ok: boolean;
  webhooks: WebhookEntry[];
  events: string[];
}

/**
 * Result of registering a webhook (includes the generated secret).
 * @category Webhooks
 */
export interface ShardWebhookRegisterResponse {
  ok: boolean;
  webhook: WebhookEntry;
  secret: string;
}

/**
 * Result of removing a webhook.
 * @category Webhooks
 */
export interface ShardWebhookRemoveResponse {
  ok: boolean;
  id: string;
}
