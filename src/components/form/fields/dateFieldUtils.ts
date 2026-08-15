import {
  CalendarDate,
  GregorianCalendar,
  parseDate,
  toCalendar,
} from '@internationalized/date';

/**
 * react-aria returns dates in the locale's calendar (Buddhist era for
 * th-TH), but stored values and dropdown years are always Gregorian.
 */
export const toGregorian = (date: CalendarDate) => toCalendar(date, new GregorianCalendar());

/** Form value can be empty or malformed; a bad string must not throw and crash the page. */
export function toCalendarDate(value: string | undefined): CalendarDate | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  try {
    return parseDate(value);
  } catch {
    return null;
  }
}
