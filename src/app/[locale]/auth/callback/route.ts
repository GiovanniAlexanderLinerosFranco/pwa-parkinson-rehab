import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { parkinsonDbOptions } from "@/lib/supabase/schema";

async function synchronizeVerifiedProfile(
  supabase: ReturnType<typeof createServerClient>,
  { force = false } = {},
) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData?.user;
  if (userError || !user?.id) return false;

  const admin = createSupabaseAdminClient();

  if (!user.email_confirmed_at) {
    if (!force) return false;
    const { error: confirmError } = await admin.auth.admin.updateUserById(user.id, {
      email_confirm: true,
    });
    if (confirmError) return false;
  }

  const { error: profileError } = await admin
    .from("perfiles")
    .update({ verificado: true })
    .eq("auth_user_id", user.id);

  return !profileError;
}

function createSupabaseWithResponseCookies(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...parkinsonDbOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const origin = requestUrl.origin;
  const locale = requestUrl.pathname.split("/").filter(Boolean)[0] || "es";
  const rawNext = requestUrl.searchParams.get("next") || `/${locale}`;
  const type = requestUrl.searchParams.get("type");

  let nextPath = rawNext;
  if (rawNext.startsWith("http://") || rawNext.startsWith("https://")) {
    try {
      const parsed = new URL(rawNext);
      nextPath = `${parsed.pathname}${parsed.search}`;
    } catch {
      nextPath = `/${locale}`;
    }
  }
  if (!nextPath.startsWith("/")) nextPath = `/${nextPath}`;

  const isRecoveryFlow = type === "recovery" || nextPath.includes("/update-password");
  const targetPath = isRecoveryFlow ? `/${locale}/update-password` : nextPath;
  const successRedirect = NextResponse.redirect(`${origin}${targetPath}`);
  const supabase = createSupabaseWithResponseCookies(request, successRedirect);

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as "signup" | "recovery" | "invite" | "magiclink" | "email",
      token_hash: tokenHash,
    });
    if (!error) {
      await synchronizeVerifiedProfile(supabase, { force: true });
      return successRedirect;
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await synchronizeVerifiedProfile(supabase, { force: true });
      return successRedirect;
    }
  }

  if (isRecoveryFlow) {
    return NextResponse.redirect(`${origin}/${locale}/recovery?error=link_expired`);
  }
  return NextResponse.redirect(`${origin}/${locale}/login?error=auth_code_error`);
}
