'use client';

import { useEffect, useRef } from 'react';
import { optionLabelOf } from '@/data/fields';
import { useLang } from '@/lib/i18n/context';
import type { Lang } from '@/lib/i18n/dict';
import { formatIsoDate } from '@/lib/utils/format';
import type { FieldKey } from '@/types/patient';

interface FieldRowProps {
  fieldKey: FieldKey;
  label: string;
  value: string | undefined;
  live: boolean;
  /** Once submitted, an empty value means "not provided", not "still waiting". */
  submitted: boolean;
}

function readable(key: FieldKey, raw: string, lang: Lang): string {
  if (key === 'dateOfBirth') return formatIsoDate(raw, lang);
  return optionLabelOf(key, raw, lang);
}

export function FieldRow({ fieldKey, label, value, live, submitted }: FieldRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { lang, t } = useLang();

  // Class toggle avoids Compiler cascade error; offsetWidth forces reflow to replay flash.
  useEffect(() => {
    const row = rowRef.current;
    if (!row || !value) return;

    row.classList.remove('bump-flash');
    void row.offsetWidth;
    row.classList.add('bump-flash');
  }, [value]);

  const filled = Boolean(value);

  return (
    <div
      ref={rowRef}
      className={[
        'relative rounded-lg border-b px-3 pt-5 pb-2 transition-colors duration-200 last:border-b-0',
        live ? 'live-ring border-b-transparent bg-white' : 'border-line',
      ].join(' ')}
    >
      <span
        className={[
          'mb-2 block text-[11px] tracking-[0.3px] transition-colors',
          live ? 'font-semibold text-brand' : 'text-muted',
        ].join(' ')}
      >
        {label}
      </span>

      <span
        className={[
          'block min-h-[23px] leading-normal break-words',
          filled ? 'text-[15px]' : 'text-[13px] text-slate-400',
        ].join(' ')}
      >
        {filled ? (
          <>
            {readable(fieldKey, value as string, lang)}
            {live ? <span aria-hidden className="caret-blink" /> : null}
          </>
        ) : submitted ? (
          t.common.notProvided
        ) : (
          t.staff.waiting
        )}
      </span>
    </div>
  );
}
