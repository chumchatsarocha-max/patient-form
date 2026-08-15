'use client';

import { TOTAL_STEPS, type StepNumber } from '@/data/fields';
import { useLang } from '@/lib/i18n/context';

interface StepperProps {
  current: StepNumber;
}

/**
 * Mobile collapses non-current steps to just their number: equal-width
 * thirds truncate long Thai step labels mid-word, and the percentage fill
 * bar can't work with unequal columns, so the active step is highlighted
 * directly instead.
 */
export function Stepper({ current }: StepperProps) {
  const { t } = useLang();

  const steps: { n: StepNumber; label: string }[] = [
    { n: 1, label: t.form.steps.personal },
    { n: 2, label: t.form.steps.contact },
    { n: 3, label: t.form.steps.review },
  ];

  return (
    <nav
      aria-label={t.form.progressLabel}
      className="relative mb-7 flex gap-1 overflow-hidden rounded-full border border-sky-100 bg-track p-[5px] min-[600px]:grid min-[600px]:grid-cols-3 min-[600px]:gap-0"
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 hidden rounded-full bg-fill transition-[width] duration-350 ease-out min-[600px]:block"
        style={{ width: `${(current / TOTAL_STEPS) * 100}%` }}
      />

      {steps.map(({ n, label }) => {
        const done = n < current;
        const active = n === current;

        return (
          <div
            key={n}
            aria-current={active ? 'step' : undefined}
            className={[
              'relative z-[1] flex min-w-0 items-center justify-center gap-2 rounded-full px-1.5 py-[9px]',
              active ? 'flex-1' : 'shrink-0',
              active ? 'bg-fill min-[600px]:bg-transparent' : '',
            ].join(' ')}
          >
            <span
              className={[
                'flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-xs',
                done || active
                  ? 'bg-white font-semibold text-brand'
                  : 'bg-line-strong text-white',
              ].join(' ')}
            >
              {done ? '✓' : n}
            </span>
            <span
              className={[
                'text-[13px]',
                done || active ? 'text-deep' : 'text-muted',
                active ? 'font-semibold' : '',
                active ? 'inline' : 'hidden min-[600px]:inline min-[600px]:truncate',
              ].join(' ')}
            >
              {label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
