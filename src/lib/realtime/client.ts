import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Only this file and channel.ts may import supabase-js, so the provider stays swappable.
// Keys here must stay publishable/anon — this file's output ships inside the client bundle.

// Static process.env access only — Next inlines NEXT_PUBLIC_* at build time, not at runtime.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let cached: SupabaseClient | null = null;

export function getRealtimeClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    // Fail loudly — a silent no-op here is much harder to debug than a thrown error.
    throw new Error(
      'Realtime is not configured. Copy .env.example to .env.local and set ' +
        'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
    );
  }

  cached ??= createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false },
  });

  return cached;
}

/** Lets the UI check config presence without try/catching getRealtimeClient(). */
export const isRealtimeConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
