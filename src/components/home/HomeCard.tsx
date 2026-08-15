'use client';

import Image from 'next/image';
import Link from 'next/link';
import clinician from '@/assets/clinician.jpg';
import { Card } from '@/components/ui/Card';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLang } from '@/lib/i18n/context';

/** Home hero card: photo + two entry points; EN/TH copy is length-balanced (see below). */

// Both entry buttons must match height exactly; geometry centralized here.
const WAY =
  'flex w-full items-center justify-between gap-4 rounded-xl px-[18px] py-[17px] text-left transition-colors active:translate-y-px min-[600px]:px-[22px] min-[600px]:py-[19px]';
const WAY_LABEL = 'text-[17px] font-semibold tracking-[-0.01em] min-[600px]:text-[18px]';

const HEADING =
  'mb-3.5 min-h-[1.3em] font-display text-[27px] leading-[1.3] font-semibold tracking-[-0.01em] min-[600px]:text-[32px]'; // 1 line
const LEAD =
  // No text-pretty — breaks Thai compound-word line breaks.
  // min-h reserves English's (longer) height so the language toggle never resizes the card.
  'mb-6 min-h-[6.6em] max-w-[42ch] text-[15px] leading-[1.65] text-muted min-[600px]:mb-[30px] min-[600px]:text-base'; // 4 lines
const FOOT = 'mt-7 min-h-[3.2em] text-xs leading-[1.6] text-muted'; // 2 lines

interface HomeCardProps {
  /** Server action: mints a sessionId, then redirects to the form. */
  startIntakeAction: () => Promise<void>;
}

export function HomeCard({ startIntakeAction }: HomeCardProps) {
  const { t } = useLang();

  return (
    <Card
      flush
      className="grid grid-cols-1 min-[860px]:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
    >
      <div className="relative h-[158px] bg-track min-[600px]:h-[190px] min-[860px]:h-auto min-[860px]:min-h-[440px]">
        {/* Static import (not public/) so content hash busts the optimizer cache on replace.
            sizes reflects the post-object-cover width (~680px), not the container width, or
            the image is fetched too small and blurs. */}
        <Image
          src={clinician}
          alt={t.home.photoAlt}
          fill
          sizes="(min-width: 860px) 700px, 100vw"
          preload
          className="object-cover object-[58%_40%] min-[860px]:object-[58%_50%]"
        />
        <div aria-hidden className="shot-veil" />
        <p className="absolute top-[18px] left-5 z-[1] text-white [text-shadow:0_1px_12px_rgba(8,47,73,0.6)] min-[860px]:top-[26px] min-[860px]:left-[26px]">
          <span className="block text-[15px] font-semibold">{t.home.place}</span>
          <span className="mt-0.5 block text-xs opacity-85">{t.home.desk}</span>
        </p>
      </div>

      {/* Extra top padding on small screens reserves room for the floating language toggle. */}
      <div className="relative flex flex-col justify-center px-5 pt-[58px] pb-6 min-[600px]:px-[26px] min-[600px]:pt-7 min-[600px]:pb-[26px] min-[860px]:px-[42px] min-[860px]:pt-11 min-[860px]:pb-[34px]">
        <LanguageToggle className="absolute top-4 right-[18px] min-[860px]:top-[22px] min-[860px]:right-6" />

        <h1 className={HEADING}>{t.home.heading}</h1>

        <p className={LEAD}>{t.home.lead}</p>

        <div className="flex flex-col gap-2.5">
          {/* Form (not Link): server must mint the sessionId first; still works before JS loads. */}
          <form action={startIntakeAction}>
            <button
              type="submit"
              className={`${WAY} cursor-pointer border border-brand bg-brand text-white hover:border-brand-dark hover:bg-brand-dark`}
            >
              <span className={WAY_LABEL}>{t.home.patient}</span>
              <span aria-hidden className="shrink-0 text-2xl leading-none">
                &rarr;
              </span>
            </button>
          </form>

          <Link
            href="/staff"
            className={`${WAY} border border-line-strong bg-card text-ink hover:border-brand hover:bg-track`}
          >
            <span className={WAY_LABEL}>{t.home.staff}</span>
            <span aria-hidden className="shrink-0 text-2xl leading-none text-brand">
              &rarr;
            </span>
          </Link>
        </div>

        <p className={FOOT}>{t.home.foot}</p>
      </div>
    </Card>
  );
}
