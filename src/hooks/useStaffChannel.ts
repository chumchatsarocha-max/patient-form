'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import {
  createSessionChannel,
  leaveChannel,
  requestState,
  trackPresence,
} from '@/lib/realtime/channel';
import {
  EVENTS,
  type FieldChangePayload,
  type PresenceState,
  type StateSyncPayload,
} from '@/lib/realtime/events';
import type { FieldKey } from '@/types/patient';
import { useActivityStatus } from './useActivityStatus';
import { useChannelRetry } from './useChannelRetry';

type SessionChannel = ReturnType<typeof createSessionChannel>;

const TRACE_LENGTH = 5;

interface StaffSessionState {
  // Raw strings only — this mirrors what the patient typed, it doesn't validate/narrow it.
  data: Partial<Record<FieldKey, string>>;
  updatedAt: Partial<Record<FieldKey, number>>;
  lastChangedField: FieldKey | null;
  // Newest field last — ActivityTrace renders this array in order.
  trace: FieldKey[];
  lastActivityAt: number | null;
  activeField: FieldKey | null;
  present: boolean;
  absentSince: number | null;
  submitted: boolean;
}

type Action =
  | { type: 'field'; payload: FieldChangePayload }
  | { type: 'sync'; payload: StateSyncPayload }
  | { type: 'submit' }
  | { type: 'reset' }
  // 'at' comes from the caller so the reducer stays a pure, testable function.
  | { type: 'presence'; presence: PresenceState | null; at: number };

/** Exported so the reducer can be tested without mounting React. */
export const initialStaffState: StaffSessionState = {
  data: {},
  updatedAt: {},
  lastChangedField: null,
  trace: [],
  lastActivityAt: null,
  activeField: null,
  present: false,
  absentSince: null,
  submitted: false,
};

export function staffSessionReducer(
  state: StaffSessionState,
  action: Action,
): StaffSessionState {
  switch (action.type) {
    case 'field': {
      const { field, value, at } = action.payload;

      // Drop stale writes: a message with an older 'at' than what's stored must not overwrite it.
      if (at <= (state.updatedAt[field] ?? 0)) return state;

      return {
        ...state,
        data: { ...state.data, [field]: value },
        updatedAt: { ...state.updatedAt, [field]: at },
        lastChangedField: field,
        // Skip duplicate entries when the same field is typed twice in a row.
        trace:
          state.trace[state.trace.length - 1] === field
            ? state.trace
            : [...state.trace, field].slice(-TRACE_LENGTH),
        lastActivityAt: Math.max(state.lastActivityAt ?? 0, at),
      };
    }

    case 'sync': {
      // Same LWW rule as 'field': never let an older sync overwrite newer per-field data.
      const { data, at } = action.payload;
      const nextData = { ...state.data };
      const nextUpdatedAt = { ...state.updatedAt };

      for (const [key, value] of Object.entries(data)) {
        const field = key as FieldKey;
        if (at <= (state.updatedAt[field] ?? 0)) continue;
        if (typeof value !== 'string') continue;

        // Empty value in a snapshot = page reload, not a real clear; deletions come via field:change.
        if (value === '' && state.data[field]) continue;

        nextData[field] = value;
        nextUpdatedAt[field] = at;
      }

      return {
        ...state,
        data: nextData,
        updatedAt: nextUpdatedAt,
        submitted: action.payload.status === 'submitted' || state.submitted,
      };
    }

    case 'submit':
      return { ...state, submitted: true };

    case 'reset':
      return { ...initialStaffState, present: state.present, absentSince: state.absentSince };

    case 'presence': {
      // Patient sends lastActivityAt: 0 for "never typed yet" — keep it null, not epoch time.
      const seenAt = Math.max(
        state.lastActivityAt ?? 0,
        action.presence?.lastActivityAt ?? 0,
      );

      return action.presence
        ? {
            ...state,
            present: true,
            absentSince: null,
            activeField: action.presence.activeField,
            lastActivityAt: seenAt > 0 ? seenAt : null,
            submitted: action.presence.status === 'submitted' || state.submitted,
          }
        : {
            ...state,
            present: false,
            // Set absentSince only once — later presence syncs must not push the disconnect clock back.
            absentSince: state.absentSince ?? action.at,
            activeField: null,
          };
    }
  }
}

export function useStaffChannel(sessionId: string) {
  const [state, dispatch] = useReducer(staffSessionReducer, initialStaffState);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<SessionChannel | null>(null);
  const { attempt, retryLater } = useChannelRetry(connected);

  useEffect(() => {
    let cancelled = false;
    const channel = createSessionChannel(sessionId, 'staff');
    channelRef.current = channel;

    const readPatientPresence = (): PresenceState | null => {
      const all = channel.presenceState() as Record<string, unknown[]>;
      const meta = all?.patient?.[0];
      return (meta as PresenceState | undefined) ?? null;
    };

    channel
      .on('broadcast', { event: EVENTS.FIELD_CHANGE }, ({ payload }) => {
        dispatch({ type: 'field', payload: payload as FieldChangePayload });
      })
      .on('broadcast', { event: EVENTS.STATE_SYNC }, ({ payload }) => {
        dispatch({ type: 'sync', payload: payload as StateSyncPayload });
      })
      .on('broadcast', { event: EVENTS.FORM_SUBMIT }, () => dispatch({ type: 'submit' }))
      .on('broadcast', { event: EVENTS.FORM_RESET }, () => dispatch({ type: 'reset' }))
      // 'sync' already fires on both join and leave; no need for separate join/leave listeners.
      .on('presence', { event: 'sync' }, () => {
        dispatch({ type: 'presence', presence: readPatientPresence(), at: Date.now() });
      });

    channel.subscribe((status, err) => {
      if (cancelled) return;

      if (status === 'SUBSCRIBED') {
        setConnected(true);
        setError(null);
        void trackPresence(channel, {
          role: 'staff',
          status: 'connected',
          activeField: null,
          lastActivityAt: Date.now(),
        });
        void requestState(channel);
      }
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        setConnected(false);
        setError(err?.message ?? status);
        retryLater();
      }
      // Staff must reconnect too, or the screen silently freezes on stale data.
      if (status === 'CLOSED') {
        setConnected(false);
        retryLater();
      }
    });

    return () => {
      cancelled = true;
      channelRef.current = null;
      void leaveChannel(channel);
    };
  }, [sessionId, attempt, retryLater]);

  // Status is derived from elapsed time here, not from a patient event — see useActivityStatus.
  const { status, isTyping, idleFor } = useActivityStatus({
    lastActivityAt: state.lastActivityAt,
    present: state.present,
    absentSince: state.absentSince,
    submitted: state.submitted,
  });

  return { ...state, status, isTyping, idleFor, connected, error };
}
