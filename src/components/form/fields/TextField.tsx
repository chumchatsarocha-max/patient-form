'use client';

import type { HTMLInputTypeAttribute } from 'react';
import type { FieldKey } from '@/types/patient';
import { FormField, controlClass } from '../FormField';
import { useField } from './useField';

interface TextFieldProps {
  name: FieldKey;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  inputMode?: 'text' | 'tel' | 'email';
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}

export function TextField({
  name,
  required = false,
  type = 'text',
  inputMode,
  autoComplete,
  placeholder,
  className,
}: TextFieldProps) {
  const { register, label, error } = useField(name);

  return (
    <FormField label={label} required={required} error={error} className={className}>
      {({ id, describedBy, invalid }) => (
        <input
          {...register}
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={controlClass(invalid)}
        />
      )}
    </FormField>
  );
}
