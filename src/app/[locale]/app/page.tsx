'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity, ShieldCheck, ClipboardCheck,
  Layers, X, Play, Pause, RotateCcw, Save, Download, Volume2
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { brand } from '@/lib/brand';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

const BBS_ITEMS = [
  'Sedente a bipedestación',
  'Bipedestación sin apoyo',
  'Sedente sin apoyo',
  'Bipedestación a sedente',
  'Transferencias',
  'Bipedestación con ojos cerrados',
  'Bipedestación con pies juntos',
  'Alcance hacia adelante con brazo extendido',
  'Recoger objeto del piso',
  'Giro para mirar atrás',
  'Giro de 360 grados',
  'Colocar un pie sobre escalón',
  'Bipedestación en tándem',
  'Bipedestación a una pierna',
];

const FGA_ITEMS = [
  'Marcha en superficie plana',
  'Cambio de velocidad de marcha',
  'Marcha con giro horizontal de cabeza',
  'Marcha con giro vertical de cabeza',
  'Giro y pivote durante la marcha',
  'Paso sobre obstáculo',
  'Marcha con base estrecha',
  'Marcha con ojos cerrados',
  'Marcha hacia atrás',
  'Subir y bajar escaleras',
];

type NivelRiesgo = 'alto' | 'medio' | 'bajo' | 'neutro';
type EstadoPrueba = 'No iniciada' | 'Parcial' | 'Completa';

type ValoracionPayload = {
  nombre_paciente: string;
  estadio_parkinson: string;
  evaluacion_entorno: string;
  resultado_tug_cognitivo: string;
  resultado_berg: string;
  resultado_fga: string;
  resultado_updrs: string;
  observaciones_clinicas: string;
  auth_user_id?: string;
};

type ValoracionPendiente = {
  id: string;
  payload: ValoracionPayload;
  createdAt: string;
};

const OFFLINE_QUEUE_KEY = brand.offlineQueueKey;
const MAX_PENDING_PREVIEW = 3;

type ModoCueing = 'both' | 'audio' | 'light';

export default function GuiaDeIntervencionInteractiva() {
  const t = useTranslations();
  const supabase = createClient();
  const [pruebaSeleccionada, setPruebaSeleccionada] = useState<string | null>(null);
  const [segundos, setSegundos] = useState(1800);
  const [timerActivo, setTimerActivo] = useState(false);
  const [tugCorriendo, setTugCorriendo] = useState(false);
  const [tugTiempoMs, setTugTiempoMs] = useState(0);
  const [tugRegistradoMs, setTugRegistradoMs] = useState<number | null>(null);
  const [progreso, setProgreso] = useState("");
  const [profesionalResponsable, setProfesionalResponsable] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [sincronizandoPendientes, setSincronizandoPendientes] = useState(false);
  const [pendientesSincronizar, setPendientesSincronizar] = useState(0);
  const [pendientesPreview, setPendientesPreview] = useState<ValoracionPendiente[]>([]);
  const [estadoSincronizacion, setEstadoSincronizacion] = useState<{ tipo: 'ok' | 'warning'; mensaje: string } | null>(null);
  const [perfilPaciente, setPerfilPaciente] = useState({
    nombre: '',
    estadio: '',
    evaluacionSocioAmbiental: '',
  });
  const [updrs, setUpdrs] = useState('');
  const [puntajesBbs, setPuntajesBbs] = useState<number[]>(Array(14).fill(-1));
  const [puntajesFga, setPuntajesFga] = useState<number[]>(Array(10).fill(-1));
  const [resultadosClinicos, setResultadosClinicos] = useState({
    tugCognitivo: '',
    berg: '',
    fga: '',
    updrs: '',
  });
  const [bpm, setBpm] = useState(60);
  const [volumenBip, setVolumenBip] = useState(70);
  const [modoCueing, setModoCueing] = useState<ModoCueing>('both');
  const [metronomoActivo, setMetronomoActivo] = useState(false);
  const [pulsoVisual, setPulsoVisual] = useState(false);
  const tugInicioRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervaloMetronomoRef = useRef<number | null>(null);
  const volumenRef = useRef(volumenBip);
  const modoCueingRef = useRef(modoCueing);

  useEffect(() => {
    volumenRef.current = volumenBip;
  }, [volumenBip]);

  useEffect(() => {
    modoCueingRef.current = modoCueing;
  }, [modoCueing]);

  useEffect(() => {
    let intervalo: any;
    if (timerActivo && segundos > 0) {
      intervalo = setInterval(() => setSegundos((s) => s - 1), 1000);
    } else {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [timerActivo, segundos]);

  useEffect(() => {
    let frameId = 0;
    const actualizarTug = () => {
      if (tugInicioRef.current !== null) {
        setTugTiempoMs(Date.now() - tugInicioRef.current);
        frameId = requestAnimationFrame(actualizarTug);
      }
    };

    if (tugCorriendo) {
      tugInicioRef.current = Date.now() - tugTiempoMs;
      frameId = requestAnimationFrame(actualizarTug);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [tugCorriendo, tugTiempoMs]);

  useEffect(() => {
    const reproducirPulso = () => {
      if (typeof window === 'undefined') {
        return;
      }

      const modo = modoCueingRef.current;
      const usarAudio = modo === 'both' || modo === 'audio';
      const usarLuz = modo === 'both' || modo === 'light';

      if (usarAudio) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          if (!audioContextRef.current) {
            audioContextRef.current = new AudioContextClass();
          }
          const ctx = audioContextRef.current;
          if (ctx) {
            if (ctx.state === 'suspended') {
              void ctx.resume();
            }
            const now = ctx.currentTime;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            const peak = Math.max(0.01, Math.min(0.28, (volumenRef.current / 100) * 0.28));

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, now);
            gainNode.gain.setValueAtTime(0.0001, now);
            gainNode.gain.exponentialRampToValueAtTime(peak, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.start(now);
            oscillator.stop(now + 0.08);
          }
        }
      }

      if (usarLuz) {
        setPulsoVisual(true);
        window.setTimeout(() => setPulsoVisual(false), 160);
      }
    };

    if (metronomoActivo) {
      const intervalo = Math.round(60000 / bpm);
      reproducirPulso();
      intervaloMetronomoRef.current = window.setInterval(reproducirPulso, intervalo);
    } else if (intervaloMetronomoRef.current !== null) {
      window.clearInterval(intervaloMetronomoRef.current);
      intervaloMetronomoRef.current = null;
    }

    return () => {
      if (intervaloMetronomoRef.current !== null) {
        window.clearInterval(intervaloMetronomoRef.current);
        intervaloMetronomoRef.current = null;
      }
    };
  }, [metronomoActivo, bpm]);

  useEffect(() => {
    return () => {
      if (intervaloMetronomoRef.current !== null) {
        window.clearInterval(intervaloMetronomoRef.current);
      }
      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const leerColaLocal = (): ValoracionPendiente[] => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const raw = window.localStorage.getItem(OFFLINE_QUEUE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as ValoracionPendiente[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const escribirColaLocal = (cola: ValoracionPendiente[]) => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(cola));
    setPendientesSincronizar(cola.length);
    setPendientesPreview(cola.slice(-MAX_PENDING_PREVIEW).reverse());
  };

  const encolarValoracion = (payload: ValoracionPayload) => {
    const cola = leerColaLocal();
    const item: ValoracionPendiente = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      payload,
      createdAt: new Date().toISOString(),
    };
    escribirColaLocal([...cola, item]);
  };

  const esErrorDeRed = (error: unknown) => {
    if (!navigator.onLine) {
      return true;
    }
    const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    return msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch');
  };

  const sincronizarColaLocal = async (manual = false) => {
    const cola = leerColaLocal();
    if (cola.length === 0 || !navigator.onLine) {
      setPendientesSincronizar(cola.length);
      setPendientesPreview(cola.slice(-MAX_PENDING_PREVIEW).reverse());
      if (manual && cola.length === 0) {
        setEstadoSincronizacion({ tipo: 'ok', mensaje: 'No hay valoraciones pendientes por sincronizar.' });
      }
      if (manual && cola.length > 0 && !navigator.onLine) {
        setEstadoSincronizacion({ tipo: 'warning', mensaje: 'Sin conexión a internet. No fue posible sincronizar.' });
      }
      return;
    }

    setSincronizandoPendientes(true);
    const pendientes: ValoracionPendiente[] = [];
    let exitosas = 0;

    for (const item of cola) {
      const { error } = await supabase.from('valoraciones_parkinson').insert([item.payload]);
      if (error) {
        pendientes.push(item);
      } else {
        exitosas += 1;
      }
    }

    escribirColaLocal(pendientes);
    if (manual || exitosas > 0) {
      if (pendientes.length === 0) {
        setEstadoSincronizacion({ tipo: 'ok', mensaje: `Sincronización completada. ${exitosas} valoración(es) enviada(s) correctamente.` });
      } else {
        setEstadoSincronizacion({ tipo: 'warning', mensaje: `Se sincronizaron ${exitosas} valoración(es). Quedan ${pendientes.length} pendiente(s).` });
      }
    }
    setSincronizandoPendientes(false);
  };

  useEffect(() => {
    const colaInicial = leerColaLocal();
    setPendientesSincronizar(colaInicial.length);
    setPendientesPreview(colaInicial.slice(-MAX_PENDING_PREVIEW).reverse());
    const onOnline = () => {
      void sincronizarColaLocal();
    };
    window.addEventListener('online', onOnline);
    void sincronizarColaLocal();
    return () => window.removeEventListener('online', onOnline);
  }, []);

  useEffect(() => {
    if (!estadoSincronizacion) {
      return;
    }
    const timer = window.setTimeout(() => setEstadoSincronizacion(null), 4500);
    return () => window.clearTimeout(timer);
  }, [estadoSincronizacion]);

  const formatearTiempo = (s: number) => {
    const min = Math.floor(s / 60);
    const seg = s % 60;
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
  };

  const formatearCronometroMs = (milisegundos: number) => {
    const min = Math.floor(milisegundos / 60000);
    const seg = Math.floor((milisegundos % 60000) / 1000);
    const ms = milisegundos % 1000;
    return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  };

  const detallesPruebas: Record<string, { desc: string; obj: string }> = {
    TUG:   { desc: 'Timed Up and Go: El paciente se levanta, camina 3m y regresa.', obj: 'Evaluar riesgo de caídas.' },
    BBS:   { desc: 'Escala de Berg: 14 ítems de equilibrio estático y dinámico.', obj: 'Determinar independencia funcional.' },
    FGA:   { desc: 'Functional Gait Assessment: Evaluación de la marcha avanzada.', obj: 'Detectar fallos en control postural.' },
    UPDRS: { desc: 'Escala unificada para Parkinson: Evaluación de síntomas motores.', obj: 'Monitorizar progresión de la enfermedad.' },
  };

  const infosBotones: Record<string, { titulo: string; subtitulo: string }> = {
    TUG:   { titulo: 'TUG Cognitivo',  subtitulo: 'Movilidad y Doble Tarea' },
    BBS:   { titulo: 'BBS',            subtitulo: 'Equilibrio Estático/Dinámico' },
    FGA:   { titulo: 'FGA',            subtitulo: 'Marcha con Biofeedback' },
    UPDRS: { titulo: 'UPDRS',          subtitulo: 'Progresión Motora' },
  };

  const handlePerfilChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setPerfilPaciente((current) => ({ ...current, [name]: value }));
  };

  const bbsTotal = useMemo(
    () => puntajesBbs.filter((v) => v >= 0).reduce((acc, curr) => acc + curr, 0),
    [puntajesBbs]
  );

  const fgaTotal = useMemo(
    () => puntajesFga.filter((v) => v >= 0).reduce((acc, curr) => acc + curr, 0),
    [puntajesFga]
  );

  const bbsItemsCompletos = useMemo(
    () => puntajesBbs.filter((v) => v >= 0).length,
    [puntajesBbs]
  );

  const fgaItemsCompletos = useMemo(
    () => puntajesFga.filter((v) => v >= 0).length,
    [puntajesFga]
  );

  const tugSegundos = useMemo(
    () => (tugRegistradoMs !== null ? tugRegistradoMs / 1000 : null),
    [tugRegistradoMs]
  );

  const riesgoTug = useMemo(() => {
    if (tugSegundos === null) {
      return null;
    }
    return tugSegundos > 11.5
      ? '⚠️ ALTO RIESGO DE CAÍDA'
      : '✅ Riesgo Bajo';
  }, [tugSegundos]);

  const interpretacionBbs = useMemo(() => {
    if (bbsItemsCompletos === 0) {
      return 'Sin datos de Berg';
    }
    if (bbsTotal >= 45 && bbsTotal <= 56) {
      return 'Riesgo Bajo';
    }
    if (bbsTotal >= 21 && bbsTotal <= 44) {
      return 'Riesgo Medio (Requiere asistencia)';
    }
    return 'Riesgo Alto (Inminencia de caída)';
  }, [bbsItemsCompletos, bbsTotal]);

  const resumenFga = useMemo(() => {
    if (fgaItemsCompletos === 0) {
      return 'Sin datos de marcha';
    }

    if (puntajesFga[9] >= 0 && puntajesFga[9] <= 1) {
      return 'Inestabilidad en escaleras';
    }

    if (puntajesFga[4] >= 0 && puntajesFga[4] <= 1) {
      return 'Alteración en giros';
    }

    return 'Marcha estable';
  }, [fgaItemsCompletos, puntajesFga]);

  const interpretacionFgaRiesgo = useMemo(() => {
    if (fgaItemsCompletos === 0) {
      return 'Sin datos de riesgo';
    }
    if (fgaTotal <= 15) {
      return 'Riesgo Alto';
    }
    if (fgaTotal <= 22) {
      return 'Riesgo Medio';
    }
    return 'Riesgo Bajo';
  }, [fgaItemsCompletos, fgaTotal]);

  const pruebasConDatos = useMemo(() => {
    let total = 0;
    if (tugRegistradoMs !== null) total += 1;
    if (bbsItemsCompletos > 0) total += 1;
    if (fgaItemsCompletos > 0) total += 1;
    if (updrs.trim() !== '') total += 1;
    return total;
  }, [tugRegistradoMs, bbsItemsCompletos, fgaItemsCompletos, updrs]);

  const estadoTug = useMemo<EstadoPrueba>(() => {
    if (tugCorriendo) {
      return 'Parcial';
    }
    if (tugRegistradoMs !== null) {
      return 'Completa';
    }
    return 'No iniciada';
  }, [tugCorriendo, tugRegistradoMs]);

  const estadoBbs = useMemo<EstadoPrueba>(() => {
    if (bbsItemsCompletos === 0) {
      return 'No iniciada';
    }
    if (bbsItemsCompletos < BBS_ITEMS.length) {
      return 'Parcial';
    }
    return 'Completa';
  }, [bbsItemsCompletos]);

  const estadoFga = useMemo<EstadoPrueba>(() => {
    if (fgaItemsCompletos === 0) {
      return 'No iniciada';
    }
    if (fgaItemsCompletos < FGA_ITEMS.length) {
      return 'Parcial';
    }
    return 'Completa';
  }, [fgaItemsCompletos]);

  const estadoUpdrs = useMemo<EstadoPrueba>(() => {
    if (updrs.trim() === '') {
      return 'No iniciada';
    }
    return 'Completa';
  }, [updrs]);

  const nivelRiesgoTug = useMemo<NivelRiesgo>(() => {
    if (tugSegundos === null) {
      return 'neutro';
    }
    return tugSegundos > 11.5 ? 'alto' : 'bajo';
  }, [tugSegundos]);

  const nivelRiesgoBbs = useMemo<NivelRiesgo>(() => {
    if (bbsItemsCompletos === 0) {
      return 'neutro';
    }
    if (bbsTotal >= 45) {
      return 'bajo';
    }
    if (bbsTotal >= 21) {
      return 'medio';
    }
    return 'alto';
  }, [bbsItemsCompletos, bbsTotal]);

  const nivelRiesgoFga = useMemo<NivelRiesgo>(() => {
    if (fgaItemsCompletos === 0) {
      return 'neutro';
    }
    if (fgaTotal <= 15) {
      return 'alto';
    }
    if (fgaTotal <= 22) {
      return 'medio';
    }
    return 'bajo';
  }, [fgaItemsCompletos, fgaTotal]);

  const claseSemaforo = (nivel: NivelRiesgo) => {
    if (nivel === 'alto') return 'text-cyan-200 bg-red-100 border border-slate-700/80';
    if (nivel === 'medio') return 'text-amber-800 bg-amber-100 border border-amber-200';
    if (nivel === 'bajo') return 'text-emerald-800 bg-emerald-100 border border-emerald-200';
    return 'text-slate-600 bg-slate-100 border border-slate-200';
  };

  const claseEstadoPrueba = (estado: EstadoPrueba) => {
    if (estado === 'Completa') return 'text-emerald-800 bg-emerald-100 border border-emerald-200';
    if (estado === 'Parcial') return 'text-amber-800 bg-amber-100 border border-amber-200';
    return 'text-slate-600 bg-slate-100 border border-slate-200';
  };

  const construirObservacionesClinicas = () => {
    const fecha = new Date().toLocaleString('es-CO');
    const profesional = profesionalResponsable.trim() || 'No especificado';
    const observacionBase = progreso.trim() || 'Sin observaciones adicionales.';
    return `[Registro: ${fecha}] [Profesional: ${profesional}] ${observacionBase}`;
  };

  const formatearFechaPendiente = (isoDate: string) => {
    const fecha = new Date(isoDate);
    if (Number.isNaN(fecha.getTime())) {
      return 'Fecha no disponible';
    }
    return fecha.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    setResultadosClinicos((prev) => ({
      ...prev,
      tugCognitivo:
        tugRegistradoMs !== null
          ? `${(tugRegistradoMs / 1000).toFixed(3)} s | ${riesgoTug ?? ''}`
          : '',
      berg:
        bbsItemsCompletos > 0
          ? `${bbsTotal}/56 | ${interpretacionBbs}`
          : '',
      fga:
        fgaItemsCompletos > 0
          ? `${fgaTotal}/30 | ${resumenFga} | ${interpretacionFgaRiesgo}`
          : '',
      updrs: updrs.trim(),
    }));
  }, [
    tugRegistradoMs,
    riesgoTug,
    bbsItemsCompletos,
    bbsTotal,
    interpretacionBbs,
    fgaItemsCompletos,
    fgaTotal,
    resumenFga,
    interpretacionFgaRiesgo,
    updrs,
  ]);

  const guardarBbsItem = (indice: number, valor: number) => {
    setPuntajesBbs((actual) => {
      const copia = [...actual];
      copia[indice] = valor;
      return copia;
    });
  };

  const guardarFgaItem = (indice: number, valor: number) => {
    setPuntajesFga((actual) => {
      const copia = [...actual];
      copia[indice] = valor;
      return copia;
    });
  };

  const iniciarTug = () => {
    setTugCorriendo(true);
  };

  const detenerTug = () => {
    setTugCorriendo(false);
    setTugRegistradoMs(tugTiempoMs);
  };

  const reiniciarTug = () => {
    setTugCorriendo(false);
    setTugTiempoMs(0);
    setTugRegistradoMs(null);
  };

  const handleGuardar = async () => {
    if (!perfilPaciente.nombre || !perfilPaciente.estadio) {
      alert('Completa el nombre del paciente y el estadio clínico antes de guardar.');
      return;
    }

    if (pruebasConDatos < 2) {
      alert('Debes completar al menos 2 pruebas clínicas antes de guardar la valoración.');
      return;
    }

    try {
      setGuardando(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        alert('Debes iniciar sesión para guardar valoraciones.');
        return;
      }

      const datosValoracion: ValoracionPayload = {
        nombre_paciente: perfilPaciente.nombre,
        estadio_parkinson: perfilPaciente.estadio,
        evaluacion_entorno: perfilPaciente.evaluacionSocioAmbiental,
        resultado_tug_cognitivo: resultadosClinicos.tugCognitivo,
        resultado_berg: resultadosClinicos.berg,
        resultado_fga: resultadosClinicos.fga,
        resultado_updrs: resultadosClinicos.updrs,
        observaciones_clinicas: construirObservacionesClinicas(),
        auth_user_id: authData.user.id,
      };

      if (!navigator.onLine) {
        encolarValoracion(datosValoracion);
        alert('Sin conexión. La valoración se guardó localmente y se sincronizará al reconectar.');
        return;
      }
      
      console.log('Enviando datos a Supabase:', datosValoracion);
      
      const { error } = await supabase.from('valoraciones_parkinson').insert([datosValoracion]);

      if (error) {
        console.error('Error detallado de Supabase:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      console.log('Valoración guardada exitosamente');
      await sincronizarColaLocal();
      alert('La valoración clínica se guardó correctamente.');
    } catch (error) {
      if (esErrorDeRed(error)) {
        const { data: authData } = await supabase.auth.getUser();
        const datosValoracion: ValoracionPayload = {
          nombre_paciente: perfilPaciente.nombre,
          estadio_parkinson: perfilPaciente.estadio,
          evaluacion_entorno: perfilPaciente.evaluacionSocioAmbiental,
          resultado_tug_cognitivo: resultadosClinicos.tugCognitivo,
          resultado_berg: resultadosClinicos.berg,
          resultado_fga: resultadosClinicos.fga,
          resultado_updrs: resultadosClinicos.updrs,
          observaciones_clinicas: construirObservacionesClinicas(),
          auth_user_id: authData.user?.id,
        };
        encolarValoracion(datosValoracion);
        alert('Conexión inestable. La valoración se guardó localmente y se sincronizará automáticamente.');
        return;
      }
      const message = error instanceof Error ? error.message : 'No fue posible guardar la valoración.';
      console.error('Error completo:', error);
      alert(`Error al guardar la valoración: ${message}`);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--balanx-bg)] text-slate-100 font-sans pb-20">
      <header className="border-b border-cyan-500/15 bg-slate-950/70 px-6 py-10 text-center backdrop-blur-md">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-300/90">
            {brand.name}
          </p>
          <h1 className="text-3xl font-extrabold text-slate-50">{t('header.title')}</h1>
          <p className="mt-2 text-sm text-slate-400">{t('header.subtitle')}</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 p-6">
        
        <div className="flex justify-end">
          <Link
            href="/ejemplos-sesion-clinica"
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-cyan-400"
          >
            <Download size={18} /> {t('nav.examples')}
          </Link>
        </div>

        {/* 1) Perfil clínico */}
        <section className="balanx-glass balanx-glow-cyan rounded-3xl p-6 transition-all duration-300 hover:shadow-lg">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-cyan-200">
            <ShieldCheck /> {t('profile.title')}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              name="nombre"
              value={perfilPaciente.nombre}
              onChange={handlePerfilChange}
              placeholder="Nombre Completo"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950/60 p-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                name="estadio"
                value={perfilPaciente.estadio}
                onChange={handlePerfilChange}
                className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
              >
                <option value="">Estadio Hoehn y Yahr (I-III)</option>
                <option value="Estadio I">Estadio I</option>
                <option value="Estadio II">Estadio II</option>
                <option value="Estadio III">Estadio III</option>
              </select>
              <input type="number" placeholder="Puntaje MMSE" className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none" />
            </div>
            <input
              type="text"
              value={profesionalResponsable}
              onChange={(event) => setProfesionalResponsable(event.target.value)}
              placeholder="Profesional responsable"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950/60 p-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Evaluación Socio-Ambiental (Red de Apoyo / Barreras en Hogar)
              </label>
              <input
                type="text"
                name="evaluacionSocioAmbiental"
                value={perfilPaciente.evaluacionSocioAmbiental}
                onChange={handlePerfilChange}
                placeholder="Describa la red de apoyo y barreras identificadas en el entorno del paciente"
                className="w-full rounded-lg border border-slate-700/80 bg-slate-950/60 p-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-400">Requisito: Estadios I-III y MMSE ≥ 24.</p>
          </div>
        </section>

        {/* 2) Batería clínica */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ClipboardCheck className="text-cyan-200" /> {t('battery.title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(detallesPruebas).map((test) => (
              <button
                key={test}
                onClick={() => setPruebaSeleccionada(test)}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 min-h-32 ${
                  pruebaSeleccionada === test
                    ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-100'
                    : 'bg-slate-950/40 border-slate-700/60 text-slate-400 hover:border-slate-700/80'
                }`}
              >
                <span className="font-black text-xl">{infosBotones[test].titulo}</span>
                <span className="text-[11px] font-normal opacity-70 text-center leading-tight">
                  {infosBotones[test].subtitulo}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="balanx-glass rounded-2xl p-4 transition-all duration-300">
              <div className="flex items-center justify-between mb-1 gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Resultado TUG</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${claseEstadoPrueba(estadoTug)}`}>{estadoTug}</span>
              </div>
              <p className="text-xl font-black text-slate-800">
                {tugRegistradoMs !== null ? `${(tugRegistradoMs / 1000).toFixed(2)} s` : '--'}
              </p>
              <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${claseSemaforo(nivelRiesgoTug)}`}>{riesgoTug || 'Sin datos de riesgo'}</span>
            </div>
            <div className="balanx-glass rounded-2xl p-4 transition-all duration-300">
              <div className="flex items-center justify-between mb-1 gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Resultado Berg</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${claseEstadoPrueba(estadoBbs)}`}>{estadoBbs}</span>
              </div>
              <p className="text-xl font-black text-slate-800">{bbsItemsCompletos > 0 ? `${bbsTotal}/56` : '--'}</p>
              <div className="flex justify-between items-center mt-1">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${claseSemaforo(nivelRiesgoBbs)}`}>{interpretacionBbs}</span>
                <p className="text-[10px] text-slate-400">{bbsItemsCompletos}/14 ítems</p>
              </div>
            </div>
            <div className="balanx-glass rounded-2xl p-4 transition-all duration-300">
              <div className="flex items-center justify-between mb-1 gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Resultado FGA</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${claseEstadoPrueba(estadoFga)}`}>{estadoFga}</span>
              </div>
              <p className="text-xl font-black text-slate-800">{fgaItemsCompletos > 0 ? `${fgaTotal}/30` : '--'}</p>
              <div className="flex justify-between items-center mt-1">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${claseSemaforo(nivelRiesgoFga)}`}>{interpretacionFgaRiesgo}</span>
                <p className="text-[10px] text-slate-400">{fgaItemsCompletos}/10 ítems</p>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">{resumenFga}</p>
            </div>
            <div className="balanx-glass rounded-2xl p-4 transition-all duration-300">
              <div className="flex items-center justify-between mb-1 gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Resultado UPDRS</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${claseEstadoPrueba(estadoUpdrs)}`}>{estadoUpdrs}</span>
              </div>
              <p className="text-sm font-semibold text-slate-700 truncate">{updrs.trim() || 'Sin registrar'}</p>
              <p className="text-[10px] text-slate-400 mt-1">Capture en la herramienta UPDRS.</p>
            </div>
          </div>

          {pruebaSeleccionada && (
            <div className="mt-6 balanx-glass border-l-8 border-cyan-400 p-6 rounded-2xl animate-in fade-in slide-in-from-left-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Herramienta: {infosBotones[pruebaSeleccionada].titulo}</h3>
                <button onClick={() => setPruebaSeleccionada(null)} className="text-slate-300 hover:text-cyan-300"><X /></button>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="text-cyan-200 font-bold uppercase text-[10px] mb-1">Descripción</h4>
                  <p>{detallesPruebas[pruebaSeleccionada].desc}</p>
                </div>
                <div>
                  <h4 className="text-slate-400 font-bold uppercase text-[10px] mb-1">Objetivo</h4>
                  <p>{detallesPruebas[pruebaSeleccionada].obj}</p>
                </div>
              </div>

              {pruebaSeleccionada === 'TUG' && (
                <div className="mt-6 bg-cyan-500/10 border border-cyan-500/15 rounded-2xl p-5 space-y-4 transition-all duration-300">
                  <h4 className="text-cyan-200 font-bold text-base">TUG Cognitivo con Cronómetro Integrado</h4>
                  <div className="rounded-lg border border-slate-700/80 bg-slate-950/50 p-3 my-3">
                    <p className="text-xs text-slate-100">
                      <span className="font-bold">Punto de corte clínico:</span> Un tiempo superior a 11.5 segundos evidencia alto riesgo de caídas.
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 italic">
                      * La alteración en el conteo regresivo (doble tarea) indica fallos en la automaticidad de la marcha.
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <span className="text-4xl font-mono font-black text-cyan-200">{formatearCronometroMs(tugTiempoMs)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={iniciarTug}
                        disabled={tugCorriendo}
                        className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Start
                      </button>
                      <button
                        onClick={detenerTug}
                        disabled={!tugCorriendo}
                        className="px-6 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Stop
                      </button>
                      <button
                        onClick={reiniciarTug}
                        className="rounded-xl border border-slate-700/80 bg-slate-950/60 px-6 py-3 text-sm font-bold text-cyan-200"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  {riesgoTug && (
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${riesgoTug.includes('ALTO') ? 'bg-red-800 text-white animate-pulse' : 'bg-green-100 text-green-700'}`}>
                      {riesgoTug}
                    </div>
                  )}
                </div>
              )}

              {pruebaSeleccionada === 'BBS' && (
                <div className="mt-6 bg-cyan-500/10 border border-cyan-500/15 rounded-2xl p-5 space-y-4 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <h4 className="text-cyan-200 font-bold text-base">Escala de Berg (BBS) Dinámica</h4>
                  </div>
                  <div className="rounded-lg border border-slate-700/80 bg-slate-950/50 p-3">
                    <p className="text-xs text-slate-100">
                      <span className="font-bold">Valor de referencia:</span> Una puntuación inferior a 45/56 sugiere riesgo inminente de caídas múltiples y requiere intervención preventiva inmediata.
                    </p>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {BBS_ITEMS.map((item, indice) => (
                      <div key={item} className="rounded-xl border border-cyan-500/20 bg-slate-950/50 p-3">
                        <p className="text-sm font-semibold text-slate-800 mb-2">{indice + 1}. {item}</p>
                        <div className="flex gap-2 flex-wrap">
                          {[0, 1, 2, 3, 4].map((valor) => (
                            <button
                              key={valor}
                              onClick={() => guardarBbsItem(indice, valor)}
                              className={`h-10 w-12 rounded-lg text-sm font-bold transition-all duration-200 ${puntajesBbs[indice] === valor ? 'bg-cyan-500 text-white' : 'bg-teal-100 text-cyan-200 hover:bg-teal-200'}`}
                            >
                              {valor}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-xl border border-cyan-500/20 bg-slate-950/50 p-3">
                    <p className="font-bold text-cyan-200">Score total: {bbsTotal}/56</p>
                    <span className="text-xs font-bold text-slate-600">{interpretacionBbs}</span>
                  </div>
                </div>
              )}

              {pruebaSeleccionada === 'FGA' && (
                <div className="mt-6 bg-cyan-500/10 border border-cyan-500/15 rounded-2xl p-5 space-y-4 transition-all duration-300">
                  <h4 className="text-cyan-200 font-bold text-base">FGA Inteligente</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {FGA_ITEMS.map((item, indice) => (
                      <div key={item} className="rounded-xl border border-cyan-500/20 bg-slate-950/50 p-3">
                        <p className="text-sm font-semibold text-slate-800 mb-2">{indice + 1}. {item}</p>
                        <div className="flex gap-2 flex-wrap">
                          {[0, 1, 2, 3].map((valor) => (
                            <button
                              key={valor}
                              onClick={() => guardarFgaItem(indice, valor)}
                              className={`h-10 w-12 rounded-lg text-sm font-bold transition-all duration-200 ${puntajesFga[indice] === valor ? 'bg-cyan-500 text-white' : 'bg-teal-100 text-cyan-200 hover:bg-teal-200'}`}
                            >
                              {valor}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-xl border border-cyan-500/20 bg-slate-950/50 p-3">
                    <p className="font-bold text-cyan-200">Score total: {fgaTotal}/30</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${claseSemaforo(nivelRiesgoFga)}`}>{interpretacionFgaRiesgo}</span>
                  </div>
                  <p className="text-xs text-slate-600">Resumen funcional: {resumenFga}</p>
                </div>
              )}

              {pruebaSeleccionada === 'UPDRS' && (
                <div className="mt-6 bg-cyan-500/10 border border-cyan-500/15 rounded-2xl p-5 transition-all duration-300">
                  <h4 className="text-cyan-200 font-bold text-base mb-3">UPDRS - Progresión Motora</h4>
                  <input
                    type="text"
                    value={updrs}
                    onChange={(event) => setUpdrs(event.target.value)}
                    placeholder="Registrar puntaje o hallazgo motor relevante"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 p-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}
        </section>

        {/* 3) Estimulación rítmica */}
        <section className="rounded-3xl bg-gradient-to-br from-teal-700 to-teal-900 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Layers /> {t('cueing.title')}
          </h3>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
            <p className="text-xs text-slate-200">{t('cueing.help')}</p>

            <div
              className={`mt-4 flex min-h-28 items-center justify-center rounded-2xl border-2 transition-all duration-100 ${
                pulsoVisual
                  ? 'scale-[1.02] border-amber-300 bg-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.85)]'
                  : 'border-slate-700/80/40 bg-slate-950/50'
              }`}
              aria-live="polite"
              aria-label={t('cueing.lightHint')}
            >
              <div
                className={`h-16 w-16 rounded-full transition-all duration-100 ${
                  pulsoVisual ? 'bg-white scale-110' : 'bg-cyan-400/30'
                }`}
              />
            </div>
            <p className="mt-2 text-center text-[11px] text-cyan-100">{t('cueing.lightHint')}</p>

            <div className="mt-4">
              <label className="text-xs font-bold uppercase tracking-wide text-cyan-100">
                {t('cueing.bpm')}
              </label>
              <input
                type="range"
                min={40}
                max={120}
                value={bpm}
                onChange={(event) => setBpm(Number(event.target.value))}
                className="mt-2 w-full accent-amber-400"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-cyan-100">40</span>
                <span className="text-2xl font-black text-white">{bpm} BPM</span>
                <span className="text-[11px] text-cyan-100">120</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-cyan-100">
                <Volume2 size={14} /> {t('cueing.volume')}
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={volumenBip}
                onChange={(event) => setVolumenBip(Number(event.target.value))}
                className="mt-2 w-full accent-amber-400"
                disabled={modoCueing === 'light'}
              />
              <div className="mt-1 text-right text-sm font-bold text-white">{volumenBip}%</div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-cyan-100">
                {t('cueing.modeLabel')}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ['both', 'both'],
                    ['audio', 'audio'],
                    ['light', 'light'],
                  ] as const
                ).map(([mode, modeKey]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setModoCueing(mode)}
                    className={`rounded-xl px-2 py-3 text-[11px] font-bold transition-colors ${
                      modoCueing === mode
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-950/50 text-slate-200 hover:bg-teal-950/60'
                    }`}
                  >
                    {t(`cueing.modes.${modeKey}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-cyan-500/30 bg-slate-950/50 p-3">
              <p className="text-[11px] leading-relaxed text-slate-200">
                <span className="font-bold">Gamificación y doble tarea:</span> pida sincronizar el paso
                con el estímulo (audio y/o luz) para favorecer el aprendizaje motor y reducir el
                congelamiento de la marcha.
              </p>
            </div>

            <button
              onClick={() => setMetronomoActivo((prev) => !prev)}
              className="mt-5 w-full balanx-btn-dopamine balanx-glow-amber rounded-xl py-4 text-sm transition-colors hover:bg-amber-300"
            >
              {metronomoActivo ? t('cueing.stop') : t('cueing.start')}
            </button>
          </div>
        </section>

        {/* 4) Monitoreo de sesión */}
        <section className="bg-slate-900 text-white rounded-[40px] p-8 relative overflow-hidden transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Layers className="text-cyan-300" /> Monitoreo de Sesión
            </h2>
            <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-6">
              <span className="text-3xl font-mono font-bold text-cyan-300">{formatearTiempo(segundos)}</span>
              <div className="flex gap-2">
                <button onClick={() => setTimerActivo(!timerActivo)} className="p-2 bg-cyan-600 rounded-full">
                  {timerActivo ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button onClick={() => { setSegundos(1800); setTimerActivo(false); }} className="p-2 bg-slate-700 rounded-full">
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl border ${segundos > 1500 ? 'bg-cyan-600 border-white' : 'bg-white/5 border-white/10 opacity-50'}`}>
              <h4 className="font-bold text-xs uppercase">1. Calentamiento (5 min)</h4>
              <p className="text-[10px] text-cyan-100">Movilidad y respiración consciente.</p>
            </div>
            <div className={`p-4 rounded-2xl border ${segundos <= 1500 && segundos > 300 ? 'bg-cyan-600 border-white' : 'bg-white/5 border-white/10 opacity-50'}`}>
              <h4 className="font-bold text-xs uppercase">2. Intervención Digital (20 min)</h4>
              <p className="text-[10px] text-cyan-100">Estímulos multisensoriales.</p>
            </div>
            <div className={`p-4 rounded-2xl border ${segundos <= 300 && segundos > 0 ? 'bg-cyan-600 border-white' : 'bg-white/5 border-white/10 opacity-50'}`}>
              <h4 className="font-bold text-xs uppercase">3. Enfriamiento (5 min)</h4>
              <p className="text-[10px] text-cyan-100">Estiramientos y feedback.</p>
            </div>
          </div>
        </section>

        {/* 5) Cierre y guardado */}
        <section className="balanx-glass balanx-glow-emerald rounded-3xl p-6 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-200">
            <Activity /> Seguimiento Meta Terapéutica
          </h3>
          {pendientesSincronizar > 0 && (
            <div className="mb-3 rounded-lg border border-amber-200 bg-amber-100 p-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <p className="text-xs text-amber-800">
                  Hay {pendientesSincronizar} valoración(es) pendiente(s) de sincronización con la nube.
                </p>
                <button
                  onClick={() => void sincronizarColaLocal(true)}
                  disabled={sincronizandoPendientes}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sincronizandoPendientes ? 'Sincronizando...' : 'Reintentar sincronización'}
                </button>
              </div>
              {pendientesPreview.length > 0 && (
                <div className="mt-2 space-y-1">
                  {pendientesPreview.map((pendiente) => (
                    <p key={pendiente.id} className="text-[11px] text-amber-900">
                      Paciente: {pendiente.payload.nombre_paciente || 'No registrado'} | Registro: {formatearFechaPendiente(pendiente.createdAt)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
          {estadoSincronizacion && (
            <p className={`mb-3 text-xs rounded-lg px-3 py-2 border ${estadoSincronizacion.tipo === 'ok' ? 'text-emerald-800 bg-emerald-100 border-emerald-200' : 'text-amber-800 bg-amber-100 border-amber-200'}`}>
              {estadoSincronizacion.mensaje}
            </p>
          )}
          <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
            <div className={`px-3 py-2 rounded-lg font-semibold ${claseEstadoPrueba(estadoTug)}`}>TUG: {estadoTug}</div>
            <div className={`px-3 py-2 rounded-lg font-semibold ${claseEstadoPrueba(estadoBbs)}`}>BBS: {estadoBbs}</div>
            <div className={`px-3 py-2 rounded-lg font-semibold ${claseEstadoPrueba(estadoFga)}`}>FGA: {estadoFga}</div>
            <div className={`px-3 py-2 rounded-lg font-semibold ${claseEstadoPrueba(estadoUpdrs)}`}>UPDRS: {estadoUpdrs}</div>
          </div>
          <div className="flex gap-4">
            <textarea
              value={progreso}
              onChange={(e) => setProgreso(e.target.value)}
              placeholder="Registro diario del progreso del paciente..."
              className="h-24 flex-1 rounded-xl border border-slate-700/80 bg-slate-950/60 p-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
            <button
              onClick={handleGuardar}
              disabled={guardando || pruebasConDatos < 2}
              className="min-w-40 bg-cyan-500 text-white p-4 rounded-xl flex flex-col items-center justify-center text-sm font-bold hover:bg-cyan-400 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              <span className="text-[10px] font-bold mt-1 uppercase">
                {guardando ? 'Guardando...' : 'Guardar Valoración'}
              </span>
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Integridad clínica: completa al menos 2 pruebas de batería para habilitar el guardado ({pruebasConDatos}/4).
          </p>
        </section>

        <footer className="text-center">
          <p className="text-xs text-slate-400">{t('footer.disclaimer')}</p>
        </footer>
      </main>

      <footer className="border-t border-cyan-500/15 bg-slate-950/80 p-8 text-center text-[11px] text-slate-500">
        <p>
          © {brand.year} {brand.legalName}. {t('footer.rights')}
        </p>
        <p className="mt-1">{brand.domainHint}</p>
      </footer>
    </div>
  );
}