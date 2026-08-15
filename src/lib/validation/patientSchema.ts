import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';
import { GENDER_VALUES } from '@/data/genders';
import { LANGUAGES } from '@/data/languages';
import { NATIONALITIES } from '@/data/nationalities';
import { RELATIONSHIPS } from '@/data/relationships';
import { DICT, type Lang } from '@/lib/i18n/dict';
import type { PatientForm } from '@/types/patient';

// zod v4 API (v4.4.3) — z.email()/z.iso.date() are top-level; superRefine issues use code: 'custom'.
// Error messages must say how to fix the problem, not just that it's wrong.

const LANGUAGE_SET: readonly string[] = LANGUAGES.map((o) => o.value);
const NATIONALITY_SET: readonly string[] = NATIONALITIES.map((o) => o.value);
const RELATIONSHIP_SET: readonly string[] = RELATIONSHIPS.map((o) => o.value);

/** Accepts Thai national format or E.164 (+countrycode) — not a universal validator. */
const DEFAULT_PHONE_COUNTRY = 'TH' as const;

export function isSupportedPhone(raw: string): boolean {
  const value = raw.replace(/[\s().-]/g, '');
  if (!value) return false;
  // Leading + lets the lib infer the country; otherwise assume Thai.
  return value.startsWith('+')
    ? isValidPhoneNumber(value)
    : isValidPhoneNumber(value, DEFAULT_PHONE_COUNTRY);
}

/** Also used by the calendar's year picker so its range can't exceed what validation accepts. */
export const MAX_AGE_YEARS = 120;

// Factory per language — validation rules are identical, only the error copy changes.
export function makePatientSchema(lang: Lang) {
  const { error: e, errorLabel } = DICT[lang];

  // '' → undefined so "typed then cleared" doesn't get stuck against a required-field rule.
  const optionalText = (max: number, label: string) =>
    z
      .string()
      .trim()
      .max(max, { error: e.tooLong(max, label) })
      .optional()
      .transform((v) => (v === '' ? undefined : v));

  const nameField = (label: string, max = 50) =>
    z
      .string()
      .trim()
      .min(1, { error: e.required(label) })
      .max(max, { error: e.tooLongOwn(max, label) })
      .refine((v) => !/^\d+$/.test(v), { error: e.onlyNumbers(label) });

  return z
    .object({
      firstName: nameField(errorLabel.firstName),

      middleName: optionalText(50, errorLabel.middleName),

      lastName: nameField(errorLabel.lastName),

      dateOfBirth: z.iso
        .date({ error: e.dobFormat })
        .refine((v) => new Date(`${v}T00:00:00Z`) <= new Date(), {
          error: e.dobFuture,
        })
        .refine(
          (v) => {
            const oldest = new Date();
            oldest.setUTCFullYear(oldest.getUTCFullYear() - MAX_AGE_YEARS);
            return new Date(`${v}T00:00:00Z`) >= oldest;
          },
          { error: e.dobTooOld(MAX_AGE_YEARS) },
        ),

      // Input is '' | Gender (native <select> needs an empty placeholder option); .pipe()
      // narrows the output to Gender so z.input<> matches PatientForm and zodResolver needs no cast.
      gender: z
        .union([z.literal(''), z.enum(GENDER_VALUES)])
        .pipe(z.enum(GENDER_VALUES, { error: e.gender })),

      phone: z
        .string()
        .trim()
        .min(1, { error: e.phoneRequired })
        .refine(isSupportedPhone, { error: e.phoneFormat }),

      email: z
        .string()
        .trim()
        .min(1, { error: e.emailRequired })
        .pipe(z.email({ error: e.emailFormat })),

      address: z
        .string()
        .trim()
        .min(5, { error: e.addressShort })
        .max(200, { error: e.addressLong(200) }),

      preferredLanguage: z
        .string()
        .refine((v) => LANGUAGE_SET.includes(v), { error: e.language }),

      nationality: z
        .string()
        .refine((v) => NATIONALITY_SET.includes(v), { error: e.nationality }),

      emergencyContactName: optionalText(100, errorLabel.emergencyContactName),

      emergencyContactPhone: z
        .string()
        .trim()
        .optional()
        .transform((v) => (v === '' ? undefined : v))
        .refine((v) => v === undefined || isSupportedPhone(v), {
          error: e.phoneFormat,
        }),

      emergencyContactRelationship: z
        .string()
        .trim()
        .optional()
        .transform((v) => (v === '' ? undefined : v))
        .refine((v) => v === undefined || RELATIONSHIP_SET.includes(v), {
          error: e.relationship,
        }),

      religion: optionalText(50, errorLabel.religion),
    })
    // Filling any one emergency-contact field makes the other two required too —
    // a contact with no phone number is useless in an actual emergency.
    .superRefine((values, ctx) => {
      const {
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelationship,
      } = values;

      const started = Boolean(
        emergencyContactName || emergencyContactPhone || emergencyContactRelationship,
      );
      if (!started) return;

      if (!emergencyContactName) {
        ctx.addIssue({
          code: 'custom',
          path: ['emergencyContactName'],
          message: e.needContactName,
        });
      }

      if (!emergencyContactPhone) {
        ctx.addIssue({
          code: 'custom',
          path: ['emergencyContactPhone'],
          message: e.needContactPhone,
        });
      }

      if (!emergencyContactRelationship) {
        ctx.addIssue({
          code: 'custom',
          path: ['emergencyContactRelationship'],
          message: e.needRelationship,
        });
      }
    });
}

/** Rules are identical across languages — only the copy in makePatientSchema differs. */
export type PatientSchema = ReturnType<typeof makePatientSchema>;

/** Validated shape — gender is narrowed from PatientForm because '' has been stripped. */
export type PatientFormValues = z.infer<PatientSchema>;

/** All-string defaults for react-hook-form — avoids React's uncontrolled-to-controlled warning. */
export const emptyPatientForm: PatientForm = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  preferredLanguage: '',
  nationality: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  religion: '',
};
