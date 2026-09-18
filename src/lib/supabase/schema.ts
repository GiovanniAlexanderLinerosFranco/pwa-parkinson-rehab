/** Schema PostgREST de Cadencia en galf-core-hub. Nunca usar public. */
export const PARKINSON_SCHEMA = "parkinson" as const;

export const parkinsonDbOptions = {
  db: { schema: PARKINSON_SCHEMA },
} as const;
