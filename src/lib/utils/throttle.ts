/** Trailing throttle: fires at most once per waitMs, at the window's end, with the latest args. */
export interface Throttled<Args extends unknown[]> {
  (...args: Args): void;
  /** Discards any pending call — use on unmount to avoid firing after unmount. */
  cancel(): void;
  /** Fires any pending call immediately — use on submit so the last edit isn't dropped. */
  flush(): void;
}

export function trailingThrottle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  waitMs: number,
): Throttled<Args> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: Args | null = null;

  const run = () => {
    timer = null;
    const args = pending;
    pending = null;
    if (args) fn(...args);
  };

  const throttled = (...args: Args) => {
    pending = args;
    if (timer !== null) return;
    timer = setTimeout(run, waitMs);
  };

  throttled.cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    pending = null;
  };

  throttled.flush = () => {
    if (timer !== null) {
      clearTimeout(timer);
      run();
    }
  };

  return throttled;
}
