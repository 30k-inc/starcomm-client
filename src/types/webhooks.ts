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
 * Payload for registering a new webhook.
 * @category Webhooks
 */
export interface RegisterWebhookPayload {
  url: string;
  events: string[];
  secret?: string;
}
