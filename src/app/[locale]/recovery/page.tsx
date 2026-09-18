"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AuthCard, AuthShell } from "@/app/components/auth/AuthShell";

export default function RecoveryPage() {
  const locale = useLocale();
  const t = useTranslations("AuthPages.recovery");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/recovery/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!res.ok) {
        setErrorMsg(t("errorGeneric"));
      } else {
        setDone(true);
      }
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
        {done ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-cyan-400" />
            <p className="text-sm text-slate-300">{t("success")}</p>
            <Link href="/login" className="inline-block font-bold text-cyan-300 hover:underline">
              {t("goLogin")}
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="mb-2 ml-1 block text-sm font-bold text-slate-100">{t("emailLabel")}</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-teal-200 py-3.5 pl-12 pr-4 outline-none focus:border-teal-600"
                />
              </div>
            </div>
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
        )}
      </AuthCard>
    </AuthShell>
  );
}
