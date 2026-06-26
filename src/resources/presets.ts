import type { BaseClient } from "../base";
import type { OperationPreset, ShardPresetsResponse } from "../types";

/**
 * Operation preset management (save, apply, remove).
 * @category Resources
 */
export class PresetsResource {
  readonly #http: BaseClient;
  constructor(http: BaseClient) {
    this.#http = http;
  }

  /** Fetches all saved operation presets. */
  async list(): Promise<ShardPresetsResponse> {
    return this.#http.ownerGet<ShardPresetsResponse>("/api/v1/presets");
  }

  /** Saves a new operation preset (or updates an existing one by name). */
  async save(preset: OperationPreset): Promise<Record<string, unknown>> {
    return this.#http.ownerPost<Record<string, unknown>>("/api/v1/presets", preset);
  }

  /**
   * Applies a saved preset, restoring its net layout and assignments.
   * @param name Preset name (case-sensitive).
   */
  async apply(name: string): Promise<Record<string, unknown>> {
    return this.#http.ownerPost<Record<string, unknown>>(
      `/api/v1/presets/${encodeURIComponent(name)}/apply`,
      {},
    );
  }

  /**
   * Deletes a saved preset.
   * @param name Preset name (case-sensitive).
   */
  async remove(name: string): Promise<Record<string, unknown>> {
    return this.#http.ownerDelete<Record<string, unknown>>(
      `/api/v1/presets/${encodeURIComponent(name)}`,
    );
  }
}
