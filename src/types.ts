/**
 * Star Comms Shard Owner API — TypeScript interfaces
 *
 * Full API coverage based on the shard's OpenAPI spec (v1.0.0).
 * Auth: Bearer scok_ (owner API key validated against central).
 */

// ─── Health (unauthenticated) ───────────────────────────────────────────────

export interface ShardHealthResponse {
  ok: boolean;
  app: string;
  guildId: string;
  guildName: string;
  registered: boolean;
  publicUrl: string;
  udpVoiceEndpoint: string;
  udpVoiceEnabled: boolean;
  centralUrl: string;
  runtime: string;
  clients: number;
  features: ShardFeatures;
  startedAt: string;
}

// ─── Status ─────────────────────────────────────────────────────────────────

export interface ShardNetStatus {
  id: number;
  name: string;
  occupancy: number;
  transmitting: string[];
}

export interface ShardInfo {
  name: string;
  publicUrl: string;
  version: string;
  startedAt: string;
  connectedOperators: number;
}

export interface ShardFeatures {
  maxNets: number;
  globalPttEnabled: boolean;
  publicNet: {
    enabled: boolean;
    name: string;
    roleIds: string[];
  };
}

export interface ShardStatusResponse {
  ok: boolean;
  guildId: string;
  guildName: string;
  operationOpen: boolean;
  shard: ShardInfo;
  features: ShardFeatures;
  nets: ShardNetStatus[];
}

// ─── Roster ─────────────────────────────────────────────────────────────────

export interface ShardOperator {
  userId: string;
  displayName: string;
  nets: number[];
  transport: string;
  transmitting: boolean;
  since: string;
  roles?: string[];
}

export interface ShardRosterResponse {
  ok: boolean;
  guildId: string;
  operators: ShardOperator[];
}

// ─── Assignments ────────────────────────────────────────────────────────────

export interface ShardAssignmentsResponse {
  ok: boolean;
  guildId: string;
  assignments: Record<string, number[]>;
}

export interface AssignmentAction {
  userId: string;
  netId: number;
  action?: "assign" | "unassign";
}

export interface ShardAssignmentResult {
  ok: boolean;
  guildId: string;
  action: string;
  userId: string;
  netId: number;
}

export interface BulkAssignmentPayload {
  action?: "assign" | "unassign";
  assignments: AssignmentAction[];
}

export interface ShardBulkAssignmentResult {
  ok: boolean;
  guildId: string;
  results: Array<{
    userId: string;
    netId: number;
    action: string;
    ok: boolean;
  }>;
}

// ─── Temporary Assignment ───────────────────────────────────────────────────

export interface TemporaryAssignmentPayload {
  userId: string;
  netId: number;
  /** TTL in milliseconds (min 15s, max 24h). Alternatively use expiresMinutes. */
  ttlMs?: number;
  /** Convenience: minutes until expiry (default 5). Ignored if ttlMs is set. */
  expiresMinutes?: number;
}

export interface TemporaryAssignmentResult {
  ok: boolean;
  guildId: string;
  userId: string;
  netId: number;
  expiresAt: string;
}

// ─── ACARS Broadcast ────────────────────────────────────────────────────────

export interface AcarsPayload {
  /** Alert text (max 280 chars). */
  text: string;
  /** Display name of the sender (default: "Owner API"). */
  senderName?: string;
  /** Duration to show the alert in ms (7000–10000). */
  durationMs?: number;
}

export interface AcarsResult {
  ok: boolean;
  delivered: number;
}

// ─── Nets ───────────────────────────────────────────────────────────────────

export interface CreateNetPayload {
  name: string;
}

export interface RenameNetPayload {
  netId: number;
  name: string;
}

export interface RemoveNetPayload {
  netId: number;
}

// ─── Operation ──────────────────────────────────────────────────────────────

export interface SetOperationPayload {
  open: boolean;
}

// ─── Features ───────────────────────────────────────────────────────────────

export interface ShardFeaturesResponse {
  ok: boolean;
  guildId: string;
  features: ShardFeatures;
}

export interface SetFeaturesPayload {
  features: Partial<ShardFeatures>;
}

// ─── Rules (role-to-net auto assignment) ────────────────────────────────────

export interface AutoAssignRule {
  roleId: string;
  netId: number;
}

export interface ShardRulesResponse {
  ok: boolean;
  guildId: string;
  rules: AutoAssignRule[];
}

export interface SetRulesPayload {
  rules: AutoAssignRule[];
}

// ─── Presets ────────────────────────────────────────────────────────────────

export interface OperationPreset {
  name: string;
  nets?: Array<{ id: number; name: string }>;
  assignments?: Record<string, number[]>;
  [key: string]: unknown;
}

export interface ShardPresetsResponse {
  ok: boolean;
  presets: OperationPreset[];
}

// ─── Clients ────────────────────────────────────────────────────────────────

export interface DisconnectClientPayload {
  userId: string;
}

export interface DisconnectClientResult {
  ok: boolean;
  disconnected: number;
}

// ─── Metrics ────────────────────────────────────────────────────────────────

export interface ShardMetricsResponse {
  ok: boolean;
  guildId: string;
  [key: string]: unknown;
}

// ─── Webhooks ───────────────────────────────────────────────────────────────

export interface WebhookEntry {
  id: string;
  url: string;
  events: string[];
  createdAt: string;
}

export interface ShardWebhooksResponse {
  ok: boolean;
  webhooks: WebhookEntry[];
  events: string[];
}

export interface RegisterWebhookPayload {
  url: string;
  events: string[];
  secret?: string;
}

// ─── Audit ──────────────────────────────────────────────────────────────────

export interface AuditEntry {
  keyId: string;
  method: string;
  path: string;
  at: string;
}

export interface ShardAuditResponse {
  ok: boolean;
  guildId: string;
  entries: AuditEntry[];
}

// ─── Public Token ───────────────────────────────────────────────────────────

export interface PublicTokenResponse {
  ok: boolean;
  token: string;
  statusUrl: string;
  widgetUrl: string;
}

// ─── Error ──────────────────────────────────────────────────────────────────

export interface ShardErrorResponse {
  error: string;
}

// ─── Archive (v1.0.90+) ─────────────────────────────────────────────────────

export interface ArchiveEntry {
  uid: string;
  name: string;
  notes: string;
  tags: string[];
  assignedUserIds: string[];
  relayTargetNetUids: string[];
  inboundRelayFromNetUids: string[];
  createdAt: string;
  archivedAt: string;
  updatedAt: string;
  source: string;
}

export interface ShardArchiveListResponse {
  ok: boolean;
  guildId: string;
  entries: ArchiveEntry[];
  total: number;
}

export interface ShardArchiveEntryResponse {
  ok: boolean;
  guildId: string;
  entry: ArchiveEntry;
  source: string;
}

export interface ShardArchiveUpsertResponse {
  ok: boolean;
  guildId: string;
  entry: ArchiveEntry;
  action: "created" | "updated";
}

export interface ShardArchiveDeleteResponse {
  ok: boolean;
  guildId: string;
  uid: string;
  deleted: boolean;
}

export interface ShardArchiveRestoreResponse {
  ok: boolean;
  guildId: string;
  uid: string;
  [key: string]: unknown;
}

export interface ShardArchiveSyncStatusResponse {
  ok: boolean;
  guildId: string;
  checkpoint: {
    lastCheckpointHash: string;
    lastCheckpointVersion: number;
    lastCheckpointAt: string;
  };
  pendingOps: number;
}

export interface ArchiveUpsertPayload {
  uid?: string;
  name?: string;
  notes?: string;
  tags?: string[];
  assignedUserIds?: string[];
  relayTargetNetUids?: string[];
  inboundRelayFromNetUids?: string[];
}

export interface ArchiveListQuery {
  tag?: string;
  search?: string;
  limit?: number;
}

// ─── Embed (v1.0.90+) ──────────────────────────────────────────────────────

export interface ShardEmbedStatusResponse {
  ok: boolean;
  guildId: string;
  guildName: string;
  operationOpen: boolean;
  nets: Array<{ id: number; name: string; occupancy: number }>;
  operators: number;
}

// ─── Net Delete by ref (v1.0.90+) ──────────────────────────────────────────

export interface RemoveNetByRefPayload {
  /** Net UID (e.g. "net_abc123") or numeric net ID as string */
  ref: string;
}

// ─── OpenAPI Spec ───────────────────────────────────────────────────────────

export interface ShardOpenApiResponse {
  openapi: string;
  info: Record<string, unknown>;
  paths: Record<string, unknown>;
  [key: string]: unknown;
}
