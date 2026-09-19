/**
 * Map of user IDs to their assigned net IDs.
 * @category Assignments
 */
export interface ShardAssignmentsResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** ID of the guild the assignments belong to. */
  guildId: string;
  /** Map of user ID to the list of net IDs assigned to that user. */
  assignments: Record<string, number[]>;
}

/**
 * A single assign/unassign action for one user.
 * Used in bulk operations.
 * @category Assignments
 */
export interface AssignmentAction {
  /** ID of the user this action applies to. */
  userId: string;
  /** Numeric ID of the net to assign or unassign. */
  netId: number;
  /** Net UID (alternative to netId). */
  netUid?: string;
  /** Whether to assign or unassign; defaults to assign. */
  action?: "assign" | "unassign";
}

/**
 * Result of a single assignment operation.
 * @category Assignments
 */
export interface ShardAssignmentResult {
  /** Whether the operation succeeded. */
  ok: boolean;
  /** ID of the guild the assignment belongs to. */
  guildId: string;
  /** Action that was performed (assign or unassign). */
  action: string;
  /** ID of the user affected by the operation. */
  userId: string;
  /** Numeric ID of the net involved. */
  netId: number;
  /** UID of the net involved. */
  netUid: string;
}

/**
 * Payload for bulk assignment operations (internal).
 * @category Assignments
 */
export interface BulkAssignmentPayload {
  /** Default action applied to actions that omit one. */
  action?: "assign" | "unassign";
  /** List of individual assignment actions to perform. */
  assignments: AssignmentAction[];
}

/**
 * Result of a bulk assignment with per-user outcomes.
 * @category Assignments
 */
export interface ShardBulkAssignmentResult {
  /** Whether the bulk operation succeeded overall. */
  ok: boolean;
  /** ID of the guild the assignments belong to. */
  guildId: string;
  /** Per-user outcomes for each action in the bulk operation. */
  results: Array<{
    /** ID of the user this outcome applies to. */
    userId: string;
    /** Numeric ID of the net involved. */
    netId: number;
    /** Action that was performed for this user. */
    action: string;
    /** Whether this user's operation succeeded. */
    ok: boolean;
  }>;
}

/**
 * Result of a temporary assignment including expiration timestamp.
 * @category Assignments
 */
export interface TemporaryAssignmentResult {
  /** Whether the operation succeeded. */
  ok: boolean;
  /** ID of the guild the assignment belongs to. */
  guildId: string;
  /** ID of the user the assignment applies to. */
  userId: string;
  /** Numeric ID of the net assigned. */
  netId: number;
  /** UID of the net assigned. */
  netUid: string;
  /** ISO timestamp at which the assignment expires. */
  expiresAt: string;
}
