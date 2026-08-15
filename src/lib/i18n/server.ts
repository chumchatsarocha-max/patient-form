import 'server-only';

import { cookies, headers } from 'next/headers';
import { DICT, toLang, type Dict, type Lang } from './dict';
import { LANG_COOKIE } from './cookie';

/** Priority: cookie → Accept-Language → en. Forces dynamic rendering (fine — app is realtime). */
export async function getLang(): Promise<Lang> {
  const fromCookie = toLang((await cookies()).get(LANG_COOKIE)?.value);
  if (fromCookie) return fromCookie;

  const accept = (await headers()).get('accept-language') ?? '';
  // Only checks the first language; doesn't parse q-values.
  return /^\s*th\b/i.test(accept) ? 'th' : 'en';
}

export async function getDict(): Promise<Dict> {
  return DICT[await getLang()];
}
