'use client';

import { labelIn } from '@/data/fields';
import type { Option } from '@/data/languages';
import type { FieldKey } from '@/types/patient';
import { FormField, controlClass } from '../FormField';
import { useField } from './useField';

/** Native <select> on purpose: a11y and keyboard nav come free, and mobile gets the OS picker. */
export function SelectField({ name, options, required = false, placeholder, className }: {
  name: FieldKey;
  options: readonly Option[];
  required?: boolean;
  /** Omitted = falls back to the current language's default select placeholder. */
  placeholder?: string;
  className?: string;
}) {
  const { register, label, error, lang, t } = useField(name);

  return (
    <FormField label={label} required={required} error={error} className={className}>
      {({ id, describedBy, invalid }) => (
        <select
          {...register}
          id={id}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={controlClass(invalid, 'appearance-none bg-white')}
        >
          {/* No defaultValue here: the empty default is owned solely by emptyPatientForm,
              so optional fields can always be reselected back to blank. */}
          <option value="" disabled={required}>
            {placeholder ?? t.form.placeholder.select}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {labelIn(o, lang)}
            </option>
          ))}
        </select>
      )}
    </FormField>
  );
}
