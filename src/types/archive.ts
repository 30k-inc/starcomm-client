/**
 * An archived net configuration entry.
 * @category Archive
 */
export interface ArchiveEntry {
  uid: string;
  name: string;
  notes: string;
  tags: string[];
  assignedUserIds: string[];
  relayTargetNetUids: string[];
  inboundRelayFromNetUids: string[];
  createdAt: string;
  archivedAt: string;
  updatedAt: string;
  source: string;
}

/**
 * Paginated list of archive entries.
 * @category Archive
 */
export interface ShardArchiveListResponse {
  ok: boolean;
  guildId: string;
  entries: ArchiveEntry[];
  total: number;
}

/**
 * Single archive entry with source metadata.
 * @category Archive
 */
export interface ShardArchiveEntryResponse {
  ok: boolean;
  guildId: string;
  entry: ArchiveEntry;
  source: string;
}

/**
 * Result of an archive create or update operation.
 * @category Archive
 */
export interface ShardArchiveUpsertResponse {
  ok: boolean;
  guildId: string;
  entry: ArchiveEntry;
  action: "created" | "updated";
}

/**
 * Result of an archive entry deletion.
 * @category Archive
 */
export interface ShardArchiveDeleteResponse {
  ok: boolean;
  guildId: string;
  uid: string;
  deleted: boolean;
}

/**
 * Result of restoring a deleted archive entry.
 * @category Archive
 */
export interface ShardArchiveRestoreResponse {
  ok: boolean;
  guildId: string;
  uid: string;
  [key: string]: unknown;
}

/**
 * Archive sync checkpoint and pending operation count.
 * @category Archive
 */
export interface ShardArchiveSyncStatusResponse {
  ok: boolean;
  guildId: string;
  checkpoint: {
    lastCheckpointHash: string;
    lastCheckpointVersion: number;
    lastCheckpointAt: string;
  };
  pendingOps: number;
}

/**
 * Payload for creating or updating an archive entry.
 * @category Archive
 */
export interface ArchiveUpsertPayload {
  uid?: string;
  name?: string;
  notes?: string;
  tags?: string[];
  assignedUserIds?: string[];
  relayTargetNetUids?: string[];
  inboundRelayFromNetUids?: string[];
}

/**
 * Query filters for listing archive entries.
 * @category Archive
 */
export interface ArchiveListQuery {
  /** Filter by tag(s). Pass a string or array of strings. */
  tag?: string | string[];
  /** Free-text search query. */
  q?: string;
  /** Maximum number of entries to return. */
  limit?: number;
}
