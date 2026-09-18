# Definición de producto — Cadencia / Parkinson PWA

**Estado: CONFIRMADO** (actualizado 2026-09-14)

Producto **comercial** (ya no entregable universitario). Angie cumple créditos / grado ~octubre; Cadencia avanza como PWA del ecosistema galf-core-hub.

| Pilar | Decisión | Estado |
|---|---|---|
| 1. Alcance clínico | Solo Parkinson domiciliario + clínico (P0) | Confirmado |
| 2. Oferta | **C) Híbrido** — FT prescribe; paciente/cuidador en casa | Confirmado |
| 3. Cáscara comercial | Cuenta / registro / login / recovery como TrainAIfit–Cudoku; planes (piloto → Pro) | Confirmado (dirección) |
| 4. i18n | next-intl; es/en ya; ampliar locales como las otras PWA | Confirmado |
| 5. Marca | Cadencia (provisional) | Confirmado |
| 6. Pagos | Misma familia Wompi + prefijo propio (`CADENCIA_`); **después** de Auth | Diferido fase 2 |

---

## 1. Alcance (esta fase)

**Producto =** herramienta de apoyo clínico y domiciliario para Parkinson temprano–moderado (Hoehn y Yahr I–III).  
**No** es todavía una plataforma multi-enfermedad.

### Incluye (IN)

- Valoración clínica (TUG, BBS, FGA, UPDRS) + historial
- Cueing multimodal (audio, luz, volumen, ambos)
- Sesión / rutina segura en el hogar (paciente + cuidador)
- Modo profesional (fisioterapeuta prescribe / revisa) + modo hogar
- PWA instalable, español/inglés (luego más idiomas), schema `parkinson` en galf-core-hub
- UX amigable (feedback de evaluadores en la sustentación)

### Excluye (OUT) por ahora

- Módulos TOC, ansiedad, depresión, hernia, demencia
- Diagnóstico, ajuste de fármacos, urgencias
- Estadios avanzados H&Y 4–5 sin supervisión presencial
- Sustituir neurólogo o fisioterapia presencial
- Branding UMB / tesis como producto comercial
- Claims de “cura” o dispositivo médico sin ruta INVIMA

**Glosario:** TUG = Timed Up and Go · BBS = Berg Balance Scale · FGA = Functional Gait Assessment · UPDRS = Unified Parkinson’s Disease Rating Scale · PWA = Progressive Web App · H&Y = Hoehn y Yahr · INVIMA = Instituto Nacional de Vigilancia de Medicamentos y Alimentos (Colombia).

---

## 2. Manera de ofrecerlo

### A) B2B clínicas

La clínica / fisioterapeuta paga licencia. El paciente usa bajo esa cuenta. Buen control clínico; escala más lento.

### B) B2C familias

La familia paga directo. Máximo alcance en el hogar; más riesgo clínico y de adhesión sin profesional.

### C) Híbrido — **recomendado**

El fisioterapeuta activa / prescribe; paciente y cuidador entrenan en casa; los datos vuelven al profesional. Alinea evidencia, feedback de evaluadores y alivio de carga familiar.

#### Cómo se ve el híbrido

1. Profesional crea perfil / plan (cadencia en BPM — beats per minute, latidos/pulsos por minuto —, duración, modo sensorial, metas).
2. Paciente/cuidador abre la PWA en casa (sesión guiada + cueing).
3. Se registran adherencia, incidencias (congelamiento, casi-caída) y re-evaluaciones.
4. Comercial: licencia por profesional o por cupo de pacientes; piloto gratis → plan de pago. Posible freemium hogar limitado con “invitar a mi fisioterapeuta”.

---

## 3. Internacionalización (como TrainAIfit.health)

Hoy Cadencia tiene `LocaleProvider` + diccionario ES/EN en código.  
TrainAIfit (`mi-salud-mi-futuro-nuevo`) usa:

- librería **next-intl**
- rutas `app/[locale]/...` → `/es/...`, `/en/...`, `/pt/...`
- archivos `messages/es.json`, `messages/en.json`, etc.

`next-intl` ya está en el `package.json` de Parkinson: el objetivo es migrar a ese patrón.

| Capa | TrainAIfit.health | Cadencia (objetivo) |
|---|---|---|
| Librería | next-intl | next-intl (ya instalado) |
| Rutas | `/es`, `/en`, `/pt`, … | `/es`, `/en` primero |
| Mensajes | `messages/*.json` | `messages/es.json` + `en.json` |
| Default | español (LATAM) | español + selector |
| Fase 1 | muchos idiomas | es + en |
| Fase 2 | maduro | pt, luego fr/de según demanda |
| Legal | por locale | Ley 1581 (CO) y equivalentes al expandir |

**Principio:** un producto = un nombre. La i18n cambia el idioma, no la marca.

---

## Decisión — CONFIRMADA (2026-09-09)

`Alcance OK · Oferta C (híbrido) · i18n OK · marca Cadencia`

Implementación en curso: next-intl + rutas `/es` y `/en`.
