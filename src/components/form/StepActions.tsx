'use client';

import { useLang } from '@/lib/i18n/context';
import { BTN_GHOST, BTN_PRIMARY } from './buttonStyles';
import { SubmitBar } from './SubmitBar';

export function StepActions({
  onBack,
  onNext,
  backDisabled = false,
}: {
  onBack: () => void;
  onNext: () => void;
  backDisabled?: boolean;
}) {
  const { t } = useLang();

  return (
    <SubmitBar>
      <button
        type="button"
        onClick={onBack}
        disabled={backDisabled}
        className={BTN_GHOST}
      >
        {t.form.back}
      </button>
      <button type="button" onClick={onNext} className={BTN_PRIMARY}>
        {t.form.next}
      </button>
    </SubmitBar>
  );
}
