import type { BaseClient } from "../base";
import type {
  NetCreateResponse,
  NetRemoveResponse,
  NetRenameResponse,
  ShardNetStatus,
  ShardStatusResponse,
} from "../types";

/**
 * Voice net management (create, rename, remove).
 * @category Resources
 */
export class NetsResource {
  readonly #http: BaseClient;
  constructor(http: BaseClient) {
    this.#http = http;
  }

  /**
   * Lists all configured nets with live occupancy and relay info.
   * Fetches the full shard status and returns the `nets` array.
   */
  async list(): Promise<ShardNetStatus[]> {
    const status = await this.#http.ownerGet<ShardStatusResponse>("/api/v1/status");
    return status.nets;
  }

  /**
   * Creates a new voice net on the shard.
   * @param name Display name for the net.
   */
  async create(name: string): Promise<NetCreateResponse> {
    return this.#http.ownerPost<NetCreateResponse>("/api/v1/nets", { name });
  }

  /**
   * Renames an existing net.
   * @param netId Numeric net identifier.
   * @param name New display name.
   * @param netUid Net UID (alternative to netId).
   */
  async rename(netId: number, name: string, netUid?: string): Promise<NetRenameResponse> {
    return this.#http.ownerPost<NetRenameResponse>("/api/v1/nets/rename", {
      netId,
      name,
      ...(netUid && { netUid }),
    });
  }

  /**
   * Removes a net by numeric ID.
   * @param netId Numeric net identifier.
   * @param netUid Net UID (alternative to netId).
   */
  async remove(netId: number, netUid?: string): Promise<NetRemoveResponse> {
    return this.#http.ownerPost<NetRemoveResponse>("/api/v1/nets/remove", {
      netId,
      ...(netUid && { netUid }),
    });
  }

  /**
   * Removes a net by its UID or string reference.
   * @param ref Net UID (e.g., `"net_abc123"`) or numeric ID as string.
   */
  async removeByRef(ref: string): Promise<NetRemoveResponse> {
    return this.#http.ownerDelete<NetRemoveResponse>(
      `/api/v1/nets/${encodeURIComponent(ref)}`,
    );
  }
}
