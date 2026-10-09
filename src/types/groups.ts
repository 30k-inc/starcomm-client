/**
 * An assignment group: a named, colored collection of roles and/or users that can
 * be placed onto one or more nets. Introduced in Star Comms shard v1.0.116.
 * @category Groups
 */
export interface AssignmentGroup {
  /** Stable group identifier (`g` followed by 16 hex characters). Omit when creating. */
  id: string;
  /** Human-readable group name (max 40 characters). */
  name: string;
  /** Display color as a `#RRGGBB` hex string. Defaults to `#3D8BFF`. */
  color: string;
  /** Whether members of this group are automatically assigned to its nets. */
  autoAssign: boolean;
  /** Discord role IDs that belong to this group (max 50). */
  roleIds: string[];
  /** Discord user IDs that belong to this group (max 200). */
  userIds: string[];
  /** Numeric net IDs this group is currently placed on. */
  netIds: number[];
  /** ISO timestamp at which the group was created. */
  createdAt: string;
  /** ISO timestamp at which the group was last updated. */
  updatedAt: string;
}

/**
 * Draft shape accepted when creating or updating a group via `groups.upsert`.
 * All fields except `name` are optional; the server fills defaults and normalizes
 * (dedupes IDs, clamps lengths, validates the color).
 * @category Groups
 */
export interface AssignmentGroupInput {
  /** Group ID to update. Omit to create a new group. */
  id?: string;
  /** Human-readable group name (max 40 characters). */
  name: string;
  /** Display color as a `#RRGGBB` hex string. Defaults to `#3D8BFF`. */
  color?: string;
  /** Whether members of this group are automatically assigned to its nets. */
  autoAssign?: boolean;
  /** Discord role IDs that belong to this group (max 50). */
  roleIds?: string[];
  /** Discord user IDs that belong to this group (max 200). */
  userIds?: string[];
  /** Numeric net IDs this group is placed on. */
  netIds?: number[];
}

/** Action discriminants accepted by `POST /api/v1/groups`. */
export type GroupActionType =
  | "groups.upsert"
  | "groups.delete"
  | "groups.assign"
  | "groups.unassign";

/**
 * Response from `GET /api/v1/groups` (list all assignment groups).
 * @category Groups
 */
export interface ShardGroupsResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** ID of the guild the groups belong to. */
  guildId: string;
  /** All configured assignment groups (normalized). */
  groups: AssignmentGroup[];
}

/**
 * Response from any `POST /api/v1/groups` action (upsert, delete, assign, unassign).
 * @category Groups
 */
export interface ShardGroupActionResponse {
  /** Whether the operation succeeded. */
  ok: boolean;
  /** ID of the guild the groups belong to. */
  guildId?: string;
  /** Action that was performed. */
  action?: GroupActionType | string;
  /** Full set of groups after the action was applied. */
  groups: AssignmentGroup[];
  /** The single group affected by this action, when applicable. */
  group?: AssignmentGroup | null;
}
