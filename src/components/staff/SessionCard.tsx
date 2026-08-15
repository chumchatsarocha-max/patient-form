'use client';

import { useLang } from '@/lib/i18n/context';
import type { LobbySession } from '@/hooks/useLobby';
import { formatElapsed } from '@/lib/utils/format';
import { STATUS_DOT_CLASS } from './statusDot';

/** Session card in the split view's left column (§4, §8). No contact info: see DECISIONS.md D11. */

interface SessionCardProps {
  session: LobbySession;
  selected: boolean;
  /** Shared clock from SessionList — see DECISIONS.md D9 on not reading time during render. */
  now: number;
  onSelect: () => void;
}

export function SessionCard({ session, selected, now, onSelect }: SessionCardProps) {
  const { lang, t } = useLang();
  const name = session.displayName.trim() || t.staff.unnamed;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={[
        'w-full cursor-pointer rounded-xl border px-3.5 py-3 text-left transition-colors',
        selected
          ? 'border-sky-300 bg-fill'
          : 'border-line bg-white hover:border-line-strong hover:bg-track',
      ].join(' ')}
    >
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className={`h-[7px] w-[7px] shrink-0 rounded-full ${STATUS_DOT_CLASS[session.status]}`}
        />
        <span
          className={`min-w-0 flex-1 truncate text-sm ${selected ? 'font-semibold text-deep' : 'text-ink'}`}
        >
          {name}
        </span>
      </span>

      {/* Thai skips font-mono: Google Sans Code has no Thai glyphs and falls back to a system font. */}
      <span
        className={`mt-1 block pl-[15px] text-[11px] text-muted ${lang === 'th' ? '' : 'font-mono'}`}
      >
        {/* a11y: status must be conveyed in text, not color alone. */}
        {t.staff.statusShort[session.status]} ·{' '}
        {formatElapsed(now - session.lastActivityAt, lang)}
      </span>
    </button>
  );
}
