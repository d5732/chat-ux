import type { AppConfig } from "./lib/edge/types.ts";

export const appConfig: AppConfig = {
  // This should be set in an environment variable in Netlify
  REMOTE_DATABASE_API_KEY: Deno.env.get("REMOTE_DATABASE_API_KEY") ?? "",
  REMOTE_DATABASE_API_URL: Deno.env.get("REMOTE_DATABASE_API_URL") ?? "",
};
