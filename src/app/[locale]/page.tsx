"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, HeartHandshake, ShieldCheck, Stethoscope } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { brand } from "@/lib/brand";
import BrandLogo from "@/app/components/BrandLogo";
import {
  type CadenciaIntent,
  saveIntent,
} from "@/lib/cadenciaIntent";

type ChipProps = {
  active: boolean;
  label: string;
  onClick: () => void;
  tone?: "cyan" | "amber" | "emerald";
};

function Chip({ active, label, onClick, tone = "cyan" }: ChipProps) {
  const activeTone =
    tone === "amber"
      ? "border-amber-400/60 bg-amber-500/20 text-amber-100 shadow-[0_0_18px_rgba(245,158,11,0.2)]"
      : tone === "emerald"
        ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.2)]"
        : "border-cyan-400/60 bg-cyan-500/20 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.22)]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all ${
        active
          ? activeTone
          : "border-slate-700/80 bg-slate-900/50 text-slate-300 hover:border-cyan-500/30 hover:text-slate-100"
      }`}
    >
      {label}
    </button>
  );
}

export default function LandingPage() {
  const t = useTranslations("Landing");
  const router = useRouter();
  const [via, setVia] = useState<"profesional" | "hogar" | null>(null);
  const [usoRol, setUsoRol] = useState<CadenciaIntent["usoRol"] | null>(null);
  const [usoPrincipal, setUsoPrincipal] = useState<CadenciaIntent["usoPrincipal"] | null>(null);
  const [condicionInteres, setCondicionInteres] =
    useState<CadenciaIntent["condicionInteres"]>("parkinson");
  const [contextoUso, setContextoUso] = useState<CadenciaIntent["contextoUso"] | null>(null);
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [confirmsAdult, setConfirmsAdult] = useState(false);
  const [declaresResponsible, setDeclaresResponsible] = useState(false);
  const [error, setError] = useState("");

  const canContinue = useMemo(
    () =>
      Boolean(
        via &&
          usoRol &&
          usoPrincipal &&
          condicionInteres &&
          contextoUso &&
          acceptsTerms &&
          confirmsAdult &&
          declaresResponsible,
      ),
    [
      via,
      usoRol,
      usoPrincipal,
      condicionInteres,
      contextoUso,
      acceptsTerms,
      confirmsAdult,
      declaresResponsible,
    ],
  );

  const onContinue = () => {
    setError("");
    if (!canContinue || !via || !usoRol || !usoPrincipal || !contextoUso) {
      setError(t("form.errorIncomplete"));
      return;
    }
    saveIntent({
      via,
      usoRol,
      usoPrincipal,
      condicionInteres,
      contextoUso,
    });
    router.push(`/register?via=${via}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--balanx-bg)] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(52,211,153,0.08),_transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:28px_28px]" />

      <section className="relative px-6 pb-12 pt-16 md:pt-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <BrandLogo size="hero" priority />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/90">
            {brand.taglineOfficial}
          </p>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-50 md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 md:text-lg">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#empezar"
              className="balanx-btn-primary balanx-glow-cyan inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm"
            >
              {t("hero.ctaStart")} <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-5 py-3 text-sm font-bold text-slate-200 backdrop-blur-md hover:border-cyan-500/40"
            >
              {t("hero.ctaLogin")}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-4xl gap-4 px-6 py-8 md:grid-cols-3">
        {[
          {
            icon: Stethoscope,
            title: t("pillars.clinicalTitle"),
            body: t("pillars.clinicalBody"),
            glow: "balanx-glow-cyan",
            iconClass: "text-cyan-400",
          },
          {
            icon: HeartHandshake,
            title: t("pillars.homeTitle"),
            body: t("pillars.homeBody"),
            glow: "balanx-glow-amber",
            iconClass: "text-amber-400",
          },
          {
            icon: ShieldCheck,
            title: t("pillars.safeTitle"),
            body: t("pillars.safeBody"),
            glow: "balanx-glow-emerald",
            iconClass: "text-emerald-400",
          },
        ].map(({ icon: Icon, title, body, glow, iconClass }) => (
          <div
            key={title}
            className={`balanx-glass ${glow} rounded-2xl p-5`}
          >
            <Icon className={`mb-3 h-6 w-6 ${iconClass}`} />
            <h2 className="text-sm font-extrabold text-slate-100">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
          </div>
        ))}
      </section>

      <section className="relative mx-auto max-w-4xl px-6 py-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-slate-50">{t("modules.title")}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-400">{t("modules.subtitle")}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: t("modules.parkinsonTitle"),
              body: t("modules.parkinsonBody"),
              badge: t("modules.available"),
              badgeClass:
                "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
              cardClass: "balanx-glow-emerald border-emerald-500/25",
            },
            {
              title: t("modules.alzheimerTitle"),
              body: t("modules.alzheimerBody"),
              badge: t("modules.roadmap"),
              badgeClass: "border-slate-600 bg-slate-900/80 text-slate-400",
              cardClass: "opacity-90",
            },
            {
              title: t("modules.msaTitle"),
              body: t("modules.msaBody"),
              badge: t("modules.roadmap"),
              badgeClass: "border-slate-600 bg-slate-900/80 text-slate-400",
              cardClass: "opacity-90",
            },
            {
              title: t("modules.otherTitle"),
              body: t("modules.otherBody"),
              badge: t("modules.roadmap"),
              badgeClass: "border-slate-600 bg-slate-900/80 text-slate-400",
              cardClass: "opacity-90",
            },
          ].map(({ title, body, badge, badgeClass, cardClass }) => (
            <article
              key={title}
              className={`balanx-glass rounded-2xl p-5 ${cardClass}`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-sm font-extrabold text-slate-100">{title}</h3>
                <span
                  className={`shrink-0 rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${badgeClass}`}
                >
                  {badge}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="empezar" className="relative mx-auto max-w-3xl px-6 pb-20">
        <div className="balanx-glass balanx-glow-cyan rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-extrabold text-slate-50">{t("form.title")}</h2>
          <p className="mt-2 text-sm text-slate-400">{t("form.subtitle")}</p>

          <div className="mt-8 space-y-7">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-cyan-300/90">
                {t("form.viaLabel")}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Chip
                  active={via === "profesional"}
                  label={t("form.viaPro")}
                  tone="cyan"
                  onClick={() => {
                    setVia("profesional");
                    setUsoRol("fisioterapeuta");
                  }}
                />
                <Chip
                  active={via === "hogar"}
                  label={t("form.viaHome")}
                  tone="amber"
                  onClick={() => {
                    setVia("hogar");
                    setUsoRol("cuidador");
                  }}
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-cyan-300/90">
                {t("form.roleLabel")}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ["fisioterapeuta", "roleFt"],
                    ["otro_profesional", "roleOther"],
                    ["cuidador", "roleCaregiver"],
                    ["autouso", "roleSelf"],
                  ] as const
                ).map(([value, key]) => (
                  <Chip
                    key={value}
                    active={usoRol === value}
                    label={t(`form.${key}`)}
                    onClick={() => setUsoRol(value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-cyan-300/90">
                {t("form.useLabel")}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ["valoracion", "useAssessment"],
                    ["cueing_sesion", "useCueing"],
                    ["hogar", "useHome"],
                    ["seguimiento", "useFollowup"],
                    ["formacion", "useTraining"],
                  ] as const
                ).map(([value, key]) => (
                  <Chip
                    key={value}
                    active={usoPrincipal === value}
                    label={t(`form.${key}`)}
                    tone="emerald"
                    onClick={() => setUsoPrincipal(value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-cyan-300/90">
                {t("form.conditionLabel")}
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {(
                  [
                    ["parkinson", "condParkinson"],
                    ["otra_neuro", "condOther"],
                    ["prefiero_no_decir", "condPrivate"],
                  ] as const
                ).map(([value, key]) => (
                  <Chip
                    key={value}
                    active={condicionInteres === value}
                    label={t(`form.${key}`)}
                    onClick={() => setCondicionInteres(value)}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">{t("form.conditionHint")}</p>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-cyan-300/90">
                {t("form.contextLabel")}
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {(
                  [
                    ["consultorio", "ctxClinic"],
                    ["domicilio", "ctxHome"],
                    ["ambos", "ctxBoth"],
                  ] as const
                ).map(([value, key]) => (
                  <Chip
                    key={value}
                    active={contextoUso === value}
                    label={t(`form.${key}`)}
                    onClick={() => setContextoUso(value)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-300">
                {t("form.termsTitle")}
              </p>
              {[
                ["acceptsTerms", acceptsTerms, setAcceptsTerms, "termsAccept"],
                ["confirmsAdult", confirmsAdult, setConfirmsAdult, "adultAccept"],
                ["declaresResponsible", declaresResponsible, setDeclaresResponsible, "responsibleAccept"],
              ].map(([id, checked, setter, labelKey]) => (
                <label key={String(id)} className="flex items-start gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    className="mt-1 accent-cyan-400"
                    checked={checked as boolean}
                    onChange={(e) => (setter as (v: boolean) => void)(e.target.checked)}
                  />
                  <span>{t(`form.${labelKey as string}`)}</span>
                </label>
              ))}
            </div>

            {error ? <p className="text-sm font-semibold text-rose-400">{error}</p> : null}

            <button
              type="button"
              onClick={onContinue}
              disabled={!canContinue}
              className="balanx-btn-dopamine balanx-glow-amber flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("form.cta")} <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-center text-xs text-slate-500">{t("form.footnote")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
