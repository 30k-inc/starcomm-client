import type { BaseClient } from "../base";
import type {
  AssignmentAction,
  BulkAssignmentPayload,
  ShardAssignmentResult,
  ShardAssignmentsResponse,
  ShardBulkAssignmentResult,
  TemporaryAssignmentResult,
} from "../types";

/**
 * Net assignment operations (assign, unassign, bulk, temporary).
 * @category Resources
 */
export class AssignmentsResource {
  readonly #http: BaseClient;
  constructor(http: BaseClient) {
    this.#http = http;
  }

  /** Fetches all current net assignments (user → net mappings). */
  async list(): Promise<ShardAssignmentsResponse> {
    return this.#http.ownerGet<ShardAssignmentsResponse>("/api/v1/assignments");
  }

  /**
   * Assigns a user to a net.
   * @param userId Discord user ID of the operator.
   * @param netId Numeric net identifier.
   */
  async assign(userId: string, netId: number): Promise<ShardAssignmentResult> {
    const body: AssignmentAction = { userId, netId, action: "assign" };
    return this.#http.ownerPost<ShardAssignmentResult>("/api/v1/assignments", body);
  }

  /**
   * Unassigns a user from a net.
   * @param userId Discord user ID of the operator.
   * @param netId Numeric net identifier.
   */
  async unassign(userId: string, netId: number): Promise<ShardAssignmentResult> {
    const body: AssignmentAction = { userId, netId, action: "unassign" };
    return this.#http.ownerPost<ShardAssignmentResult>("/api/v1/assignments", body);
  }

  /** Assigns or unassigns multiple users in a single request. */
  async bulk(assignments: AssignmentAction[]): Promise<ShardBulkAssignmentResult> {
    const payload: BulkAssignmentPayload = { assignments };
    return this.#http.ownerPost<ShardBulkAssignmentResult>("/api/v1/assignments/bulk", payload);
  }

  /**
   * Creates a temporary net assignment that auto-expires.
   * @param userId Discord user ID of the operator.
   * @param netId Numeric net identifier.
   * @param ttlMs Time-to-live in milliseconds (min 15s, max 24h). Defaults to 5 minutes.
   */
  async temporary(userId: string, netId: number, ttlMs?: number): Promise<TemporaryAssignmentResult> {
    return this.#http.ownerPost<TemporaryAssignmentResult>("/api/v1/assignments/temporary", {
      userId,
      netId,
      ...(ttlMs !== undefined && { ttlMs }),
    });
  }
}
