import type { BaseClient } from "../base";
import type {
  UriLinkAction,
  UriLinkCreateResponse,
  UriLinkResolveResponse,
  UriLinkRevokeResponse,
  UriLinksListResponse,
  UriLinkTarget,
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
 * const { link, token, directUri } = await client.uriLinks.create("join:guild", "Fleet Night Invite", {
 *   expiresDays: 7,
 *   maxUses: 50,
 * });
 * console.log(directUri); // starcomms://launch?shard=...&id=...&token=...
 *
 * // Revoke a link
 * await client.uriLinks.revoke(link.id);
 *
 * // Resolve a link (public, no auth required)
 * const resolved = await client.uriLinks.resolve(link.id, token);
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
   * Creating a `join:org-link` action also requires `write:uri:org-link`.
   * @param action Action the link performs when resolved.
   * @param name Human-readable name for the link.
   * @param options Optional expiry, max uses, and target configuration.
   * @returns The created link with the one-time secret token and launch URLs.
   */
  async create(
    action: UriLinkAction,
    name?: string,
    options?: {
      target?: UriLinkTarget;
      expiresAt?: string;
      expiresMinutes?: number;
      expiresDays?: number;
      maxUses?: number;
    },
  ): Promise<UriLinkCreateResponse> {
    return this.#http.ownerPost<UriLinkCreateResponse>("/api/v1/uri-links", {
      action,
      ...(name && { name }),
      ...options,
    });
  }

  /**
   * Revoke a URI link by ID. Requires `manage:uri` scope.
   * Revoked links return HTTP 410 when resolved.
   * @param id The URI link ID to revoke.
   */
  async revoke(id: string): Promise<UriLinkRevokeResponse> {
    return this.#http.ownerPost<UriLinkRevokeResponse>("/api/v1/uri-links/revoke", { id });
  }

  /**
   * Resolve a URI link — returns the launch intent (action + target).
   * This endpoint is public (no owner key required). Increments use count.
   * @param id The URI link ID.
   * @param token The secret token issued at creation.
   */
  async resolve(id: string, token: string): Promise<UriLinkResolveResponse> {
    return this.#http.ownerPost<UriLinkResolveResponse>("/api/v1/uri-links/resolve", { id, token });
  }
}
