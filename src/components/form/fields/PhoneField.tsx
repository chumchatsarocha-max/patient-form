'use client';

import type { FieldKey } from '@/types/patient';
import { FormField, controlClass } from '../FormField';
import { useField } from './useField';

/** inputMode="tel" brings up the numeric keypad but still allows + and spaces;
 *  the accepted format is enforced in the schema, not here. */
export function PhoneField({ name, required = false, className }: {
  name: FieldKey;
  required?: boolean;
  className?: string;
}) {
  const { register, label, error, t } = useField(name);

  return (
    <FormField label={label} required={required} error={error} className={className}>
      {({ id, describedBy, invalid }) => (
        <input
          {...register}
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={t.form.placeholder.phone}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={controlClass(invalid)}
        />
      )}
    </FormField>
  );
}
