'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ValidacionExpertos() {
  const [form, setForm] = useState({
    nombre: '', pertinencia: 5, aplicabilidad: 5, claridad: 5, utilidad: 5, observaciones: ''
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
        observaciones: form.observaciones
      }
    ]);
    
    // Aquí está el chismoso:
    if (error) {
      alert("Hubo un error de conexión: " + error.message);
    } else {
      setEnviado(true);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-red-800">
          <h2 className="text-2xl font-bold text-red-800 mb-4">¡Validación Recibida!</h2>
          <p className="text-gray-600">Agradecemos profundamente su tiempo y juicio clínico en la evaluación de esta herramienta tecnológica.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-red-800 px-6 py-8 text-center">
          <h1 className="text-3xl font-extrabold text-white">Portal de Validación Clínica</h1>
          <p className="mt-2 text-red-100">Evaluación de Herramienta Digital para Prevención de Caídas en EP</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Profesional Experto</label>
            <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border" 
              onChange={e => setForm({...form, nombre: e.target.value})} />
          </div>

          {[
            { id: 'pertinencia', label: '1. Pertinencia', desc: '¿El diseño responde a las necesidades actuales del contexto colombiano?' },
            { id: 'aplicabilidad', label: '2. Aplicabilidad', desc: '¿Es viable implementar esta herramienta en un consultorio promedio?' },
            { id: 'claridad', label: '3. Claridad', desc: '¿La interfaz y las alertas de riesgo son fáciles de comprender?' },
            { id: 'utilidad', label: '4. Utilidad Clínica', desc: '¿Facilita la toma de decisiones para prevenir caídas de forma objetiva?' },
          ].map((item) => (
            <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-base font-bold text-gray-900">{item.label}</label>
              <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
              <div className="flex justify-between items-center max-w-md">
                <span className="text-xs text-gray-400">Totalmente en desacuerdo</span>
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num} className="flex flex-col items-center cursor-pointer">
                    <input type="radio" name={item.id} value={num} required className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
                      defaultChecked={num === 5}
                      onChange={(e) => setForm({...form, [item.id]: parseInt(e.target.value)})} />
                    <span className="mt-1 text-sm font-medium text-gray-700">{num}</span>
                  </label>
                ))}
                <span className="text-xs text-gray-400">Totalmente de acuerdo</span>
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">Observaciones o recomendaciones (Opcional)</label>
            <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
              onChange={e => setForm({...form, observaciones: e.target.value})}></textarea>
          </div>

          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
            Enviar Validación Oficial
          </button>
        </form>
      </div>
    </div>
  );
}