import type { PublicNetState, ShardFeatures } from "./common";

/**
 * Current public net feature state (GET response).
 * @category Public Net
 */
export interface PublicNetStatusResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** Discord guild identifier the status applies to. */
  guildId: string;
  /** Current public net feature state. */
  publicNet: PublicNetState;
}

/**
 * Response from a public net action (show, hide, remove, restore).
 * @category Public Net
 */
export interface PublicNetActionResponse {
  /** Whether the action succeeded. */
  ok: boolean;
  /** Discord guild identifier the action applied to. */
  guildId: string;
  /** Name of the action performed (show, hide, remove, restore). */
  action: string;
  /** Shard feature flags after the action. */
  features: ShardFeatures;
  /** Public net feature state after the action. */
  publicNet: PublicNetState;
}
