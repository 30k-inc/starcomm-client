import type { PublicNetState, ShardFeatures } from "./common";

/**
 * Response from opening or closing the operation.
 * @category Operations
 */
export interface SetOperationResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** Discord guild ID the operation applies to. */
  guildId: string;
  /** Discriminator identifying this as an operation-set response. */
  action: "operation.set";
  /** Whether the operation is now open. */
  open: boolean;
}

/**
 * Current shard feature configuration response.
 * @category Operations
 */
export interface ShardFeaturesResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** Discord guild ID the features belong to. */
  guildId: string;
  /** Current shard feature configuration. */
  features: ShardFeatures;
}

/**
 * Response from updating shard features.
 * @category Operations
 */
export interface SetFeaturesResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** Discord guild ID the features belong to. */
  guildId: string;
  /** Discriminator identifying this as a features-set response. */
  action: "features.set";
  /** Updated shard feature configuration. */
  features: ShardFeatures;
  /** Resulting public net state after the update. */
  publicNet: PublicNetState;
}

/**
 * A role-to-net auto-assignment rule.
 * When a user with the specified role connects, they are auto-assigned to the listed nets.
 * @category Operations
 */
export interface AutoAssignRule {
  /** Discord role ID that triggers this rule. */
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
  /** Whether the request succeeded. */
  ok: boolean;
  /** Discord guild ID the rules belong to. */
  guildId: string;
  /** Current list of auto-assignment rules. */
  rules: AutoAssignRule[];
}

/**
 * Response from replacing auto-assignment rules.
 * @category Operations
 */
export interface SetRulesResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** Discord guild ID the rules belong to. */
  guildId: string;
  /** Discriminator identifying this as a rules-set response. */
  action: "rules.set";
  /** Replaced list of auto-assignment rules. */
  rules: AutoAssignRule[];
}
