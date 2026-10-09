---
"@30k/starcomm-client": minor
---

Update for Star Comms bun shard v1.0.116 API changes:

### New: Assignment Groups

Added `client.groups` (`GroupsResource`) for the new `/api/v1/groups` Owner API:

- `list()` — fetch all assignment groups (`GET /api/v1/groups`)
- `upsert(group)` — create a group, or update one when `group.id` is set
- `delete(groupId)` — delete a group
- `assign(groupId, netId)` / `unassign(groupId, netId)` — place or remove a group on a net

All actions require the `write:assignments` owner scope. New types: `AssignmentGroup`, `AssignmentGroupInput`, `GroupActionType`, `ShardGroupsResponse`, `ShardGroupActionResponse`.

### Changed: `nets.remove` is now a permanent delete

As of shard v1.0.116, `/nets/remove` deletes a net permanently instead of archiving it. `NetRemoveResponse.archived` is now always `false` and `entry` is optional (omitted) — `entry` was previously required. Updated JSDoc accordingly.

### Changed: local admin snapshot

`LocalAdminChannel` gained a `groupIds: string[]` field, listing the assignment groups placed on each net in the desktop admin panel snapshot.
