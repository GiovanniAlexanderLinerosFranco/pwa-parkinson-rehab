"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AuthCard, AuthShell } from "@/app/components/auth/AuthShell";

function VerifyBody() {
  const t = useTranslations("AuthPages.verify");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <AuthCard>
      <div className="space-y-4 text-center">
        <Mail className="mx-auto h-12 w-12 text-cyan-400" />
        <p className="text-sm text-slate-300">
          {email ? t("bodyWithEmail", { email }) : t("body")}
        </p>
        <Link href="/login" className="inline-block font-bold text-cyan-300 hover:underline">
          {t("goLogin")}
        </Link>
      </div>
    </AuthCard>
  );
}

export default function VerifyPage() {
  const t = useTranslations("AuthPages.verify");

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-extrabold text-slate-100">{t("title")}</h1>
        <p className="text-sm text-slate-400">{t("subtitle")}</p>
      </div>
      <Suspense fallback={<div className="text-center text-sm text-slate-500">…</div>}>
        <VerifyBody />
      </Suspense>
    </AuthShell>
  );
}
