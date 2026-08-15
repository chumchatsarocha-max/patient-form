'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BROADCAST_THROTTLE_MS,
  DISCONNECT_GRACE_MS,
  PRESENCE_THROTTLE_MS,
  PRESENCE_TICK_MS,
} from '@/lib/constants';
import {
  createSessionChannel,
  leaveChannel,
  publishFieldChange,
  publishFormReset,
  publishFormSubmit,
  publishStateSync,
  trackPresence,
} from '@/lib/realtime/channel';
import { EVENTS, type PresenceState } from '@/lib/realtime/events';
import { trailingThrottle, type Throttled } from '@/lib/utils/throttle';
import type { FieldKey, PatientForm, SessionStatus } from '@/types/patient';
import { useChannelRetry } from './useChannelRetry';

type SessionChannel = ReturnType<typeof createSessionChannel>;

interface UsePatientChannelOptions {
  sessionId: string;
  getSnapshot: () => PatientForm;
}

export function usePatientChannel({ sessionId, getSnapshot }: UsePatientChannelOptions) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // supabase-js won't reconnect on its own after a drop — see useChannelRetry.
  const { attempt, retryLater } = useChannelRetry(connected);

  // Delay showing disconnected until DISCONNECT_GRACE_MS so brief reconnects don't flicker the UI.
  const [lostForLong, setLostForLong] = useState(false);

  useEffect(() => {
    const id = setTimeout(
      () => setLostForLong(!connected),
      connected ? 0 : DISCONNECT_GRACE_MS,
    );
    return () => clearTimeout(id);
  }, [connected]);

  const channelRef = useRef<SessionChannel | null>(null);
  const snapshotRef = useRef(getSnapshot);

  // Ref writes must happen in an effect, not during render (D9).
  useEffect(() => {
    snapshotRef.current = getSnapshot;
  }, [getSnapshot]);

  const presenceRef = useRef<PresenceState>({
    role: 'patient',
    status: 'connected',
    activeField: null,
    lastActivityAt: 0,
  });

  const fieldThrottleRef = useRef<Throttled<[FieldKey, string]> | null>(null);
  const presenceThrottleRef = useRef<Throttled<[]> | null>(null);

  // Depends only on sessionId/attempt — any other dep recreates the channel every keystroke.
  useEffect(() => {
    let cancelled = false;
    const channel = createSessionChannel(sessionId, 'patient');
    channelRef.current = channel;

    const push = () => {
      if (!cancelled) void trackPresence(channel, presenceRef.current);
    };

    // Built fresh here so each retry's throttle closes over the current channel, not a stale one.
    fieldThrottleRef.current = trailingThrottle<[FieldKey, string]>((field, value) => {
      if (!cancelled) {
        void publishFieldChange(channel, { field, value, at: Date.now() });
      }
    }, BROADCAST_THROTTLE_MS);

    presenceThrottleRef.current = trailingThrottle<[]>(push, PRESENCE_THROTTLE_MS);

    channel.on('broadcast', { event: EVENTS.STATE_REQUEST }, () => {
      void publishStateSync(channel, {
        data: snapshotRef.current(),
        status: presenceRef.current.status,
        at: Date.now(),
      });
    });

    channel.subscribe((status, err) => {
      if (cancelled) return;

      if (status === 'SUBSCRIBED') {
        setConnected(true);
        setError(null);
        push();
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

    // Periodic re-track (not just on subscribe) — keeps presence fresh for staff's disconnect check.
    const tick = setInterval(push, PRESENCE_TICK_MS);

    return () => {
      cancelled = true;
      clearInterval(tick);
      fieldThrottleRef.current?.cancel();
      presenceThrottleRef.current?.cancel();
      fieldThrottleRef.current = null;
      presenceThrottleRef.current = null;
      channelRef.current = null;
      void leaveChannel(channel);
    };
  }, [sessionId, attempt, retryLater]);

  const publishField = useCallback((field: FieldKey, value: string) => {
    presenceRef.current = {
      ...presenceRef.current,
      status: 'filling',
      lastActivityAt: Date.now(),
    };
    fieldThrottleRef.current?.(field, value);
    presenceThrottleRef.current?.();
  }, []);

  /** activeField comes from onFocus in the form; drives row highlighting in the staff view. */
  const setActiveField = useCallback((field: FieldKey | null) => {
    presenceRef.current = { ...presenceRef.current, activeField: field };
    presenceThrottleRef.current?.();
  }, []);

  const setStatus = useCallback((status: SessionStatus) => {
    presenceRef.current = { ...presenceRef.current, status };
    const channel = channelRef.current;
    if (channel) void trackPresence(channel, presenceRef.current);
  }, []);

  /** Flush the pending throttled field update first so it isn't lost after submit. */
  const publishSubmit = useCallback(() => {
    const channel = channelRef.current;
    if (!channel) return;
    fieldThrottleRef.current?.flush();
    setStatus('submitted');
    void publishFormSubmit(channel, Date.now());
  }, [setStatus]);

  const publishReset = useCallback(() => {
    const channel = channelRef.current;
    if (!channel) return;
    fieldThrottleRef.current?.cancel();
    presenceRef.current = {
      role: 'patient',
      status: 'connected',
      activeField: null,
      lastActivityAt: 0,
    };
    void trackPresence(channel, presenceRef.current);
    void publishFormReset(channel, Date.now());
  }, []);

  return {
    /** Stays true through the reconnect grace period so the UI doesn't flash "disconnected". */
    connected: connected || !lostForLong,
    error,
    publishField,
    setActiveField,
    publishSubmit,
    publishReset,
  };
}
