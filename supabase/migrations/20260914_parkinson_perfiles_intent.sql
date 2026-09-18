-- Intent + términos en perfiles Cadencia (hub galf-core-hub / schema parkinson)
alter table parkinson.perfiles
  add column if not exists uso_rol text;
alter table parkinson.perfiles
  add column if not exists uso_principal text;
alter table parkinson.perfiles
  add column if not exists condicion_interes text;
alter table parkinson.perfiles
  add column if not exists contexto_uso text;
alter table parkinson.perfiles
  add column if not exists acepta_terminos_at timestamptz;
alter table parkinson.perfiles
  add column if not exists declara_uso_responsable boolean not null default false;
