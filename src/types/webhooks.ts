/**
 * A registered webhook entry.
 * @category Webhooks
 */
export interface WebhookEntry {
  /** Unique identifier for this webhook. */
  id: string;
  /** Destination URL that events are delivered to. */
  url: string;
  /** Event types this webhook is subscribed to. */
  events: string[];
  /** ISO timestamp of when the webhook was created. */
  createdAt: string;
}

/**
 * List of webhooks and available event types.
 * @category Webhooks
 */
export interface ShardWebhooksResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** Registered webhooks for the shard. */
  webhooks: WebhookEntry[];
  /** All event types available for subscription. */
  events: string[];
}

/**
 * Result of registering a webhook (includes the generated secret).
 * @category Webhooks
 */
export interface ShardWebhookRegisterResponse {
  /** Whether the registration succeeded. */
  ok: boolean;
  /** The newly registered webhook. */
  webhook: WebhookEntry;
  /** Generated signing secret for verifying webhook payloads. */
  secret: string;
}

/**
 * Result of removing a webhook.
 * @category Webhooks
 */
export interface ShardWebhookRemoveResponse {
  /** Whether the removal succeeded. */
  ok: boolean;
  /** Identifier of the removed webhook. */
  id: string;
}
