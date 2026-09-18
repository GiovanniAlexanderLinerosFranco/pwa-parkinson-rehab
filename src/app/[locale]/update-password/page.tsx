"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { validatePassword } from "@/lib/authPassword";
import PasswordInput from "@/app/components/auth/PasswordInput";
import { AuthCard, AuthShell } from "@/app/components/auth/AuthShell";

export default function UpdatePasswordPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("AuthPages.updatePassword");
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (password !== confirm) {
      setErrorMsg(t("errorMismatch"));
      return;
    }
    const code = validatePassword(password);
    if (code) {
      setErrorMsg(t("errorWeak"));
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push(`/${locale}/login`);
      router.refresh();
    } catch {
      setErrorMsg(t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-extrabold text-slate-100">{t("title")}</h1>
        <p className="text-sm text-slate-400">{t("subtitle")}</p>
      </div>
      <AuthCard>
        <form onSubmit={onSubmit} className="space-y-5">
          <PasswordInput
            label={t("passwordLabel")}
            value={password}
            onChange={setPassword}
            showStrength
            autoComplete="new-password"
          />
          <PasswordInput
            label={t("confirmLabel")}
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
          />
          {errorMsg ? (
            <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {t("submit")}
          </button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
