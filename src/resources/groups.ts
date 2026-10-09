import type { BaseClient } from "../base";
import type { AssignmentGroupInput, ShardGroupActionResponse, ShardGroupsResponse } from "../types";

/**
 * Assignment group management (list, create/update, delete, place on nets).
 * Groups are named, colored collections of roles and/or users that can be
 * placed onto nets. Introduced in Star Comms shard v1.0.116.
 * @category Resources
 */
export class GroupsResource {
  readonly #http: BaseClient;
  constructor(http: BaseClient) {
    this.#http = http;
  }

  /** Lists all configured assignment groups. */
  async list(): Promise<ShardGroupsResponse> {
    return this.#http.ownerGet<ShardGroupsResponse>("/api/v1/groups");
  }

  /**
   * Creates a new group, or updates an existing one when `group.id` is set.
   * @param group Group definition. Provide `id` to update; omit it to create.
   */
  async upsert(group: AssignmentGroupInput): Promise<ShardGroupActionResponse> {
    return this.#http.ownerPost<ShardGroupActionResponse>("/api/v1/groups", {
      action: "groups.upsert",
      group,
    });
  }

  /**
   * Deletes a group by ID.
   * @param groupId Identifier of the group to delete.
   */
  async delete(groupId: string): Promise<ShardGroupActionResponse> {
    return this.#http.ownerPost<ShardGroupActionResponse>("/api/v1/groups", {
      action: "groups.delete",
      groupId,
    });
  }

  /**
   * Places a group onto a net (adds the net to the group's `netIds`).
   * @param groupId Identifier of the group.
   * @param netId Numeric net identifier to place the group on.
   */
  async assign(groupId: string, netId: number): Promise<ShardGroupActionResponse> {
    return this.#http.ownerPost<ShardGroupActionResponse>("/api/v1/groups", {
      action: "groups.assign",
      groupId,
      netId,
    });
  }

  /**
   * Removes a group from a net (removes the net from the group's `netIds`).
   * @param groupId Identifier of the group.
   * @param netId Numeric net identifier to remove the group from.
   */
  async unassign(groupId: string, netId: number): Promise<ShardGroupActionResponse> {
    return this.#http.ownerPost<ShardGroupActionResponse>("/api/v1/groups", {
      action: "groups.unassign",
      groupId,
      netId,
    });
  }
}
