/**
 * Target audience for a ready check.
 * @category Ready Checks
 */
export interface ReadyCheckTarget {
  /** If true, all connected non-org-link members are included. */
  everyone: boolean;
  /** Include squad leaders (when everyone=false). */
  squadLeaders: boolean;
  /** Include admins (when everyone=false). */
  admins: boolean;
  /** Specific role IDs to target (when everyone=false). */
  roleIds: string[];
}

/**
 * A saved ready check template.
 * @category Ready Checks
 */
export interface ReadyCheckTemplate {
  id: string;
  name: string;
  message: string;
  color: string;
  keyCombo: string;
  target: ReadyCheckTarget;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Participant status in a ready check session.
 * @category Ready Checks
 */
export type ReadyCheckParticipantStatus = "pending" | "ready" | "declined" | "afk";

/**
 * A single participant in a ready check session.
 * @category Ready Checks
 */
export interface ReadyCheckParticipant {
  userId: string;
  name: string;
  status: ReadyCheckParticipantStatus;
  respondedAt: string;
}

/**
 * A live or completed ready check session.
 * @category Ready Checks
 */
export interface ReadyCheckSession {
  id: string;
  templateId: string;
  guildId: string;
  name: string;
  message: string;
  color: string;
  keyCombo: string;
  target: ReadyCheckTarget;
  initiatorId: string;
  initiatorName: string;
  source: string;
  startedAt: string;
  expiresAt: string;
  completedAt: string;
  status: "active" | "complete";
  participants: ReadyCheckParticipant[];
}

/**
 * Summary of participant responses in a ready check session.
 * @category Ready Checks
 */
export interface ReadyCheckSummary {
  total: number;
  pending: number;
  ready: number;
  declined: number;
  afk: number;
  allReady: boolean;
  notReady: ReadyCheckParticipant[];
}

/**
 * Response from listing ready check templates.
 * @category Ready Checks
 */
export interface ReadyChecksListResponse {
  ok: boolean;
  guildId: string;
  readyChecks: ReadyCheckTemplate[];
}

/**
 * Response from creating or updating a ready check template.
 * @category Ready Checks
 */
export interface ReadyCheckUpsertResponse {
  ok: boolean;
  guildId: string;
  readyCheck: ReadyCheckTemplate;
}

/**
 * Response from removing a ready check template.
 * @category Ready Checks
 */
export interface ReadyCheckRemoveResponse {
  ok: boolean;
  guildId: string;
  removedId: string;
}

/**
 * Response from starting a ready check session.
 * @category Ready Checks
 */
export interface ReadyCheckStartResponse {
  ok: boolean;
  guildId: string;
  session: ReadyCheckSession;
  summary: ReadyCheckSummary;
}

/**
 * Response from fetching all ready check sessions.
 * @category Ready Checks
 */
export interface ReadyCheckSessionsResponse {
  ok: boolean;
  guildId: string;
  sessions: ReadyCheckSession[];
}

/**
 * Response from fetching a single ready check session.
 * @category Ready Checks
 */
export interface ReadyCheckSessionResponse {
  ok: boolean;
  guildId: string;
  session: ReadyCheckSession;
  summary: ReadyCheckSummary;
}

/**
 * Input for creating/updating a ready check template.
 * @category Ready Checks
 */
export interface ReadyCheckTemplateInput {
  /** Existing template ID (for updates). Omit to create. */
  id?: string;
  /** Display name for the ready check. */
  name?: string;
  /** Message shown to participants (required, max 280 chars). */
  message: string;
  /** Hex color for the UI (e.g. "#34CD84"). */
  color?: string;
  /** Keyboard shortcut hint. */
  keyCombo?: string;
  /** Target audience configuration. */
  target?: Partial<ReadyCheckTarget>;
}
