import type { BaseClient } from "../base";
import type { PublicNetShowPayload, PublicNetStatusResponse } from "../types";

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

  /** Shows or re-adds the public net with optional name and role gates. */
  async show(payload: PublicNetShowPayload = {}): Promise<Record<string, unknown>> {
    return this.#http.ownerPost<Record<string, unknown>>("/api/v1/public-net/show", payload);
  }

  /** Hides the public net while preserving its config. */
  async hide(): Promise<Record<string, unknown>> {
    return this.#http.ownerPost<Record<string, unknown>>("/api/v1/public-net/hide", {});
  }

  /** Removes the public net and resets its config. */
  async remove(): Promise<Record<string, unknown>> {
    return this.#http.ownerPost<Record<string, unknown>>("/api/v1/public-net/remove", {});
  }

  /** Restores the public net after it was hidden or removed. */
  async restore(): Promise<Record<string, unknown>> {
    return this.#http.ownerPost<Record<string, unknown>>("/api/v1/public-net/restore", {});
  }
}
