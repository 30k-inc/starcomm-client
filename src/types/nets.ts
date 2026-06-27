import type { ArchiveEntry } from "./archive";

/**
 * Response from creating a net.
 * @category Nets
 */
export interface NetCreateResponse {
  ok: boolean;
  guildId: string;
  action: "net.create";
  netId: number;
  netUid: string;
  name: string;
}

/**
 * Response from renaming a net.
 * @category Nets
 */
export interface NetRenameResponse {
  ok: boolean;
  guildId: string;
  action: "net.rename";
  netId: number;
  netUid: string;
  name: string;
}

/**
 * Response from removing a net.
 * @category Nets
 */
export interface NetRemoveResponse {
  ok: boolean;
  guildId: string;
  action: "net.remove";
  netId: number;
  netUid: string;
  archived: boolean;
  entry: ArchiveEntry;
}
