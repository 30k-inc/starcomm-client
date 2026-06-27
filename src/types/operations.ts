import type { PublicNetState, ShardFeatures } from "./common";

/**
 * Response from opening or closing the operation.
 * @category Operations
 */
export interface SetOperationResponse {
  ok: boolean;
  guildId: string;
  action: "operation.set";
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
 * Response from updating shard features.
 * @category Operations
 */
export interface SetFeaturesResponse {
  ok: boolean;
  guildId: string;
  action: "features.set";
  features: ShardFeatures;
  publicNet: PublicNetState;
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
 * Response from replacing auto-assignment rules.
 * @category Operations
 */
export interface SetRulesResponse {
  ok: boolean;
  guildId: string;
  action: "rules.set";
  rules: AutoAssignRule[];
}
