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
  /** Whether the broadcast succeeded. */
  ok: boolean;
  /** Identifier of the target guild. */
  guildId: string;
  /** Unique identifier of the broadcast. */
  id: string;
  /** Number of recipients the alert was routed to. */
  routed: number;
  /** Time taken to complete the broadcast, in milliseconds. */
  durationMs: number;
  /** Severity type of the broadcast alert. */
  alertType: AcarsAlertType;
}

/**
 * Result of a disconnect operation.
 * @category Comms
 */
export interface DisconnectClientResult {
  /** Whether the disconnect operation succeeded. */
  ok: boolean;
  /** Identifier of the target guild. */
  guildId: string;
  /** Identifier of the user that was disconnected. */
  userId: string;
  /** Number of client connections that were disconnected. */
  disconnected: number;
}
