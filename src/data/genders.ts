/** Single source of truth for the gender <select> and the patientSchema enum. */
import type { Option } from './languages';

/** Literal tuple (not a plain array) so z.enum can narrow the type. */
export const GENDER_VALUES = ['male', 'female', 'other', 'prefer_not_to_say'] as const;

export const GENDERS = [
  { value: 'male', label: 'Male', labelTh: 'ชาย' },
  { value: 'female', label: 'Female', labelTh: 'หญิง' },
  { value: 'other', label: 'Other', labelTh: 'อื่น ๆ' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say', labelTh: 'ไม่ระบุ' },
] as const satisfies readonly Option[];
