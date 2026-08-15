'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { STAFF_COOKIE, verifyStaffLogin } from '@/lib/auth';

// Split into its own 'use server' file because the caller is a client component (needs useLang).

/** Only allows internal paths — blocks open-redirect via ?next=https://... */
function safeNext(value: string | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/staff';
  return value;
}

export async function signIn(formData: FormData) {
  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');
  const next = safeNext(String(formData.get('next') ?? ''));

  if (!verifyStaffLogin(username, password)) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const store = await cookies();
  store.set(STAFF_COOKIE, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  redirect(next);
}

export async function signOut() {
  const store = await cookies();
  store.delete(STAFF_COOKIE);
  redirect('/');
}
