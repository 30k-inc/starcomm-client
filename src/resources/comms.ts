import type { BaseClient } from "../base";
import type {
  AcarsPayload,
  AcarsResult,
  DisconnectClientPayload,
  DisconnectClientResult,
} from "../types";

/**
 * Communication operations (ACARS alerts, client disconnect).
 * @category Resources
 */
export class CommsResource {
  constructor(private readonly http: BaseClient) {}

  /** Broadcasts an ACARS text alert to all connected operators. */
  async sendAcars(payload: AcarsPayload): Promise<AcarsResult> {
    return this.http.ownerPost<AcarsResult>("/api/v1/acars", payload);
  }

  /** Force-disconnects a client from the shard. */
  async disconnect(payload: DisconnectClientPayload): Promise<DisconnectClientResult> {
    return this.http.ownerPost<DisconnectClientResult>("/api/v1/clients/disconnect", payload);
  }
}
