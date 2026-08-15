import type { Metadata } from 'next';
import { Banner } from '@/components/ui/Banner';
import { Card } from '@/components/ui/Card';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { HomeLink } from '@/components/ui/HomeLink';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { signIn } from '@/lib/actions/auth';
import { staffCredentials } from '@/lib/auth';
import { getDict } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDict();
  return { title: t.meta.login };
}

/** Restricts to internal paths, blocking open-redirect via ?next=. Server action re-validates. */
function safeNext(value: string | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/staff';
  return value;
}

const FIELD_LABEL_CLASS = 'absolute -top-2 left-3 z-[1] bg-card px-1.5 text-xs text-muted';
const FIELD_INPUT_CLASS =
  'min-h-12 w-full rounded-lg border border-line-strong bg-transparent px-3 py-3.5 text-[15px] focus:border-brand focus:outline-none';

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const params = await searchParams;
  const failed = params.error === '1';
  const next = safeNext(typeof params.next === 'string' ? params.next : undefined);
  const demo = staffCredentials();
  const t = await getDict();

  return (
    <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-3 py-12 sm:px-4">
      <header className="mb-4 px-1">
        <div className="mb-3 flex items-center justify-between gap-3">
          <HomeLink />
          <LanguageToggle tone="onSheet" />
        </div>

        <Eyebrow>{t.login.eyebrow}</Eyebrow>
        <h1 className="font-display text-xl font-bold tracking-tight text-deep sm:text-2xl">
          {t.login.title}
        </h1>
      </header>

      <Card>
        <form action={signIn} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />

          {failed ? (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">
              {t.login.failed}
            </p>
          ) : null}

          <div className="relative">
            <label htmlFor="username" className={FIELD_LABEL_CLASS}>
              {t.login.username}
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              defaultValue={demo.username}
              required
              className={FIELD_INPUT_CLASS}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className={FIELD_LABEL_CLASS}>
              {t.login.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={FIELD_INPUT_CLASS}
            />
          </div>

          <button
            type="submit"
            className="min-h-12 cursor-pointer rounded-lg bg-brand px-5 text-[15px] text-white transition-colors hover:bg-brand-dark"
          >
            {t.login.submit}
          </button>
        </form>
      </Card>

      {/* Demo credentials shown so reviewers can sign in without asking — this is not real auth. */}
      <Banner tone="warning" className="mt-4">
        <p>{t.login.demo(demo.username, demo.password)}</p>
        <p className="mt-1">{t.login.demoNote}</p>
      </Banner>
    </main>
  );
}
