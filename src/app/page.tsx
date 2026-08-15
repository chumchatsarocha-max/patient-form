import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { HomeCard } from '@/components/home/HomeCard';
import { getDict } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDict();
  return { title: t.meta.home };
}

/** Runs server-side so the start button still works before client JS loads. */
async function startIntake() {
  'use server';
  redirect(`/patient/${crypto.randomUUID()}`);
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[940px] flex-1 flex-col justify-center px-3 py-5 min-[600px]:px-4 min-[600px]:py-10 min-[860px]:pb-14">
      <HomeCard startIntakeAction={startIntake} />
    </main>
  );
}
