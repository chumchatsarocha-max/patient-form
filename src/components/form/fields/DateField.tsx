'use client';

import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import { useMemo, useRef, useState } from 'react';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker,
  DateSegment,
  Group,
  I18nProvider,
} from 'react-aria-components';
import { Controller, useFormContext } from 'react-hook-form';
import { CalendarIcon } from '@/components/ui/Icons';
import { MAX_AGE_YEARS } from '@/lib/validation/patientSchema';
import type { FieldKey, PatientForm } from '@/types/patient';
import { FormField, controlClass } from '../FormField';
import { CalendarSheet } from './CalendarSheet';
import { CELL, NAV, PICK, SEGMENT } from './dateFieldStyles';
import { toCalendarDate, toGregorian } from './dateFieldUtils';
import { useField } from './useField';

/**
 * Date-of-birth field on react-aria-components + @internationalized/date:
 * segmented DD/MM/YYYY input, an automatic Buddhist-era calendar for Thai
 * locale, and direct month/year dropdowns for jumping decades back. The
 * stored value is always ISO 'YYYY-MM-DD' in the Gregorian calendar (§3) —
 * only the display changes with locale.
 */
export function DateField({ name, required = false, className }: {
  name: FieldKey;
  required?: boolean;
  className?: string;
}) {
  const { label, error, lang, t } = useField(name);
  const { control, trigger } = useFormContext<PatientForm>();
  /** Month the calendar is showing — null means "follow the selected value (or today)". */
  const [focused, setFocused] = useState<CalendarDate | null>(null);
  /** Anchors the portaled calendar sheet's position to this field. */
  const anchorRef = useRef<HTMLDivElement>(null);

  /**
   * react-aria calls onFocusChange synchronously during Calendar's own
   * render, so setState here directly would trigger React's "update while
   * rendering a different component" error — deferred via queueMicrotask.
   * CalendarDate is a new object every call, so the update also compares
   * by value first, or the deferred setState would retrigger forever.
   */
  const handleFocusChange = (date: CalendarDate) => {
    const next = toGregorian(date);
    queueMicrotask(() => {
      setFocused((prev) => (prev && prev.compare(next) === 0 ? prev : next));
    });
  };

  const locale = lang === 'th' ? 'th-TH' : 'en-GB';
  const maxValue = today(getLocalTimeZone());

  const months = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' });
    // Month names map 1:1 between Buddhist and Gregorian calendars, so any reference year works.
    return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(Date.UTC(2024, i, 1))));
  }, [locale]);

  const years = useMemo(
    () => Array.from({ length: MAX_AGE_YEARS + 1 }, (_, i) => maxValue.year - i),
    [maxValue.year],
  );

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      className={className}
      labelsGroup
    >
      {({ labelId, describedBy, invalid }) => (
        <I18nProvider locale={locale}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => {
              const value = toCalendarDate(field.value);
              const view = focused ?? value ?? maxValue;

              /** Moves the open month without touching the user's selected value. */
              const moveTo = (year: number, month: number) => {
                const next = new CalendarDate(year, month, 1);
                setFocused(next.compare(maxValue) > 0 ? maxValue : next);
              };

              return (
                <DatePicker
                  value={value}
                  onChange={(date) => {
                    field.onChange(date ? toGregorian(date).toString() : '');
                    /**
                     * mode is 'onBlur', and picking a date never blurs this
                     * field, so without a manual trigger the stale error
                     * message would stay even after a valid pick.
                     */
                    void trigger(name);
                  }}
                  onBlur={field.onBlur}
                  maxValue={maxValue}
                  shouldForceLeadingZeros
                  aria-labelledby={labelId}
                  aria-describedby={describedBy}
                  isInvalid={invalid}
                  className="w-full"
                >
                  <Group
                    ref={anchorRef}
                    className={`${controlClass(invalid)} flex items-center justify-between gap-2`}
                  >
                    <DateInput className="flex flex-1 gap-0.5">
                      {(segment) => <DateSegment segment={segment} className={SEGMENT} />}
                    </DateInput>

                    <Button
                      data-datepicker-trigger
                      aria-label={t.form.openCalendar}
                      className="shrink-0 cursor-pointer rounded p-1 text-muted outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-brand/40 data-[hovered]:text-brand"
                    >
                      <CalendarIcon className="h-5 w-5" />
                    </Button>
                  </Group>

                  <CalendarSheet anchorRef={anchorRef}>
                    <Calendar focusedValue={view} onFocusChange={handleFocusChange}>
                      <header className="mb-2 flex items-center gap-1.5">
                        <Button slot="previous" className={NAV}>
                          <span aria-hidden>‹</span>
                        </Button>

                        <select
                          aria-label={t.form.month}
                          value={view.month}
                          onChange={(e) => moveTo(view.year, Number(e.target.value))}
                          className={`${PICK} flex-1`}
                        >
                          {months.map((monthName, i) => (
                            <option key={monthName} value={i + 1}>
                              {monthName}
                            </option>
                          ))}
                        </select>

                        <select
                          aria-label={t.form.year}
                          value={view.year}
                          onChange={(e) => moveTo(Number(e.target.value), view.month)}
                          className={PICK}
                        >
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {/* Thai reads Buddhist year, matching the segmented input's display. */}
                              {lang === 'th' ? year + 543 : year}
                            </option>
                          ))}
                        </select>

                        <Button slot="next" className={NAV}>
                          <span aria-hidden>›</span>
                        </Button>
                      </header>

                      <CalendarGrid className="border-separate border-spacing-0.5">
                        <CalendarGridHeader>
                          {(day) => (
                            <CalendarHeaderCell className="h-8 w-9 text-xs font-normal text-muted">
                              {day}
                            </CalendarHeaderCell>
                          )}
                        </CalendarGridHeader>
                        <CalendarGridBody>
                          {(date) => <CalendarCell date={date} className={CELL} />}
                        </CalendarGridBody>
                      </CalendarGrid>
                    </Calendar>
                  </CalendarSheet>
                </DatePicker>
              );
            }}
          />
        </I18nProvider>
      )}
    </FormField>
  );
}
