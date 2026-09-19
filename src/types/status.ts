import type { ShardFeatures } from "./common";

/**
 * Shard health check response (unauthenticated, lightweight).
 * @category Status
 */
export interface ShardHealthResponse {
  /** Whether the shard is healthy. */
  ok: boolean;
  /** Application identifier. */
  app: string;
  /** Running application version. */
  version: string;
}

/**
 * Full shard debug snapshot (requires shard token).
 * @category Status
 */
export interface ShardDebugResponse {
  /** Whether the debug snapshot was produced successfully. */
  ok: boolean;
  /** Application identifier. */
  app: string;
  /** Discord guild ID this shard serves. */
  guildId: string;
  /** Human-readable guild name. */
  guildName: string;
  /** Public base URL of the shard. */
  publicUrl: string;
  /** UDP voice endpoint the shard advertises. */
  udpVoiceEndpoint: string;
  /** Public host used for UDP voice, if any. */
  udpPublicHost?: string;
  /** Whether UDP voice transport is enabled. */
  udpVoiceEnabled: boolean;
  /** Raw UDP voice diagnostics. */
  udpVoice: Record<string, unknown>;
  /** URL of the central coordination service. */
  centralUrl: string;
  /** Runtime environment description. */
  runtime: string;
  /** ISO timestamp when the shard started. */
  startedAt: string;
  /** Number of currently connected clients. */
  clients: number;
  /** ISO timestamp until which the shard is entitled to run. */
  entitledUntil: string;
  /** Per-user connection and audio diagnostics. */
  users: Array<{
    /** User ID. */
    userId: string;
    /** Display name. */
    name: string;
    /** ISO timestamp when the user connected. */
    connectedAt: string;
    /** Whether the user holds a control connection. */
    control: boolean;
    /** Whether the user has voice enabled. */
    voice: boolean;
    /** Whether the user is using UDP voice transport. */
    udpVoice: boolean;
    /** Net IDs currently assigned to the user. */
    assignedNetIds: number[];
    /** Inbound audio packet count. */
    audioIn: number;
    /** Outbound audio packet count. */
    audioOut: number;
    /** Inbound UDP audio packet count. */
    udpAudioIn: number;
    /** Outbound UDP audio packet count. */
    udpAudioOut: number;
    /** Count of dropped audio packets. */
    audioDropped: number;
    /** Number of backpressure events observed. */
    backpressureEvents: number;
  }>;
  /** Channels and their member user IDs. */
  channels: Array<{
    /** Channel ID. */
    id: number;
    /** Channel name. */
    name: string;
    /** IDs of users in the channel. */
    userIds: string[];
  }>;
}

/**
 * Status of a single voice net including live occupancy.
 * @category Status
 */
export interface ShardNetStatus {
  /** Numeric net ID. */
  id: number;
  /** Stable net UID. */
  uid: string;
  /** Alternate net UID. */
  netUid: string;
  /** Net name. */
  name: string;
  /** Number of operators currently on the net. */
  occupancy: number;
  /** User IDs currently transmitting on the net. */
  transmitting: string[];
  /** Net IDs this net relays audio to. */
  relayTargetNetIds: number[];
  /** Net UIDs this net relays audio to. */
  relayTargetNetUids: string[];
}

/**
 * Shard identity and version metadata.
 * @category Status
 */
export interface ShardInfo {
  /** Shard name. */
  name: string;
  /** Public base URL of the shard. */
  publicUrl: string;
  /** Running shard version. */
  version: string;
  /** ISO timestamp when the shard started. */
  startedAt: string;
  /** Number of connected operators. */
  connectedOperators: number;
}

/**
 * Full shard status including nets, features, and operation state.
 * @category Status
 */
export interface ShardStatusResponse {
  /** Whether the status query succeeded. */
  ok: boolean;
  /** Discord guild ID this shard serves. */
  guildId: string;
  /** Human-readable guild name. */
  guildName: string;
  /** Whether the operation is currently open. */
  operationOpen: boolean;
  /** Shard identity and version metadata. */
  shard: ShardInfo;
  /** Enabled shard feature flags. */
  features: ShardFeatures;
  /** Status of each voice net. */
  nets: ShardNetStatus[];
}

/**
 * A connected operator with transport and transmission state.
 * @category Status
 */
export interface ShardOperator {
  /** Operator user ID. */
  userId: string;
  /** Operator display name. */
  displayName: string;
  /** Net IDs the operator is assigned to. */
  nets: number[];
  /** Transport in use by the operator. */
  transport: string;
  /** Whether the operator is currently transmitting. */
  transmitting: boolean;
  /** ISO timestamp since the operator connected. */
  since: string;
  /** Whether this is a service listener (non-human bot connection). */
  service: boolean;
  /** Roles assigned to the operator. */
  roles?: string[];
}

/**
 * Roster of all connected operators.
 * @category Status
 */
export interface ShardRosterResponse {
  /** Whether the roster query succeeded. */
  ok: boolean;
  /** Discord guild ID this shard serves. */
  guildId: string;
  /** All connected operators. */
  operators: ShardOperator[];
}

/**
 * The shard's OpenAPI specification document.
 * @category Status
 */
export interface ShardOpenApiResponse {
  /** OpenAPI specification version. */
  openapi: string;
  /** API metadata (title, version, etc.). */
  info: Record<string, unknown>;
  /** Path definitions keyed by route. */
  paths: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Public embed status (net occupancy without auth).
 * @category Status
 */
export interface ShardEmbedStatusResponse {
  /** Whether the embed status query succeeded. */
  ok: boolean;
  /** Discord guild ID this shard serves. */
  guildId: string;
  /** Human-readable guild name. */
  guildName: string;
  /** Whether the operation is currently open. */
  operationOpen: boolean;
  /** Number of connected operators. */
  connected: number;
  /** The primary public net and its occupancy. */
  publicNet: {
    /** Numeric net ID. */
    id: number;
    /** Stable net UID. */
    uid: string;
    /** Alternate net UID. */
    netUid: string;
    /** Net name. */
    name: string;
    /** Whether the net is enabled. */
    enabled: boolean;
    /** Number of operators currently on the net. */
    occupancy: number;
  };
  /** Summary of each net's occupancy and visibility. */
  nets: Array<{
    /** Numeric net ID. */
    id: number;
    /** Net name. */
    name: string;
    /** Number of operators currently on the net. */
    occupancy: number;
    /** Stable net UID. */
    uid?: string;
    /** Alternate net UID. */
    netUid?: string;
    /** Whether the net is virtual. */
    virtual?: boolean;
    /** Whether the net is publicly visible. */
    public?: boolean;
    /** Whether the net is protected. */
    protected?: boolean;
  }>;
  /** ISO timestamp when the status was last updated. */
  updatedAt: string;
}
