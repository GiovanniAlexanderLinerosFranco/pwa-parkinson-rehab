import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import {
  createSupabaseAdminClient,
  isValidEmail,
  normalizeEmail,
} from "@/lib/supabase/admin";
import { validatePassword } from "@/lib/authPassword";

const ROLES = ["fisioterapeuta", "paciente", "cuidador"] as const;

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
    const {
      email,
      displayName,
      password,
      role = "fisioterapeuta",
      locale: requestedLocale = "es",
      acceptsTerms = false,
      confirmsAdultAge = false,
      declaresResponsible = false,
      intent = null,
    } = body;

    const locale = (routing.locales as readonly string[]).includes(requestedLocale)
      ? requestedLocale
      : routing.defaultLocale;

    const rol = (ROLES as readonly string[]).includes(role) ? role : "fisioterapeuta";

    if (!email?.trim() || !displayName?.trim() || !password?.trim()) {
      return NextResponse.json({ success: false, error_code: "MISSING_REQUIRED_FIELDS" }, { status: 400 });
    }

    if (String(displayName).trim().length < 3) {
      return NextResponse.json({ success: false, error_code: "NAME_TOO_SHORT" }, { status: 400 });
    }

    if (!intent || typeof intent !== "object") {
      return NextResponse.json({ success: false, error_code: "INTENT_REQUIRED" }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ success: false, error_code: "INVALID_EMAIL_FORMAT" }, { status: 400 });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ success: false, error_code: passwordError }, { status: 400 });
    }

    if (!acceptsTerms) {
      return NextResponse.json({ success: false, error_code: "TERMS_NOT_ACCEPTED" }, { status: 400 });
    }

    if (!confirmsAdultAge) {
      return NextResponse.json({ success: false, error_code: "AGE_CONFIRMATION_REQUIRED" }, { status: 400 });
    }

    if (!declaresResponsible) {
      return NextResponse.json({ success: false, error_code: "RESPONSIBLE_USE_REQUIRED" }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const nombre = String(displayName).trim();

    const { data: existing } = await admin
      .from("perfiles")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: false, error_code: "EMAIL_ALREADY_REGISTERED" }, { status: 409 });
    }

    const siteUrl = resolveSiteUrl(req);
    const emailRedirectTo = `${siteUrl}/${locale}/auth/callback?next=/${locale}/app`;

    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: false,
      user_metadata: { full_name: nombre, rol },
    });

    if (authError || !authData.user) {
      const msg = authError?.message || "";
      if (msg.toLowerCase().includes("already") || authError?.status === 422) {
        return NextResponse.json({ success: false, error_code: "EMAIL_ALREADY_REGISTERED" }, { status: 409 });
      }
      console.error("CADENCIA_REGISTER_AUTH_FAILED", authError?.message);
      return NextResponse.json({ success: false, error_code: "REGISTER_FAILED" }, { status: 500 });
    }

    const authUserId = authData.user.id;

    const { error: profileError } = await admin.from("perfiles").insert({
      auth_user_id: authUserId,
      nombre_mostrar: nombre,
      email: normalizedEmail,
      rol,
      plan: "piloto",
      verificado: false,
      idioma_preferido: locale,
      uso_rol: intent.usoRol || null,
      uso_principal: intent.usoPrincipal || null,
      condicion_interes: intent.condicionInteres || null,
      contexto_uso: intent.contextoUso || null,
      acepta_terminos_at: new Date().toISOString(),
      declara_uso_responsable: true,
    });

    if (profileError) {
      console.error("CADENCIA_REGISTER_PROFILE_FAILED", profileError.message);
      await admin.auth.admin.deleteUser(authUserId);
      return NextResponse.json({ success: false, error_code: "REGISTER_FAILED" }, { status: 500 });
    }

    const { error: resendError } = await admin.auth.resend({
      type: "signup",
      email: normalizedEmail,
      options: { emailRedirectTo },
    });

    if (resendError) {
      console.warn("CADENCIA_REGISTER_RESEND_WARN", resendError.message);
    }

    return NextResponse.json({
      success: true,
      email_sent: !resendError,
      email: normalizedEmail,
    });
  } catch (err) {
    console.error("CADENCIA_REGISTER_FAILED", err);
    return NextResponse.json({ success: false, error_code: "REGISTER_FAILED" }, { status: 500 });
  }
}
