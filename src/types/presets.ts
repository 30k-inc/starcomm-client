/**
 * A saved operation preset (net layout + assignments).
 * @category Presets
 */
export interface OperationPreset {
  /** Unique name of the preset. */
  name: string;
  /** Nets included in the preset layout. */
  nets?: Array<{ id: number; name: string }>;
  /** Map of net name to the member IDs assigned to it. */
  assignments?: Record<string, number[]>;
  [key: string]: unknown;
}

/**
 * List of all saved presets.
 * @category Presets
 */
export interface ShardPresetsResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** All saved presets for the shard. */
  presets: OperationPreset[];
}

/**
 * Result of saving a preset.
 * @category Presets
 */
export interface ShardPresetSaveResponse {
  /** Whether the save succeeded. */
  ok: boolean;
  /** The preset that was saved. */
  preset: OperationPreset;
}

/**
 * Result of removing a preset.
 * @category Presets
 */
export interface ShardPresetRemoveResponse {
  /** Whether the removal succeeded. */
  ok: boolean;
  /** Name of the removed preset. */
  name: string;
}

/**
 * Result of applying a preset.
 * @category Presets
 */
export interface ShardPresetApplyResponse {
  /** Whether the apply succeeded. */
  ok: boolean;
  /** Discord guild ID the preset was applied to. */
  guildId: string;
  /** Name of the applied preset. */
  preset: string;
  /** Per-assignment results from applying the preset. */
  results: Array<Record<string, unknown>>;
}
