/**
 * Supported URI link actions.
 * @category URI Links
 */
export type UriLinkAction = "select:guild" | "join:guild" | "join:org-link";

/**
 * Target configuration for a URI link (varies by action).
 * @category URI Links
 */
export interface UriLinkTarget {
  /** Numeric network identifier of the target. */
  netId?: number;
  /** String network UID of the target. */
  netUid?: string;
  /** Identifier of the org link target. */
  orgLinkId?: string;
  [key: string]: unknown;
}

/**
 * A URI link as returned by the shard (public view, no token).
 * @category URI Links
 */
export interface UriLink {
  /** Unique identifier of the link. */
  id: string;
  /** Human-readable name for the link. */
  name: string;
  /** Action the link performs when resolved. */
  action: UriLinkAction;
  /** Target configuration for the action. */
  target: UriLinkTarget;
  /** ISO timestamp when the link was created. */
  createdAt: string;
  /** ISO timestamp when the link expires. */
  expiresAt: string;
  /** ISO timestamp when the link was revoked. */
  revokedAt: string;
  /** Maximum number of times the link can be used. */
  maxUses: number;
  /** Number of times the link has been used. */
  useCount: number;
  /** ISO timestamp when the link was last used. */
  lastUsedAt: string;
  /** Identifier of the API key that created the link. */
  createdByKeyId: string;
}

/**
 * Response from listing URI links.
 * @category URI Links
 */
export interface UriLinksListResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** Identifier of the guild the links belong to. */
  guildId: string;
  /** The list of URI links. */
  links: UriLink[];
}

/**
 * Payload for creating a URI link.
 * @category URI Links
 */
export interface UriLinkCreatePayload {
  /** Action the link performs when resolved. */
  action: UriLinkAction;
  /** Human-readable name for the link. */
  name?: string;
  /** Target config (netId, netUid, orgLinkId depending on action). */
  target?: UriLinkTarget;
  /** ISO expiry timestamp. Mutually exclusive with expiresMinutes/expiresDays. */
  expiresAt?: string;
  /** Minutes until expiry. */
  expiresMinutes?: number;
  /** Days until expiry. */
  expiresDays?: number;
  /** Maximum number of times the link can be used. 0 = unlimited. */
  maxUses?: number;
}

/**
 * Response from creating a URI link (includes the one-time token and launch URLs).
 * @category URI Links
 */
export interface UriLinkCreateResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** Identifier of the guild the link belongs to. */
  guildId: string;
  /** The newly created URI link. */
  link: UriLink;
  /** One-time secret token — only returned on create. */
  token: string;
  /** Full launch URL for the StarComms client (starcomms://launch?...). */
  directUri: string;
  /** Alternative launch URL (web-based). */
  launchUrl: string;
  /** The updated list of URI links. */
  links: UriLink[];
}

/**
 * Response from revoking a URI link.
 * @category URI Links
 */
export interface UriLinkRevokeResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** Identifier of the guild the link belongs to. */
  guildId: string;
  /** Identifier of the revoked link. */
  id: string;
  /** The updated list of URI links. */
  links: UriLink[];
}

/**
 * Payload for resolving a URI link.
 * @category URI Links
 */
export interface UriLinkResolvePayload {
  /** Identifier of the link to resolve. */
  id: string;
  /** One-time secret token for the link. */
  token: string;
}

/**
 * Response from resolving a URI link — returns the launch intent.
 * @category URI Links
 */
export interface UriLinkResolveResponse {
  /** Whether the request succeeded. */
  ok: boolean;
  /** The resolved URI link. */
  link: UriLink;
  /** Action the link performs. */
  action: UriLinkAction;
  /** Target configuration for the action. */
  target: UriLinkTarget;
}
