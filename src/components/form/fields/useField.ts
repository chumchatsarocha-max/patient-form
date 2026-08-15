'use client';

import { useFormContext } from 'react-hook-form';
import { labelOf } from '@/data/fields';
import { useLang } from '@/lib/i18n/context';
import type { FieldKey, PatientForm } from '@/types/patient';

/**
 * Sole wiring point between field components and react-hook-form, so no
 * field component needs to import useFormContext directly.
 */
export function useField(name: FieldKey) {
  const { register, formState } = useFormContext<PatientForm>();
  const { lang, t } = useLang();
  const error = formState.errors[name]?.message;

  return {
    register: register(name),
    label: labelOf(name, lang),
    error: typeof error === 'string' ? error : undefined,
    lang,
    t,
  };
}
