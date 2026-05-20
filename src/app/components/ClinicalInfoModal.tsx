'use client';

export default function ClinicalInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <header className="bg-red-800 text-white px-4 py-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Fundamentación y Uso Clínico</h2>
          <button onClick={onClose} className="text-white hover:bg-red-900 p-1 rounded">✕</button>
        </header>
        <div className="p-4 space-y-4 text-sm text-gray-800">
          <section>
            <h3 className="font-semibold mb-1">1. Fundamento Clínico</h3>
            <p>Los estímulos auditivos rítmicos favorecen el acoplamiento sensoriomotor y ayudan a activar rutas compensatorias (Bypass Neuronal), facilitando el inicio y la continuidad de la marcha en pacientes con EP.</p>
          </section>
          <section>
            <h3 className="font-semibold mb-1">2. Protocolo de Uso</h3>
            <p>Se recomienda que las sesiones de intervención no excedan los 30 minutos totales para evitar la fatiga neuronal, optimizando el rendimiento motor según tolerancia clínica.</p>
          </section>
          <section>
            <h3 className="font-semibold mb-1">3. Instrucciones de Doble Tarea</h3>
            <p>Incorporar tareas simultáneas de alta complejidad (conteo regresivo, denominación semántica, fluidez verbal) para entrenar el control atencional y el desempeño funcional durante la deambulación.</p>
          </section>
        </div>
      </div>
    </div>
  );
}