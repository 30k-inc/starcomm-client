import type { ShardFeatures } from "./common";

/**
 * Shard health check response (unauthenticated, lightweight).
 * @category Status
 */
export interface ShardHealthResponse {
  ok: boolean;
  app: string;
  version: string;
}

/**
 * Full shard debug snapshot (requires shard token).
 * @category Status
 */
export interface ShardDebugResponse {
  ok: boolean;
  app: string;
  guildId: string;
  guildName: string;
  publicUrl: string;
  udpVoiceEndpoint: string;
  udpPublicHost?: string;
  udpVoiceEnabled: boolean;
  udpVoice: Record<string, unknown>;
  centralUrl: string;
  runtime: string;
  startedAt: string;
  clients: number;
  entitledUntil: string;
  users: Array<{
    userId: string;
    name: string;
    connectedAt: string;
    control: boolean;
    voice: boolean;
    udpVoice: boolean;
    assignedNetIds: number[];
    audioIn: number;
    audioOut: number;
    udpAudioIn: number;
    udpAudioOut: number;
    audioDropped: number;
    backpressureEvents: number;
  }>;
  channels: Array<{ id: number; name: string; userIds: string[] }>;
}

/**
 * Status of a single voice net including live occupancy.
 * @category Status
 */
export interface ShardNetStatus {
  id: number;
  uid: string;
  netUid: string;
  name: string;
  occupancy: number;
  transmitting: string[];
  relayTargetNetIds: number[];
  relayTargetNetUids: string[];
}

/**
 * Shard identity and version metadata.
 * @category Status
 */
export interface ShardInfo {
  name: string;
  publicUrl: string;
  version: string;
  startedAt: string;
  connectedOperators: number;
}

/**
 * Full shard status including nets, features, and operation state.
 * @category Status
 */
export interface ShardStatusResponse {
  ok: boolean;
  guildId: string;
  guildName: string;
  operationOpen: boolean;
  shard: ShardInfo;
  features: ShardFeatures;
  nets: ShardNetStatus[];
}

/**
 * A connected operator with transport and transmission state.
 * @category Status
 */
export interface ShardOperator {
  userId: string;
  displayName: string;
  nets: number[];
  transport: string;
  transmitting: boolean;
  since: string;
  /** Whether this is a service listener (non-human bot connection). */
  service: boolean;
  roles?: string[];
}

/**
 * Roster of all connected operators.
 * @category Status
 */
export interface ShardRosterResponse {
  ok: boolean;
  guildId: string;
  operators: ShardOperator[];
}

/**
 * The shard's OpenAPI specification document.
 * @category Status
 */
export interface ShardOpenApiResponse {
  openapi: string;
  info: Record<string, unknown>;
  paths: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Public embed status (net occupancy without auth).
 * @category Status
 */
export interface ShardEmbedStatusResponse {
  ok: boolean;
  guildId: string;
  guildName: string;
  operationOpen: boolean;
  connected: number;
  publicNet: {
    id: number;
    uid: string;
    netUid: string;
    name: string;
    enabled: boolean;
    occupancy: number;
  };
  nets: Array<{
    id: number;
    name: string;
    occupancy: number;
    uid?: string;
    netUid?: string;
    virtual?: boolean;
    public?: boolean;
    protected?: boolean;
  }>;
  updatedAt: string;
}
