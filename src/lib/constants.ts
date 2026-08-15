/** Timing constants — declare once here, do not hardcode these numbers elsewhere. */

export const BROADCAST_THROTTLE_MS = 200;

export const ACTIVE_WINDOW_MS = 3000;

export const INACTIVE_AFTER_MS = 30000;

export const PRESENCE_TICK_MS = 5000;

/** Short enough to go unnoticed, long enough to not busy-loop channel creation during an outage. */
export const CHANNEL_RETRY_MS = 2000;

/** Supabase presence drops more often than tabs actually close; wait before declaring disconnected. */
export const DISCONNECT_GRACE_MS = 5 * 60 * 1000;

/** Keeps combined presence+broadcast traffic under Supabase Realtime's per-second event quota. */
export const LOBBY_TRACK_THROTTLE_MS = 2000;
export const PRESENCE_THROTTLE_MS = 1500;
