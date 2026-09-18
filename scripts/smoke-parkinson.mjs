/**
 * Smoke test mínimo contra galf-core-hub / schema parkinson.
 * Uso: node --env-file=.env.local scripts/smoke-parkinson.mjs
 * No inventa éxito: imprime errores reales de PostgREST/RLS/schema.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const schema = "parkinson";

function fail(step, detail) {
  console.error(`[FAIL] ${step}`);
  console.error(detail);
  process.exitCode = 1;
}

async function main() {
  console.log("--- smoke parkinson ---");
  console.log("URL host:", url ? new URL(url).host : "(missing)");
  console.log("schema:", schema);
  console.log("anon key present:", Boolean(anon && anon.length > 20));

  if (!url || !anon) {
    fail("env", "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return;
  }

  if (!url.includes("ysmxxmcyrdjiyfrexbjy")) {
    fail(
      "env-url",
      `La URL no es galf-core-hub (ysmxxmcyrdjiyfrexbjy). Actual: ${new URL(url).host}`,
    );
    return;
  }

  const supabase = createClient(url, anon, {
    db: { schema },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1) Carga / consulta mínima
  const select = await supabase
    .from("valoraciones_parkinson")
    .select("id, created_at", { count: "exact" })
    .limit(1);

  if (select.error) {
    fail("select valoraciones_parkinson", {
      message: select.error.message,
      code: select.error.code,
      details: select.error.details,
      hint: select.error.hint,
    });
    return;
  }
  console.log("[OK] select valoraciones_parkinson count=", select.count);

  const selectVal = await supabase
    .from("validacion_expertos")
    .select("id", { count: "exact" })
    .limit(1);

  if (selectVal.error) {
    fail("select validacion_expertos", {
      message: selectVal.error.message,
      code: selectVal.error.code,
      details: selectVal.error.details,
      hint: selectVal.error.hint,
    });
    return;
  }
  console.log("[OK] select validacion_expertos count=", selectVal.count);

  // 2) Insert mínimo de humo (marcador smoke) + cleanup best-effort
  const marker = `SMOKE_TEST_${Date.now()}`;
  const insert = await supabase.from("valoraciones_parkinson").insert([
    {
      nombre_paciente: marker,
      estadio_parkinson: "Estadio II",
      evaluacion_entorno: "smoke",
      resultado_tug_cognitivo: "smoke",
      resultado_berg: "smoke",
      resultado_fga: "smoke",
      resultado_updrs: "smoke",
      observaciones_clinicas: "smoke-test automatizado — borrar si queda",
    },
  ]).select("id");

  if (insert.error) {
    fail("insert valoraciones_parkinson", {
      message: insert.error.message,
      code: insert.error.code,
      details: insert.error.details,
      hint: insert.error.hint,
    });
    return;
  }

  const id = insert.data?.[0]?.id;
  console.log("[OK] insert valoraciones_parkinson id=", id);

  if (id) {
    const del = await supabase.from("valoraciones_parkinson").delete().eq("id", id);
    if (del.error) {
      console.warn("[WARN] no se pudo borrar fila smoke:", del.error.message);
    } else {
      console.log("[OK] delete smoke row");
    }
  }

  console.log("--- smoke PASS ---");
  console.log("Nota: no hay Supabase Auth login en esta PWA (solo escudo UI).");
}

main().catch((err) => {
  fail("uncaught", err);
});
