/** Inline SVG icons — components/ui must stay domain-agnostic (§4). Stroke, size 24, currentColor. */

type IconProps = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  // width/height attrs required: Safari sizes attribute-less inline SVGs differently and the
  // icon vanishes. Tailwind's size classes still win visually (CSS beats attribute).
  width: 24,
  height: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

export function PulseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 12h4l2.5-7 4 14 3-9 2 2h4.5" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3l7 3v5.5c0 4.3-2.9 8.2-7 9.5-4.1-1.3-7-5.2-7-9.5V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function ClipboardIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 4h6v3H9z" />
      <path d="M15 5.5h2.5A1.5 1.5 0 0 1 19 7v12a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V7a1.5 1.5 0 0 1 1.5-1.5H9" />
      <path d="M8.5 12h7M8.5 16h4.5" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </svg>
  );
}

export function MonitorIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="4" width="18" height="12.5" rx="1.75" />
      <path d="M9 20.5h6M12 16.5v4" />
      <path d="M7 10.5h2l1.5-3 2 6 1.5-3h2" />
    </svg>
  );
}
