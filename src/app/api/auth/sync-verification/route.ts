import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError || !user?.id) {
      return NextResponse.json({ success: false, error_code: "UNAUTHORIZED" }, { status: 401 });
    }

    const admin = createSupabaseAdminClient();

    if (!user.email_confirmed_at) {
      const { error: confirmError } = await admin.auth.admin.updateUserById(user.id, {
        email_confirm: true,
      });
      if (confirmError) {
        return NextResponse.json({ success: false, error_code: "SYNC_FAILED" }, { status: 500 });
      }
    }

    const { error: profileError } = await admin
      .from("perfiles")
      .update({ verificado: true })
      .eq("auth_user_id", user.id);

    if (profileError) {
      return NextResponse.json({ success: false, error_code: "SYNC_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ success: true, synced: true });
  } catch (err) {
    console.error("CADENCIA_SYNC_VERIFICATION_FAILED", err);
    return NextResponse.json({ success: false, error_code: "SYNC_FAILED" }, { status: 500 });
  }
}
