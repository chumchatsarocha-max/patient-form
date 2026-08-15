'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n/context';

/** Shared "back to home" link — styled as a translucent chip over the background photo. */
// font-semibold centralized: regular weight is too faint on the photo backdrop, and every
// chip in the same row (home link / sign out) must match in weight.
export const CHIP =
  'inline-flex items-center gap-1.5 rounded-lg border border-white/70 bg-white/70 px-3 py-1.5 text-[13px] font-semibold text-deep backdrop-blur-sm transition-colors hover:bg-white';

export function HomeLink({ className = '' }: { className?: string }) {
  const { t } = useLang();

  return (
    <Link href="/" className={`${CHIP} ${className}`}>
      <span aria-hidden>&larr;</span>
      {t.common.home}
    </Link>
  );
}
