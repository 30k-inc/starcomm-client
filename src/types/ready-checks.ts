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
  /** Unique template identifier. */
  id: string;
  /** Display name for the template. */
  name: string;
  /** Message shown to participants. */
  message: string;
  /** Hex color for the UI. */
  color: string;
  /** Keyboard shortcut hint. */
  keyCombo: string;
  /** Target audience configuration. */
  target: ReadyCheckTarget;
  /** User ID of the template creator. */
  createdBy: string;
  /** Display name of the template creator. */
  createdByName: string;
  /** ISO timestamp when the template was created. */
  createdAt: string;
  /** ISO timestamp when the template was last updated. */
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
  /** User ID of the participant. */
  userId: string;
  /** Display name of the participant. */
  name: string;
  /** Current response status of the participant. */
  status: ReadyCheckParticipantStatus;
  /** ISO timestamp when the participant last responded. */
  respondedAt: string;
}

/**
 * A live or completed ready check session.
 * @category Ready Checks
 */
export interface ReadyCheckSession {
  /** Unique session identifier. */
  id: string;
  /** ID of the template this session was started from. */
  templateId: string;
  /** ID of the guild the session belongs to. */
  guildId: string;
  /** Display name for the session. */
  name: string;
  /** Message shown to participants. */
  message: string;
  /** Hex color for the UI. */
  color: string;
  /** Keyboard shortcut hint. */
  keyCombo: string;
  /** Target audience configuration. */
  target: ReadyCheckTarget;
  /** User ID of the member who started the session. */
  initiatorId: string;
  /** Display name of the member who started the session. */
  initiatorName: string;
  /** Origin of the session (e.g. app or bot). */
  source: string;
  /** ISO timestamp when the session started. */
  startedAt: string;
  /** ISO timestamp when the session expires. */
  expiresAt: string;
  /** ISO timestamp when the session completed. */
  completedAt: string;
  /** Current lifecycle status of the session. */
  status: "active" | "complete";
  /** Participants in the session. */
  participants: ReadyCheckParticipant[];
}

/**
 * Summary of participant responses in a ready check session.
 * @category Ready Checks
 */
export interface ReadyCheckSummary {
  /** Total number of participants. */
  total: number;
  /** Number of participants yet to respond. */
  pending: number;
  /** Number of participants marked ready. */
  ready: number;
  /** Number of participants who declined. */
  declined: number;
  /** Number of participants marked AFK. */
  afk: number;
  /** True when all participants are ready. */
  allReady: boolean;
  /** Participants who are not yet ready. */
  notReady: ReadyCheckParticipant[];
}

/**
 * Response from listing ready check templates.
 * @category Ready Checks
 */
export interface ReadyChecksListResponse {
  /** True when the request succeeded. */
  ok: boolean;
  /** ID of the guild the templates belong to. */
  guildId: string;
  /** The list of ready check templates. */
  readyChecks: ReadyCheckTemplate[];
}

/**
 * Response from creating or updating a ready check template.
 * @category Ready Checks
 */
export interface ReadyCheckUpsertResponse {
  /** True when the request succeeded. */
  ok: boolean;
  /** ID of the guild the template belongs to. */
  guildId: string;
  /** The created or updated ready check template. */
  readyCheck: ReadyCheckTemplate;
}

/**
 * Response from removing a ready check template.
 * @category Ready Checks
 */
export interface ReadyCheckRemoveResponse {
  /** True when the request succeeded. */
  ok: boolean;
  /** ID of the guild the template belonged to. */
  guildId: string;
  /** ID of the removed template. */
  removedId: string;
}

/**
 * Response from starting a ready check session.
 * @category Ready Checks
 */
export interface ReadyCheckStartResponse {
  /** True when the request succeeded. */
  ok: boolean;
  /** ID of the guild the session belongs to. */
  guildId: string;
  /** The started ready check session. */
  session: ReadyCheckSession;
  /** Summary of participant responses. */
  summary: ReadyCheckSummary;
}

/**
 * Response from fetching all ready check sessions.
 * @category Ready Checks
 */
export interface ReadyCheckSessionsResponse {
  /** True when the request succeeded. */
  ok: boolean;
  /** ID of the guild the sessions belong to. */
  guildId: string;
  /** The list of ready check sessions. */
  sessions: ReadyCheckSession[];
}

/**
 * Response from fetching a single ready check session.
 * @category Ready Checks
 */
export interface ReadyCheckSessionResponse {
  /** True when the request succeeded. */
  ok: boolean;
  /** ID of the guild the session belongs to. */
  guildId: string;
  /** The requested ready check session. */
  session: ReadyCheckSession;
  /** Summary of participant responses. */
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
