import type { BaseClient } from "../base";
import { StarCommsError } from "../error";
import type { ShardAuditResponse, ShardMetricsResponse } from "../types";

/**
 * Shard metrics, Prometheus export, audit log, and debug.
 * @category Resources
 */
export class MetricsResource {
  constructor(private readonly http: BaseClient) {}

  /**
   * Fetches shard performance metrics.
   * @param sinceMinutes Lookback window in minutes. Omit for all available data.
   */
  async get(sinceMinutes?: number): Promise<ShardMetricsResponse> {
    const query = sinceMinutes ? `?sinceMinutes=${sinceMinutes}` : "";
    return this.http.ownerGet<ShardMetricsResponse>(`/api/v1/metrics${query}`);
  }

  /** Fetches metrics in Prometheus exposition format (text/plain). */
  async prometheus(): Promise<string> {
    this.http.requireOwnerKey();
    return this.http.getRawText("/api/v1/metrics/prometheus", this.http.ownerApiKey);
  }

  /**
   * Fetches the audit log of API calls made with the owner key.
   * @param limit Maximum number of entries to return.
   */
  async getAudit(limit?: number): Promise<ShardAuditResponse> {
    const query = limit ? `?limit=${limit}` : "";
    return this.http.ownerGet<ShardAuditResponse>(`/api/v1/audit${query}`);
  }

  /**
   * Fetches internal debug state. Requires the shard token (`scsh_...`).
   * @throws {StarCommsError} If `shardToken` was not provided in config.
   */
  async getDebug(): Promise<Record<string, unknown>> {
    if (!this.http.shardToken) {
      throw new StarCommsError(500, "Shard token not configured. Cannot call /debug.");
    }
    return this.http.get<Record<string, unknown>>("/debug", this.http.shardToken);
  }
}
