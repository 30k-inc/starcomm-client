import type { ArchiveEntry } from "./archive";

/**
 * Response from creating a net.
 * @category Nets
 */
export interface NetCreateResponse {
  /** Whether the operation succeeded. */
  ok: boolean;
  /** ID of the guild the net belongs to. */
  guildId: string;
  /** Discriminator identifying this as a net-create action. */
  action: "net.create";
  /** Numeric ID of the created net. */
  netId: number;
  /** Unique string identifier of the created net. */
  netUid: string;
  /** Display name of the created net. */
  name: string;
}

/**
 * Response from renaming a net.
 * @category Nets
 */
export interface NetRenameResponse {
  /** Whether the operation succeeded. */
  ok: boolean;
  /** ID of the guild the net belongs to. */
  guildId: string;
  /** Discriminator identifying this as a net-rename action. */
  action: "net.rename";
  /** Numeric ID of the renamed net. */
  netId: number;
  /** Unique string identifier of the renamed net. */
  netUid: string;
  /** New display name of the net. */
  name: string;
}

/**
 * Response from removing a net.
 *
 * As of shard v1.0.116 `/nets/remove` deletes the net **permanently** rather than
 * archiving it, so `archived` is now `false` and `entry` is omitted. The field
 * remains for backward compatibility with older shard versions that archived on
 * removal.
 * @category Nets
 */
export interface NetRemoveResponse {
  /** Whether the operation succeeded. */
  ok: boolean;
  /** ID of the guild the net belonged to. */
  guildId: string;
  /** Discriminator identifying this as a net-remove action. */
  action: "net.remove";
  /** Numeric ID of the removed net. */
  netId: number;
  /** Unique string identifier of the removed net. */
  netUid: string;
  /** Whether the net was archived on removal. Always `false` on shard v1.0.116+ (permanent delete). */
  archived: boolean;
  /** Archive entry recording the removed net. Omitted on shard v1.0.116+ (not archived). */
  entry?: ArchiveEntry;
}
