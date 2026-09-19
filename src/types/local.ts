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
  /** Message discriminant identifying this as a snapshot message. */
  type: "snapshot";
  /** Name of the protocol in use. */
  protocol: string;
  /** Numeric version of the protocol. */
  protocolVersion: number;
  /** Name of the local application. */
  app: string;
  /** Version string of the local application. */
  version: string;
  /** Whether the local client is currently connected. */
  connected: boolean;
  /** Number of paired devices. */
  pairedDevices: number;
  /** Identifier of the current user. */
  userId: string;
  /** Display name of the current user. */
  displayName: string;
  /** Identifier of the current guild. */
  guildId: string;
  /** Display name of the current guild. */
  guildName: string;
  /** Whether an operation is currently open. */
  operationOpen: boolean;
  /** Current status of the underlying socket. */
  socketStatus: string;
  /** Identifier of the currently active net. */
  activeNetId: number;
  /** Identifier of the currently active guild. */
  activeGuildId: string;
  /** Relay/shard connection state. */
  relay: LocalRelay;
  /** User access/permission flags. */
  access: LocalAccess;
  /** Current push-to-talk state. */
  ptt: LocalPtt;
  /** Overlay display state. */
  overlay: LocalOverlay;
  /** Entries currently being received (others transmitting). */
  receiving: LocalReceivingEntry[];
  /** Channels/nets visible to the local user. */
  channels: LocalChannel[];
  /** Admin-only session data, present only for admin users. */
  admin?: LocalAdmin;
}

// ─── Relay ────────────────────────────────────────────────────────────────────

/** Relay/shard connection state. */
export interface LocalRelay {
  /** Identifier of the relay's guild. */
  guildId: string;
  /** Display name of the relay's guild. */
  guildName: string;
  /** Voice endpoint address for the relay. */
  voiceEndpoint: string;
  /** UDP voice endpoint address for the relay. */
  udpVoiceEndpoint: string;
  /** Name of the shard. */
  shardName: string;
  /** Whether the shard is currently active. */
  shardActive: boolean;
  /** Whether an operation is currently open on the relay. */
  operationOpen: boolean;
}

// ─── Access ───────────────────────────────────────────────────────────────────

/** User access/permission flags. */
export interface LocalAccess {
  /** Whether the user has admin privileges. */
  isAdmin: boolean;
  /** Whether the user has full admin privileges. */
  isFullAdmin: boolean;
  /** Whether the user may customize the theme. */
  canCustomizeTheme: boolean;
}

// ─── PTT ──────────────────────────────────────────────────────────────────────

/** Current push-to-talk state. */
export interface LocalPtt {
  /** Whether push-to-talk is currently active. */
  active: boolean;
  /** Identifier of the net being transmitted on. */
  netId: number;
  /** Name of the channel being transmitted on. */
  channel: string;
  /** Display color associated with the channel. */
  color: string;
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

/** Overlay display state. */
export interface LocalOverlay {
  /** Whether the user is currently transmitting. */
  transmitting: boolean;
  /** Name of the channel being transmitted on. */
  transmitChannel: string;
  /** Display color of the transmit channel. */
  transmitColor: string;
  /** Tag label shown in the overlay. */
  tag: string;
  /** Current overlay language. */
  language: string;
  /** Localized overlay label strings. */
  labels: LocalOverlayLabels;
  /** Entries currently being received in the overlay. */
  receiving: LocalReceivingEntry[];
}

/** Overlay label strings. */
export interface LocalOverlayLabels {
  /** Label for the transmitting state. */
  transmitting: string;
  /** Label for the receiving state. */
  receiving: string;
  /** Label for the ready state. */
  ready: string;
  /** Label for the command net. */
  commandNet: string;
  /** Label for the radio net. */
  radioNet: string;
}

// ─── Receiving ────────────────────────────────────────────────────────────────

/** A single receiving entry (someone currently transmitting). */
export interface LocalReceivingEntry {
  /** Identifier of the net the entry is on. */
  netId: number;
  /** Identifier of the entry's guild. */
  guildId: string;
  /** Display name of the transmitting user. */
  name: string;
  /** Name of the channel being received on. */
  channel: string;
  /** Text associated with the entry. */
  text: string;
  /** Display color associated with the entry. */
  color: string;
}

// ─── Channels ─────────────────────────────────────────────────────────────────

/** A channel/net visible to the local user. */
export interface LocalChannel {
  /** Numeric identifier of the channel. */
  id: number;
  /** Unique string identifier of the channel. */
  uid: string;
  /** Identifier of the channel's guild. */
  guildId: string;
  /** Display name of the channel's guild. */
  guildName: string;
  /** Display name of the channel. */
  name: string;
  /** Whether the user is assigned to this channel. */
  assigned: boolean;
  /** Whether the user may transmit on this channel. */
  canTransmit: boolean;
  /** Whether the user may receive on this channel. */
  canReceive: boolean;
  /** Whether this is a public net. */
  isPublicNet: boolean;
  /** Whether this is a global alert channel. */
  isGlobalAlert: boolean;
  /** Whether this channel is restricted to the current shard. */
  shardOnly: boolean;
  /** Whether this channel is linked to an org. */
  orgLink: boolean;
  /** Whether the assignment to this channel is read-only. */
  readOnlyAssignment: boolean;
  /** Whether the channel is currently active. */
  active: boolean;
  /** Playback volume level for the channel. */
  volume: number;
  /** Whether the channel is muted. */
  muted: boolean;
  /** Number of members in the channel. */
  memberCount: number;
  /** Members currently in the channel. */
  members: LocalChannelMember[];
}

/** A member of a channel. */
export interface LocalChannelMember {
  /** Identifier of the member. */
  userId: string;
  /** Display name of the member. */
  name: string;
  /** Whether the member is linked via an org. */
  orgLink: boolean;
  /** Whether the member's assignment is read-only. */
  readOnlyAssignment: boolean;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

/** Admin-only session data (only present for admin users). */
export interface LocalAdmin {
  /** Whether the admin may assign users to nets. */
  canAssign: boolean;
  /** Whether the admin may manage nets. */
  canManageNets: boolean;
  /** Whether the admin may send ACARS alerts. */
  canSendAcars: boolean;
  /** Whether ACARS alerts are enabled. */
  acarsEnabled: boolean;
  /** Duration of an ACARS alert in milliseconds. */
  acarsDurationMs: number;
  /** Whether streamer mode is enabled. */
  streamerMode: boolean;
  /** Users visible in the admin panel. */
  users: LocalAdminUser[];
  /** Channels visible in the admin panel. */
  channels: LocalAdminChannel[];
}

/** An online user visible in the admin panel. */
export interface LocalAdminUser {
  /** Identifier of the user. */
  userId: string;
  /** Display name of the user. */
  name: string;
  /** Timestamp when the user connected. */
  connectedAt: string;
  /** Identifiers of the nets the user is assigned to. */
  assignedNetIds: number[];
}

/** A channel as seen in the admin panel. */
export interface LocalAdminChannel {
  /** Numeric identifier of the channel. */
  id: number;
  /** Display name of the channel. */
  name: string;
  /** Identifiers of the users in the channel. */
  userIds: string[];
}

// ─── Error ────────────────────────────────────────────────────────────────────

/** Error message from the local client. */
export interface LocalError {
  /** Message discriminant identifying this as an error message. */
  type: "error";
  /** Human-readable error description. */
  message: string;
}

// ─── Phone → StarComm Commands (client sends these) ───────────────────────────

/** Initial hello handshake sent by the phone/external client. */
export interface LocalHelloCommand {
  /** Command discriminant identifying the hello handshake. */
  type: "hello";
}

/** Request a full snapshot refresh. */
export interface LocalSnapshotCommand {
  /** Command discriminant requesting a snapshot refresh. */
  type: "snapshot";
}

/** Start PTT on a net. */
export interface LocalPttStartCommand {
  /** Command discriminant to start push-to-talk. */
  type: "ptt.start";
  /** Identifier of the net to start transmitting on. */
  netId: number;
}

/** Hold PTT (toggle mode). */
export interface LocalPttHoldCommand {
  /** Command discriminant to hold push-to-talk. */
  type: "ptt.hold";
  /** Identifier of the net to hold transmission on. */
  netId: number;
}

/** Stop PTT on a net. */
export interface LocalPttStopCommand {
  /** Command discriminant to stop push-to-talk. */
  type: "ptt.stop";
  /** Identifier of the net to stop transmitting on. */
  netId: number;
}

/** Admin: assign a user to a net. */
export interface LocalAdminAssignCommand {
  /** Command discriminant to assign a user to a net. */
  type: "admin.assign";
  /** Identifier of the user to assign. */
  userId: string;
  /** Identifier of the net to assign the user to. */
  netId: number;
}

/** Admin: unassign a user from a net. */
export interface LocalAdminUnassignCommand {
  /** Command discriminant to unassign a user from a net. */
  type: "admin.unassign";
  /** Identifier of the user to unassign. */
  userId: string;
  /** Identifier of the net to unassign the user from. */
  netId: number;
}

/** Admin: disconnect a user. */
export interface LocalAdminDisconnectCommand {
  /** Command discriminant to disconnect a user. */
  type: "admin.disconnect";
  /** Identifier of the user to disconnect. */
  userId: string;
}

/** Admin: send an ACARS alert. */
export interface LocalAdminAcarsCommand {
  /** Command discriminant to send an ACARS alert. */
  type: "admin.acars";
  /** Text content of the ACARS alert. */
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
  /** Payload type for the snapshot event. */
  snapshot: LocalSnapshot;
  /** Payload type for the error event. */
  error: LocalError;
}

/** All inbound local event type strings. */
export type LocalEventType = keyof LocalEventMap;
