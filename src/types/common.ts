/**
 * Shard feature configuration (max nets, PTT, public net).
 * @category Common
 */
export interface ShardFeatures {
  maxNets: number;
  globalPttEnabled: boolean;
  acarsEnabled: boolean;
  publicNet: {
    enabled: boolean;
    name: string;
    roleIds: string[];
  };
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
