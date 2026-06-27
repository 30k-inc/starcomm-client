import type { BaseClient } from "../base";
import type { PublicNetActionResponse, PublicNetStatusResponse } from "../types";

/**
 * Public net feature management (show, hide, remove, restore).
 * @category Resources
 */
export class PublicNetResource {
  readonly #http: BaseClient;
  constructor(http: BaseClient) {
    this.#http = http;
  }

  /** Reads current public net feature state. */
  async get(): Promise<PublicNetStatusResponse> {
    return this.#http.ownerGet<PublicNetStatusResponse>("/api/v1/public-net");
  }

  /**
   * Shows or re-adds the public net.
   * @param name Optional display name for the public net.
   * @param roleIds Optional role IDs that gate access to the public net.
   */
  async show(name?: string, roleIds?: string[]): Promise<PublicNetActionResponse> {
    return this.#http.ownerPost<PublicNetActionResponse>("/api/v1/public-net/show", {
      ...(name && { name }),
      ...(roleIds && { roleIds }),
    });
  }

  /** Hides the public net while preserving its config. */
  async hide(): Promise<PublicNetActionResponse> {
    return this.#http.ownerPost<PublicNetActionResponse>("/api/v1/public-net/hide", {});
  }

  /** Removes the public net and resets its config. */
  async remove(): Promise<PublicNetActionResponse> {
    return this.#http.ownerPost<PublicNetActionResponse>("/api/v1/public-net/remove", {});
  }

  /** Restores the public net after it was hidden or removed. */
  async restore(): Promise<PublicNetActionResponse> {
    return this.#http.ownerPost<PublicNetActionResponse>("/api/v1/public-net/restore", {});
  }
}
