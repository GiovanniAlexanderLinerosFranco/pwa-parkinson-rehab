# Schema `parkinson` en galf-core-hub

1. Abrir SQL Editor del proyecto **galf-core-hub** (`ysmxxmcyrdjiyfrexbjy`).
2. Ejecutar `supabase/migrations/20260909_parkinson_schema.sql` (tablas clínicas).
3. Ejecutar `supabase/migrations/20260914_parkinson_auth_perfiles.sql` (perfiles + RLS Auth).
4. Dashboard → **Project Settings → API → Exposed schemas**: agregar `parkinson`.
5. Copiar **anon key** y **service_role** a `.env.local` / Vercel (ver `docs/AUTH_SETUP.md`).
6. Auth URL Configuration: añadir redirects Cadencia (no reemplazar Site URL).
7. Smoke clínico: `npm run smoke:parkinson` (requiere ajustar script si RLS exige Auth).

No escribir tablas de Parkinson en `public`.
