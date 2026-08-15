'use client';

import { useEffect, useState } from 'react';
import {
  ACTIVE_WINDOW_MS,
  DISCONNECT_GRACE_MS,
  INACTIVE_AFTER_MS,
} from '@/lib/constants';
import type { SessionStatus } from '@/types/patient';

interface ActivityInput {
  lastActivityAt: number | null;
  present: boolean;
  absentSince: number | null;
  submitted: boolean;
}

export function useActivityStatus({
  lastActivityAt,
  present,
  absentSince,
  submitted,
}: ActivityInput) {
  const [now, setNow] = useState(() => Date.now());

  const status = resolveStatus({ lastActivityAt, present, absentSince, submitted, now });

  useEffect(() => {
    // Keep ticking through the grace period — disconnected flips by elapsed time, not an event.
    if (submitted || status === 'disconnected') return;

    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [submitted, status]);
  const idleFor = lastActivityAt === null ? null : now - lastActivityAt;

  return {
    status,
    /** True only within ACTIVE_WINDOW_MS of input — drives the pulse, not status. */
    isTyping: status === 'filling' && idleFor !== null && idleFor < ACTIVE_WINDOW_MS,
    idleFor,
  };
}

/** Pure so it can be tested without mounting React. */
export function resolveStatus({
  lastActivityAt,
  present,
  absentSince,
  submitted,
  now,
}: ActivityInput & { now: number }): SessionStatus {
  // Presence flaps before a real disconnect; wait out DISCONNECT_GRACE_MS before declaring it.
  if (!present && absentSince !== null && now - absentSince >= DISCONNECT_GRACE_MS) {
    return 'disconnected';
  }

  if (submitted) return 'submitted';

  if (lastActivityAt === null) return 'connected';

  return now - lastActivityAt > INACTIVE_AFTER_MS ? 'inactive' : 'filling';
}
