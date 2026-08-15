'use client';

import { useEffect, useRef, useState } from 'react';
import {
  DISCONNECT_GRACE_MS,
  LOBBY_TRACK_THROTTLE_MS,
  PRESENCE_TICK_MS,
} from '@/lib/constants';
import {
  createLobbyChannel,
  leaveChannel,
  trackLobbyEntry,
} from '@/lib/realtime/channel';
import type { LobbyEntry } from '@/lib/realtime/events';
import { trailingThrottle } from '@/lib/utils/throttle';
import type { SessionStatus } from '@/types/patient';
import { useChannelRetry } from './useChannelRetry';

/** Patient side — paired with usePatientChannel on the /patient/[sessionId] page. */
export function useLobbyAnnounce(
  sessionId: string,
  status: SessionStatus,
  displayName: string,
) {
  // Date.now() is impure during render (D9) — placeholder here, set for real in the effect.
  const entryRef = useRef<LobbyEntry>({
    sessionId,
    displayName,
    status,
    startedAt: 0,
    lastActivityAt: 0,
  });

  // Lets the status/displayName effect trigger a push without joining the channel effect's deps.
  const pushRef = useRef<() => void>(() => {});

  // Must retry a failed announce, or the session vanishes from the staff list for good.
  const [joined, setJoined] = useState(false);
  const { attempt, retryLater } = useChannelRetry(joined);

  // Depends only on sessionId/attempt — any other dep recreates the channel every keystroke.
  useEffect(() => {
    let cancelled = false;
    const now = Date.now();
    entryRef.current = {
      ...entryRef.current,
      startedAt: entryRef.current.startedAt || now,
      lastActivityAt: now,
    };

    const channel = createLobbyChannel(sessionId);

    // Throttled — untamed per-keystroke tracks + field broadcasts blew past Realtime's rate limit.
    const throttled = trailingThrottle(() => {
      if (!cancelled) void trackLobbyEntry(channel, entryRef.current);
    }, LOBBY_TRACK_THROTTLE_MS);

    const push = () => {
      if (cancelled) return;
      // Refresh lastActivityAt on every push — otherwise it goes stale between name/status edits.
      entryRef.current = { ...entryRef.current, lastActivityAt: Date.now() };
      throttled();
    };
    pushRef.current = push;

    channel.subscribe((subscribeStatus) => {
      if (cancelled) return;

      if (subscribeStatus === 'SUBSCRIBED') {
        setJoined(true);
        push();
      }
      // Severed mid-session (e.g. frozen tab) — recreate the channel; see useChannelRetry.
      if (
        subscribeStatus === 'CLOSED' ||
        subscribeStatus === 'CHANNEL_ERROR' ||
        subscribeStatus === 'TIMED_OUT'
      ) {
        setJoined(false);
        retryLater();
      }
    });

    const tick = setInterval(push, PRESENCE_TICK_MS);

    return () => {
      cancelled = true;
      clearInterval(tick);
      throttled.cancel();
      pushRef.current = () => {};
      void leaveChannel(channel);
    };
  }, [sessionId, attempt, retryLater]);

  useEffect(() => {
    entryRef.current = {
      ...entryRef.current,
      status,
      displayName,
      lastActivityAt: Date.now(),
    };
    pushRef.current();
  }, [status, displayName]);
}

/** present = currently in presence; false = absent but still within DISCONNECT_GRACE_MS. */
export type LobbySession = LobbyEntry & { present: boolean };

/** Staff side — used on the /staff page. */
export function useLobbySessions() {
  const [sessions, setSessions] = useState<LobbySession[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { attempt, retryLater } = useChannelRetry(connected);
  // Persists across channel retries — otherwise the list would blank out on every reconnect.
  const keptRef = useRef<Map<string, LobbyEntry>>(new Map());
  const missingSinceRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    let cancelled = false;
    const channel = createLobbyChannel('staff-observer');

    // Grace period before dropping — presence flaps (network/retry) more than tabs actually close.
    const readSessions = () => {
      if (cancelled) return;
      const all = channel.presenceState() as Record<string, unknown[]>;
      const now = Date.now();

      for (const metas of Object.values(all)) {
        const entry = metas?.[0] as LobbyEntry | undefined;
        if (entry?.sessionId) keptRef.current.set(entry.sessionId, entry);
      }

      const live = new Set(
        Object.values(all)
          .map((metas) => (metas?.[0] as LobbyEntry | undefined)?.sessionId)
          .filter(Boolean) as string[],
      );

      for (const [id, entry] of keptRef.current) {
        if (live.has(id)) {
          missingSinceRef.current.delete(id);
          continue;
        }
        const since = missingSinceRef.current.get(id) ?? now;
        missingSinceRef.current.set(id, since);
        if (now - since >= DISCONNECT_GRACE_MS) {
          keptRef.current.delete(id);
          missingSinceRef.current.delete(id);
        } else {
          keptRef.current.set(id, entry);
        }
      }

      setSessions(
        [...keptRef.current.values()]
          .map((entry) => ({ ...entry, present: live.has(entry.sessionId) }))
          // Present-first sort — pure time-sort could let a grace-period entry outrank someone typing now.
          .sort(
            (a, b) =>
              Number(b.present) - Number(a.present) ||
              b.lastActivityAt - a.lastActivityAt,
          ),
      );
    };

    channel.on('presence', { event: 'sync' }, readSessions);

    channel.subscribe((status, err) => {
      if (cancelled) return;
      if (status === 'SUBSCRIBED') {
        setConnected(true);
        setError(null);
        readSessions();
      }
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        setConnected(false);
        setError(err?.message ?? status);
        retryLater();
      }
      if (status === 'CLOSED') {
        setConnected(false);
        retryLater();
      }
    });

    // Presence doesn't emit on grace-period expiry — this sweep re-checks it on a timer.
    const sweep = setInterval(readSessions, PRESENCE_TICK_MS * 2);

    return () => {
      cancelled = true;
      clearInterval(sweep);
      void leaveChannel(channel);
    };
  }, [attempt, retryLater]);

  return { sessions, connected, error };
}
