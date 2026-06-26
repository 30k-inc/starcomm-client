import type { BaseClient } from "../base";
import type {
  SetFeaturesPayload,
  SetOperationPayload,
  SetRulesPayload,
  ShardFeaturesResponse,
  ShardRulesResponse,
} from "../types";

/**
 * Operation lifecycle, feature flags, and auto-assignment rules.
 * @category Resources
 */
export class OperationsResource {
  constructor(private readonly http: BaseClient) {}

  /** Opens or closes the operation (controls whether operators can connect). */
  async set(payload: SetOperationPayload): Promise<Record<string, unknown>> {
    return this.http.ownerPost<Record<string, unknown>>("/api/v1/operation", payload);
  }

  /** Fetches the current shard feature configuration. */
  async getFeatures(): Promise<ShardFeaturesResponse> {
    return this.http.ownerGet<ShardFeaturesResponse>("/api/v1/features");
  }

  /** Updates shard feature flags (max nets, public net, global PTT). */
  async setFeatures(payload: SetFeaturesPayload): Promise<Record<string, unknown>> {
    return this.http.ownerPost<Record<string, unknown>>("/api/v1/features", payload);
  }

  /** Fetches role-to-net auto-assignment rules. */
  async getRules(): Promise<ShardRulesResponse> {
    return this.http.ownerGet<ShardRulesResponse>("/api/v1/rules");
  }

  /** Replaces all auto-assignment rules. */
  async setRules(payload: SetRulesPayload): Promise<Record<string, unknown>> {
    return this.http.ownerPost<Record<string, unknown>>("/api/v1/rules", payload);
  }
}
