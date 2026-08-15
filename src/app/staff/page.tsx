import type { Metadata } from 'next';
import { StaffConsole } from '@/components/staff/StaffConsole';
import { StaffHeader } from '@/components/staff/StaffHeader';
import { Banner } from '@/components/ui/Banner';
import { Card } from '@/components/ui/Card';
import { getDict } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDict();
  return { title: t.meta.staff };
}

export default async function StaffPage() {
  const t = await getDict();

  return (
    <main className="mx-auto w-full max-w-[940px] flex-1 px-3 pt-4 pb-12 sm:px-4 sm:pt-8 sm:pb-16">
      <StaffHeader />

      <Banner className="mb-5">{t.staff.banner}</Banner>

      <Card flush>
        <StaffConsole />
      </Card>
    </main>
  );
}
