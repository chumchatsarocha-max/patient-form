'use client';

import type { ReactNode } from 'react';

/**
 * Sticky to the viewport bottom on mobile (thumb reach), static at ≥640px.
 * `-mx-5` bleeds it to the full card width (card has p-5 on mobile) so the
 * opaque background actually covers content scrolling behind it.
 */
export function SubmitBar({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        'sticky bottom-0 z-10 -mx-5 mt-2 flex items-center gap-3 border-t border-line',
        'bg-card/95 px-5 py-3 backdrop-blur-sm',
        'sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pt-2 sm:backdrop-blur-none',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
