import type { PublicNetState, ShardFeatures } from "./common";

/**
 * Current public net feature state (GET response).
 * @category Public Net
 */
export interface PublicNetStatusResponse {
  ok: boolean;
  guildId: string;
  publicNet: PublicNetState;
}

/**
 * Response from a public net action (show, hide, remove, restore).
 * @category Public Net
 */
export interface PublicNetActionResponse {
  ok: boolean;
  guildId: string;
  action: string;
  features: ShardFeatures;
  publicNet: PublicNetState;
}
