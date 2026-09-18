# Roadmap comercial Cadencia

Misma “cáscara” que Cudoku / TrainAIfit.health, datos en schema **`parkinson`** del hub (nunca `public`).

## Principio

| Copiar de Cudoku (hub) | Copiar idea de TrainAIfit | No copiar aún |
|---|---|---|
| Auth + register/login/verify/recovery | Roles clínicos (FT / paciente / cuidador) | Proxy comercial pesado (trial + tarjeta obligatoria) |
| Perfil en schema propio | Multilingüismo amplio | Wompi cobrando desde el día 1 |
| Redirects absolutos por app | | Suscripciones complejas en `public` |

## Fases

### Fase 1 — Cuenta (ahora)
1. Tabla `parkinson.perfiles` (auth_user_id, email, rol, verificado, plan, idioma).
2. Activar sesión Auth en el cliente Supabase.
3. Rutas: register, login, verify, recovery, callback.
4. API register (service role) → Auth + perfil.
5. Proxy: intl + refresh sesión (sin /pay).
6. Redirect URLs Cadencia en el hub (**añadir**, no cambiar Site URL).
7. RLS: valoraciones ligadas a usuario autenticado.
8. i18n: mantener es/en en Auth; preparar más locales.

### Fase 2 — Comercial ligero
- Planes free/piloto/pro en perfil.
- Wompi con referencia `CADENCIA_…` vía hub de eventos (como Cudoku).
- Pantalla /pay y gate suave (no clonar TrainAIfit entero).

### Fase 3 — Producto clínico casa
- Vista hogar + cueing usable (feedback evaluadores).
- Vínculo FT ↔ paciente.
- Más idiomas (pt, fr, …) al ritmo de las otras PWA.

### Fase 4 — Escala
- Auth maduro, analítica, posible INVIMA si aplica claim terapéutico.
