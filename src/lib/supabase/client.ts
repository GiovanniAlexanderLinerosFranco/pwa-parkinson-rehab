import { createBrowserClient } from "@supabase/ssr";
import { parkinsonDbOptions } from "./schema";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        ...parkinsonDbOptions,
      },
    );
  }
  return browserClient;
}
