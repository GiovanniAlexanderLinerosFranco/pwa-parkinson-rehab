"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { passwordChecks } from "@/lib/authPassword";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showStrength?: boolean;
  name?: string;
  autoComplete?: string;
  required?: boolean;
};

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  label,
  showStrength = false,
  name = "password",
  autoComplete = "current-password",
  required = true,
}: Props) {
  const t = useTranslations("AuthPages.password");
  const [visible, setVisible] = useState(false);
  const checks = passwordChecks(value);
  const score = [checks.length, checks.upper, checks.number, checks.symbol].filter(Boolean).length;

  return (
    <div>
      {label ? (
        <label className="mb-2 ml-1 block text-sm font-bold text-cyan-100">{label}</label>
      ) : null}
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-3.5 pl-4 pr-12 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/60"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-cyan-300"
          aria-label={visible ? t("hide") : t("show")}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {showStrength ? (
        <div className="mt-3 space-y-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded ${score >= n ? "bg-emerald-400" : "bg-slate-700"}`}
              />
            ))}
          </div>
          <ul className="space-y-1 text-xs text-slate-400">
            <li className={checks.length ? "text-emerald-400" : ""}>{t("ruleLength")}</li>
            <li className={checks.upper ? "text-emerald-400" : ""}>{t("ruleUpper")}</li>
            <li className={checks.number ? "text-emerald-400" : ""}>{t("ruleNumber")}</li>
            <li className={checks.symbol ? "text-emerald-400" : ""}>{t("ruleSymbol")}</li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
