import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TermsDocument } from "@/app/components/TermsDocument";
import BrandLogo from "@/app/components/BrandLogo";

export default async function TerminosPage() {
  const t = await getTranslations("Terms");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--balanx-bg)] px-4 py-10 text-slate-100 md:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.1),_transparent_50%)]" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
          >
            <ArrowLeft size={16} /> {t("backHome")}
          </Link>
          <BrandLogo size="sm" />
        </div>
        <div className="balanx-glass balanx-glow-cyan rounded-2xl p-6 md:p-8">
          <TermsDocument />
        </div>
      </div>
    </div>
  );
}
