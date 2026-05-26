/*
 * Il Tuo Architetto — Gemini API proxy + listing fetcher (Cloudflare Worker)
 * --------------------------------------------------------------------------
 * Two endpoints:
 *
 *   POST /v1beta/models/<model>:generateContent
 *     Forwards the request to Google's Gemini API, attaching the
 *     GEMINI_API_KEY secret. Lets the public site call Gemini without
 *     exposing the key.
 *
 *   GET  /fetch-listing?url=<encoded listing URL>
 *     Server-side fetches the listing HTML so the demo can extract data
 *     from sites that block browser CORS (immobiliare.it, idealista.it,
 *     casa.it, ...). Restricted to a known list of Italian real-estate
 *     domains so the proxy can't be abused as an open relay.
 *
 * Secrets / variables (set in Cloudflare → Worker → Settings):
 *   GEMINI_API_KEY   secret — your AIza... key from aistudio.google.com
 *   ALLOWED_ORIGIN   variable (optional) — e.g.
 *                    "https://iltuoarchitetto.netlify.app". If unset,
 *                    every origin is allowed (fine while debugging).
 */

const UPSTREAM = "https://generativelanguage.googleapis.com";

// Italian real-estate domains the /fetch-listing endpoint will fetch on
// behalf of the demo. Extend if you want to support more.
const LISTING_HOSTS = new Set([
  "immobiliare.it", "www.immobiliare.it",
  "idealista.it", "www.idealista.it",
  "casa.it", "www.casa.it",
  "subito.it", "www.subito.it",
  "tecnocasa.it", "www.tecnocasa.it",
  "gabetti.it", "www.gabetti.it",
  "remax.it", "www.remax.it",
  "engelvoelkers.com", "www.engelvoelkers.com",
  "kijiji.it", "www.kijiji.it",
  "wikicasa.it", "www.wikicasa.it",
  "bakeca.it", "www.bakeca.it",
]);

const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
};

export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);

    // --- /fetch-listing -----------------------------------------------------
    if (request.method === "GET" && url.pathname === "/fetch-listing") {
      const target = url.searchParams.get("url");
      if (!target) return json({ error: "missing url parameter" }, 400, cors);
      let targetUrl;
      try { targetUrl = new URL(target); }
      catch { return json({ error: "invalid url" }, 400, cors); }
      if (!/^https?:$/.test(targetUrl.protocol)) {
        return json({ error: "only http/https allowed" }, 400, cors);
      }
      if (!LISTING_HOSTS.has(targetUrl.hostname)) {
        return json({
          error: "host not in allowlist",
          host: targetUrl.hostname,
          allowed: [...LISTING_HOSTS],
        }, 403, cors);
      }
      let upstream;
      try {
        upstream = await fetch(targetUrl.toString(), {
          headers: BROWSER_HEADERS,
          redirect: "follow",
        });
      } catch (e) {
        return json({ error: "fetch failed", detail: String(e).slice(0, 200) }, 502, cors);
      }
      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: {
          ...cors,
          "Content-Type": upstream.headers.get("Content-Type") || "text/html; charset=utf-8",
          "X-Upstream-Status": String(upstream.status),
          "X-Upstream-Length": String(text.length),
        },
      });
    }

    // --- /v1beta/models/<model>:generateContent (Gemini proxy) -------------
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }
    if (!/^\/v1beta\/models\/[^/]+:generateContent$/.test(url.pathname)) {
      return json({ error: "Forbidden path" }, 403, cors);
    }
    if (!env.GEMINI_API_KEY) {
      return json({ error: "Server is missing GEMINI_API_KEY secret" }, 500, cors);
    }

    const upstreamUrl = new URL(UPSTREAM + url.pathname);
    upstreamUrl.searchParams.set("key", env.GEMINI_API_KEY);

    let body;
    try { body = await request.text(); }
    catch { return json({ error: "Could not read request body" }, 400, cors); }

    const resp = await fetch(upstreamUrl.toString(), {
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
