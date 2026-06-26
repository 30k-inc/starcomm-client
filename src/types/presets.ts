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
