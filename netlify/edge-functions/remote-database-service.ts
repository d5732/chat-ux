import type { Config, Context } from "https://edge.netlify.com/";

import { appConfig } from "../../config.edge.js";

if (!appConfig.REMOTE_DATABASE_API_KEY || !appConfig.REMOTE_DATABASE_API_URL) {
  throw new Error("REMOTE_DATABASE_API_KEY must be set in config.edge.ts");
}

export default async function handler(
  request: Request,
  context: Context
): Promise<void /* Response */> {
  try {
    const data = await request.json();

    data.token = "Bearer " + appConfig.REMOTE_DATABASE_API_KEY ?? "";

    // await fetch(appConfig.REMOTE_DATABASE_API_URL, {
    //   headers: {
    //     "Content-Type": "text/plain",
    //   },
    //   body: data,
    //   method: "POST",
    // });
  } catch (e) {
    console.error(e);
    // return new Response(e.message, {
    //   status: 500,
    //   headers: {
    //     "Content-Type": "text/plain",
    //   },
    // });
  }
}

export const config: Config = {
  path: "/api/remote-database/conversation",
};
