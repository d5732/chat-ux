import type { Config, Context } from "https://edge.netlify.com/";

import { appConfig } from "../../config.edge.ts";

console.log({ "appConfig.REMOTE_SERVICE_URL": appConfig.REMOTE_SERVICE_URL });
if (/* !appConfig.REMOTE_SERVICE_KEY || */ !appConfig.REMOTE_SERVICE_URL) {
  throw new Error("Env vars must be set in config.edge.ts");
}

export default async function handler(
  request: Request,
  context: Context
): Promise<Response> {
  try {
    console.log(15, { request });

    const body = await request.json();

    console.log(body);

    const response = await fetch(appConfig.REMOTE_SERVICE_URL, {
      method: request.method,
      headers: { "content-type": "applciation/json" },
      body: JSON.stringify(body),
    });

    console.log(27, { response });

    const data = await response.json();
    console.log(30, { data });

    return response;
  } catch (e) {
    console.error(e);
    return new Response(e.message, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export const config: Config = {
  path: "/api/remote-service",
};
