export const CADENCIA_INTENT_KEY = "balanx_uso_previsto_v1";

export type CadenciaIntent = {
  usoRol: "fisioterapeuta" | "otro_profesional" | "cuidador" | "autouso";
  usoPrincipal: "valoracion" | "cueing_sesion" | "hogar" | "seguimiento" | "formacion";
  condicionInteres: "parkinson" | "otra_neuro" | "prefiero_no_decir";
  contextoUso: "consultorio" | "domicilio" | "ambos";
  via?: "profesional" | "hogar";
};

export function saveIntent(intent: CadenciaIntent) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(CADENCIA_INTENT_KEY, JSON.stringify(intent));
}

export function readIntent(): CadenciaIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CADENCIA_INTENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CadenciaIntent;
  } catch {
    return null;
  }
}

export function clearIntent() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(CADENCIA_INTENT_KEY);
}

export function mapIntentToRole(intent: CadenciaIntent | null): "fisioterapeuta" | "paciente" | "cuidador" {
  if (!intent) return "fisioterapeuta";
  if (intent.usoRol === "cuidador") return "cuidador";
  if (intent.usoRol === "autouso") return "paciente";
  return "fisioterapeuta";
}
