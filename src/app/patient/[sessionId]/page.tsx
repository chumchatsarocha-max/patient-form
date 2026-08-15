import type { Metadata } from 'next';
import { PatientForm } from '@/components/form/PatientForm';
import { Banner } from '@/components/ui/Banner';
import { Card } from '@/components/ui/Card';
import { HomeLink } from '@/components/ui/HomeLink';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { getDict } from '@/lib/i18n/server';
import { shortSessionCode } from '@/lib/utils/format';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDict();
  return { title: t.meta.patient };
}

export default async function PatientPage({ params }: PageProps<'/patient/[sessionId]'>) {
  const { sessionId } = await params;
  const t = await getDict();

  return (
    <main className="mx-auto w-full max-w-[640px] flex-1 px-3 pt-4 pb-12 sm:px-4 sm:pt-8 sm:pb-16">
      <div className="mb-3 flex items-center justify-between gap-3">
        <HomeLink />
        <LanguageToggle tone="onSheet" />
      </div>

      {/* Required by spec §9 — do not remove. */}
      <Banner className="mb-5">{t.patient.banner}</Banner>

      <Card>
        <PatientForm sessionId={sessionId} />
      </Card>

      {/* Patient reads this code aloud at the counter; staff matches it to the session. */}
      <p className="mt-5 text-center font-mono text-[11px] text-deep/60">
        {t.patient.session(shortSessionCode(sessionId))}
      </p>
    </main>
  );
}
