import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";
import { parkinsonDbOptions } from "./lib/supabase/schema";

const intlMiddleware = createMiddleware(routing);

/** Rutas públicas (sin sesión). La clínica vive en /app. */
const PUBLIC_SUFFIXES = new Set([
  "",
  "login",
  "register",
  "verify",
  "recovery",
  "update-password",
]);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  const hasLocale = (routing.locales as readonly string[]).includes(maybeLocale);
  const locale = hasLocale ? maybeLocale : routing.defaultLocale;
  const rest = hasLocale ? segments.slice(1) : segments;

  if (rest[0] === "auth" && (rest[1] === "callback" || rest[1] === "recovery-confirm")) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user: { id: string; email_confirmed_at?: string | null } | null = null;

  if (url && anon) {
    const supabase = createServerClient(url, anon, {
      ...parkinsonDbOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const first = rest[0] || "";
  const isPublic = PUBLIC_SUFFIXES.has(first) || first === "auth";

  // Usuario con sesión en landing → ir al panel
  if (user?.email_confirmed_at && first === "") {
    const appUrl = request.nextUrl.clone();
    appUrl.pathname = `/${locale}/app`;
    const redirect = NextResponse.redirect(appUrl);
    supabaseResponse.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value));
    return redirect;
  }

  if (!isPublic && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${locale}/login`;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isPublic && user && !user.email_confirmed_at) {
    const verifyUrl = request.nextUrl.clone();
    verifyUrl.pathname = `/${locale}/verify`;
    return NextResponse.redirect(verifyUrl);
  }

  const intlResponse = intlMiddleware(request);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });
  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
