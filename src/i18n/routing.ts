import { defineRouting } from "next-intl/routing";

/** Locales Cadencia fase 1 (mismo patrón que TrainAIfit.health). */
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
