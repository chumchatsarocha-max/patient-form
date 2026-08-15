'use client';

import {
  FIELD_GROUPS,
  groupNoteIn,
  groupTitleIn,
  labelIn,
  optionLabelOf,
  type StepNumber,
} from '@/data/fields';
import { useLang } from '@/lib/i18n/context';
import type { Lang } from '@/lib/i18n/dict';
import { formatIsoDate } from '@/lib/utils/format';
import type { PatientForm } from '@/types/patient';

/** Raw value to human text — e.g. option codes to their localized label, ISO date to '1 May 1990'. */
function readable(key: keyof PatientForm, raw: string, lang: Lang): string {
  if (!raw) return '';
  if (key === 'dateOfBirth') return formatIsoDate(raw, lang);
  return optionLabelOf(key, raw, lang);
}

interface ReviewListProps {
  values: PatientForm;
  onEdit: (step: StepNumber) => void;
}

/** Pre-submit review, grouped into blocks, each with an Edit-back button. */
export function ReviewList({ values, onEdit }: ReviewListProps) {
  const { lang, t } = useLang();

  return (
    <>
      {FIELD_GROUPS.map((group) => (
        <div key={group.title} className="mb-3 rounded-lg border border-line p-4">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <strong className="text-sm">
              {groupTitleIn(group, lang)}
              {groupNoteIn(group, lang) ? (
                <span className="font-normal text-muted">{groupNoteIn(group, lang)}</span>
              ) : null}
            </strong>
            <button
              type="button"
              onClick={() => onEdit(group.step)}
              className="shrink-0 cursor-pointer border-none bg-transparent p-0 text-[13px] text-brand underline"
            >
              {t.form.edit}
            </button>
          </div>

          <dl className="grid grid-cols-1 gap-y-0.5 text-sm sm:grid-cols-[minmax(0,160px)_minmax(0,1fr)] sm:gap-y-2">
            {group.fields.map((field) => {
              const shown = readable(field.key, values[field.key] ?? '', lang);
              return (
                <div key={field.key} className="contents">
                  <dt className="mt-2 text-muted sm:mt-0">{labelIn(field, lang)}</dt>
                  <dd className={`m-0 break-words ${shown ? '' : 'text-slate-400'}`}>
                    {shown || t.common.notProvided}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ))}
    </>
  );
}
