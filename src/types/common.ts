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
 * Standard error response from the shard.
 * @category Common
 */
export interface ShardErrorResponse {
  error: string;
}
