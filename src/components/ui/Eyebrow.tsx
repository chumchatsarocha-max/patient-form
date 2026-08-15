'use client';

import type { ReactNode } from 'react';
import { useLang } from '@/lib/i18n/context';

/** Eyebrow line above the page title. Thai uses normal weight/tracking; uppercase+mono is English-only. */
export function Eyebrow({ children }: { children: ReactNode }) {
  const { lang } = useLang();

  return (
    <p
      className={
        // font-semibold both languages: already small/low-contrast (deep/70), regular reads too faint.
        lang === 'th'
          ? 'text-[13px] leading-5 font-semibold text-deep/70'
          : 'font-mono text-[11px] font-semibold tracking-[0.18em] text-deep/70 uppercase'
      }
    >
      {children}
    </p>
  );
}
