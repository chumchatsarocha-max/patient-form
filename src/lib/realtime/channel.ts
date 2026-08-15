import type { RealtimeChannel } from '@supabase/supabase-js';
import { getRealtimeClient } from './client';
import {
  EVENTS,
  LOBBY_TOPIC,
  sessionTopic,
  type ChannelRole,
  type FieldChangePayload,
  type LobbyEntry,
  type PresenceState,
  type StateSyncPayload,
} from './events';

// Thin wrappers only: topic names and payload shapes. Lifecycle (subscribe/reconnect) lives in src/hooks/.

/** Presence key = role, so staff can read the patient's state directly from presenceState(). */
export function createSessionChannel(
  sessionId: string,
  role: ChannelRole,
): RealtimeChannel {
  return getRealtimeClient().channel(sessionTopic(sessionId), {
    config: {
      presence: { key: role },
      // self: false — sender already has this state locally, no need to echo it back.
      broadcast: { self: false },
    },
  });
}

/** Caller must throttle before calling this (BROADCAST_THROTTLE_MS) — this function doesn't. */
export function publishFieldChange(channel: RealtimeChannel, payload: FieldChangePayload) {
  return channel.send({ type: 'broadcast', event: EVENTS.FIELD_CHANGE, payload });
}

export function publishFormSubmit(channel: RealtimeChannel, at: number) {
  return channel.send({ type: 'broadcast', event: EVENTS.FORM_SUBMIT, payload: { at } });
}

export function publishFormReset(channel: RealtimeChannel, at: number) {
  return channel.send({ type: 'broadcast', event: EVENTS.FORM_RESET, payload: { at } });
}

export function requestState(channel: RealtimeChannel) {
  return channel.send({ type: 'broadcast', event: EVENTS.STATE_REQUEST, payload: {} });
}

export function publishStateSync(channel: RealtimeChannel, payload: StateSyncPayload) {
  return channel.send({ type: 'broadcast', event: EVENTS.STATE_SYNC, payload });
}

/** Safe to call repeatedly — each call replaces the previously tracked state. */
export function trackPresence(channel: RealtimeChannel, state: PresenceState) {
  return channel.track(state);
}

/** Uses removeChannel (not unsubscribe) so the client drops its reference; else channels leak on nav. */
export function leaveChannel(channel: RealtimeChannel) {
  return getRealtimeClient().removeChannel(channel);
}

/** Patient passes sessionId as the presence key; staff omit it and just read presenceState(). */
export function createLobbyChannel(presenceKey?: string): RealtimeChannel {
  return getRealtimeClient().channel(LOBBY_TOPIC, {
    config: { presence: { key: presenceKey ?? '' } },
  });
}

export function trackLobbyEntry(channel: RealtimeChannel, entry: LobbyEntry) {
  return channel.track(entry);
}
