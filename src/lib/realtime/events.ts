import type { FieldKey, PatientForm, SessionStatus } from '@/types/patient';

// Source of truth for event names and payloads — must not import any provider SDK (keeps transport swappable).

export const sessionTopic = (sessionId: string) => `intake:${sessionId}`;

export const LOBBY_TOPIC = 'intake:lobby';

export const EVENTS = {
  FIELD_CHANGE: 'field:change',
  FORM_SUBMIT: 'form:submit',
  FORM_RESET: 'form:reset',
  STATE_REQUEST: 'state:request', // staff requests a snapshot after joining late
  STATE_SYNC: 'state:sync', // patient replies with the full form state
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

export type ChannelRole = 'patient' | 'staff';

export interface FieldChangePayload {
  field: FieldKey;
  value: string;
  at: number;
}

export interface StateSyncPayload {
  data: PatientForm;
  status: SessionStatus;
  at: number;
}

export interface PresenceState {
  role: ChannelRole;
  status: SessionStatus;
  activeField: FieldKey | null;
  lastActivityAt: number;
}

/** Only currently-open sessions — closing the tab removes the entry; no history is kept. */
export interface LobbyEntry {
  sessionId: string;
  /** Blank until the patient fills a name. Lobby omits phone/email on purpose — no contact info to leak. */
  displayName: string;
  status: SessionStatus;
  startedAt: number;
  lastActivityAt: number;
}
