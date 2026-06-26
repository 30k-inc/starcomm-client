/**
 * Current public net feature state.
 * @category Public Net
 */
export interface PublicNetStatusResponse {
  ok: boolean;
  guildId: string;
  publicNet: {
    enabled: boolean;
    name: string;
    roleIds: string[];
  };
}

/**
 * Payload for showing/adding the public net.
 * @category Public Net
 */
export interface PublicNetShowPayload {
  name?: string;
  roleIds?: string[];
}
