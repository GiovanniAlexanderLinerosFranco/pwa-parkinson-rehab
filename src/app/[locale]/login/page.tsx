"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, Loader2, LogIn, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import PasswordInput from "@/app/components/auth/PasswordInput";
import { AuthCard, AuthShell } from "@/app/components/auth/AuthShell";

function LoginForm() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("AuthPages.login");
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(
    searchParams.get("error") === "auth_code_error" ? t("errorLink") : "",
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        router.push(`/${locale}/verify?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        return;
      }

      try {
        await fetch("/api/auth/sync-verification", { method: "POST" });
      } catch {
        /* ignore */
      }

      const next = searchParams.get("next");
      const safeNext =
        next?.startsWith(`/${locale}`) && !next.endsWith(`/${locale}`)
          ? next
          : `/${locale}/app`;
      router.push(safeNext);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Invalid login credentials")) {
        setErrorMessage(t("errorCredentials"));
      } else if (msg.includes("Email not confirmed")) {
        router.push(`/${locale}/verify?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      } else {
        setErrorMessage(t("errorGeneric"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-extrabold text-slate-100">{t("title")}</h1>
        <p className="text-sm text-slate-400">{t("subtitle")}</p>
      </div>
      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 ml-1 block text-sm font-bold text-slate-100">{t("emailLabel")}</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-3.5 pl-12 pr-4 text-slate-100 outline-none focus:border-cyan-400/60"
              />
            </div>
          </div>
          <PasswordInput
            label={t("passwordLabel")}
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
          {errorMessage ? (
            <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
            {t("submit")}
          </button>
        </form>
        <div className="mt-6 space-y-2 text-center text-sm text-slate-400">
          <p>
            <Link href="/recovery" className="font-semibold text-cyan-300 hover:underline">
              {t("forgot")}
            </Link>
          </p>
          <p>
            {t("noAccount")}{" "}
            <Link href="/register" className="font-semibold text-cyan-300 hover:underline">
              {t("createAccount")}
            </Link>
          </p>
        </div>
      </AuthCard>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="text-center text-sm text-slate-500">…</div>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
