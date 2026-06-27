import type { BaseClient } from "../base";
import type {
  AutoAssignRule,
  SetFeaturesResponse,
  SetOperationResponse,
  SetRulesResponse,
  ShardFeatures,
  ShardFeaturesResponse,
  ShardRulesResponse,
} from "../types";

/**
 * Operation lifecycle, feature flags, and auto-assignment rules.
 * @category Resources
 */
export class OperationsResource {
  readonly #http: BaseClient;
  constructor(http: BaseClient) {
    this.#http = http;
  }

  /** Opens the operation (allows operators to connect). */
  async open(): Promise<SetOperationResponse> {
    return this.#http.ownerPost<SetOperationResponse>("/api/v1/operation", { open: true });
  }

  /** Closes the operation (prevents new operator connections). */
  async close(): Promise<SetOperationResponse> {
    return this.#http.ownerPost<SetOperationResponse>("/api/v1/operation", { open: false });
  }

  /** Fetches the current shard feature configuration. */
  async getFeatures(): Promise<ShardFeaturesResponse> {
    return this.#http.ownerGet<ShardFeaturesResponse>("/api/v1/features");
  }

  /** Updates shard feature flags (max nets, public net, global PTT). */
  async setFeatures(features: Partial<ShardFeatures>): Promise<SetFeaturesResponse> {
    return this.#http.ownerPost<SetFeaturesResponse>("/api/v1/features", { features });
  }

  /** Fetches role-to-net auto-assignment rules. */
  async getRules(): Promise<ShardRulesResponse> {
    return this.#http.ownerGet<ShardRulesResponse>("/api/v1/rules");
  }

  /** Replaces all auto-assignment rules. */
  async setRules(rules: AutoAssignRule[]): Promise<SetRulesResponse> {
    return this.#http.ownerPost<SetRulesResponse>("/api/v1/rules", { rules });
  }
}
