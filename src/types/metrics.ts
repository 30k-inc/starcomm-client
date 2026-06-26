/**
 * Shard performance metrics (structure varies by shard version).
 * @category Metrics
 */
export interface ShardMetricsResponse {
  ok: boolean;
  guildId: string;
  [key: string]: unknown;
}

/**
 * A single audit log entry recording an API call.
 * @category Metrics
 */
export interface AuditEntry {
  keyId: string;
  method: string;
  path: string;
  at: string;
}

/**
 * Paginated audit log response.
 * @category Metrics
 */
export interface ShardAuditResponse {
  ok: boolean;
  guildId: string;
  entries: AuditEntry[];
}
