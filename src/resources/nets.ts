import type { BaseClient } from "../base";
import type { CreateNetPayload, RemoveNetPayload, RenameNetPayload } from "../types";

/**
 * Voice net management (create, rename, remove).
 * @category Resources
 */
export class NetsResource {
  constructor(private readonly http: BaseClient) {}

  /** Creates a new voice net on the shard. */
  async create(payload: CreateNetPayload): Promise<Record<string, unknown>> {
    return this.http.ownerPost<Record<string, unknown>>("/api/v1/nets", payload);
  }

  /** Renames an existing net. */
  async rename(payload: RenameNetPayload): Promise<Record<string, unknown>> {
    return this.http.ownerPost<Record<string, unknown>>("/api/v1/nets/rename", payload);
  }

  /** Removes a net by numeric ID. */
  async remove(payload: RemoveNetPayload): Promise<Record<string, unknown>> {
    return this.http.ownerPost<Record<string, unknown>>("/api/v1/nets/remove", payload);
  }

  /**
   * Removes a net by its UID or string reference.
   * @param ref Net UID (e.g., `"net_abc123"`) or numeric ID as string.
   */
  async removeByRef(ref: string): Promise<Record<string, unknown>> {
    return this.http.ownerDelete<Record<string, unknown>>(
      `/api/v1/nets/${encodeURIComponent(ref)}`,
    );
  }
}
