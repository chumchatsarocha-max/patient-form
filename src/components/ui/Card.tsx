import type { ReactNode } from 'react';

/** components/ui must stay domain-agnostic (§4) — no patient/staff concepts in this file. */

interface CardProps {
  children: ReactNode;
  /** true = no padding, caller manages it (for cards with a full-bleed header/footer). */
  flush?: boolean;
  className?: string;
}

export function Card({ children, flush = false, className = '' }: CardProps) {
  return (
    <div
      className={[
        'rounded-2xl bg-card',
        'shadow-[0_24px_48px_-16px_rgba(12,74,110,0.28),0_4px_12px_-6px_rgba(12,74,110,0.12)]',
        flush ? 'overflow-hidden' : 'p-5 sm:p-8',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
