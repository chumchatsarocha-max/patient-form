'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { LANG_COOKIE, LANG_COOKIE_MAX_AGE } from './cookie';
import { DICT, type Dict, type Lang } from './dict';

interface LanguageValue {
  lang: Lang;
  setLang: (next: Lang) => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageValue | null>(null);

/** Hydrates from the server-resolved language (cookie/Accept-Language) — no flash on load. */
export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const router = useRouter();

  const setLang = useCallback(
    (next: Lang) => {
      setLangState(next);
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=${LANG_COOKIE_MAX_AGE}; samesite=lax`;
      // Keep <html lang> in sync so screen readers and native controls use the right language.
      document.documentElement.lang = next;
      // Refresh syncs server-rendered text (banner, <title>) with the new lang; doesn't reset form state.
      router.refresh();
    },
    [router],
  );

  const value = useMemo<LanguageValue>(
    () => ({ lang, setLang, t: DICT[lang] }),
    [lang, setLang],
  );

  return <LanguageContext value={value}>{children}</LanguageContext>;
}

export function useLang(): LanguageValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLang ต้องอยู่ภายใน <LanguageProvider>');
  return value;
}
