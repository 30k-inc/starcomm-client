/**
 * Result of an ACARS broadcast.
 * @category Comms
 */
export interface AcarsResult {
  ok: boolean;
  guildId: string;
  id: string;
  routed: number;
  durationMs: number;
}

/**
 * Result of a disconnect operation.
 * @category Comms
 */
export interface DisconnectClientResult {
  ok: boolean;
  guildId: string;
  userId: string;
  disconnected: number;
}
