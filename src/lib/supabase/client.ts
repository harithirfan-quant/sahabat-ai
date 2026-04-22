/**
 * Browser-side Supabase client for Client Components.
 *
 * Reads cookies via @supabase/ssr so the session stays in sync with the
 * server. Import this from "use client" components only.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
