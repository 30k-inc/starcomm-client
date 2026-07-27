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
 * When a user with the specified role connects, they are auto-assigned to the listed nets.
 * @category Operations
 */
export interface AutoAssignRule {
  roleId: string;
  /** @deprecated Use `netIds` for multiple nets. Single net ID (kept for backward compat). */
  netId?: number;
  /** Array of numeric net IDs to auto-assign. */
  netIds?: number[];
  /** Array of net UIDs to auto-assign (alternative to netIds). */
  netUids?: string[];
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
