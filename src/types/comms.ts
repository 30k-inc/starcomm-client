/**
 * Payload for broadcasting an ACARS text alert.
 * @category Comms
 */
export interface AcarsPayload {
  /** Alert text (max 280 chars). */
  text: string;
  /** Display name of the sender (default: "Owner API"). */
  senderName?: string;
  /** Duration to show the alert in ms (7000–10000). */
  durationMs?: number;
}

/**
 * Result of an ACARS broadcast with delivery count.
 * @category Comms
 */
export interface AcarsResult {
  ok: boolean;
  delivered: number;
}

/**
 * Payload for force-disconnecting a client.
 * @category Comms
 */
export interface DisconnectClientPayload {
  userId: string;
}

/**
 * Result of a disconnect operation.
 * @category Comms
 */
export interface DisconnectClientResult {
  ok: boolean;
  disconnected: number;
}
