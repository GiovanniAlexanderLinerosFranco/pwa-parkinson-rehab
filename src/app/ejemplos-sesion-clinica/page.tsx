import Link from 'next/link';
import { ArrowLeft, BookOpenCheck, ClipboardCheck, FileText, Stethoscope } from 'lucide-react';

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
    <div className="min-h-screen bg-red-50 text-slate-900 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-red-800 font-semibold hover:underline"
        >
          <ArrowLeft size={18} /> Volver a la Guia Principal
        </Link>

        <section className="bg-white border border-red-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-3 text-red-800">
            <BookOpenCheck size={24} />
            <h1 className="text-3xl font-black">Ejemplos de Sesion Clinica</h1>
          </div>
          <p className="text-slate-600 text-sm">
            Esta guia describe el uso operativo de la PWA para fisioterapia neurologica en Parkinson,
            integrando perfil del paciente, bateria clinica, monitoreo de sesion y guardado de resultados.
          </p>
        </section>

        <section className="bg-white border border-red-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-red-800 mb-3 flex items-center gap-2">
            <Stethoscope size={20} /> Flujo de uso detallado en consulta
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
            <li>Abra la PWA y valide el escudo de acceso profesional.</li>
            <li>Complete Perfil del Paciente: nombre, estadio Hoehn y Yahr, MMSE y profesional responsable.</li>
            <li>Registre la evaluacion socio-ambiental con barreras y red de apoyo del hogar.</li>
            <li>Seleccione la primera prueba clinica segun prioridad funcional (TUG o BBS).</li>
            <li>Registre el resultado de la prueba y valide que cambie a estado Completa.</li>
            <li>Aplique una segunda prueba (FGA o UPDRS) para cumplir integridad minima de guardado.</li>
            <li>Use Cueing Ritmico para trabajo de marcha con BPM ajustado entre 40 y 120.</li>
            <li>
              Gestione Monitoreo de Sesion con protocolo total de 30 minutos:
              5 min de calentamiento, 20 min de intervencion digital y 5 min de enfriamiento.
            </li>
            <li>Documente hallazgos clinicos en Seguimiento Meta Terapeutica.</li>
            <li>Guarde la valoracion y confirme el mensaje de registro exitoso.</li>
          </ol>
        </section>

        <section className="bg-white border border-red-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-red-800 mb-4 flex items-center gap-2">
            <ClipboardCheck size={20} /> Pruebas conectadas en la PWA
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {pruebas.map((prueba) => (
              <article key={prueba.nombre} className="border border-red-100 rounded-2xl p-4 bg-red-50/40">
                <h3 className="font-bold text-red-900 text-base">{prueba.nombre}</h3>
                <p className="text-sm text-slate-600 mt-1">{prueba.objetivo}</p>
                <Link
                  href={prueba.ruta}
                  className="inline-flex mt-3 px-3 py-2 rounded-lg bg-red-800 text-white text-xs font-bold hover:bg-red-900"
                >
                  Abrir prueba
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white border border-red-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-red-800 mb-3 flex items-center gap-2">
            <FileText size={20} /> Caso simulado de referencia
          </h2>
          <p className="text-sm text-slate-700 leading-6">
            Paciente en estadio II, MMSE 27. Se realiza TUG cognitivo (resultado completo),
            luego UPDRS motor para completar al menos 2 pruebas. Se registra observacion clinica,
            se aplica sesion de 30 minutos (5/20/5) y se guarda la valoracion para seguimiento.
            Este flujo corresponde al recorrido minimo recomendado para uso asistencial seguro.
          </p>
        </section>
      </div>
    </div>
  );
}
