import type { BaseClient } from "../base";
import type {
  UriLinkCreatePayload,
  UriLinkCreateResponse,
  UriLinkResolvePayload,
  UriLinkResolveResponse,
  UriLinkRevokeResponse,
  UriLinksListResponse,
} from "../types/uri-links";

/**
 * URI launch link management — create, list, revoke, and resolve deep-links
 * that launch the StarComms client into a specific guild/net/org-link.
 *
 * @example
 * ```typescript
 * // List existing links
 * const { links } = await client.uriLinks.list();
 *
 * // Create a "join guild" link that expires in 7 days
 * const { link, token } = await client.uriLinks.create({
 *   action: "join:guild",
 *   name: "Fleet Night Invite",
 *   expiresDays: 7,
 *   maxUses: 50,
 * });
 * console.log(`starcomm://connect?id=${link.id}&token=${token}`);
 *
 * // Revoke a link
 * await client.uriLinks.revoke(link.id);
 *
 * // Resolve a link (public, no auth required)
 * const resolved = await client.uriLinks.resolve({ id: link.id, token });
 * console.log(resolved.action, resolved.target);
 * ```
 *
 * @category Resources
 */
export class UriLinksResource {
  readonly #http: BaseClient;
  constructor(http: BaseClient) {
    this.#http = http;
  }

  /** List all URI links on the shard. Requires `read:uri` scope. */
  async list(): Promise<UriLinksListResponse> {
    return this.#http.ownerGet<UriLinksListResponse>("/api/v1/uri-links");
  }

  /**
   * Create a new URI launch link. Requires `write:uri` scope.
   * Creating an `join:org-link` action also requires `write:uri:org-link`.
   * @returns The created link with the one-time secret token.
   */
  async create(payload: UriLinkCreatePayload): Promise<UriLinkCreateResponse> {
    return this.#http.ownerPost<UriLinkCreateResponse>("/api/v1/uri-links", payload);
  }

  /**
   * Revoke a URI link by ID. Requires `manage:uri` scope.
   * Revoked links return HTTP 410 when resolved.
   */
  async revoke(id: string): Promise<UriLinkRevokeResponse> {
    return this.#http.ownerPost<UriLinkRevokeResponse>("/api/v1/uri-links/revoke", { id });
  }

  /**
   * Resolve a URI link — returns the launch intent (action + target).
   * This endpoint is public (no owner key required). Increments use count.
   */
  async resolve(payload: UriLinkResolvePayload): Promise<UriLinkResolveResponse> {
    return this.#http.ownerPost<UriLinkResolveResponse>("/api/v1/uri-links/resolve", payload);
  }
}
