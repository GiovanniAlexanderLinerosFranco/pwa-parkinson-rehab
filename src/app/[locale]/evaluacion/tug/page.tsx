'use client';
import React, { useState, useEffect } from 'react';
import { Timer, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function TugPage() {
  const [tiempo, setTiempo] = useState(0);
  const [corriendo, setCorriendo] = useState(false);

  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval> | undefined;
    if (corriendo) {
      intervalo = setInterval(() => setTiempo((t) => t + 0.1), 100);
    }
    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [corriendo]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--balanx-bg)] p-6 text-slate-100 md:p-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.1),_transparent_50%)]" />
      <div className="relative z-10">
        <Link
          href="/app"
          className="mb-8 flex items-center gap-2 font-bold text-cyan-300 hover:text-cyan-200"
        >
          <ArrowLeft size={20} /> Volver a la Guía de Intervención
        </Link>

        <div className="balanx-glass balanx-glow-cyan mx-auto max-w-4xl rounded-2xl p-8">
          <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-50">
            Prueba: Timed Up and Go (TUG)
          </h1>
          <p className="mb-8 text-slate-400 italic">
            Evaluar la velocidad y seguridad al caminar.
          </p>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-10 text-center shadow-[0_0_24px_rgba(34,211,238,0.12)]">
              <Timer className="mx-auto mb-4 text-cyan-400" size={48} />
              <div className="mb-6 font-mono text-6xl font-bold text-slate-50">
                {tiempo.toFixed(1)}s
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setCorriendo(!corriendo)}
                  className={`rounded-xl px-8 py-3 font-bold transition-all ${
                    corriendo
                      ? 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                      : 'balanx-btn-primary balanx-glow-cyan'
                  }`}
                >
                  {corriendo ? 'DETENER' : 'INICIAR'}
                </button>
                <button
                  onClick={() => {
                    setTiempo(0);
                    setCorriendo(false);
                  }}
                  className="rounded-xl border border-slate-700/80 bg-slate-900/70 p-3 text-slate-200 hover:border-cyan-500/40"
                >
                  Reiniciar
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase text-emerald-300">
                  <AlertCircle size={16} /> Interpretación Clínica
                </h4>
                <ul className="space-y-2 text-xs font-medium text-slate-300">
                  <li>
                    • <span className="text-emerald-400">Normal:</span> Menos de 10 segundos.
                  </li>
                  <li>
                    • <span className="text-amber-400">Riesgo leve:</span> 11 a 20 segundos.
                  </li>
                  <li>
                    • <span className="text-rose-400">Riesgo alto:</span> Más de 20 segundos.
                  </li>
                </ul>
              </div>
              <textarea
                placeholder="Observaciones de la marcha (bradicinesia, giros, etc.)..."
                className="h-32 w-full rounded-2xl border border-slate-700/80 bg-slate-950/60 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none"
              />
              <button className="balanx-btn-primary balanx-glow-cyan flex w-full items-center justify-center gap-2 rounded-2xl py-4 transition-all">
                <Save size={18} /> GUARDAR RESULTADO EN EXPEDIENTE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
