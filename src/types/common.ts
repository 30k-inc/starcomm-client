/**
 * Org Link feature configuration.
 * @category Common
 */
export interface OrgLinkFeature {
  /** Whether the org link feature is enabled. */
  enabled: boolean;
  /** Role IDs permitted to use the org link. */
  roleIds: string[];
  /** UID of the net the org is linked to. */
  netUid: string;
}

/**
 * Shard feature configuration (max nets, PTT, public net, org link, ACARS, ready checks).
 * @category Common
 */
export interface ShardFeatures {
  /** Maximum number of nets allowed on the shard. */
  maxNets: number;
  /** Whether global push-to-talk is enabled. */
  globalPttEnabled: boolean;
  /** Whether ACARS is enabled. */
  acarsEnabled: boolean;
  /** Whether ready checks are enabled. */
  readyCheckEnabled: boolean;
  /** Public net configuration. */
  publicNet: {
    /** Whether the public net is enabled. */
    enabled: boolean;
    /** Display name of the public net. */
    name: string;
    /** Role IDs permitted to access the public net. */
    roleIds: string[];
  };
  /** Org link feature configuration. */
  orgLink: OrgLinkFeature;
}

/**
 * Public net state returned in action responses.
 * @category Common
 */
export interface PublicNetState {
  /** Whether the public net is enabled. */
  enabled: boolean;
  /** Display name of the public net. */
  name: string;
  /** Role IDs permitted to access the public net. */
  roleIds: string[];
}

/**
 * Standard error response from the shard.
 * @category Common
 */
export interface ShardErrorResponse {
  /** Human-readable error message. */
  error: string;
}
