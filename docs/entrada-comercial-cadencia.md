# Entrada comercial Cadencia (propuesta mejorada)

## Problema del escudo actual
El overlay “soy profesional” es frágil, no crea cuenta y no distingue **quién** usa la herramienta ni **para qué**.

## Flujo propuesto (estilo TrainAIfit, tono clínico)

```
/es  →  Landing pública
         ├─ Profesionales de la salud  → /es/register?via=profesional
         └─ Familia / cuidador         → /es/register?via=hogar
                ↑
         Ambos pasan por:
         1) Uso previsto (intent)
         2) Aceptación de términos + responsabilidad
         3) Crear cuenta
         4) Verificar email
         5) Entrar al panel clínico / hogar
```

La app clínica (`/es` con sesión) **ya no** muestra escudo. El gate es Auth + términos en el registro.

## 1) Landing (`/` pública)
- Marca **Cadencia** hero (no UMB).
- Una frase: apoyo a valoración, cueing y prevención de caídas en Parkinson temprano; módulos neuro futuros.
- Dos caminos claros (sin etiquetar “paciente” en la puerta):
  - **Soy profesional de la salud**
  - **Acompaño a un familiar**
- Bloque corto de confianza: no sustituye consulta médica; uso responsable; datos en schema `parkinson`.

## 2) Formulario de uso previsto (antes o dentro del registro)
Campos (chips + obligatorio):

| Campo | Opciones |
|---|---|
| Rol | Fisioterapeuta / Médico-otro profesional / Cuidador familiar / Persona con diagnóstico (autouso supervisado) |
| Uso principal | Valoración clínica · Cueing en sesión · Entrenamiento en casa · Seguimiento entre citas · Explorar / formación |
| Condición de interés | Parkinson (ahora) · Otra neurodegenerativa (próximamente) · Preferir no decir |
| Contexto | Consultorio · Domicilio · Ambos |
| Declaraciones | Términos + privacidad · Mayor de edad · No sustituye criterio clínico · Si soy familiar, uso bajo orientación profesional cuando aplique |

Se guarda en `sessionStorage` y se envía a `/api/register` → columnas en `parkinson.perfiles` (`uso_previsto`, `acepta_terminos_at`, etc.).

## 3) Restricciones (más serias que el escudo)
- Sin cuenta verificada no hay app clínica.
- Términos obligatorios en registro (no un modal descartable).
- Disclaimer fijo en footer de la app.
- Familias: copy de acompañamiento, no de autodiagnóstico.
- Futuro: módulos (hernia, TOC…) solo tras declarar interés y con triaje propio.

## 4) Qué NO hacer aún
- No clonar el proxy comercial pesado de TrainAIfit.
- No Wompi todavía.
- No multi-enfermedad en el producto; solo **mencionar** en landing como roadmap.
