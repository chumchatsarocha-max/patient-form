import 'server-only';

// Demo gate only — blocks direct /staff access; the realtime channel itself is still public.

export const STAFF_COOKIE = 'staff_demo_session';

/** Defaults let reviewers run the demo without setting env vars — documented in README. */
const DEFAULT_USERNAME = 'Admin';
const DEFAULT_PASSWORD = 'Admin@12345';

export function staffCredentials() {
  return {
    username: process.env.STAFF_USERNAME ?? DEFAULT_USERNAME,
    password: process.env.STAFF_PASSWORD ?? DEFAULT_PASSWORD,
  };
}

export function verifyStaffLogin(username: string, password: string): boolean {
  const expected = staffCredentials();
  return username.trim() === expected.username && password === expected.password;
}
