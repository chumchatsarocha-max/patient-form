import type { SessionStatus } from '@/types/patient';

/** Background class for the small status dot shown on session cards and tabs. */
export const STATUS_DOT_CLASS: Record<SessionStatus, string> = {
  filling: 'bg-brand',
  submitted: 'bg-green-600',
  inactive: 'bg-line-strong',
  connected: 'bg-line-strong',
  disconnected: 'bg-line-strong',
};
