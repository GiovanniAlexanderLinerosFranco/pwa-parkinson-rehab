'use client';
import React, { useState, useEffect } from 'react';
import { Timer, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TugPage() {
  const [tiempo, setTiempo] = useState(0);
  const [corriendo, setCorriendo] = useState(false);

  useEffect(() => {
    let intervalo: any;
    if (corriendo) {
      intervalo = setInterval(() => setTiempo(t => t + 0.1), 100);
    }
    return () => clearInterval(intervalo);
  }, [corriendo]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <Link href="/" className="flex items-center gap-2 text-blue-600 mb-8 hover:underline">
        <ArrowLeft size={20} /> Volver a la Guía de Intervención
      </Link>

      <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 shadow-sm border">
        <h1 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">Prueba: Timed Up and Go (TUG)</h1>
        <p className="text-slate-500 mb-8 italic">Evaluar la velocidad y seguridad al caminar.</p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center p-10 bg-slate-900 rounded-[40px] text-white">
            <Timer className="mx-auto mb-4 text-blue-400" size={48} />
            <div className="text-6xl font-mono font-bold mb-6">{tiempo.toFixed(1)}s</div>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setCorriendo(!corriendo)}
                className={`px-8 py-3 rounded-full font-bold transition-all ${corriendo ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {corriendo ? 'DETENER' : 'INICIAR'}
              </button>
              <button onClick={() => {setTiempo(0); setCorriendo(false);}} className="p-3 bg-slate-700 rounded-full hover:bg-slate-600">
                Reiniciar
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2 text-sm uppercase">
                <AlertCircle size={16} /> Interpretación Clínica [cite: 226, 246]
              </h4>
              <ul className="text-xs space-y-2 text-slate-600 font-medium">
                <li>• <span className="text-emerald-600">Normal:</span> Menos de 10 segundos.</li>
                <li>• <span className="text-orange-500">Riesgo leve:</span> 11 a 20 segundos.</li>
                <li>• <span className="text-red-500">Riesgo alto:</span> Más de 20 segundos.</li>
              </ul>
            </div>
            <textarea placeholder="Observaciones de la marcha (bradicinesia, giros, etc.)..." className="w-full p-4 border rounded-2xl h-32 text-sm" />
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
              <Save size={18} /> GUARDAR RESULTADO EN EXPEDIENTE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}