'use client';

import { labelOf } from '@/data/fields';
import { useLang } from '@/lib/i18n/context';
import { DICT, type Lang } from '@/lib/i18n/dict';
import { formatElapsedBare } from '@/lib/utils/format';
import type { FieldKey, SessionStatus } from '@/types/patient';

/** a11y (§8): status is always conveyed in text, not color alone, and the text says why. */

const TONE: Record<SessionStatus, string> = {
  filling: 'border-sky-300 text-deep',
  submitted: 'border-green-300 text-green-fg',
  inactive: 'border-line text-muted',
  connected: 'border-line text-muted',
  disconnected: 'border-line text-muted',
};

const DOT: Record<SessionStatus, string> = {
  filling: 'bg-brand',
  submitted: 'bg-green-600',
  inactive: 'border-2 border-line-strong bg-transparent',
  connected: 'bg-line-strong',
  disconnected: 'border-2 border-line-strong bg-transparent',
};

export function statusText(
  status: SessionStatus,
  activeField: FieldKey | null,
  idleFor: number | null,
  lang: Lang,
): string {
  const s = DICT[lang].staff.status;

  switch (status) {
    case 'submitted':
      return s.submitted;
    case 'filling':
      return activeField ? s.fillingField(labelOf(activeField, lang)) : s.filling;
    case 'inactive':
      return s.inactive(formatElapsedBare(idleFor, lang));
    case 'connected':
      return s.connected;
    case 'disconnected':
      return s.disconnected;
  }
}

interface StatusPillProps {
  status: SessionStatus;
  activeField: FieldKey | null;
  idleFor: number | null;
}

export function StatusPill({ status, activeField, idleFor }: StatusPillProps) {
  const { lang } = useLang();

  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border bg-white px-3.5 py-1.5 text-[13px] shadow-[0_2px_6px_-3px_rgba(12,74,110,0.25)] ${TONE[status]}`}
    >
      <span
        aria-hidden
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT[status]}`}
      />
      {statusText(status, activeField, idleFor, lang)}
    </span>
  );
}
