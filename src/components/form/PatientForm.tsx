'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { STEP_FIELDS, type StepNumber } from '@/data/fields';
import { GENDERS } from '@/data/genders';
import { LANGUAGES } from '@/data/languages';
import { NATIONALITIES } from '@/data/nationalities';
import { RELATIONSHIPS } from '@/data/relationships';
import { useLobbyAnnounce } from '@/hooks/useLobby';
import { usePatientChannel } from '@/hooks/usePatientChannel';
import { useLang } from '@/lib/i18n/context';
import {
  emptyPatientForm,
  makePatientSchema,
  type PatientFormValues,
} from '@/lib/validation/patientSchema';
import type { FieldKey, PatientForm as PatientFormData, SessionStatus } from '@/types/patient';
import { ReviewList } from './ReviewList';
import { StepActions } from './StepActions';
import { Stepper } from './Stepper';
import { SubmitBar } from './SubmitBar';
import { BTN_GHOST, BTN_PRIMARY } from './buttonStyles';
import { DateField } from './fields/DateField';
import { PhoneField } from './fields/PhoneField';
import { SelectField } from './fields/SelectField';
import { TextAreaField } from './fields/TextAreaField';
import { TextField } from './fields/TextField';

/** Title + lead paragraph shared by all three wizard steps. */
function StepHeader({ title, lead }: { title: string; lead: string }) {
  return (
    <>
      <h1 className="mb-1 font-display text-[22px] font-bold sm:text-[26px]">{title}</h1>
      <p className="mb-6 text-sm text-muted">{lead}</p>
    </>
  );
}

interface PatientFormProps {
  sessionId: string;
}

export function PatientForm({ sessionId }: PatientFormProps) {
  const { lang, t } = useLang();
  const [step, setStep] = useState<StepNumber>(1);
  const [submitted, setSubmitted] = useState(false);
  const [everTyped, setEverTyped] = useState(false);
  // Separate state (not derived via watch) so the lobby name doesn't need its own watch subscription.
  const [displayName, setDisplayName] = useState('');

  // useForm re-reads options every render, so a new resolver takes effect immediately, no remount.
  const resolver = useMemo(() => zodResolver(makePatientSchema(lang)), [lang]);

  const methods = useForm<PatientFormData, unknown, PatientFormValues>({
    resolver,
    defaultValues: emptyPatientForm,
    // Deliberate UX: don't error on the first keystroke, validate on blur, then
    // re-validate every change once the field has already errored.
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const { getValues, handleSubmit, trigger, watch, reset, formState } = methods;

  /**
   * Currently-errored field names, mirrored into a ref so the watch callback
   * below can read the latest set without putting formState in its deps
   * (which would resubscribe the watcher on every error change).
   */
  const erroredRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    erroredRef.current = new Set(Object.keys(formState.errors));
  }, [formState.errors]);

  // Re-validate only fields already in error on language switch — triggering the
  // whole form would surface errors for wizard steps the user hasn't reached yet.
  const erroredKeys = Object.keys(formState.errors).join(',');
  useEffect(() => {
    if (erroredKeys) void trigger(erroredKeys.split(',') as FieldKey[]);
  }, [lang, erroredKeys, trigger]);

  const getSnapshot = useCallback(() => getValues(), [getValues]);
  const channel = usePatientChannel({ sessionId, getSnapshot });
  const { publishField, setActiveField, publishSubmit, publishReset } = channel;

  const status: SessionStatus = submitted
    ? 'submitted'
    : everTyped
      ? 'filling'
      : 'connected';

  useLobbyAnnounce(sessionId, status, displayName);

  // Every keystroke publishes — throttling is already applied inside the hook.
  useEffect(() => {
    const sub = watch((values, { name }) => {
      if (!name) return;
      setEverTyped(true);
      publishField(name as FieldKey, String(values[name as FieldKey] ?? ''));

      // reValidateMode alone only applies after a submit; an error raised by the
      // "Next" button's trigger() would otherwise stay red until blur, even once
      // fixed. Re-trigger manually for fields already in error.
      if (erroredRef.current.has(name)) void trigger(name as FieldKey);

      if (name === 'firstName' || name === 'lastName') {
        setDisplayName([values.firstName, values.lastName].filter(Boolean).join(' '));
      }
    });
    return () => sub.unsubscribe();
  }, [watch, publishField, trigger]);

  const goTo = useCallback((next: StepNumber) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const next = useCallback(async () => {
    // Validate only this step's fields, not the whole form.
    if (step === 3) return;
    const ok = await trigger([...STEP_FIELDS[step]]);
    if (ok) goTo((step + 1) as StepNumber);
  }, [step, trigger, goTo]);

  const back = useCallback(() => {
    if (step > 1) goTo((step - 1) as StepNumber);
  }, [step, goTo]);

  const onSubmit = handleSubmit(
    () => {
      publishSubmit();
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    (errors) => {
      // Route back to whichever step owns the first invalid field, so an
      // error is never raised on a screen the user can't see.
      const bad = Object.keys(errors)[0] as FieldKey | undefined;
      if (!bad) return;
      const owner = STEP_FIELDS[1].includes(bad) ? 1 : 2;
      goTo(owner);
    },
  );

  const startOver = useCallback(() => {
    reset(emptyPatientForm);
    setSubmitted(false);
    setEverTyped(false);
    publishReset();
    goTo(1);
  }, [reset, publishReset, goTo]);

  // activeField tracks real focus via event delegation on <form>.
  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLFormElement>) => {
      const name = (event.target as HTMLElement).getAttribute('name');
      if (name) setActiveField(name as FieldKey);
    },
    [setActiveField],
  );

  const handleBlur = useCallback(() => setActiveField(null), [setActiveField]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} onFocus={handleFocus} onBlur={handleBlur} noValidate>
        {!submitted ? <Stepper current={step} /> : null}

        {step === 1 && !submitted ? (
          <section>
            <StepHeader title={t.form.step1Title} lead={t.form.step1Lead} />

            <div className="flex flex-col gap-0 sm:flex-row sm:gap-3">
              <TextField
                name="firstName"
                required
                placeholder={t.form.placeholder.firstName}
                autoComplete="given-name"
                className="flex-1"
              />
              <TextField
                name="middleName"
                placeholder={t.form.placeholder.optional}
                autoComplete="additional-name"
                className="flex-1"
              />
            </div>

            <TextField
              name="lastName"
              required
              placeholder={t.form.placeholder.lastName}
              autoComplete="family-name"
            />
            <DateField name="dateOfBirth" required />

            <div className="flex flex-col gap-0 sm:flex-row sm:gap-3">
              <SelectField name="gender" required options={GENDERS} className="flex-1" />
              <SelectField
                name="nationality"
                required
                options={NATIONALITIES}
                className="flex-1"
              />
            </div>

            <StepActions onBack={back} onNext={next} backDisabled />
          </section>
        ) : null}

        {step === 2 && !submitted ? (
          <section>
            <StepHeader title={t.form.step2Title} lead={t.form.step2Lead} />

            <PhoneField name="phone" required />
            <TextField
              name="email"
              required
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t.form.placeholder.email}
            />
            <TextAreaField
              name="address"
              required
              placeholder={t.form.placeholder.address}
            />

            <div className="flex flex-col gap-0 sm:flex-row sm:gap-3">
              <SelectField
                name="preferredLanguage"
                required
                options={LANGUAGES}
                className="flex-1"
              />
              <TextField
                name="religion"
                placeholder={t.form.placeholder.optional}
                className="flex-1"
              />
            </div>

            <p className="mt-6 mb-3.5 border-t border-line pt-4.5 text-[13px] font-semibold">
              {t.form.emergencyHeading}{' '}
              <span className="font-normal text-muted">{t.form.emergencyNote}</span>
            </p>

            <div className="flex flex-col gap-0 sm:flex-row sm:gap-3">
              <TextField
                name="emergencyContactName"
                placeholder={t.form.placeholder.optional}
                className="flex-1"
              />
              <SelectField
                name="emergencyContactRelationship"
                options={RELATIONSHIPS}
                placeholder={t.form.placeholder.optional}
                className="flex-1"
              />
            </div>

            <PhoneField name="emergencyContactPhone" />

            <StepActions onBack={back} onNext={next} />
          </section>
        ) : null}

        {step === 3 && !submitted ? (
          <section>
            <StepHeader title={t.form.step3Title} lead={t.form.step3Lead} />

            <ReviewList values={getValues()} onEdit={goTo} />

            <p className="mb-5 rounded-lg bg-amber-bg px-3 py-2.5 text-[13px] text-amber-fg">
              {t.form.submitWarning}
            </p>

            <SubmitBar>
              <button type="button" onClick={back} className={BTN_GHOST}>
                {t.form.back}
              </button>
              <button type="submit" className={BTN_PRIMARY}>
                {t.form.submit}
              </button>
            </SubmitBar>
          </section>
        ) : null}

        {submitted ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-3.5 flex h-13 w-13 items-center justify-center rounded-full bg-green-bg text-[26px] text-green-fg">
              ✓
            </div>
            <StepHeader title={t.form.doneTitle} lead={t.form.doneLead} />
            <button type="button" onClick={startOver} className={BTN_GHOST}>
              {t.form.startOver}
            </button>
          </div>
        ) : null}

        <p className="mt-6 border-t border-line pt-5 text-center text-sm text-muted">
          {/* Connection status is conveyed via text, not color alone (a11y). */}
          {channel.connected ? t.form.connected : t.form.connecting}
        </p>
      </form>
    </FormProvider>
  );
}
