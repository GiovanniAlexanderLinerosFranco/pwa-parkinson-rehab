import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  isValidEmail,
  normalizeEmail,
} from "@/lib/supabase/admin";
import { routing } from "@/i18n/routing";

function resolveSiteUrl(request: Request) {
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host");
  const fromRequest = host ? `${protocol}://${host}` : null;
  if (process.env.NODE_ENV === "development") {
    return fromRequest || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  }
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || fromRequest;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body.email || "");
    const requestedLocale = body.locale || "es";
    const locale = (routing.locales as readonly string[]).includes(requestedLocale)
      ? requestedLocale
      : routing.defaultLocale;

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error_code: "INVALID_EMAIL_FORMAT" }, { status: 400 });
    }

    const siteUrl = resolveSiteUrl(req);
    const redirectTo = `${siteUrl}/${locale}/auth/callback?type=recovery&next=/${locale}/update-password`;

    const admin = createSupabaseAdminClient();
    const { error } = await admin.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      console.warn("CADENCIA_RECOVERY_WARN", error.message);
    }

    // No revelar si el email existe.
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CADENCIA_RECOVERY_FAILED", err);
    return NextResponse.json({ success: false, error_code: "RECOVERY_FAILED" }, { status: 500 });
  }
}
