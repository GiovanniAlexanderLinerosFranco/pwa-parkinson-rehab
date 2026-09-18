'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import BrandLogo from '@/app/components/BrandLogo';

export default function ValidacionExpertos() {
  const supabase = createClient();
  const [form, setForm] = useState({
    nombre: '',
    pertinencia: 5,
    aplicabilidad: 5,
    claridad: 5,
    utilidad: 5,
    observaciones: '',
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('validacion_expertos').insert([
      {
        nombre_experto: form.nombre,
        pertinencia: form.pertinencia,
        aplicabilidad: form.aplicabilidad,
        claridad: form.claridad,
        utilidad_clinica: form.utilidad,
        observaciones: form.observaciones,
      },
    ]);

    if (error) {
      alert('Hubo un error de conexión: ' + error.message);
    } else {
      setEnviado(true);
    }
  };

  if (enviado) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--balanx-bg)] p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(52,211,153,0.12),_transparent_55%)]" />
        <div className="balanx-glass balanx-glow-emerald relative z-10 w-full max-w-md rounded-2xl border-t-4 border-emerald-400 p-8 text-center">
          <BrandLogo size="sm" className="mx-auto mb-4" />
          <h2 className="mb-4 text-2xl font-bold text-emerald-300">¡Validación Recibida!</h2>
          <p className="text-slate-400">
            Agradecemos profundamente su tiempo y juicio clínico en la evaluación de esta
            herramienta tecnológica.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--balanx-bg)] px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_50%)]" />
      <div className="balanx-glass balanx-glow-cyan relative z-10 mx-auto max-w-3xl overflow-hidden rounded-2xl">
        <div className="border-b border-cyan-500/20 bg-slate-950/60 px-6 py-8 text-center">
          <BrandLogo size="md" className="mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-slate-50">Portal de Validación Clínica</h1>
          <p className="mt-2 text-cyan-200/80">
            Evaluación de Herramienta Digital para Prevención de Caídas en EP (Enfermedad de
            Parkinson)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-8">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Nombre del Profesional Experto
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-xl border border-slate-700/80 bg-slate-950/60 p-2 text-slate-100 shadow-sm focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>

          {[
            {
              id: 'pertinencia',
              label: '1. Pertinencia',
              desc: '¿El diseño responde a las necesidades actuales del contexto colombiano?',
            },
            {
              id: 'aplicabilidad',
              label: '2. Aplicabilidad',
              desc: '¿Es viable implementar esta herramienta en un consultorio promedio?',
            },
            {
              id: 'claridad',
              label: '3. Claridad',
              desc: '¿La interfaz y las alertas de riesgo son fáciles de comprender?',
            },
            {
              id: 'utilidad',
              label: '4. Utilidad Clínica',
              desc: '¿Facilita la toma de decisiones para prevenir caídas de forma objetiva?',
            },
          ].map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4"
            >
              <label className="block text-base font-bold text-slate-100">{item.label}</label>
              <p className="mb-3 text-sm text-slate-400">{item.desc}</p>
              <div className="flex max-w-md items-center justify-between">
                <span className="text-xs text-slate-500">Totalmente en desacuerdo</span>
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num} className="flex cursor-pointer flex-col items-center">
                    <input
                      type="radio"
                      name={item.id}
                      value={num}
                      required
                      className="h-5 w-5 border-slate-600 text-cyan-500 focus:ring-cyan-400"
                      defaultChecked={num === 5}
                      onChange={(e) =>
                        setForm({ ...form, [item.id]: parseInt(e.target.value) })
                      }
                    />
                    <span className="mt-1 text-sm font-medium text-slate-300">{num}</span>
                  </label>
                ))}
                <span className="text-xs text-slate-500">Totalmente de acuerdo</span>
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Observaciones o recomendaciones (Opcional)
            </label>
            <textarea
              rows={4}
              className="mt-1 block w-full rounded-xl border border-slate-700/80 bg-slate-950/60 p-2 text-slate-100 shadow-sm focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="balanx-btn-primary balanx-glow-cyan flex w-full justify-center rounded-xl px-4 py-3 text-lg transition-all"
          >
            Enviar Validación Oficial
          </button>
        </form>
      </div>
    </div>
  );
}
