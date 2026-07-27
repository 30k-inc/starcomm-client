/**
 * Org Link feature configuration.
 * @category Common
 */
export interface OrgLinkFeature {
  enabled: boolean;
  roleIds: string[];
  netUid: string;
}

/**
 * Shard feature configuration (max nets, PTT, public net, org link, ACARS, ready checks).
 * @category Common
 */
export interface ShardFeatures {
  maxNets: number;
  globalPttEnabled: boolean;
  acarsEnabled: boolean;
  readyCheckEnabled: boolean;
  publicNet: {
    enabled: boolean;
    name: string;
    roleIds: string[];
  };
  orgLink: OrgLinkFeature;
}

/**
 * Public net state returned in action responses.
 * @category Common
 */
export interface PublicNetState {
  enabled: boolean;
  name: string;
  roleIds: string[];
}

/**
 * Standard error response from the shard.
 * @category Common
 */
export interface ShardErrorResponse {
  error: string;
}
