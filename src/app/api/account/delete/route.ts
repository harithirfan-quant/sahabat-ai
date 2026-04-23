import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/account/delete
 *
 * Hard-deletes the currently logged-in user's account and all their data.
 * This is the PDPA "right to erasure" endpoint — see /legal/privacy §6 and
 * /legal/pdpa-notice §6.
 *
 * Flow:
 *   1. Read the user from the request's auth cookie (anon client, RLS-bound).
 *   2. Use the service-role client to call supabase.auth.admin.deleteUser.
 *      Cascading foreign keys on the app tables (chats, check_ins, etc.)
 *      then remove all derived rows.
 *   3. Sign the user out so their cookie no longer points at a ghost id.
 *
 * Per the Privacy Policy, the user-visible effect is immediate; backups and
 * processor caches flush within 30 days.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "not_authenticated" },
        { status: 401 },
      );
    }

    const admin = createServiceClient();
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("[account/delete] admin.deleteUser failed:", deleteError);
      return NextResponse.json(
        { error: "delete_failed", message: deleteError.message },
        { status: 500 },
      );
    }

    // Clear the now-orphaned cookie session on the current request.
    await supabase.auth.signOut();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[account/delete] unexpected:", err);
    return NextResponse.json(
      { error: "server_error" },
      { status: 500 },
    );
  }
}
