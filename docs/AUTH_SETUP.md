# Auth Cadencia (Fase 1)

## 1) SQL en galf-core-hub

SQL Editor → ejecutar:

`supabase/migrations/20260914_parkinson_auth_perfiles.sql`

## 2) Variables

En `.env.local` y Vercel (Production / Preview / Development):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL` (igual al hub)
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_APP_URL` (prod: URL de Vercel Cadencia)

Tras cambiar `NEXT_PUBLIC_*`: **Redeploy**.

## 3) Redirect URLs (hub)

Dashboard → Authentication → URL Configuration.

**Añadir** (no borrar TrainAIfit / Cudoku):

```
https://pwa-parkinson-rehab.vercel.app/**
https://pwa-parkinson-rehab.vercel.app/*/auth/callback
https://pwa-parkinson-rehab.vercel.app/*/auth/recovery-confirm
http://localhost:3000/**
http://localhost:3000/*/auth/callback
http://localhost:3000/*/auth/recovery-confirm
```

No sustituyas la Site URL canónica del hub si ya es de otro producto; Cadencia usa redirects absolutos.

## 4) Rutas

- `/es` — landing pública (uso previsto + términos)
- `/es/register` — crear cuenta (requiere intent del landing)
- `/es/login` — entrar → panel `/es/app`
- `/es/app` — PWA clínica (protegida)
- `/es/verify` · `/es/recovery` · `/es/update-password`
- `/es/auth/callback`

## 5) SQL adicional (intent)

Después del SQL de perfiles Auth, ejecutar también:

`supabase/migrations/20260914_parkinson_perfiles_intent.sql`
