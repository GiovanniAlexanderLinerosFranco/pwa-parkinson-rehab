'use client';
import React from 'react';
import { ArrowLeft, Zap, ClipboardList } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function UpdrsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--balanx-bg)] p-6 text-slate-100 md:p-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.1),_transparent_50%),radial-gradient(circle_at_bottom_right,_rgba(52,211,153,0.08),_transparent_45%)]" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <Link
          href="/app"
          className="mb-8 flex items-center gap-2 font-bold text-cyan-300 hover:text-cyan-200"
        >
          <ArrowLeft size={20} /> Volver a la Consola
        </Link>

        <div className="mb-10 flex items-center gap-4">
          <div className="rounded-2xl border border-amber-400/30 bg-amber-500/15 p-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Zap size={32} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-50">Escala UPDRS</h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              Monitoreo de Síntomas Motores
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="balanx-glass balanx-glow-cyan rounded-2xl p-8">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-50">
              <ClipboardList className="text-cyan-400" /> Parte III: Examen Motor
            </h3>
            <ul className="space-y-4">
              {['Temblor en reposo', 'Bradicinesia', 'Rigidez', 'Estabilidad Postural'].map(
                (sintoma) => (
                  <li
                    key={sintoma}
                    className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/50 p-3"
                  >
                    <span className="text-sm font-medium text-slate-200">{sintoma}</span>
                    <select className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-cyan-400/50 focus:outline-none">
                      <option>0 - Normal</option>
                      <option>1 - Leve</option>
                      <option>2 - Moderado</option>
                      <option>3 - Grave</option>
                    </select>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 p-8 text-center shadow-[0_0_28px_rgba(52,211,153,0.15)]">
            <h4 className="mb-2 text-2xl font-black text-slate-50">Validación de Datos</h4>
            <p className="mb-6 text-sm text-slate-300">
              El registro de síntomas motores permite ajustar el nivel de dificultad de los
              Exergames de Realidad Virtual.
            </p>
            <button className="balanx-btn-dopamine balanx-glow-amber rounded-2xl py-4 uppercase tracking-wider transition-all">
              Generar Reporte Clínico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
