/** Canonical patient intake shape — shared by the form, realtime contract, and staff view. */

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface PatientForm {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string; // ISO 'YYYY-MM-DD'
  gender: Gender | '';
  phone: string;
  email: string;
  address: string;
  preferredLanguage: string;
  nationality: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  religion?: string;
}

export type FieldKey = keyof PatientForm;

export type SessionStatus =
  | 'connected' // on the form page, hasn't typed yet
  | 'filling' // input within ACTIVE_WINDOW_MS
  | 'inactive' // no input for longer than INACTIVE_AFTER_MS
  | 'submitted'
  | 'disconnected';
