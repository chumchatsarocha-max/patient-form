import type { ReactNode } from 'react';

/** components/ui must stay domain-agnostic (§4) — this takes only tone and content. */

type Tone = 'note' | 'warning';

const TONE: Record<Tone, string> = {
  note: 'bg-white/85 border-line text-muted',
  warning: 'bg-amber-bg border-amber-fg/25 text-amber-fg',
};

interface BannerProps {
  tone?: Tone;
  /** Always text — tone (color) alone must not convey meaning (§8 a11y). */
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Banner({ tone = 'note', title, children, className = '' }: BannerProps) {
  return (
    <aside
      className={`rounded-xl border px-4 py-3 text-[13px] leading-relaxed backdrop-blur-sm ${TONE[tone]} ${className}`}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? 'mt-1' : ''}>{children}</div>
    </aside>
  );
}
