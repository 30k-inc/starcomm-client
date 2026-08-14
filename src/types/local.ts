// ─── Local StarComm Client WebSocket Protocol Types ───────────────────────────
// These types model the WebSocket messages exchanged with the StarComm desktop
// application running on localhost.
//
// @module
// @category Local Client

// ─── Snapshot ─────────────────────────────────────────────────────────────────

/**
 * Top-level snapshot message sent by the local client on connection and on state changes.
 * @category Local Client
 */
export interface LocalSnapshot {
  type: "snapshot";
  protocol: string;
  protocolVersion: number;
  app: string;
  version: string;
  connected: boolean;
  pairedDevices: number;
  userId: string;
  displayName: string;
  guildId: string;
  guildName: string;
  operationOpen: boolean;
  socketStatus: string;
  activeNetId: number;
  activeGuildId: string;
  relay: LocalRelay;
  access: LocalAccess;
  ptt: LocalPtt;
  overlay: LocalOverlay;
  receiving: LocalReceivingEntry[];
  channels: LocalChannel[];
  admin?: LocalAdmin;
}

// ─── Relay ────────────────────────────────────────────────────────────────────

/** Relay/shard connection state. */
export interface LocalRelay {
  guildId: string;
  guildName: string;
  voiceEndpoint: string;
  udpVoiceEndpoint: string;
  shardName: string;
  shardActive: boolean;
  operationOpen: boolean;
}

// ─── Access ───────────────────────────────────────────────────────────────────

/** User access/permission flags. */
export interface LocalAccess {
  isAdmin: boolean;
  isFullAdmin: boolean;
  canCustomizeTheme: boolean;
}

// ─── PTT ──────────────────────────────────────────────────────────────────────

/** Current push-to-talk state. */
export interface LocalPtt {
  active: boolean;
  netId: number;
  channel: string;
  color: string;
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

/** Overlay display state. */
export interface LocalOverlay {
  transmitting: boolean;
  transmitChannel: string;
  transmitColor: string;
  tag: string;
  language: string;
  labels: LocalOverlayLabels;
  receiving: LocalReceivingEntry[];
}

/** Overlay label strings. */
export interface LocalOverlayLabels {
  transmitting: string;
  receiving: string;
  ready: string;
  commandNet: string;
  radioNet: string;
}

// ─── Receiving ────────────────────────────────────────────────────────────────

/** A single receiving entry (someone currently transmitting). */
export interface LocalReceivingEntry {
  netId: number;
  guildId: string;
  name: string;
  channel: string;
  text: string;
  color: string;
}

// ─── Channels ─────────────────────────────────────────────────────────────────

/** A channel/net visible to the local user. */
export interface LocalChannel {
  id: number;
  uid: string;
  guildId: string;
  guildName: string;
  name: string;
  assigned: boolean;
  canTransmit: boolean;
  canReceive: boolean;
  isPublicNet: boolean;
  isGlobalAlert: boolean;
  shardOnly: boolean;
  orgLink: boolean;
  readOnlyAssignment: boolean;
  active: boolean;
  volume: number;
  muted: boolean;
  memberCount: number;
  members: LocalChannelMember[];
}

/** A member of a channel. */
export interface LocalChannelMember {
  userId: string;
  name: string;
  orgLink: boolean;
  readOnlyAssignment: boolean;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

/** Admin-only session data (only present for admin users). */
export interface LocalAdmin {
  canAssign: boolean;
  canManageNets: boolean;
  canSendAcars: boolean;
  acarsEnabled: boolean;
  acarsDurationMs: number;
  streamerMode: boolean;
  users: LocalAdminUser[];
  channels: LocalAdminChannel[];
}

/** An online user visible in the admin panel. */
export interface LocalAdminUser {
  userId: string;
  name: string;
  connectedAt: string;
  assignedNetIds: number[];
}

/** A channel as seen in the admin panel. */
export interface LocalAdminChannel {
  id: number;
  name: string;
  userIds: string[];
}

// ─── Error ────────────────────────────────────────────────────────────────────

/** Error message from the local client. */
export interface LocalError {
  type: "error";
  message: string;
}

// ─── Phone → StarComm Commands (client sends these) ───────────────────────────

/** Initial hello handshake sent by the phone/external client. */
export interface LocalHelloCommand {
  type: "hello";
}

/** Request a full snapshot refresh. */
export interface LocalSnapshotCommand {
  type: "snapshot";
}

/** Start PTT on a net. */
export interface LocalPttStartCommand {
  type: "ptt.start";
  netId: number;
}

/** Hold PTT (toggle mode). */
export interface LocalPttHoldCommand {
  type: "ptt.hold";
  netId: number;
}

/** Stop PTT on a net. */
export interface LocalPttStopCommand {
  type: "ptt.stop";
  netId: number;
}

/** Admin: assign a user to a net. */
export interface LocalAdminAssignCommand {
  type: "admin.assign";
  userId: string;
  netId: number;
}

/** Admin: unassign a user from a net. */
export interface LocalAdminUnassignCommand {
  type: "admin.unassign";
  userId: string;
  netId: number;
}

/** Admin: disconnect a user. */
export interface LocalAdminDisconnectCommand {
  type: "admin.disconnect";
  userId: string;
}

/** Admin: send an ACARS alert. */
export interface LocalAdminAcarsCommand {
  type: "admin.acars";
  text: string;
}

/** Union of all commands the external client can send to StarComm. */
export type LocalCommand =
  | LocalHelloCommand
  | LocalSnapshotCommand
  | LocalPttStartCommand
  | LocalPttHoldCommand
  | LocalPttStopCommand
  | LocalAdminAssignCommand
  | LocalAdminUnassignCommand
  | LocalAdminDisconnectCommand
  | LocalAdminAcarsCommand;

// ─── Inbound Message Union ────────────────────────────────────────────────────

/** Union of all messages the StarComm desktop app can send to us. */
export type LocalMessage = LocalSnapshot | LocalError;

// ─── Event Map (for typed listeners) ─────────────────────────────────────────

/** Map of local event type strings to their payload types. */
export interface LocalEventMap {
  snapshot: LocalSnapshot;
  error: LocalError;
}

/** All inbound local event type strings. */
export type LocalEventType = keyof LocalEventMap;
