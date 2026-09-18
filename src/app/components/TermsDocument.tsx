"use client";

import { useTranslations } from "next-intl";
import { brand } from "@/lib/brand";

const SECTION_IDS = [
  "identity",
  "nature",
  "modules",
  "users",
  "duties",
  "data",
  "limits",
  "prohibitions",
  "changes",
  "contact",
] as const;

export function TermsDocument({ className = "" }: { className?: string }) {
  const t = useTranslations("Terms");

  return (
    <article className={`space-y-6 text-sm leading-relaxed text-slate-300 ${className}`}>
      <header className="space-y-2 border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-extrabold text-slate-50 md:text-2xl">{t("title")}</h1>
        <p className="text-xs text-slate-500">
          {t("updated", { year: brand.year })} · {brand.legalName}
        </p>
        <p className="text-slate-400">{t("intro")}</p>
      </header>

      {SECTION_IDS.map((id) => (
        <section key={id} className="space-y-2">
          <h2 className="text-base font-bold text-cyan-200">{t(`sections.${id}.title`)}</h2>
          <p className="whitespace-pre-line">{t(`sections.${id}.body`)}</p>
        </section>
      ))}

      <footer className="border-t border-slate-800 pt-4 text-xs text-slate-500">
        {t("footer", { email: brand.supportEmail })}
      </footer>
    </article>
  );
}
