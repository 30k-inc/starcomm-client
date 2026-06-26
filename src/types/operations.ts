import type { ShardFeatures } from "./common";

/**
 * Payload for opening or closing the operation.
 * @category Operations
 */
export interface SetOperationPayload {
  open: boolean;
}

/**
 * Current shard feature configuration response.
 * @category Operations
 */
export interface ShardFeaturesResponse {
  ok: boolean;
  guildId: string;
  features: ShardFeatures;
}

/**
 * Payload for updating shard features (partial update).
 * @category Operations
 */
export interface SetFeaturesPayload {
  features: Partial<ShardFeatures>;
}

/**
 * A role-to-net auto-assignment rule.
 * @category Operations
 */
export interface AutoAssignRule {
  roleId: string;
  netId: number;
}

/**
 * Current auto-assignment rules.
 * @category Operations
 */
export interface ShardRulesResponse {
  ok: boolean;
  guildId: string;
  rules: AutoAssignRule[];
}

/**
 * Payload for replacing all auto-assignment rules.
 * @category Operations
 */
export interface SetRulesPayload {
  rules: AutoAssignRule[];
}
