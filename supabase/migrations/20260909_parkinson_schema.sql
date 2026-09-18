-- =============================================================================
-- PWA Parkinson → galf-core-hub (schema parkinson)
-- Idempotente. NO toca public (TrainAIfit / BioGALF-Home-Health).
-- Proyecto: https://ysmxxmcyrdjiyfrexbjy.supabase.co
-- =============================================================================

create schema if not exists parkinson;

grant usage on schema parkinson to postgres, anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- valoraciones_parkinson
-- -----------------------------------------------------------------------------
create table if not exists parkinson.valoraciones_parkinson (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre_paciente text not null,
  estadio_parkinson text not null,
  evaluacion_entorno text,
  resultado_tug_cognitivo text,
  resultado_berg text,
  resultado_fga text,
  resultado_updrs text,
  observaciones_clinicas text
);

-- Si la tabla ya existía con menos columnas, asegurar columnas usadas por la PWA.
alter table parkinson.valoraciones_parkinson
  add column if not exists created_at timestamptz not null default now();
alter table parkinson.valoraciones_parkinson
  add column if not exists nombre_paciente text;
alter table parkinson.valoraciones_parkinson
  add column if not exists estadio_parkinson text;
alter table parkinson.valoraciones_parkinson
  add column if not exists evaluacion_entorno text;
alter table parkinson.valoraciones_parkinson
  add column if not exists resultado_tug_cognitivo text;
alter table parkinson.valoraciones_parkinson
  add column if not exists resultado_berg text;
alter table parkinson.valoraciones_parkinson
  add column if not exists resultado_fga text;
alter table parkinson.valoraciones_parkinson
  add column if not exists resultado_updrs text;
alter table parkinson.valoraciones_parkinson
  add column if not exists observaciones_clinicas text;

create index if not exists valoraciones_parkinson_created_at_idx
  on parkinson.valoraciones_parkinson (created_at desc);

-- -----------------------------------------------------------------------------
-- validacion_expertos
-- -----------------------------------------------------------------------------
create table if not exists parkinson.validacion_expertos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre_experto text not null,
  pertinencia integer not null check (pertinencia between 1 and 5),
  aplicabilidad integer not null check (aplicabilidad between 1 and 5),
  claridad integer not null check (claridad between 1 and 5),
  utilidad_clinica integer not null check (utilidad_clinica between 1 and 5),
  observaciones text
);

alter table parkinson.validacion_expertos
  add column if not exists created_at timestamptz not null default now();
alter table parkinson.validacion_expertos
  add column if not exists nombre_experto text;
alter table parkinson.validacion_expertos
  add column if not exists pertinencia integer;
alter table parkinson.validacion_expertos
  add column if not exists aplicabilidad integer;
alter table parkinson.validacion_expertos
  add column if not exists claridad integer;
alter table parkinson.validacion_expertos
  add column if not exists utilidad_clinica integer;
alter table parkinson.validacion_expertos
  add column if not exists observaciones text;

create index if not exists validacion_expertos_created_at_idx
  on parkinson.validacion_expertos (created_at desc);

-- -----------------------------------------------------------------------------
-- Grants (API roles)
-- -----------------------------------------------------------------------------
grant select, insert, update, delete on all tables in schema parkinson to anon, authenticated, service_role;
grant usage, select on all sequences in schema parkinson to anon, authenticated, service_role;

alter default privileges in schema parkinson
  grant select, insert, update, delete on tables to anon, authenticated, service_role;
alter default privileges in schema parkinson
  grant usage, select on sequences to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- RLS propio del schema parkinson
-- Nota: la PWA actual NO usa Supabase Auth (solo escudo profesional en UI).
-- Por eso las policies permiten insert/select con rol anon para no romper el flujo.
-- Endurecer cuando exista Auth profesional.
-- -----------------------------------------------------------------------------
alter table parkinson.valoraciones_parkinson enable row level security;
alter table parkinson.validacion_expertos enable row level security;

drop policy if exists valoraciones_parkinson_anon_insert on parkinson.valoraciones_parkinson;
create policy valoraciones_parkinson_anon_insert
  on parkinson.valoraciones_parkinson
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists valoraciones_parkinson_anon_select on parkinson.valoraciones_parkinson;
create policy valoraciones_parkinson_anon_select
  on parkinson.valoraciones_parkinson
  for select
  to anon, authenticated
  using (true);

drop policy if exists valoraciones_parkinson_service_all on parkinson.valoraciones_parkinson;
create policy valoraciones_parkinson_service_all
  on parkinson.valoraciones_parkinson
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists validacion_expertos_anon_insert on parkinson.validacion_expertos;
create policy validacion_expertos_anon_insert
  on parkinson.validacion_expertos
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists validacion_expertos_anon_select on parkinson.validacion_expertos;
create policy validacion_expertos_anon_select
  on parkinson.validacion_expertos
  for select
  to anon, authenticated
  using (true);

drop policy if exists validacion_expertos_service_all on parkinson.validacion_expertos;
create policy validacion_expertos_service_all
  on parkinson.validacion_expertos
  for all
  to service_role
  using (true)
  with check (true);

-- -----------------------------------------------------------------------------
-- IMPORTANTE (Dashboard Supabase → Project Settings → API):
-- 1) Exposed schemas: agregar "parkinson" (además de public/graphql_public).
-- 2) Extra search path puede incluir: public, parkinson
-- Sin exponer el schema, el cliente JS con db.schema='parkinson' fallará aunque el DDL exista.
-- =============================================================================
