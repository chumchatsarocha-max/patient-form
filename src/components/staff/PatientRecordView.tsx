'use client';

import {
  FIELD_GROUPS,
  REQUIRED_FIELDS,
  TOTAL_STEPS,
  groupNoteIn,
  groupTitleIn,
  labelIn,
  stepOfField,
} from '@/data/fields';
import { useStaffChannel } from '@/hooks/useStaffChannel';
import { useLang } from '@/lib/i18n/context';
import { formatElapsed, shortSessionCode } from '@/lib/utils/format';
import { ActivityTrace } from './ActivityTrace';
import { FieldRow } from './FieldRow';
import { StatusPill } from './StatusPill';

interface PatientRecordViewProps {
  sessionId: string;
}

/** Read-only live mirror of the patient form. */
export function PatientRecordView({ sessionId }: PatientRecordViewProps) {
  const session = useStaffChannel(sessionId);
  const { lang, t } = useLang();
  const { data, status, activeField, lastChangedField, idleFor, submitted } = session;

  const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');
  const initials =
    ((data.firstName?.[0] ?? '') + (data.lastName?.[0] ?? '')).toUpperCase() || '?';

  const filledRequired = REQUIRED_FIELDS.filter((key) => data[key]).length;
  const percent = Math.round((filledRequired / REQUIRED_FIELDS.length) * 100);

  // Step is inferred from the last-touched field (§7) so presence doesn't need its own step key.
  const currentStep = submitted ? TOTAL_STEPS : (stepOfField(activeField ?? lastChangedField) ?? 1);

  const stepText = submitted
    ? t.staff.stepDone(TOTAL_STEPS)
    : status === 'inactive' || status === 'disconnected'
      ? t.staff.stepStopped(currentStep, TOTAL_STEPS)
      : t.staff.stepOn(currentStep, TOTAL_STEPS);

  return (
    <>
      <header className="border-b border-line bg-gradient-to-b from-sky-50 to-white px-4 pt-5 pb-5 sm:px-6">
        <div className="mb-4 flex items-center gap-3 sm:gap-3.5">
          <div
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-600 to-brand-dark text-base font-bold tracking-wide text-white shadow-[0_6px_14px_-6px_rgba(7,89,133,0.7)] sm:h-13 sm:w-13 sm:text-[19px]"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="mb-0.5 font-display text-[19px] leading-tight font-bold sm:text-[22px]">
              {fullName || t.staff.unnamed}
            </h2>
            <span className="font-mono text-xs text-muted">
              {shortSessionCode(sessionId)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <StatusPill status={status} activeField={activeField} idleFor={idleFor} />
          <span className="inline-flex items-center rounded-full border border-sky-100 bg-track px-3.5 py-1.5 text-[13px] text-deep">
            {stepText}
          </span>
        </div>

        <div className="mt-3 border-t border-sky-100/70 pt-2.5">
          <ActivityTrace
            trace={session.trace}
            activeField={activeField}
            isTyping={session.isTyping}
          />
        </div>
      </header>

      <div className="bg-[#FBFDFF] px-4 pt-5 pb-6 sm:px-6">
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-sky-100"
            role="progressbar"
            aria-valuenow={filledRequired}
            aria-valuemin={0}
            aria-valuemax={REQUIRED_FIELDS.length}
            aria-label={t.staff.requiredProgress}
          >
            <span
              className="block h-full rounded-full bg-brand transition-[width] duration-450 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs whitespace-nowrap text-muted">
            {t.staff.requiredCount(filledRequired, REQUIRED_FIELDS.length)}
          </span>
        </div>

        {FIELD_GROUPS.map((group) => {
          const isCurrent = status === 'filling' && group.step === currentStep;
          const note = groupNoteIn(group, lang);

          return (
            <section
              key={group.title}
              className={[
                'mb-4 rounded-2xl border px-4 pt-2 pb-3 shadow-[0_1px_2px_rgba(12,74,110,0.05),0_10px_24px_-20px_rgba(12,74,110,0.5)] transition-colors sm:px-4.5',
                isCurrent ? 'border-sky-200 bg-[#F4FBFF]' : 'border-line bg-white',
              ].join(' ')}
            >
              <h3
                className={[
                  'mt-3.5 mb-1.5 pl-0.5 text-[13px] font-semibold',
                  isCurrent ? 'text-brand' : 'text-muted',
                ].join(' ')}
              >
                {groupTitleIn(group, lang)}
                {note ? <span className="font-normal">{note}</span> : null}
              </h3>

              <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                {group.fields.map((field) => (
                  <FieldRow
                    key={field.key}
                    fieldKey={field.key}
                    label={labelIn(field, lang)}
                    value={data[field.key]}
                    live={status === 'filling' && activeField === field.key}
                    submitted={submitted}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="flex flex-wrap items-center justify-center gap-3 border-t border-line bg-white px-4 py-4 text-[13px] text-muted sm:justify-between sm:px-6">
        <span>{t.staff.lastUpdate(formatElapsed(idleFor, lang))}</span>
        <span>
          {session.connected ? t.staff.live : t.staff.reconnecting}
          {session.error ? ` · ${session.error}` : ''}
        </span>
      </footer>
    </>
  );
}
