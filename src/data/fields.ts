/**
 * Field registry — the single source of truth for the form's shape and the staff mirror.
 *
 * Labels live here, not in the i18n dictionary, so a new field can't be added without its
 * Thai translation. Add a field here, in `types/patient.ts`, and in `patientSchema.ts`.
 */

import type { Lang } from '@/lib/i18n/dict';
import type { FieldKey } from '@/types/patient';
import { GENDERS } from './genders';
import { LANGUAGES, type Option } from './languages';
import { NATIONALITIES } from './nationalities';
import { RELATIONSHIPS } from './relationships';

/** 1 = Personal, 2 = Contact, 3 = Review */
export type StepNumber = 1 | 2 | 3;

export interface FieldMeta {
  key: FieldKey;
  label: string;
  labelTh: string;
  step: 1 | 2;
  required: boolean;
  /** Drives masking of contact info in summary/staff views. */
  sensitive?: 'phone' | 'email';
}

export interface FieldGroup {
  title: string;
  titleTh: string;
  note?: string;
  noteTh?: string;
  step: 1 | 2;
  fields: readonly FieldMeta[];
}

export const FIELD_GROUPS: readonly FieldGroup[] = [
  {
    title: 'Personal information',
    titleTh: 'ข้อมูลส่วนตัว',
    step: 1,
    fields: [
      { key: 'firstName', label: 'First name', labelTh: 'ชื่อจริง', step: 1, required: true },
      { key: 'middleName', label: 'Middle name', labelTh: 'ชื่อกลาง', step: 1, required: false },
      { key: 'lastName', label: 'Last name', labelTh: 'นามสกุล', step: 1, required: true },
      { key: 'dateOfBirth', label: 'Date of birth', labelTh: 'วันเกิด', step: 1, required: true },
      { key: 'gender', label: 'Gender', labelTh: 'เพศ', step: 1, required: true },
      { key: 'nationality', label: 'Nationality', labelTh: 'สัญชาติ', step: 1, required: true },
    ],
  },
  {
    title: 'Contact and preferences',
    titleTh: 'ข้อมูลติดต่อและความต้องการ',
    step: 2,
    fields: [
      {
        key: 'phone',
        label: 'Phone number',
        labelTh: 'เบอร์โทรศัพท์',
        step: 2,
        required: true,
        sensitive: 'phone',
      },
      {
        key: 'email',
        label: 'E-mail address',
        labelTh: 'อีเมล',
        step: 2,
        required: true,
        sensitive: 'email',
      },
      { key: 'address', label: 'Address', labelTh: 'ที่อยู่', step: 2, required: true },
      {
        key: 'preferredLanguage',
        label: 'Preferred language',
        labelTh: 'ภาษาที่สะดวกสื่อสาร',
        step: 2,
        required: true,
      },
      { key: 'religion', label: 'Religion', labelTh: 'ศาสนา', step: 2, required: false },
    ],
  },
  {
    title: 'Emergency contact',
    titleTh: 'ผู้ติดต่อกรณีฉุกเฉิน',
    note: ' — optional, but fill all three if you fill one',
    noteTh: ' — ไม่บังคับ แต่ถ้ากรอกช่องหนึ่งแล้วต้องกรอกให้ครบทั้งสามช่อง',
    step: 2,
    fields: [
      { key: 'emergencyContactName', label: 'Name', labelTh: 'ชื่อ', step: 2, required: false },
      {
        key: 'emergencyContactPhone',
        label: 'Phone number',
        labelTh: 'เบอร์โทรศัพท์',
        step: 2,
        required: false,
        sensitive: 'phone',
      },
      {
        key: 'emergencyContactRelationship',
        label: 'Relationship',
        labelTh: 'ความสัมพันธ์',
        step: 2,
        required: false,
      },
    ],
  },
];

export const FIELDS: readonly FieldMeta[] = FIELD_GROUPS.flatMap((g) => g.fields);

export const FIELD_ORDER: readonly FieldKey[] = FIELDS.map((f) => f.key);

export const REQUIRED_FIELDS: readonly FieldKey[] = FIELDS.filter((f) => f.required).map(
  (f) => f.key,
);

/** Fields that must pass validation before advancing to the next step. */
export const STEP_FIELDS: Record<1 | 2, readonly FieldKey[]> = {
  1: FIELDS.filter((f) => f.step === 1).map((f) => f.key),
  2: FIELDS.filter((f) => f.step === 2).map((f) => f.key),
};

export function labelIn(item: { label: string; labelTh: string }, lang: Lang): string {
  return lang === 'th' ? item.labelTh : item.label;
}

export function groupTitleIn(group: FieldGroup, lang: Lang): string {
  return lang === 'th' ? group.titleTh : group.title;
}

export function groupNoteIn(group: FieldGroup, lang: Lang): string | undefined {
  return lang === 'th' ? group.noteTh : group.note;
}

const FIELD_BY_KEY = new Map(FIELDS.map((f) => [f.key, f]));

export function labelOf(key: FieldKey, lang: Lang): string {
  const field = FIELD_BY_KEY.get(key);
  return field ? labelIn(field, lang) : key;
}

export function stepOfField(key: FieldKey | null): 1 | 2 | null {
  if (!key) return null;
  return FIELDS.find((f) => f.key === key)?.step ?? null;
}

export const TOTAL_STEPS = 3;

/** value → label map for select fields, so raw codes (e.g. 'TH') never show in the UI. */
const OPTION_SETS: Partial<Record<FieldKey, readonly Option[]>> = {
  gender: GENDERS,
  nationality: NATIONALITIES,
  preferredLanguage: LANGUAGES,
  emergencyContactRelationship: RELATIONSHIPS,
};

export function optionsFor(key: FieldKey): readonly Option[] | undefined {
  return OPTION_SETS[key];
}

/** Converts a stored value to its display label; non-select fields return the value unchanged. */
export function optionLabelOf(key: FieldKey, value: string, lang: Lang): string {
  const set = OPTION_SETS[key];
  if (!set) return value;
  const found = set.find((o) => o.value === value);
  return found ? labelIn(found, lang) : value;
}
