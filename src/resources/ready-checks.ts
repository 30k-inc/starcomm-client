import type { BaseClient } from "../base";
import type {
  ReadyCheckRemoveResponse,
  ReadyCheckSessionResponse,
  ReadyCheckSessionsResponse,
  ReadyCheckStartResponse,
  ReadyCheckTemplateInput,
  ReadyCheckUpsertResponse,
  ReadyChecksListResponse,
} from "../types";

/**
 * Ready Check template and session management.
 *
 * Ready Checks are short-lived (20s) attendance polls that target connected
 * operators. Templates define reusable configurations; sessions are live instances.
 *
 * @example
 * ```typescript
 * // List configured templates
 * const { readyChecks } = await client.readyChecks.list();
 *
 * // Create a template
 * const { readyCheck } = await client.readyChecks.upsert({
 *   message: "Fleet departing in 2 minutes — confirm ready",
 *   target: { everyone: true },
 * });
 *
 * // Start a session from a template
 * const { session, summary } = await client.readyChecks.start(readyCheck.id, "Fleet Commander");
 *
 * // Check session status
 * const status = await client.readyChecks.getSession(session.id);
 * console.log(status.summary.ready, "/", status.summary.total);
 * ```
 *
 * @category Resources
 */
export class ReadyChecksResource {
  readonly #http: BaseClient;
  constructor(http: BaseClient) {
    this.#http = http;
  }

  /** List all configured ready check templates. Requires `read:ready-checks` scope. */
  async list(): Promise<ReadyChecksListResponse> {
    return this.#http.ownerGet<ReadyChecksListResponse>("/api/v1/ready-checks");
  }

  /**
   * Create or update a ready check template. Requires `write:ready-checks` scope.
   * If `input.id` is provided, the existing template is updated; otherwise a new one is created.
   * @param input Template configuration (message is required).
   */
  async upsert(input: ReadyCheckTemplateInput): Promise<ReadyCheckUpsertResponse> {
    return this.#http.ownerPost<ReadyCheckUpsertResponse>("/api/v1/ready-checks", input);
  }

  /**
   * Remove a ready check template. Requires `write:ready-checks` scope.
   * @param id Template ID to remove.
   */
  async remove(id: string): Promise<ReadyCheckRemoveResponse> {
    return this.#http.ownerDelete<ReadyCheckRemoveResponse>(
      `/api/v1/ready-checks/${encodeURIComponent(id)}`,
    );
  }

  /**
   * Start a ready check session from a saved template. Requires `write:ready-checks` scope.
   * Targets connected operators matching the template's audience and expires after ~20 seconds.
   * @param templateId ID of the template to initiate.
   * @param initiatorName Display name of the person starting the check (shown to participants).
   */
  async start(templateId: string, initiatorName?: string): Promise<ReadyCheckStartResponse> {
    return this.#http.ownerPost<ReadyCheckStartResponse>("/api/v1/ready-checks/start", {
      templateId,
      ...(initiatorName && { initiatorName }),
    });
  }

  /** Fetch all active and recent ready check sessions. Requires `read:ready-checks` scope. */
  async getSessions(): Promise<ReadyCheckSessionsResponse> {
    return this.#http.ownerGet<ReadyCheckSessionsResponse>("/api/v1/ready-checks/status");
  }

  /**
   * Fetch a single ready check session with participant details.
   * @param sessionId Session ID to look up.
   */
  async getSession(sessionId: string): Promise<ReadyCheckSessionResponse> {
    return this.#http.ownerGet<ReadyCheckSessionResponse>(
      `/api/v1/ready-checks/status/${encodeURIComponent(sessionId)}`,
    );
  }
}
