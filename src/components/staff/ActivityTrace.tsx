'use client';

import { labelOf } from '@/data/fields';
import { useLang } from '@/lib/i18n/context';
import type { FieldKey } from '@/types/patient';

/** Signature element (PROJECT_SPEC.md §8): last-touched fields, pulsing while the patient types. */

interface ActivityTraceProps {
  /** Field-touch order, newest last. */
  trace: FieldKey[];
  activeField: FieldKey | null;
  isTyping: boolean;
}

export function ActivityTrace({ trace, activeField, isTyping }: ActivityTraceProps) {
  const { lang, t } = useLang();

  // Google Sans Code is Latin-only; forcing it on Thai falls back to a mismatched system font.
  const face = lang === 'th' ? '' : 'font-mono';

  if (trace.length === 0) {
    return (
      <p className={`${face} text-[11px] text-muted`} aria-live="off">
        {t.staff.traceIdle}
      </p>
    );
  }

  const current = activeField ?? trace[trace.length - 1];

  return (
    <div
      className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] ${face}`}
      // Per-field values are noisy for screen readers; StatusPill already exposes the summary.
      aria-hidden
    >
      {trace.map((field, i) => {
        const isLast = i === trace.length - 1;
        return (
          <span key={`${field}-${i}`} className="flex items-center gap-1.5">
            <span className={isLast ? 'text-deep' : 'text-muted/70'}>
              {labelOf(field, lang)}
            </span>
            {!isLast ? <span className="text-line-strong">›</span> : null}
          </span>
        );
      })}

      <span className="flex items-center gap-1.5 text-brand">
        <span className="text-line-strong">›</span>
        <span className={isTyping ? 'trace-beat' : 'opacity-40'}>●</span>
        {activeField ? <span className="text-brand">{labelOf(current, lang)}</span> : null}
      </span>
    </div>
  );
}
