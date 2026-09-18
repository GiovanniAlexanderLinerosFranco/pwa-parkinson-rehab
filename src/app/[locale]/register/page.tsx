"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import PasswordInput from "@/app/components/auth/PasswordInput";
import { AuthCard, AuthShell } from "@/app/components/auth/AuthShell";
import {
  clearIntent,
  mapIntentToRole,
  readIntent,
  type CadenciaIntent,
} from "@/lib/cadenciaIntent";

function RegisterForm() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const t = useTranslations("AuthPages.register");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [intent, setIntent] = useState<CadenciaIntent | null>(null);
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "fisioterapeuta" as "fisioterapeuta" | "paciente" | "cuidador",
    acceptsTerms: false,
    confirmsAdultAge: false,
    declaresResponsible: false,
  });

  useEffect(() => {
    const stored = readIntent();
    const via = searchParams.get("via");
    if (stored) {
      setIntent(stored);
      setForm((f) => ({
        ...f,
        role: mapIntentToRole(stored),
        acceptsTerms: true,
        confirmsAdultAge: true,
        declaresResponsible: true,
      }));
    } else if (via === "hogar") {
      setForm((f) => ({ ...f, role: "cuidador" }));
    }
  }, [searchParams]);

  const mapError = (code: string) => {
    const map: Record<string, string> = {
      PASSWORD_TOO_SHORT: t("errorPasswordLength"),
      PASSWORD_MISSING_UPPERCASE: t("errorPasswordUppercase"),
      PASSWORD_MISSING_NUMBER: t("errorPasswordNumber"),
      PASSWORD_MISSING_SYMBOL: t("errorPasswordSymbol"),
      EMAIL_ALREADY_REGISTERED: t("errorEmailTaken"),
      TERMS_NOT_ACCEPTED: t("errorTerms"),
      AGE_CONFIRMATION_REQUIRED: t("errorAge"),
      RESPONSIBLE_USE_REQUIRED: t("errorResponsible"),
      NAME_TOO_SHORT: t("errorNameShort"),
      INTENT_REQUIRED: t("errorIntent"),
    };
    return map[code] || t("errorGeneric");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (form.password !== form.confirmPassword) {
      setErrorMsg(t("errorPasswordMismatch"));
      setLoading(false);
      return;
    }

    const currentIntent = intent || readIntent();
    if (!currentIntent) {
      setErrorMsg(t("errorIntent"));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: form.email,
          displayName: form.displayName,
          password: form.password,
          role: form.role,
          locale,
          acceptsTerms: form.acceptsTerms,
          confirmsAdultAge: form.confirmsAdultAge,
          declaresResponsible: form.declaresResponsible,
          intent: currentIntent,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setErrorMsg(mapError(result.error_code || ""));
        setLoading(false);
        return;
      }
      clearIntent();
      setRegisteredEmail(result.email || form.email.trim().toLowerCase());
      setDone(true);
    } catch {
      setErrorMsg(t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-extrabold text-slate-100">{t("title")}</h1>
        <p className="text-sm text-slate-400">{t("subtitle")}</p>
        {!intent ? (
          <p className="mt-3 text-sm font-semibold text-amber-800">
            {t("needLanding")}{" "}
            <Link href="/" className="underline">
              {t("goLanding")}
            </Link>
          </p>
        ) : null}
      </div>
      <AuthCard>
        {done ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-cyan-400" />
            <p className="text-sm text-slate-300">{t("success", { email: registeredEmail })}</p>
            <Link href="/login" className="inline-block font-bold text-cyan-300 hover:underline">
              {t("goLogin")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-2 ml-1 block text-sm font-bold text-slate-100">{t("nameLabel")}</label>
              <input
                value={form.displayName}
                onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                required
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-3 px-4 text-slate-100 outline-none focus:border-cyan-400/60"
              />
            </div>
            <div>
              <label className="mb-2 ml-1 block text-sm font-bold text-slate-100">{t("emailLabel")}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-3 px-4 text-slate-100 outline-none focus:border-cyan-400/60"
              />
            </div>
            <PasswordInput
              label={t("passwordLabel")}
              value={form.password}
              onChange={(password) => setForm((f) => ({ ...f, password }))}
              showStrength
              autoComplete="new-password"
            />
            <PasswordInput
              label={t("confirmLabel")}
              value={form.confirmPassword}
              onChange={(confirmPassword) => setForm((f) => ({ ...f, confirmPassword }))}
              autoComplete="new-password"
            />
            <label className="flex items-start gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.acceptsTerms}
                onChange={(e) => setForm((f) => ({ ...f, acceptsTerms: e.target.checked }))}
                className="mt-1"
              />
              <span>{t("terms")}</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.confirmsAdultAge}
                onChange={(e) => setForm((f) => ({ ...f, confirmsAdultAge: e.target.checked }))}
                className="mt-1"
              />
              <span>{t("adult")}</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.declaresResponsible}
                onChange={(e) => setForm((f) => ({ ...f, declaresResponsible: e.target.checked }))}
                className="mt-1"
              />
              <span>{t("responsible")}</span>
            </label>
            {errorMsg ? (
              <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            ) : null}
            <button
              type="submit"
              disabled={loading || !intent}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              {t("submit")}
            </button>
          </form>
        )}
        {!done ? (
          <p className="mt-6 text-center text-sm text-slate-400">
            {t("hasAccount")}{" "}
            <Link href="/login" className="font-semibold text-cyan-300 hover:underline">
              {t("goLogin")}
            </Link>
          </p>
        ) : null}
      </AuthCard>
    </>
  );
}

export default function RegisterPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="text-center text-sm text-slate-500">…</div>}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
