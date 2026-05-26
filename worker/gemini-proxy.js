/*
 * Il Tuo Architetto — Gemini API proxy (Cloudflare Worker)
 * ---------------------------------------------------------
 * Holds the Google AI Studio API key as a Cloudflare secret so the public
 * website never exposes it. The browser calls this Worker instead of calling
 * generativelanguage.googleapis.com directly.
 *
 * Setup (one time, ~5 min):
 *   1. Sign in at https://dash.cloudflare.com/ (free account).
 *   2. Workers & Pages -> Create -> Create Worker -> name it
 *      "iltuoarchitetto-proxy" -> Deploy (the default Hello World is fine
 *      to start).
 *   3. Click "Edit code", replace the file with this entire file's content,
 *      then Save & Deploy.
 *   4. Open the Worker -> Settings -> Variables and Secrets -> Add Secret:
 *        Name:  GEMINI_API_KEY
 *        Value: <your AIza... key from https://aistudio.google.com/apikey>
 *      (Optionally also add a plain variable
 *        Name:  ALLOWED_ORIGIN
 *        Value: https://iltuoarchitetto.netlify.app
 *      to restrict who can call the proxy. Use "*" while testing.)
 *   5. Copy the Worker URL (e.g. https://iltuoarchitetto-proxy.<account>.workers.dev)
 *      and paste it into assets/js/config.js as window.GEMINI_PROXY.
 *   6. Commit & push — Netlify redeploys; visitors no longer need their own key.
 */

const UPSTREAM = "https://generativelanguage.googleapis.com";

export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }

    const url = new URL(request.url);
    // Only allow the Gemini generateContent endpoint, nothing else.
    if (!/^\/v1beta\/models\/[^/]+:generateContent$/.test(url.pathname)) {
      return json({ error: "Forbidden path" }, 403, cors);
    }
    if (!env.GEMINI_API_KEY) {
      return json({ error: "Server is missing GEMINI_API_KEY secret" }, 500, cors);
    }

    const upstream = new URL(UPSTREAM + url.pathname);
    upstream.searchParams.set("key", env.GEMINI_API_KEY);

    let body;
    try { body = await request.text(); }
    catch { return json({ error: "Could not read request body" }, 400, cors); }

    const resp = await fetch(upstream.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const text = await resp.text();
    return new Response(text, {
      status: resp.status,
      headers: {
        ...cors,
        "Content-Type": resp.headers.get("Content-Type") || "application/json",
      },
    });
  },
};

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...(headers || {}), "Content-Type": "application/json" },
  });
}
