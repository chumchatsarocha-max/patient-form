'use client';

import { Eyebrow } from '@/components/ui/Eyebrow';
import { CHIP, HomeLink } from '@/components/ui/HomeLink';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { signOut } from '@/lib/actions/auth';
import { useLang } from '@/lib/i18n/context';

/**
 * Staff-side page header. Both sides share the same light background and white cards, so this
 * label is what tells staff which side they're on (patient name is <h2>; this is the page <h1>).
 */
export function StaffHeader() {
  const { t } = useLang();

  return (
    <header className="mb-4 px-1">
      {/* Home stays left, language/sign-out stay right — merging them made "back" hard to find. */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <HomeLink />
        <div className="flex items-center gap-2">
          <LanguageToggle tone="onSheet" />
          <form action={signOut}>
            <button type="submit" className={`cursor-pointer ${CHIP}`}>
              {t.common.signOut}
            </button>
          </form>
        </div>
      </div>

      <Eyebrow>{t.staff.eyebrow}</Eyebrow>
      <h1 className="font-display text-xl font-bold tracking-tight text-deep sm:text-2xl">
        {t.staff.title}
      </h1>
    </header>
  );
}
