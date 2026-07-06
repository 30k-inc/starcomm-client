/**
 * Options for starting the audio listener.
 * @category Audio
 */
export interface AudioListenOptions {
  /** Discord guild ID to listen on. */
  guildId: string;
  /** Initial net IDs to receive audio from. */
  nets?: number[];
  /** Display name shown in the shard roster for this listener. @default "" */
  displayName?: string;
  /** Auto-reconnect on connection loss. @default true */
  autoReconnect?: boolean;
  /** Initial delay before first reconnect attempt in ms. @default 2000 */
  initialDelayMs?: number;
  /** Maximum delay between reconnect attempts in ms. @default 30000 */
  maxDelayMs?: number;
  /** Maximum consecutive reconnect attempts. @default Infinity */
  maxAttempts?: number;
}

/**
 * A decoded audio frame received from the shard.
 * @category Audio
 */
export interface AudioFrame {
  /** Net ID the audio was transmitted on. */
  netId: number;
  /** Discord user ID of the transmitting operator. */
  userId: string;
  /** Raw Opus audio payload. */
  opus: Uint8Array;
}

/**
 * PTT (push-to-talk) state event received over the voice WebSocket.
 * @category Audio
 */
export interface AudioPttEvent {
  /** Discord user ID of the operator. */
  userId: string;
  /** Display name of the operator. */
  displayName: string;
  /** Net ID the PTT event is on. */
  netId: number;
}

/**
 * Audio listener lifecycle event types.
 * @category Audio
 */
export type AudioLifecycleEventType =
  | "audio.connected"
  | "audio.disconnected"
  | "audio.reconnected"
  | "audio.error";

/**
 * Audio event map for typed `.on()` handlers.
 * @category Audio
 */
export interface AudioEventMap {
  audio: AudioFrame;
  "ptt.start": AudioPttEvent;
  "ptt.stop": AudioPttEvent;
  connected: { guildId: string };
  disconnected: { reason: string };
  reconnected: { attempt: number };
  error: { reason: string };
}

/**
 * All possible audio event types for the `.on()` handler.
 * @category Audio
 */
export type AudioEventType = keyof AudioEventMap;
