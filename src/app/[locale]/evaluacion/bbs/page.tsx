'use client';
import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function BbsPage() {
  const [puntajes, setPuntajes] = useState<number[]>(new Array(14).fill(0));
  const total = puntajes.reduce((a, b) => a + b, 0);

  const items = [
    '1. De sedestación a bipedestación',
    '2. Bipedestación sin apoyo',
    '3. Sentado sin apoyo dorsal',
    '4. De bipedestación a sedestación',
    '5. Transferencias',
    '6. Bipedestación con ojos cerrados',
    '7. Bipedestación con pies juntos',
    '8. Alcanzar hacia delante con brazo extendido',
    '9. Recoger objeto del suelo',
    '10. Girar para mirar atrás',
    '11. Girar 360 grados',
    '12. Situar pies alternativamente en un escalón',
    '13. Bipedestación con un pie adelantado',
    '14. Bipedestación sobre un solo pie',
  ];

  const manejarCambio = (index: number, valor: number) => {
    const nuevosPuntajes = [...puntajes];
    nuevosPuntajes[index] = valor;
    setPuntajes(nuevosPuntajes);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--balanx-bg)] p-6 text-slate-100 md:p-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.1),_transparent_50%)]" />
      <div className="relative z-10">
        <Link
          href="/app"
          className="mb-8 flex items-center gap-2 font-bold text-cyan-300 hover:text-cyan-200"
        >
          <ArrowLeft size={20} /> Volver al Inicio
        </Link>

        <div className="balanx-glass balanx-glow-cyan mx-auto max-w-4xl rounded-2xl p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-3xl font-black text-slate-50">Escala de Berg (BBS)</h1>
              <p className="text-slate-400 italic">
                Evaluación de equilibrio estático y dinámico.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-400/40 bg-cyan-500/15 px-8 py-4 text-center shadow-[0_0_24px_rgba(34,211,238,0.2)]">
              <span className="block text-xs font-bold uppercase text-cyan-200/80">
                Puntaje Total
              </span>
              <span className="text-4xl font-black text-slate-50">{total}/56</span>
            </div>
          </div>

          <div className="mb-10 space-y-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 md:flex-row md:items-center"
              >
                <span className="text-sm font-bold text-slate-200">{item}</span>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((v) => (
                    <button
                      key={v}
                      onClick={() => manejarCambio(idx, v)}
                      className={`h-10 w-10 rounded-xl font-bold transition-all ${
                        puntajes[idx] === v
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_16px_rgba(34,211,238,0.35)] scale-110'
                          : 'border border-slate-700 bg-slate-950/60 text-slate-400 hover:border-cyan-400/40'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-6 sm:flex-row sm:items-center">
            <div>
              <h4 className="font-bold text-emerald-400">Interpretación:</h4>
              <p className="text-sm text-slate-300">
                {total <= 20
                  ? 'Riesgo alto de caída (Silla de ruedas)'
                  : total <= 40
                    ? 'Riesgo medio de caída (Asistencia)'
                    : 'Riesgo bajo de caída (Independiente)'}
              </p>
            </div>
            <button className="balanx-btn-primary balanx-glow-cyan flex items-center justify-center gap-2 rounded-2xl px-6 py-3">
              <Save size={18} /> Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
