import type { BaseClient } from "../base";
import type {
  AssignmentAction,
  BulkAssignmentPayload,
  ShardAssignmentResult,
  ShardAssignmentsResponse,
  ShardBulkAssignmentResult,
  TemporaryAssignmentPayload,
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
   * Assigns or unassigns a user to/from a net.
   * @param userId Discord user ID of the operator.
   * @param netId Numeric net identifier.
   * @param action Whether to assign or unassign. @default "assign"
   */
  async set(
    userId: string,
    netId: number,
    action: "assign" | "unassign" = "assign",
  ): Promise<ShardAssignmentResult> {
    const body: AssignmentAction = { userId, netId, action };
    return this.#http.ownerPost<ShardAssignmentResult>("/api/v1/assignments", body);
  }

  /** Assigns or unassigns multiple users in a single request. */
  async bulk(payload: BulkAssignmentPayload): Promise<ShardBulkAssignmentResult> {
    return this.#http.ownerPost<ShardBulkAssignmentResult>("/api/v1/assignments/bulk", payload);
  }

  /** Creates a temporary net assignment that auto-expires after a TTL. */
  async temporary(payload: TemporaryAssignmentPayload): Promise<TemporaryAssignmentResult> {
    return this.#http.ownerPost<TemporaryAssignmentResult>("/api/v1/assignments/temporary", payload);
  }
}
