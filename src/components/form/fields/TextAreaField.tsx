'use client';

import type { FieldKey } from '@/types/patient';
import { FormField, controlClass } from '../FormField';
import { useField } from './useField';

export function TextAreaField({ name, required = false, placeholder, className }: {
  name: FieldKey;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const { register, label, error } = useField(name);

  return (
    <FormField label={label} required={required} error={error} className={className}>
      {({ id, describedBy, invalid }) => (
        <textarea
          {...register}
          id={id}
          rows={3}
          placeholder={placeholder}
          autoComplete="street-address"
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={controlClass(invalid, 'min-h-[76px] resize-y')}
        />
      )}
    </FormField>
  );
}
