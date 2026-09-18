'use client';

import { useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import ClinicalInfoModal from './ClinicalInfoModal';
import BrandLogo from './BrandLogo';
import { usePathname, useRouter, Link } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';

export default function GlobalHeader() {
  const [openClinicalInfo, setOpenClinicalInfo] = useState(false);
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const supabase = createClient();

  const onLocaleChange = (next: AppLocale) => {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/verify') ||
    pathname.startsWith('/recovery') ||
    pathname.startsWith('/update-password') ||
    pathname.startsWith('/auth');

  const isLanding = pathname === '/' || pathname === '';
  const isApp =
    pathname.startsWith('/app') ||
    pathname.startsWith('/evaluacion') ||
    pathname.startsWith('/ejemplos-sesion-clinica') ||
    pathname.startsWith('/validacion');

  return (
    <>
      {isApp && !isAuthRoute ? (
        <Link
          href="/app"
          className="fixed left-4 top-3 z-40 rounded-xl border border-cyan-500/20 bg-slate-900/70 px-2 py-1 shadow-[0_0_16px_rgba(34,211,238,0.12)] backdrop-blur-md"
          aria-label="BALANX"
        >
          <BrandLogo size="sm" className="!h-10" />
        </Link>
      ) : null}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <label className="sr-only" htmlFor="balanx-lang">
          {t('nav.lang')}
        </label>
        <select
          id="balanx-lang"
          value={locale}
          disabled={pending}
          onChange={(e) => onLocaleChange(e.target.value as AppLocale)}
          className="rounded-lg border border-cyan-500/20 bg-slate-900/80 px-2 py-2 text-xs font-bold text-slate-100 shadow-[0_0_16px_rgba(34,211,238,0.12)] backdrop-blur-md"
        >
          {routing.locales.map((code) => (
            <option key={code} value={code} className="bg-slate-900">
              {code.toUpperCase()}
            </option>
          ))}
        </select>
        {isApp && !isAuthRoute ? (
          <>
            <button
              onClick={() => setOpenClinicalInfo(true)}
              className="rounded-lg border border-cyan-400/30 bg-cyan-500/15 px-4 py-2 text-xs font-bold text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.18)] backdrop-blur-md transition-all hover:bg-cyan-500/25"
            >
              {t('nav.fundamentals')}
            </button>
            <button
              onClick={onLogout}
              className="rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-xs font-bold text-slate-200 backdrop-blur-md hover:border-amber-400/40 hover:text-amber-100"
            >
              {t('nav.logout')}
            </button>
          </>
        ) : null}
        {(isLanding || isAuthRoute) && (
          <Link
            href="/login"
            className="rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-xs font-bold text-slate-200 backdrop-blur-md hover:border-cyan-400/40"
          >
            {t('nav.login')}
          </Link>
        )}
      </div>
      <ClinicalInfoModal open={openClinicalInfo} onClose={() => setOpenClinicalInfo(false)} />
    </>
  );
}
