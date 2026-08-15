import { NextResponse, type NextRequest } from 'next/server';

// Server-side gate for /staff (demo); see src/lib/auth.ts for what it does and doesn't protect.

const STAFF_COOKIE = 'staff_demo_session';

export function proxy(request: NextRequest) {
  const signedIn = request.cookies.get(STAFF_COOKIE)?.value === 'ok';
  if (signedIn) return NextResponse.next();

  const loginUrl = new URL('/login', request.url);
  // Remembers post-login destination; safeNext() in actions/auth.ts guards against open-redirect.
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/staff', '/staff/:path*'],
};
