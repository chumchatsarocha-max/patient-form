import { DICT, type Lang } from '@/lib/i18n/dict';

// lang-aware because EN/TH time and month strings differ — actual copy lives in DICT.

/** Coarse units are intentional — a per-second counter isn't readable from across a desk. */
export function formatElapsed(ms: number | null, lang: Lang): string {
  const t = DICT[lang].time;
  if (ms === null) return t.none;
  if (ms < 2_000) return t.justNow;

  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return t.seconds(seconds);

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return t.minutes(minutes);

  const hours = Math.floor(minutes / 60);
  return t.hours(hours);
}

/** Like formatElapsed, without the trailing "ago" — for sentences already in past tense. */
export function formatElapsedBare(ms: number | null, lang: Lang): string {
  return DICT[lang].time.barePlain(formatElapsed(ms, lang));
}

/** Returns full years of age, or null if isoDate can't be parsed. */
export function calculateAge(isoDate: string, now = new Date()): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;

  const birth = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(birth.getTime())) return null;

  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - birth.getUTCMonth();
  const dayDiff = now.getUTCDate() - birth.getUTCDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age -= 1;

  return age >= 0 ? age : null;
}

// Not toLocaleDateString — server/browser locale can differ and would cause hydration mismatches.
// th shows Buddhist Era (year + 543) for display only; the stored value stays Gregorian ISO.
const BUDDHIST_OFFSET = 543;

export function formatIsoDate(isoDate: string, lang: Lang): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
  const [year, month, day] = isoDate.split('-');
  const shownYear = lang === 'th' ? Number(year) + BUDDHIST_OFFSET : year;
  return `${Number(day)} ${DICT[lang].months[Number(month) - 1]} ${shownYear}`;
}

/** Deterministic hash (FNV-1a), not sequential — staff don't share ordering. Display-only. */
export function shortSessionCode(sessionId: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < sessionId.length; i += 1) {
    hash ^= sessionId.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `A${String(((hash >>> 0) % 999) + 1).padStart(3, '0')}`;
}

/** Empty values render as "—", not blank — staff must be able to tell "not filled" from empty. */
export function displayValue(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : '—';
}
