/**
 * Server-side Supabase clients.
 *
 *  - createClient()       : for Server Components, Route Handlers, Server
 *                           Actions. Reads/writes the auth cookie via Next's
 *                           `cookies()` store.
 *  - createServiceClient(): for privileged backend tasks (seed scripts,
 *                           risk-engine callbacks, admin jobs). Uses the
 *                           SUPABASE_SERVICE_ROLE_KEY and BYPASSES RLS.
 *                           Never expose this to the browser.
 */

import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `setAll` was called from a Server Component. This is safe to
            // ignore when middleware refreshes the session on the next
            // request.
          }
        },
      },
    },
  );
}

export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set — required for privileged server operations.",
    );
  }
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
