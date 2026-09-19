/**
 * An archived net configuration entry.
 * @category Archive
 */
export interface ArchiveEntry {
  /** Unique identifier for the archive entry. */
  uid: string;
  /** Display name of the archived net. */
  name: string;
  /** Free-text notes about the entry. */
  notes: string;
  /** Tags associated with the entry. */
  tags: string[];
  /** User IDs assigned to this net. */
  assignedUserIds: string[];
  /** Net UIDs this net relays outbound to. */
  relayTargetNetUids: string[];
  /** Net UIDs this net receives inbound relays from. */
  inboundRelayFromNetUids: string[];
  /** ISO timestamp when the entry was created. */
  createdAt: string;
  /** ISO timestamp when the entry was archived. */
  archivedAt: string;
  /** ISO timestamp when the entry was last updated. */
  updatedAt: string;
  /** Origin source of the archive entry. */
  source: string;
}

/**
 * Paginated list of archive entries.
 * @category Archive
 */
export interface ShardArchiveListResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** Discord guild identifier the entries belong to. */
  guildId: string;
  /** Archive entries in this page. */
  entries: ArchiveEntry[];
  /** Total number of matching entries. */
  total: number;
}

/**
 * Single archive entry with source metadata.
 * @category Archive
 */
export interface ShardArchiveEntryResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** Discord guild identifier the entry belongs to. */
  guildId: string;
  /** The requested archive entry. */
  entry: ArchiveEntry;
  /** Origin source of the archive entry. */
  source: string;
}

/**
 * Result of an archive create or update operation.
 * @category Archive
 */
export interface ShardArchiveUpsertResponse {
  /** Whether the operation succeeded. */
  ok: boolean;
  /** Discord guild identifier the entry belongs to. */
  guildId: string;
  /** The created or updated archive entry. */
  entry: ArchiveEntry;
  /** Whether the entry was created or updated. */
  action: "created" | "updated";
}

/**
 * Result of an archive entry deletion.
 * @category Archive
 */
export interface ShardArchiveDeleteResponse {
  /** Whether the deletion succeeded. */
  ok: boolean;
  /** Discord guild identifier the entry belonged to. */
  guildId: string;
  /** Unique identifier of the deleted entry. */
  uid: string;
  /** Whether the entry was actually deleted. */
  deleted: boolean;
}

/**
 * Result of restoring a deleted archive entry.
 * @category Archive
 */
export interface ShardArchiveRestoreResponse {
  /** Whether the restore succeeded. */
  ok: boolean;
  /** Discord guild identifier the entry belongs to. */
  guildId: string;
  /** Unique identifier of the restored entry. */
  uid: string;
  [key: string]: unknown;
}

/**
 * Archive sync checkpoint and pending operation count.
 * @category Archive
 */
export interface ShardArchiveSyncStatusResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** Discord guild identifier the sync status applies to. */
  guildId: string;
  /** Latest sync checkpoint metadata. */
  checkpoint: {
    /** Hash of the last committed checkpoint. */
    lastCheckpointHash: string;
    /** Version number of the last checkpoint. */
    lastCheckpointVersion: number;
    /** ISO timestamp of the last checkpoint. */
    lastCheckpointAt: string;
  };
  /** Number of operations pending sync. */
  pendingOps: number;
}

/**
 * Payload for creating or updating an archive entry.
 * @category Archive
 */
export interface ArchiveUpsertPayload {
  /** Unique identifier of the entry to update; omit to create. */
  uid?: string;
  /** Display name of the net. */
  name?: string;
  /** Free-text notes about the entry. */
  notes?: string;
  /** Tags to associate with the entry. */
  tags?: string[];
  /** User IDs to assign to this net. */
  assignedUserIds?: string[];
  /** Net UIDs this net relays outbound to. */
  relayTargetNetUids?: string[];
  /** Net UIDs this net receives inbound relays from. */
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
