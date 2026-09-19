/**
 * Public embed token and associated widget/status URLs.
 * @category Stream
 */
export interface PublicTokenResponse {
  /** Whether the token request succeeded. */
  ok: boolean;
  /** The signed embed token. */
  token: string;
  /** URL for polling shard status. */
  statusUrl: string;
  /** URL of the embeddable widget. */
  widgetUrl: string;
}

/**
 * Known SSE event types emitted by the shard.
 * @category Stream
 */
export type OwnerEventType =
  | "user.joined"
  | "user.left"
  | "ptt.start"
  | "ptt.stop"
  | "operation.opened"
  | "operation.closed"
  | "assignments.changed"
  | "config.changed"
  | "client.disconnected"
  | "acars.sent"
  | "ready-check.configured"
  | "ready-check.removed"
  | "ready-check.started"
  | "ready-check.response"
  | "ready-check.completed";

/**
 * Base shape shared by all SSE events.
 * @category Stream
 */
export interface BaseOwnerEvent<T extends OwnerEventType, D> {
  /** Unique identifier for this event. */
  id: string;
  /** The event type discriminant. */
  type: T;
  /** Discord guild ID the event belongs to. */
  guildId: string;
  /** ISO timestamp of when the event occurred. */
  at: string;
  /** Type-specific payload for this event. */
  data: D;
}

/**
 * Data for `user.joined` event.
 * @category Stream
 */
export interface UserJoinedData {
  /** ID of the user who joined. */
  userId: string;
  /** Display name of the user. */
  displayName: string;
  /** Transport the user connected over. */
  transport: string;
  /** IDs of the nets the user is on. */
  nets: number[];
}

/**
 * Data for `user.left` event.
 * @category Stream
 */
export interface UserLeftData {
  /** ID of the user who left. */
  userId: string;
  /** Display name of the user. */
  displayName: string;
  /** Transport the user was connected over. */
  transport: string;
}

/**
 * Data for `ptt.start` event.
 * @category Stream
 */
export interface PttStartData {
  /** ID of the user who started transmitting. */
  userId: string;
  /** Display name of the user. */
  displayName: string;
  /** ID of the net being transmitted on. */
  netId: number;
}

/**
 * Data for `ptt.stop` event.
 * @category Stream
 */
export interface PttStopData {
  /** ID of the user who stopped transmitting. */
  userId: string;
  /** Display name of the user. */
  displayName: string;
  /** ID of the net that was being transmitted on. */
  netId: number;
  /** Optional reason the transmission stopped. */
  reason?: string;
}

/**
 * Data for `operation.opened` event.
 * @category Stream
 */
export interface OperationOpenedData {
  /** Whether the operation is now open. */
  open: boolean;
}

/**
 * Data for `operation.closed` event.
 * @category Stream
 */
export interface OperationClosedData {
  /** Whether the operation is now open. */
  open: boolean;
}

/**
 * Data for `assignments.changed` event.
 * @category Stream
 */
export interface AssignmentsChangedData {
  /** Origin of the assignment change. */
  source?: string;
  /** The assignment action that occurred. */
  action?: string;
  /** Optional reason for the change. */
  reason?: string;
  /** ID of the affected user. */
  userId?: string;
  /** ID of the affected net. */
  netId?: number;
  /** ID of the associated key. */
  keyId?: string;
}

/**
 * Data for `config.changed` event.
 * @category Stream
 */
export interface ConfigChangedData {
  /** ID of the affected key. */
  keyId?: string;
  /** The config action that occurred. */
  action?: string;
  /** ID of the user who made the change. */
  uid?: string;
  /** Name of the applied preset. */
  preset?: string;
  /** Result payload of the config change. */
  result?: Record<string, unknown>;
}

/**
 * Data for `client.disconnected` event.
 * @category Stream
 */
export interface ClientDisconnectedData {
  /** ID of the disconnected user. */
  userId: string;
  /** ID of the associated key. */
  keyId: string;
  /** Timestamp of the disconnection. */
  disconnected: number;
}

/**
 * Data for `acars.sent` event.
 * @category Stream
 */
export interface AcarsSentData {
  /** Unique identifier for the ACARS message. */
  id: string;
  /** Text content of the message. */
  text: string;
  /** Duration of the message in milliseconds. */
  durationMs: number;
  /** Alert type of the message. */
  alertType: string;
  /** ID of the sender. */
  senderId: string;
  /** Display name of the sender. */
  senderName: string;
  /** Origin of the message. */
  source: string;
  /** Number of recipients the message was routed to. */
  routed: number;
  /** ISO timestamp of when the message was sent. */
  at: string;
  /** ID of the associated key. */
  keyId?: string;
}

/**
 * Data for `ready-check.configured` event.
 * @category Stream
 */
export interface ReadyCheckConfiguredData {
  /** ID of the ready-check template. */
  templateId: string;
  /** ID of the associated key. */
  keyId?: string;
  /** ID of the configuring user. */
  senderId?: string;
  /** Display name of the configuring user. */
  senderName?: string;
}

/**
 * Data for `ready-check.removed` event.
 * @category Stream
 */
export interface ReadyCheckRemovedData {
  /** ID of the removed ready-check template. */
  templateId: string;
  /** ID of the associated key. */
  keyId?: string;
  /** ID of the removing user. */
  senderId?: string;
  /** Display name of the removing user. */
  senderName?: string;
}

/**
 * Data for `ready-check.started` event.
 * @category Stream
 */
export interface ReadyCheckStartedData {
  /** ID of the ready-check session. */
  sessionId: string;
  /** ID of the ready-check template. */
  templateId: string;
  /** ID of the user who started the check. */
  initiatorId: string;
  /** Display name of the initiator. */
  initiatorName: string;
  /** Origin of the ready-check. */
  source: string;
  /** Number of participants in the check. */
  participantCount: number;
  /** ISO timestamp of when the check expires. */
  expiresAt: string;
  /** ID of the associated key. */
  keyId?: string;
}

/**
 * Data for `ready-check.response` event.
 * @category Stream
 */
export interface ReadyCheckResponseData {
  /** ID of the ready-check session. */
  sessionId: string;
  /** ID of the responding user. */
  userId: string;
  /** Display name of the responding user. */
  name: string;
  /** The user's response status. */
  status: string;
  /** ISO timestamp of when the user responded. */
  respondedAt: string;
}

/**
 * Data for `ready-check.completed` event.
 * @category Stream
 */
export interface ReadyCheckCompletedData {
  /** ID of the ready-check session. */
  sessionId: string;
  /** ID of the ready-check template. */
  templateId: string;
  /** Aggregate tally of participant responses. */
  summary: {
    /** Total number of participants. */
    total: number;
    /** Number of participants who did not respond. */
    pending: number;
    /** Number of participants who responded ready. */
    ready: number;
    /** Number of participants who declined. */
    declined: number;
    /** Number of participants marked AFK. */
    afk: number;
    /** Whether all participants responded ready. */
    allReady: boolean;
  };
}

/**
 * Discriminated union of all SSE event types with typed data.
 * @category Stream
 */
export type OwnerEvent =
  | BaseOwnerEvent<"user.joined", UserJoinedData>
  | BaseOwnerEvent<"user.left", UserLeftData>
  | BaseOwnerEvent<"ptt.start", PttStartData>
  | BaseOwnerEvent<"ptt.stop", PttStopData>
  | BaseOwnerEvent<"operation.opened", OperationOpenedData>
  | BaseOwnerEvent<"operation.closed", OperationClosedData>
  | BaseOwnerEvent<"assignments.changed", AssignmentsChangedData>
  | BaseOwnerEvent<"config.changed", ConfigChangedData>
  | BaseOwnerEvent<"client.disconnected", ClientDisconnectedData>
  | BaseOwnerEvent<"acars.sent", AcarsSentData>
  | BaseOwnerEvent<"ready-check.configured", ReadyCheckConfiguredData>
  | BaseOwnerEvent<"ready-check.removed", ReadyCheckRemovedData>
  | BaseOwnerEvent<"ready-check.started", ReadyCheckStartedData>
  | BaseOwnerEvent<"ready-check.response", ReadyCheckResponseData>
  | BaseOwnerEvent<"ready-check.completed", ReadyCheckCompletedData>;

/**
 * Map from event type to its data shape, for typed `.on()` handlers.
 * @category Stream
 */
export interface OwnerEventMap {
  /** Event fired when a user joins. */
  "user.joined": BaseOwnerEvent<"user.joined", UserJoinedData>;
  /** Event fired when a user leaves. */
  "user.left": BaseOwnerEvent<"user.left", UserLeftData>;
  /** Event fired when a user starts transmitting. */
  "ptt.start": BaseOwnerEvent<"ptt.start", PttStartData>;
  /** Event fired when a user stops transmitting. */
  "ptt.stop": BaseOwnerEvent<"ptt.stop", PttStopData>;
  /** Event fired when an operation opens. */
  "operation.opened": BaseOwnerEvent<"operation.opened", OperationOpenedData>;
  /** Event fired when an operation closes. */
  "operation.closed": BaseOwnerEvent<"operation.closed", OperationClosedData>;
  /** Event fired when assignments change. */
  "assignments.changed": BaseOwnerEvent<"assignments.changed", AssignmentsChangedData>;
  /** Event fired when configuration changes. */
  "config.changed": BaseOwnerEvent<"config.changed", ConfigChangedData>;
  /** Event fired when a client disconnects. */
  "client.disconnected": BaseOwnerEvent<"client.disconnected", ClientDisconnectedData>;
  /** Event fired when an ACARS message is sent. */
  "acars.sent": BaseOwnerEvent<"acars.sent", AcarsSentData>;
  /** Event fired when a ready-check is configured. */
  "ready-check.configured": BaseOwnerEvent<"ready-check.configured", ReadyCheckConfiguredData>;
  /** Event fired when a ready-check is removed. */
  "ready-check.removed": BaseOwnerEvent<"ready-check.removed", ReadyCheckRemovedData>;
  /** Event fired when a ready-check starts. */
  "ready-check.started": BaseOwnerEvent<"ready-check.started", ReadyCheckStartedData>;
  /** Event fired when a participant responds to a ready-check. */
  "ready-check.response": BaseOwnerEvent<"ready-check.response", ReadyCheckResponseData>;
  /** Event fired when a ready-check completes. */
  "ready-check.completed": BaseOwnerEvent<"ready-check.completed", ReadyCheckCompletedData>;
}
