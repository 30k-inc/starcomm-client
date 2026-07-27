/**
 * Public embed token and associated widget/status URLs.
 * @category Stream
 */
export interface PublicTokenResponse {
  ok: boolean;
  token: string;
  statusUrl: string;
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
  id: string;
  type: T;
  guildId: string;
  at: string;
  data: D;
}

/**
 * Data for `user.joined` event.
 * @category Stream
 */
export interface UserJoinedData {
  userId: string;
  displayName: string;
  transport: string;
  nets: number[];
}

/**
 * Data for `user.left` event.
 * @category Stream
 */
export interface UserLeftData {
  userId: string;
  displayName: string;
  transport: string;
}

/**
 * Data for `ptt.start` event.
 * @category Stream
 */
export interface PttStartData {
  userId: string;
  displayName: string;
  netId: number;
}

/**
 * Data for `ptt.stop` event.
 * @category Stream
 */
export interface PttStopData {
  userId: string;
  displayName: string;
  netId: number;
  reason?: string;
}

/**
 * Data for `operation.opened` event.
 * @category Stream
 */
export interface OperationOpenedData {
  open: boolean;
}

/**
 * Data for `operation.closed` event.
 * @category Stream
 */
export interface OperationClosedData {
  open: boolean;
}

/**
 * Data for `assignments.changed` event.
 * @category Stream
 */
export interface AssignmentsChangedData {
  source?: string;
  action?: string;
  reason?: string;
  userId?: string;
  netId?: number;
  keyId?: string;
}

/**
 * Data for `config.changed` event.
 * @category Stream
 */
export interface ConfigChangedData {
  keyId?: string;
  action?: string;
  uid?: string;
  preset?: string;
  result?: Record<string, unknown>;
}

/**
 * Data for `client.disconnected` event.
 * @category Stream
 */
export interface ClientDisconnectedData {
  userId: string;
  keyId: string;
  disconnected: number;
}

/**
 * Data for `acars.sent` event.
 * @category Stream
 */
export interface AcarsSentData {
  id: string;
  text: string;
  durationMs: number;
  alertType: string;
  senderId: string;
  senderName: string;
  source: string;
  routed: number;
  at: string;
  keyId?: string;
}

/**
 * Data for `ready-check.configured` event.
 * @category Stream
 */
export interface ReadyCheckConfiguredData {
  templateId: string;
  keyId?: string;
  senderId?: string;
  senderName?: string;
}

/**
 * Data for `ready-check.removed` event.
 * @category Stream
 */
export interface ReadyCheckRemovedData {
  templateId: string;
  keyId?: string;
  senderId?: string;
  senderName?: string;
}

/**
 * Data for `ready-check.started` event.
 * @category Stream
 */
export interface ReadyCheckStartedData {
  sessionId: string;
  templateId: string;
  initiatorId: string;
  initiatorName: string;
  source: string;
  participantCount: number;
  expiresAt: string;
  keyId?: string;
}

/**
 * Data for `ready-check.response` event.
 * @category Stream
 */
export interface ReadyCheckResponseData {
  sessionId: string;
  userId: string;
  name: string;
  status: string;
  respondedAt: string;
}

/**
 * Data for `ready-check.completed` event.
 * @category Stream
 */
export interface ReadyCheckCompletedData {
  sessionId: string;
  templateId: string;
  summary: {
    total: number;
    pending: number;
    ready: number;
    declined: number;
    afk: number;
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
  "user.joined": BaseOwnerEvent<"user.joined", UserJoinedData>;
  "user.left": BaseOwnerEvent<"user.left", UserLeftData>;
  "ptt.start": BaseOwnerEvent<"ptt.start", PttStartData>;
  "ptt.stop": BaseOwnerEvent<"ptt.stop", PttStopData>;
  "operation.opened": BaseOwnerEvent<"operation.opened", OperationOpenedData>;
  "operation.closed": BaseOwnerEvent<"operation.closed", OperationClosedData>;
  "assignments.changed": BaseOwnerEvent<"assignments.changed", AssignmentsChangedData>;
  "config.changed": BaseOwnerEvent<"config.changed", ConfigChangedData>;
  "client.disconnected": BaseOwnerEvent<"client.disconnected", ClientDisconnectedData>;
  "acars.sent": BaseOwnerEvent<"acars.sent", AcarsSentData>;
  "ready-check.configured": BaseOwnerEvent<"ready-check.configured", ReadyCheckConfiguredData>;
  "ready-check.removed": BaseOwnerEvent<"ready-check.removed", ReadyCheckRemovedData>;
  "ready-check.started": BaseOwnerEvent<"ready-check.started", ReadyCheckStartedData>;
  "ready-check.response": BaseOwnerEvent<"ready-check.response", ReadyCheckResponseData>;
  "ready-check.completed": BaseOwnerEvent<"ready-check.completed", ReadyCheckCompletedData>;
}
