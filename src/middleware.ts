/**
 * Session-refresh middleware for Supabase Auth.
 *
 * @supabase/ssr recommends running `getUser()` on every request so that
 * expiring access tokens are rotated via the refresh token cookie before
 * Server Components read them. Without this, users get silently logged
 * out after an hour and the chat/dashboard APIs start returning 401.
 *
 * We also gate the authenticated app pages here so unauthenticated users
 * are redirected to /auth/login instead of seeing a blank dashboard.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PREFIXES = ["/app"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session cookie if it's close to expiry.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (needsAuth && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // If an authed user hits /auth/*, bounce them into the app.
  if (user && pathname.startsWith("/auth/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/app/chat";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  // Skip static assets, Next internals, and the public /demo route. Everything
  // else flows through the session refresh.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|demo|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
