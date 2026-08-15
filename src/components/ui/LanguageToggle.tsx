'use client';

import { LANGS, type Lang } from '@/lib/i18n/dict';
import { useLang } from '@/lib/i18n/context';

/**
 * EN/Thai language toggle, reusable on any page (components/ui stays domain-agnostic, §4).
 * Each button's label stays in its own language (not translated) so a reader who can't read
 * the currently active language can still find their own button.
 */

const LABEL: Record<Lang, string> = { en: 'EN', th: 'ไทย' };

interface LanguageToggleProps {
  /** 'plain' = white capsule on a card, 'onSheet' = translucent for over a background photo. */
  tone?: 'plain' | 'onSheet';
  className?: string;
}

export function LanguageToggle({ tone = 'plain', className = '' }: LanguageToggleProps) {
  const { lang, setLang, t } = useLang();

  const shell =
    tone === 'onSheet'
      ? 'border-white/70 bg-white/70 backdrop-blur-sm'
      : 'border-line bg-card';

  return (
    <div
      role="group"
      aria-label={t.common.languageGroup}
      className={`flex shrink-0 gap-0.5 rounded-full border p-[3px] ${shell} ${className}`}
    >
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          // Fixed min-w: without it the selected (semibold) button widens and the capsule shifts.
          className={`min-w-14 cursor-pointer rounded-full px-3 py-[7px] text-center text-xs leading-4 transition-colors ${
            lang === code
              ? 'bg-track font-semibold text-brand'
              : 'text-muted hover:text-ink'
          }`}
        >
          {LABEL[code]}
        </button>
      ))}
    </div>
  );
}
