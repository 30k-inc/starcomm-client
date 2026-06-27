/**
 * A saved operation preset (net layout + assignments).
 * @category Presets
 */
export interface OperationPreset {
  name: string;
  nets?: Array<{ id: number; name: string }>;
  assignments?: Record<string, number[]>;
  [key: string]: unknown;
}

/**
 * List of all saved presets.
 * @category Presets
 */
export interface ShardPresetsResponse {
  ok: boolean;
  presets: OperationPreset[];
}

/**
 * Result of saving a preset.
 * @category Presets
 */
export interface ShardPresetSaveResponse {
  ok: boolean;
  preset: OperationPreset;
}

/**
 * Result of removing a preset.
 * @category Presets
 */
export interface ShardPresetRemoveResponse {
  ok: boolean;
  name: string;
}

/**
 * Result of applying a preset.
 * @category Presets
 */
export interface ShardPresetApplyResponse {
  ok: boolean;
  guildId: string;
  preset: string;
  results: Array<Record<string, unknown>>;
}
