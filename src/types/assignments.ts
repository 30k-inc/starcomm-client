/**
 * Map of user IDs to their assigned net IDs.
 * @category Assignments
 */
export interface ShardAssignmentsResponse {
  ok: boolean;
  guildId: string;
  assignments: Record<string, number[]>;
}

/**
 * A single assign/unassign action for one user.
 * Used in bulk operations.
 * @category Assignments
 */
export interface AssignmentAction {
  userId: string;
  netId: number;
  /** Net UID (alternative to netId). */
  netUid?: string;
  action?: "assign" | "unassign";
}

/**
 * Result of a single assignment operation.
 * @category Assignments
 */
export interface ShardAssignmentResult {
  ok: boolean;
  guildId: string;
  action: string;
  userId: string;
  netId: number;
  netUid: string;
}

/**
 * Payload for bulk assignment operations (internal).
 * @category Assignments
 */
export interface BulkAssignmentPayload {
  action?: "assign" | "unassign";
  assignments: AssignmentAction[];
}

/**
 * Result of a bulk assignment with per-user outcomes.
 * @category Assignments
 */
export interface ShardBulkAssignmentResult {
  ok: boolean;
  guildId: string;
  results: Array<{
    userId: string;
    netId: number;
    action: string;
    ok: boolean;
  }>;
}

/**
 * Result of a temporary assignment including expiration timestamp.
 * @category Assignments
 */
export interface TemporaryAssignmentResult {
  ok: boolean;
  guildId: string;
  userId: string;
  netId: number;
  netUid: string;
  expiresAt: string;
}
