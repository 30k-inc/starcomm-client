import type { BaseClient } from "../base";
import type {
  ArchiveListQuery,
  ArchiveUpsertPayload,
  ShardArchiveDeleteResponse,
  ShardArchiveEntryResponse,
  ShardArchiveListResponse,
  ShardArchiveRestoreResponse,
  ShardArchiveSyncStatusResponse,
  ShardArchiveUpsertResponse,
} from "../types";

/**
 * Net archive CRUD and sync status.
 * @category Resources
 */
export class ArchiveResource {
  constructor(private readonly http: BaseClient) {}

  /**
   * Lists archived net configurations.
   * @param query Optional filters for tag, search text, and result limit.
   */
  async list(query?: ArchiveListQuery): Promise<ShardArchiveListResponse> {
    const params = new URLSearchParams();
    if (query?.q) params.set("q", query.q);
    if (query?.tag) {
      const tags = Array.isArray(query.tag) ? query.tag : [query.tag];
      for (const t of tags) params.append("tag", t);
    }
    if (query?.limit) params.set("limit", String(query.limit));
    const qs = params.toString();
    return this.http.ownerGet<ShardArchiveListResponse>(`/api/v1/archive${qs ? `?${qs}` : ""}`);
  }

  /**
   * Fetches a single archive entry by UID.
   * @param uid Archive entry unique identifier.
   */
  async get(uid: string): Promise<ShardArchiveEntryResponse> {
    return this.http.ownerGet<ShardArchiveEntryResponse>(
      `/api/v1/archive/${encodeURIComponent(uid)}`,
    );
  }

  /** Creates or updates an archive entry. */
  async upsert(payload: ArchiveUpsertPayload): Promise<ShardArchiveUpsertResponse> {
    return this.http.ownerPost<ShardArchiveUpsertResponse>("/api/v1/archive", payload);
  }

  /**
   * Updates an existing archive entry by UID.
   * @param uid Archive entry unique identifier.
   */
  async update(uid: string, payload: ArchiveUpsertPayload): Promise<ShardArchiveUpsertResponse> {
    return this.http.ownerPost<ShardArchiveUpsertResponse>(
      `/api/v1/archive/${encodeURIComponent(uid)}`,
      payload,
    );
  }

  /**
   * Soft-deletes an archive entry.
   * @param uid Archive entry unique identifier.
   */
  async delete(uid: string): Promise<ShardArchiveDeleteResponse> {
    return this.http.ownerDelete<ShardArchiveDeleteResponse>(
      `/api/v1/archive/${encodeURIComponent(uid)}`,
    );
  }

  /**
   * Restores a previously deleted archive entry.
   * @param uid Archive entry unique identifier.
   */
  async restore(uid: string): Promise<ShardArchiveRestoreResponse> {
    return this.http.ownerPost<ShardArchiveRestoreResponse>(
      `/api/v1/archive/${encodeURIComponent(uid)}/restore`,
      {},
    );
  }

  /** Fetches the archive sync/checkpoint status. */
  async syncStatus(): Promise<ShardArchiveSyncStatusResponse> {
    return this.http.ownerGet<ShardArchiveSyncStatusResponse>("/api/v1/archive/sync/status");
  }
}
