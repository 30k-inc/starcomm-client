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
  netId?: number;
  netUid?: string;
  orgLinkId?: string;
  [key: string]: unknown;
}

/**
 * A URI link as returned by the shard (public view, no token).
 * @category URI Links
 */
export interface UriLink {
  id: string;
  name: string;
  action: UriLinkAction;
  target: UriLinkTarget;
  createdAt: string;
  expiresAt: string;
  revokedAt: string;
  maxUses: number;
  useCount: number;
  lastUsedAt: string;
  createdByKeyId: string;
}

/**
 * Response from listing URI links.
 * @category URI Links
 */
export interface UriLinksListResponse {
  ok: boolean;
  guildId: string;
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
  ok: boolean;
  guildId: string;
  link: UriLink;
  /** One-time secret token — only returned on create. */
  token: string;
  /** Full launch URL for the StarComms client (starcomms://launch?...). */
  directUri: string;
  /** Alternative launch URL (web-based). */
  launchUrl: string;
  links: UriLink[];
}

/**
 * Response from revoking a URI link.
 * @category URI Links
 */
export interface UriLinkRevokeResponse {
  ok: boolean;
  guildId: string;
  id: string;
  links: UriLink[];
}

/**
 * Payload for resolving a URI link.
 * @category URI Links
 */
export interface UriLinkResolvePayload {
  id: string;
  token: string;
}

/**
 * Response from resolving a URI link — returns the launch intent.
 * @category URI Links
 */
export interface UriLinkResolveResponse {
  ok: boolean;
  link: UriLink;
  action: UriLinkAction;
  target: UriLinkTarget;
}
