'use client';

import { useId, type ReactNode } from 'react';

interface RenderProps {
  id: string;
  /** Label's own id, for controls wired via aria-labelledby instead of htmlFor. */
  labelId: string;
  describedBy: string | undefined;
  invalid: boolean;
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  /**
   * True when the control has no single element for htmlFor to target (e.g. a
   * grouped date picker) — renders a <span id={labelId}> instead, and the
   * caller must wire aria-labelledby={labelId} on the control itself.
   */
  labelsGroup?: boolean;
  children: (props: RenderProps) => ReactNode;
}

/**
 * Sole owner of label/error/aria wiring for form fields — don't duplicate
 * this wiring elsewhere. a11y floor: every control gets a real <label
 * htmlFor>, aria-invalid + aria-describedby on error, and role="alert" text.
 */
export function FormField({
  label,
  required = false,
  error,
  hint,
  className = '',
  labelsGroup = false,
  children,
}: FormFieldProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const invalid = Boolean(error);

  const labelClass = [
    'absolute -top-2 left-3 z-[1] bg-card px-1.5 text-xs',
    invalid ? 'text-danger' : 'text-muted',
  ].join(' ');
  const labelText = `${label}${required ? ' *' : ''}`;

  return (
    <div className={`relative mb-[18px] ${className}`}>
      {labelsGroup ? (
        <span id={labelId} className={labelClass}>
          {labelText}
        </span>
      ) : (
        <label id={labelId} htmlFor={id} className={labelClass}>
          {labelText}
        </label>
      )}

      {children({ id, labelId, describedBy, invalid })}

      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Shared control styling — height clears the project's ≥44px touch-target floor. */
export function controlClass(invalid: boolean, extra = ''): string {
  return [
    'w-full rounded-lg border bg-transparent px-3 py-3.5 text-[15px] text-ink',
    'placeholder:text-slate-400 focus:outline-none',
    invalid
      ? 'border-danger'
      : 'border-line-strong focus:border-brand focus:shadow-[0_0_0_3px_rgba(3,105,161,0.14)]',
    extra,
  ].join(' ');
}
