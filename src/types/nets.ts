/**
 * Payload for creating a new voice net.
 * @category Nets
 */
export interface CreateNetPayload {
  name: string;
}

/**
 * Payload for renaming an existing net.
 * @category Nets
 */
export interface RenameNetPayload {
  netId: number;
  /** Net UID (alternative to netId). */
  netUid?: string;
  name: string;
}

/**
 * Payload for removing a net by numeric ID.
 * @category Nets
 */
export interface RemoveNetPayload {
  netId: number;
  /** Net UID (alternative to netId). */
  netUid?: string;
}

/**
 * Payload for removing a net by UID or string reference.
 * @category Nets
 */
export interface RemoveNetByRefPayload {
  /** Net UID (e.g., `"net_abc123"`) or numeric net ID as string. */
  ref: string;
}
