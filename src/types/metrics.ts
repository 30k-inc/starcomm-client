/**
 * Shard performance metrics (structure varies by shard version).
 * @category Metrics
 */
export interface ShardMetricsResponse {
  /** Whether the metrics request succeeded. */
  ok: boolean;
  /** Discord guild ID the metrics belong to. */
  guildId: string;
  [key: string]: unknown;
}

/**
 * A single audit log entry recording an API call.
 * @category Metrics
 */
export interface AuditEntry {
  /** ID of the API key that made the call. */
  keyId: string;
  /** HTTP method used for the request. */
  method: string;
  /** Request path that was called. */
  path: string;
  /** ISO timestamp of when the call occurred. */
  at: string;
}

/**
 * Paginated audit log response.
 * @category Metrics
 */
export interface ShardAuditResponse {
  /** Whether the audit request succeeded. */
  ok: boolean;
  /** Discord guild ID the audit log belongs to. */
  guildId: string;
  /** Audit log entries in this page. */
  entries: AuditEntry[];
}
