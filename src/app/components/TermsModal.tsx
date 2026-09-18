"use client";

import { useTranslations } from "next-intl";
import { TermsDocument } from "@/app/components/TermsDocument";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function TermsModal({ open, onClose }: Props) {
  const t = useTranslations("Terms");
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
    >
      <div
        className="balanx-glass balanx-glow-cyan flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-cyan-500/20 bg-slate-950/90 px-4 py-3">
          <h2 className="text-sm font-bold text-cyan-100 md:text-base">{t("modalTitle")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-300 hover:bg-cyan-500/20 hover:text-white"
            aria-label={t("close")}
          >
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
          <TermsDocument />
        </div>
        <footer className="shrink-0 border-t border-cyan-500/20 bg-slate-950/90 p-4">
          <button
            type="button"
            onClick={onClose}
            className="balanx-btn-primary balanx-glow-cyan w-full rounded-xl py-3 text-sm"
          >
            {t("closeRead")}
          </button>
        </footer>
      </div>
    </div>
  );
}
