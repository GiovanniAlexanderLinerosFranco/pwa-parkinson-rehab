'use client';
import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function FgaPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--balanx-bg)] p-6 text-slate-100 md:p-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.1),_transparent_50%)]" />
      <div className="relative z-10">
        <Link
          href="/app"
          className="mb-8 flex items-center gap-2 font-bold text-cyan-300 hover:text-cyan-200"
        >
          <ArrowLeft size={20} /> Volver
        </Link>

        <div className="balanx-glass balanx-glow-cyan mx-auto max-w-3xl rounded-2xl p-8">
          <h1 className="mb-4 text-3xl font-black text-slate-50">
            Functional Gait Assessment (FGA)
          </h1>
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-4">
            <Info className="shrink-0 text-cyan-400" />
            <p className="text-xs text-slate-300">
              Esta prueba evalúa el control postural durante la marcha. Incluye caminar con ojos
              cerrados, giros y pasos sobre obstáculos.
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 transition-colors hover:border-cyan-500/40">
              <h3 className="mb-4 font-bold italic text-slate-200">
                &quot;Caminar 6 metros con cambios en la velocidad de la marcha...&quot;
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((n) => (
                  <button
                    key={n}
                    className="rounded-xl border border-slate-700 bg-slate-950/60 py-3 font-bold text-slate-400 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/20 hover:text-cyan-100 hover:shadow-[0_0_16px_rgba(34,211,238,0.2)]"
                  >
                    Nivel {n}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-center text-sm text-slate-500">
              Componentes del FGA (Functional Gait Assessment) habilitados para el prototipo digital.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
