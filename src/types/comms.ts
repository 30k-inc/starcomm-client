/**
 * Supported ACARS alert severity types.
 * @category Comms
 */
export type AcarsAlertType = "critical" | "emergency" | "non-emergency";

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
  alertType: AcarsAlertType;
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
