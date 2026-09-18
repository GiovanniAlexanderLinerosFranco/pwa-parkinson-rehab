import { Link } from '@/i18n/navigation';
import { ArrowLeft, BookOpenCheck, ClipboardCheck, FileText, Stethoscope } from 'lucide-react';
import BrandLogo from '@/app/components/BrandLogo';

const pruebas = [
  {
    nombre: 'TUG Cognitivo',
    objetivo: 'Evaluar movilidad funcional y riesgo de caidas en doble tarea.',
    ruta: '/evaluacion/tug',
  },
  {
    nombre: 'BBS (Berg Balance Scale)',
    objetivo: 'Valorar equilibrio estatico y dinamico en 14 items funcionales.',
    ruta: '/evaluacion/bbs',
  },
  {
    nombre: 'FGA (Functional Gait Assessment)',
    objetivo: 'Evaluar estabilidad durante marcha y adaptacion a desafios.',
    ruta: '/evaluacion/fga',
  },
  {
    nombre: 'UPDRS Motor',
    objetivo: 'Registrar progresion motora y hallazgos clinicos relevantes.',
    ruta: '/evaluacion/updrs',
  },
];

export default function EjemplosSesionClinicaPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--balanx-bg)] px-6 py-10 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.1),_transparent_50%)]" />
      <div className="relative z-10 mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 font-semibold text-cyan-300 hover:text-cyan-200"
          >
            <ArrowLeft size={18} /> Volver a la Guia Principal
          </Link>
          <BrandLogo size="sm" />
        </div>

        <section className="balanx-glass balanx-glow-cyan rounded-2xl p-8">
          <div className="mb-3 flex items-center gap-3 text-cyan-300">
            <BookOpenCheck size={24} />
            <h1 className="text-3xl font-black text-slate-50">Ejemplos de Sesion Clinica</h1>
          </div>
          <p className="text-sm text-slate-400">
            Esta guia describe el uso operativo de la PWA (Progressive Web App) BALANX para
            fisioterapia neurologica en Parkinson, integrando perfil del paciente, bateria clinica,
            monitoreo de sesion y guardado de resultados.
          </p>
        </section>

        <section className="balanx-glass rounded-2xl p-8">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-extrabold text-cyan-300">
            <Stethoscope size={20} /> Flujo de uso detallado en consulta
          </h2>
          <ol className="list-inside list-decimal space-y-2 text-sm text-slate-300">
            <li>Abra la PWA e inicie sesion con su cuenta profesional.</li>
            <li>
              Complete Perfil del Paciente: nombre, estadio Hoehn y Yahr, MMSE (Mini-Mental State
              Examination) y profesional responsable.
            </li>
            <li>Registre la evaluacion socio-ambiental con barreras y red de apoyo del hogar.</li>
            <li>Seleccione la primera prueba clinica segun prioridad funcional (TUG o BBS).</li>
            <li>Registre el resultado de la prueba y valide que cambie a estado Completa.</li>
            <li>
              Aplique una segunda prueba (FGA o UPDRS) para cumplir integridad minima de guardado.
            </li>
            <li>
              Use Cueing Ritmico para trabajo de marcha con BPM (beats per minute) ajustado entre 40
              y 120.
            </li>
            <li>
              Gestione Monitoreo de Sesion con protocolo total de 30 minutos: 5 min de calentamiento,
              20 min de intervencion digital y 5 min de enfriamiento.
            </li>
            <li>Documente hallazgos clinicos en Seguimiento Meta Terapeutica.</li>
            <li>Guarde la valoracion y confirme el mensaje de registro exitoso.</li>
          </ol>
        </section>

        <section className="balanx-glass rounded-2xl p-8">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-emerald-300">
            <ClipboardCheck size={20} /> Pruebas conectadas en la PWA
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {pruebas.map((prueba) => (
              <article
                key={prueba.nombre}
                className="rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)]"
              >
                <h3 className="text-base font-bold text-slate-50">{prueba.nombre}</h3>
                <p className="mt-1 text-sm text-slate-400">{prueba.objetivo}</p>
                <Link
                  href={prueba.ruta}
                  className="balanx-btn-primary mt-3 inline-flex rounded-xl px-3 py-2 text-xs"
                >
                  Abrir prueba
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="balanx-glass balanx-glow-amber rounded-2xl p-8">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-extrabold text-amber-300">
            <FileText size={20} /> Caso simulado de referencia
          </h2>
          <p className="text-sm leading-6 text-slate-300">
            Paciente en estadio II, MMSE 27. Se realiza TUG cognitivo (resultado completo), luego
            UPDRS motor para completar al menos 2 pruebas. Se registra observacion clinica, se aplica
            sesion de 30 minutos (5/20/5) y se guarda la valoracion para seguimiento. Este flujo
            corresponde al recorrido minimo recomendado para uso asistencial seguro.
          </p>
        </section>
      </div>
    </div>
  );
}
