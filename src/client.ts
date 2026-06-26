import { StarCommsError } from "./error";
import type {
  AcarsPayload,
  AcarsResult,
  ArchiveListQuery,
  ArchiveUpsertPayload,
  AssignmentAction,
  BulkAssignmentPayload,
  CreateNetPayload,
  DisconnectClientPayload,
  DisconnectClientResult,
  OperationPreset,
  PublicTokenResponse,
  RegisterWebhookPayload,
  RemoveNetPayload,
  RenameNetPayload,
  SetFeaturesPayload,
  SetOperationPayload,
  SetRulesPayload,
  ShardArchiveDeleteResponse,
  ShardArchiveEntryResponse,
  ShardArchiveListResponse,
  ShardArchiveRestoreResponse,
  ShardArchiveSyncStatusResponse,
  ShardArchiveUpsertResponse,
  ShardAssignmentResult,
  ShardAssignmentsResponse,
  ShardAuditResponse,
  ShardBulkAssignmentResult,
  ShardEmbedStatusResponse,
  ShardFeaturesResponse,
  ShardHealthResponse,
  ShardMetricsResponse,
  ShardOpenApiResponse,
  ShardPresetsResponse,
  ShardRosterResponse,
  ShardRulesResponse,
  ShardStatusResponse,
  ShardWebhooksResponse,
  TemporaryAssignmentPayload,
  TemporaryAssignmentResult,
} from "./types";

export interface StarCommsClientConfig {
  /** Base URL of the shard (e.g., "http://216.114.75.146:25588"). No trailing slash. */
  baseUrl: string;
  /** Owner API key (scok_...) for authenticated endpoints. */
  ownerApiKey: string;
  /** Optional shard token (scsh_...) for the /debug endpoint. */
  shardToken?: string;
  /** Request timeout in milliseconds (default: 10000). */
  timeoutMs?: number;
  /** Optional custom fetch implementation (default: global fetch). */
  fetch?: typeof fetch;
}

/**
 * Star Comms Shard Owner API Client.
 *
 * A framework-agnostic TypeScript client for interacting with a Star Comms shard.
 * Uses the native `fetch` API (Node 18+, Bun, Deno, or browser).
 *
 * @example
 * ```typescript
 * import { StarCommsClient } from "@starcomms/client";
 *
 * const client = new StarCommsClient({
 *   baseUrl: "http://216.114.75.146:25588",
 *   ownerApiKey: "scok_your_key_here",
 * });
 *
 * const status = await client.getStatus();
 * console.log(status.nets);
 *
 * await client.assignNet("discord_user_id", 1);
 * await client.sendAcars({ text: "Fleet departing!" });
 * ```
 */
export class StarCommsClient {
  private readonly baseUrl: string;
  private readonly ownerApiKey: string;
  private readonly shardToken?: string;
  private readonly timeoutMs: number;
  private readonly _fetch: typeof fetch;

  constructor(config: StarCommsClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.ownerApiKey = config.ownerApiKey;
    this.shardToken = config.shardToken;
    this.timeoutMs = config.timeoutMs ?? 10_000;
    this._fetch = config.fetch ?? globalThis.fetch;
  }

  // ─── Public Endpoints (unauthenticated) ─────────────────────────────

  async getHealth(): Promise<ShardHealthResponse> {
    return this.get<ShardHealthResponse>("/health");
  }

  async getOpenApiSpec(): Promise<ShardOpenApiResponse> {
    return this.get<ShardOpenApiResponse>("/api/v1/openapi.json");
  }

  async getEmbedStatus(token: string): Promise<ShardEmbedStatusResponse> {
    return this.get<ShardEmbedStatusResponse>(`/api/v1/embed/status?token=${encodeURIComponent(token)}`);
  }

  async getEmbedWidget(token: string): Promise<string> {
    const url = `${this.baseUrl}/api/v1/embed/widget?token=${encodeURIComponent(token)}`;
    const response = await this._fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    if (!response.ok) {
      throw new StarCommsError(response.status, `Embed widget failed: HTTP ${response.status}`);
    }
    return response.text();
  }

  // ─── Status & Roster ────────────────────────────────────────────────

  async getStatus(): Promise<ShardStatusResponse> {
    return this.ownerGet<ShardStatusResponse>("/api/v1/status");
  }

  async getRoster(): Promise<ShardRosterResponse> {
    return this.ownerGet<ShardRosterResponse>("/api/v1/roster");
  }

  // ─── Assignments ────────────────────────────────────────────────────

  async getAssignments(): Promise<ShardAssignmentsResponse> {
    return this.ownerGet<ShardAssignmentsResponse>("/api/v1/assignments");
  }

  async assignNet(userId: string, netId: number, action: "assign" | "unassign" = "assign"): Promise<ShardAssignmentResult> {
    const body: AssignmentAction = { userId, netId, action };
    return this.ownerPost<ShardAssignmentResult>("/api/v1/assignments", body);
  }

  async bulkAssign(payload: BulkAssignmentPayload): Promise<ShardBulkAssignmentResult> {
    return this.ownerPost<ShardBulkAssignmentResult>("/api/v1/assignments/bulk", payload);
  }

  async temporaryAssign(payload: TemporaryAssignmentPayload): Promise<TemporaryAssignmentResult> {
    return this.ownerPost<TemporaryAssignmentResult>("/api/v1/assignments/temporary", payload);
  }

  // ─── ACARS Broadcast ────────────────────────────────────────────────

  async sendAcars(payload: AcarsPayload): Promise<AcarsResult> {
    return this.ownerPost<AcarsResult>("/api/v1/acars", payload);
  }

  // ─── Nets ───────────────────────────────────────────────────────────

  async createNet(payload: CreateNetPayload): Promise<Record<string, unknown>> {
    return this.ownerPost<Record<string, unknown>>("/api/v1/nets", payload);
  }

  async renameNet(payload: RenameNetPayload): Promise<Record<string, unknown>> {
    return this.ownerPost<Record<string, unknown>>("/api/v1/nets/rename", payload);
  }

  async removeNet(payload: RemoveNetPayload): Promise<Record<string, unknown>> {
    return this.ownerPost<Record<string, unknown>>("/api/v1/nets/remove", payload);
  }

  async removeNetByRef(ref: string): Promise<Record<string, unknown>> {
    return this.ownerDelete<Record<string, unknown>>(`/api/v1/nets/${encodeURIComponent(ref)}`);
  }

  // ─── Operation ──────────────────────────────────────────────────────

  async setOperation(payload: SetOperationPayload): Promise<Record<string, unknown>> {
    return this.ownerPost<Record<string, unknown>>("/api/v1/operation", payload);
  }

  // ─── Features ───────────────────────────────────────────────────────

  async getFeatures(): Promise<ShardFeaturesResponse> {
    return this.ownerGet<ShardFeaturesResponse>("/api/v1/features");
  }

  async setFeatures(payload: SetFeaturesPayload): Promise<Record<string, unknown>> {
    return this.ownerPost<Record<string, unknown>>("/api/v1/features", payload);
  }

  // ─── Rules ──────────────────────────────────────────────────────────

  async getRules(): Promise<ShardRulesResponse> {
    return this.ownerGet<ShardRulesResponse>("/api/v1/rules");
  }

  async setRules(payload: SetRulesPayload): Promise<Record<string, unknown>> {
    return this.ownerPost<Record<string, unknown>>("/api/v1/rules", payload);
  }

  // ─── Presets ────────────────────────────────────────────────────────

  async getPresets(): Promise<ShardPresetsResponse> {
    return this.ownerGet<ShardPresetsResponse>("/api/v1/presets");
  }

  async savePreset(preset: OperationPreset): Promise<Record<string, unknown>> {
    return this.ownerPost<Record<string, unknown>>("/api/v1/presets", preset);
  }

  async applyPreset(name: string): Promise<Record<string, unknown>> {
    return this.ownerPost<Record<string, unknown>>(`/api/v1/presets/${encodeURIComponent(name)}/apply`, {});
  }

  async removePreset(name: string): Promise<Record<string, unknown>> {
    return this.ownerDelete<Record<string, unknown>>(`/api/v1/presets/${encodeURIComponent(name)}`);
  }

  // ─── Clients ────────────────────────────────────────────────────────

  async disconnectClient(payload: DisconnectClientPayload): Promise<DisconnectClientResult> {
    return this.ownerPost<DisconnectClientResult>("/api/v1/clients/disconnect", payload);
  }

  // ─── Metrics ────────────────────────────────────────────────────────

  async getMetrics(sinceMinutes?: number): Promise<ShardMetricsResponse> {
    const query = sinceMinutes ? `?sinceMinutes=${sinceMinutes}` : "";
    return this.ownerGet<ShardMetricsResponse>(`/api/v1/metrics${query}`);
  }

  async getPrometheusMetrics(): Promise<string> {
    this.requireOwnerKey();
    const url = `${this.baseUrl}/api/v1/metrics/prometheus`;
    const response = await this._fetch(url, {
      method: "GET",
      headers: { authorization: `Bearer ${this.ownerApiKey}` },
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    if (!response.ok) {
      throw new StarCommsError(response.status, `Prometheus metrics failed: HTTP ${response.status}`);
    }
    return response.text();
  }

  // ─── Webhooks ───────────────────────────────────────────────────────

  async getWebhooks(): Promise<ShardWebhooksResponse> {
    return this.ownerGet<ShardWebhooksResponse>("/api/v1/webhooks");
  }

  async registerWebhook(payload: RegisterWebhookPayload): Promise<Record<string, unknown>> {
    return this.ownerPost<Record<string, unknown>>("/api/v1/webhooks", payload);
  }

  async removeWebhook(id: string): Promise<Record<string, unknown>> {
    return this.ownerDelete<Record<string, unknown>>(`/api/v1/webhooks/${encodeURIComponent(id)}`);
  }

  // ─── Audit ──────────────────────────────────────────────────────────

  async getAudit(limit?: number): Promise<ShardAuditResponse> {
    const query = limit ? `?limit=${limit}` : "";
    return this.ownerGet<ShardAuditResponse>(`/api/v1/audit${query}`);
  }

  // ─── Public Token ───────────────────────────────────────────────────

  async getPublicToken(): Promise<PublicTokenResponse> {
    return this.ownerGet<PublicTokenResponse>("/api/v1/public-token");
  }

  // ─── Debug ──────────────────────────────────────────────────────────

  async getDebug(): Promise<Record<string, unknown>> {
    if (!this.shardToken) {
      throw new StarCommsError(500, "Shard token not configured. Cannot call /debug.");
    }
    return this.get<Record<string, unknown>>("/debug", this.shardToken);
  }

  // ─── Archive ────────────────────────────────────────────────────────

  async getArchive(query?: ArchiveListQuery): Promise<ShardArchiveListResponse> {
    const params = new URLSearchParams();
    if (query?.tag) params.set("tag", query.tag);
    if (query?.search) params.set("search", query.search);
    if (query?.limit) params.set("limit", String(query.limit));
    const qs = params.toString();
    return this.ownerGet<ShardArchiveListResponse>(`/api/v1/archive${qs ? `?${qs}` : ""}`);
  }

  async getArchiveEntry(uid: string): Promise<ShardArchiveEntryResponse> {
    return this.ownerGet<ShardArchiveEntryResponse>(`/api/v1/archive/${encodeURIComponent(uid)}`);
  }

  async upsertArchive(payload: ArchiveUpsertPayload): Promise<ShardArchiveUpsertResponse> {
    return this.ownerPost<ShardArchiveUpsertResponse>("/api/v1/archive", payload);
  }

  async updateArchiveEntry(uid: string, payload: ArchiveUpsertPayload): Promise<ShardArchiveUpsertResponse> {
    return this.ownerPost<ShardArchiveUpsertResponse>(`/api/v1/archive/${encodeURIComponent(uid)}`, payload);
  }

  async deleteArchiveEntry(uid: string): Promise<ShardArchiveDeleteResponse> {
    return this.ownerDelete<ShardArchiveDeleteResponse>(`/api/v1/archive/${encodeURIComponent(uid)}`);
  }

  async restoreArchiveEntry(uid: string): Promise<ShardArchiveRestoreResponse> {
    return this.ownerPost<ShardArchiveRestoreResponse>(`/api/v1/archive/${encodeURIComponent(uid)}/restore`, {});
  }

  async getArchiveSyncStatus(): Promise<ShardArchiveSyncStatusResponse> {
    return this.ownerGet<ShardArchiveSyncStatusResponse>("/api/v1/archive/sync/status");
  }

  // ─── Event Stream ───────────────────────────────────────────────────

  async openEventStream(): Promise<Response> {
    this.requireOwnerKey();
    const url = `${this.baseUrl}/api/v1/stream`;
    const response = await this._fetch(url, {
      method: "GET",
      headers: {
        accept: "text/event-stream",
        authorization: `Bearer ${this.ownerApiKey}`,
      },
    });
    if (!response.ok) {
      throw new StarCommsError(response.status, `Event stream failed: HTTP ${response.status}`);
    }
    return response;
  }

  // ─── Internal HTTP helpers ──────────────────────────────────────────

  private async get<T>(path: string, bearerToken?: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = { accept: "application/json" };
    if (bearerToken) headers.authorization = `Bearer ${bearerToken}`;

    const response = await this._fetch(url, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    return this.handleResponse<T>(response);
  }

  private async ownerGet<T>(path: string): Promise<T> {
    this.requireOwnerKey();
    return this.get<T>(path, this.ownerApiKey);
  }

  private async ownerPost<T>(path: string, body: unknown): Promise<T> {
    this.requireOwnerKey();
    const url = `${this.baseUrl}${path}`;
    const response = await this._fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${this.ownerApiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    return this.handleResponse<T>(response);
  }

  private async ownerDelete<T>(path: string): Promise<T> {
    this.requireOwnerKey();
    const url = `${this.baseUrl}${path}`;
    const response = await this._fetch(url, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${this.ownerApiKey}`,
      },
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    let payload: unknown;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { error: text };
    }

    if (!response.ok) {
      const errorMessage = (payload as Record<string, unknown>)?.error as string
        ?? `Star Comms shard returned HTTP ${response.status}`;
      throw new StarCommsError(response.status, errorMessage);
    }

    return payload as T;
  }

  private requireOwnerKey(): void {
    if (!this.ownerApiKey) {
      throw new StarCommsError(500, "Owner API key not configured.");
    }
  }
}
