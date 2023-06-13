import type { Config, Context } from "https://edge.netlify.com/";

import { appConfig } from "../../config.edge.js";

if (!appConfig.REMOTE_DATABASE_API_KEY || !appConfig.REMOTE_DATABASE_API_URL) {
  throw new Error("REMOTE_DATABASE_API_KEY must be set in config.edge.ts");
}

export default async function handler(
  request: Request,
  context: Context
): Promise<Response> {
  try {
    const data = await request.json();

    
      {
        // Optional. This can also be set to a real user id, session id or leave blank.
        // See https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids
        user: context.ip,
        messages: [
          {
            role: "system",
            content: prompt,
          },
          ...messages,
        ],
      },
      appConfig.OPENAI_API_KEY ?? ""
    );
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(e.message, {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}

export const config: Config = {
  path: "/api/remote-database/conversation",
};
