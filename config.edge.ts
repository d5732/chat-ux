import type { AppConfig } from "./lib/edge/types.ts";

export const appConfig: AppConfig = {
  // This should be set in an environment variable in Netlify
  REMOTE_SERVICE_KEY: Deno.env.get("REMOTE_SERVICE_KEY") ?? "",
  REMOTE_SERVICE_URL: Deno.env.get("REMOTE_SERVICE_URL") ?? "",
};
