'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CHANNEL_RETRY_MS } from '@/lib/constants';

/** Forces callers to recreate their channel — supabase-js won't auto-reconnect once closed. */
export function useChannelRetry(connected: boolean) {
  const [attempt, setAttempt] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const retryNow = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setAttempt((n) => n + 1);
  }, []);

  /** Call from the subscribe status callback on CLOSED / CHANNEL_ERROR / TIMED_OUT. */
  const retryLater = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setAttempt((n) => n + 1);
    }, CHANNEL_RETRY_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, []);

  // Retry immediately on tab/network return so mobile app-switching doesn't wait a full cycle.
  useEffect(() => {
    if (connected) return;

    const wake = () => {
      if (document.visibilityState === 'visible') retryNow();
    };
    document.addEventListener('visibilitychange', wake);
    window.addEventListener('online', retryNow);
    window.addEventListener('focus', wake);

    return () => {
      document.removeEventListener('visibilitychange', wake);
      window.removeEventListener('online', retryNow);
      window.removeEventListener('focus', wake);
    };
  }, [connected, retryNow]);

  return { attempt, retryLater, retryNow };
}
