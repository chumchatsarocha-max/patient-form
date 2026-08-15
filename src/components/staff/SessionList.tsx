'use client';

import { useEffect, useState } from 'react';
import type { LobbySession } from '@/hooks/useLobby';
import { useLang } from '@/lib/i18n/context';
import { SessionCard } from './SessionCard';

/** Left column of the split view (§8, >=1024px); StaffConsole uses a tab bar below that. */
export function SessionList({
  sessions,
  selected,
  onSelect,
}: {
  sessions: LobbySession[];
  selected: string | null;
  onSelect: (sessionId: string) => void;
}) {
  const { t } = useLang();

  // Single shared clock (D9); cards must not call Date.now() themselves, or times would drift.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="tablist"
      aria-label={t.staff.openSessions}
      aria-orientation="vertical"
      className="flex flex-col gap-2"
    >
      {sessions.map((session) => (
        <SessionCard
          key={session.sessionId}
          session={session}
          selected={session.sessionId === selected}
          now={now}
          onSelect={() => onSelect(session.sessionId)}
        />
      ))}
    </div>
  );
}
