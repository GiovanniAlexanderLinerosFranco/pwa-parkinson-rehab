'use client';

import { useTranslations } from 'next-intl';

export default function ClinicalInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('clinicalInfo');
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('title')}
    >
      <div
        className="balanx-glass balanx-glow-cyan w-full max-w-2xl overflow-hidden rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-cyan-500/20 bg-slate-950/80 px-4 py-3 text-cyan-100">
          <h2 className="text-base font-semibold">{t('title')}</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-cyan-500/20" aria-label={t('close')}>
            ✕
          </button>
        </header>
        <div className="space-y-4 p-4 text-sm text-slate-300">
          <section>
            <h3 className="mb-1 font-semibold text-cyan-200">{t('s1t')}</h3>
            <p>{t('s1')}</p>
          </section>
          <section>
            <h3 className="mb-1 font-semibold text-cyan-200">{t('s2t')}</h3>
            <p>{t('s2')}</p>
          </section>
          <section>
            <h3 className="mb-1 font-semibold text-emerald-300">{t('s3t')}</h3>
            <p>{t('s3')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
