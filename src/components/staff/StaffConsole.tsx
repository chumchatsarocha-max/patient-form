'use client';

import { useEffect, useState } from 'react';
import { useLobbySessions } from '@/hooks/useLobby';
import { useLang } from '@/lib/i18n/context';
import type { LobbyEntry } from '@/lib/realtime/events';
import { PatientRecordView } from './PatientRecordView';
import { SessionList } from './SessionList';
import { STATUS_DOT_CLASS } from './statusDot';

function tabName(entry: LobbyEntry, fallback: string): string {
  return entry.displayName.trim() || fallback;
}

/** Front-desk console: tabs from lobby presence, detail from the selected session's channel. */
export function StaffConsole({ initialSessionId }: { initialSessionId?: string }) {
  const { sessions, connected } = useLobbySessions();
  const [requested, setRequested] = useState<string | null>(initialSessionId ?? null);
  const { t } = useLang();

  // Don't fall back to sessions[0] each render — it remounts PatientRecordView and drops live data.
  const selected =
    sessions.find((s) => s.sessionId === requested)?.sessionId ??
    sessions[0]?.sessionId ??
    null;

  useEffect(() => {
    if (!selected || selected === requested) return;
    queueMicrotask(() => setRequested(selected));
  }, [selected, requested]);

  if (sessions.length === 0) {
    return (
      <div className="px-5 py-14 text-center">
        <h2 className="mb-2 font-display text-lg font-semibold">
          {connected ? t.staff.emptyTitle : t.staff.connectingTitle}
        </h2>
        <p className="mx-auto max-w-sm text-sm text-muted">
          {connected ? t.staff.emptyLead : t.staff.connectingLead}
        </p>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* >=1024px: persistent split view — do not collapse this lg:block/lg:hidden pair. */}
      <aside className="hidden border-r border-line bg-[#F8FBFE] p-3 lg:block">
        <SessionList sessions={sessions} selected={selected} onSelect={setRequested} />
      </aside>

      {/* <1024px: horizontal tab bar instead — a vertical list would eat too much height. */}
      <div
        role="tablist"
        aria-label={t.staff.openSessions}
        className="flex gap-2 overflow-x-auto border-b border-line bg-[#F8FBFE] px-4 py-3.5 sm:px-5 lg:hidden"
      >
        {sessions.map((entry) => {
          const active = entry.sessionId === selected;
          return (
            <button
              key={entry.sessionId}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setRequested(entry.sessionId)}
              className={[
                'flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] transition-colors',
                active
                  ? 'border-sky-300 bg-fill font-semibold text-deep'
                  : 'border-line bg-white text-muted hover:border-line-strong hover:text-ink',
              ].join(' ')}
            >
              <span
                aria-hidden
                className={`h-[7px] w-[7px] shrink-0 rounded-full ${STATUS_DOT_CLASS[entry.status]}`}
              />
              {tabName(entry, t.staff.unnamed)}
            </button>
          );
        })}
      </div>

      <div className="min-w-0">
        {selected ? <PatientRecordView key={selected} sessionId={selected} /> : null}
      </div>
    </div>
  );
}
