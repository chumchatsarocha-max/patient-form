export const SEGMENT =
  'rounded px-0.5 tabular-nums outline-none data-[focused]:bg-brand data-[focused]:text-white data-[placeholder]:text-slate-400';

export const CELL =
  'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-sm outline-none ' +
  'data-[hovered]:bg-track data-[selected]:bg-brand data-[selected]:font-semibold data-[selected]:text-white ' +
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-brand/40 ' +
  'data-[disabled]:cursor-not-allowed data-[disabled]:text-slate-300 data-[unavailable]:text-slate-300';

export const NAV =
  'flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line text-muted ' +
  'outline-none data-[hovered]:bg-track data-[hovered]:text-ink data-[focus-visible]:ring-2 data-[focus-visible]:ring-brand/40 ' +
  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40';

/**
 * Native <select> for the month/year dropdown, on purpose (mobile gets the OS picker).
 * appearance-none is load-bearing on Safari, which otherwise draws full native
 * chrome and breaks the calendar header layout — every other select in the
 * form already has it.
 */
export const PICK =
  'min-w-0 cursor-pointer appearance-none rounded-lg border border-line bg-card px-2 py-1.5 ' +
  'text-center text-sm font-semibold text-ink focus:border-brand focus:outline-none';
