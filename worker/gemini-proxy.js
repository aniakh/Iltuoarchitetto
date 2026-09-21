/*
 * Il Tuo Architetto — Gemini proxy + listing fetcher + 3-report access quota
 * ==========================================================================
 *
 * ENDPOINTS
 *   POST /v1beta/models/<model>:generateContent   Gemini proxy (key added server-side)
 *   GET  /v1beta/models?pageSize=200              Model listing (for auto-detection)
 *   GET  /fetch-listing?url=<listing url>         Server-side page fetch for autofill
 *   GET  /market-lookup?comune=X&province=Y       OMI + portal prices for a comune (cached)
 *   GET  /quota                                   How many reports this link has left
 *   POST /consume                                 Burn one report slot -> generationId
 *   POST /admin/token                             Mint a customer link  (admin secret)
 *   GET  /admin/token?token=XXX                   Inspect a token       (admin secret)
 *   GET  /admin/tokens                            List tokens           (admin secret)
 *
 * ---------------------------------------------------------------------------
 * SETUP IN CLOUDFLARE
 *
 * 1. Secrets & variables  (Worker -> Settings -> Variables and Secrets)
 *      GEMINI_API_KEY   (Secret)    your AIza... key from aistudio.google.com
 *      ADMIN_SECRET     (Secret)    any long random string you invent; it protects
 *                                   the /admin endpoints and the admin page
 *      ALLOWED_ORIGIN   (Variable)  optional, e.g. https://yoursite.netlify.app
 *                                   leave unset to allow all origins
 *      REQUIRE_TOKEN    (Variable)  optional, "true" to refuse visitors who have
 *                                   no access link at all. Default: open demo.
 *
 * 2. KV namespace  (this is what stores the "3 reports" counters)
 *      Storage & Databases -> KV -> Create namespace, name it "ITA_QUOTA"
 *      Then Worker -> Settings -> Bindings -> Add -> KV namespace
 *          Variable name: QUOTA        Namespace: ITA_QUOTA
 *
 *    Until the KV binding exists the Worker runs in OPEN mode: everything works,
 *    nothing is metered. Quota only switches on once QUOTA is bound.
 *
 * Note: Cloudflare KV is eventually consistent and has no atomic counters. For a
 * single customer clicking a button this is fine; two perfectly simultaneous
 * clicks could in theory both read the same counter. Use Durable Objects if you
 * ever need strict, race-proof accounting.
 */

const UPSTREAM = "https://generativelanguage.googleapis.com";
const DEFAULT_MAX_USES = 3;
// A started report stays renderable for this long, so a slow session can finish.
const GENERATION_TTL_SECONDS = 3 * 60 * 60;
// Hard ceiling of image calls a single report may make. A full report needs
// roughly 15-25; the ceiling simply stops a replayed generation id from being
// used to mint unlimited renders inside the TTL window.
const MAX_IMAGES_PER_GENERATION = 60;
// Market quotations move slowly (OMI publishes twice a year), so a long
// cache keeps lookups instant and stops every visitor re-billing the search.
const MARKET_CACHE_TTL_SECONDS = 14 * 24 * 60 * 60;

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
};

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Access-Token, X-Generation-Id, X-Admin-Secret",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const kv = env.QUOTA || null;          // KV binding; null => open mode
    const enforced = !!kv;
    const path = url.pathname;

    try {
      /* ---------------- admin ---------------- */
      if (path.startsWith("/admin/")) {
        return await handleAdmin(request, env, url, cors, kv);
      }

      /* ---------------- quota status ---------------- */
      if (path === "/quota" && request.method === "GET") {
        if (!enforced) return json({ enforced: false }, 200, cors);
        const token = request.headers.get("X-Access-Token") || url.searchParams.get("token") || "";
        if (!token) return json({ enforced: true, remaining: null, code: "no_token" }, 200, cors);
        const rec = await getToken(kv, token);
        if (!rec) return json({ enforced: true, remaining: 0, code: "invalid_token" }, 200, cors);
        return json({
          enforced: true,
          remaining: Math.max(0, rec.max - rec.used),
          max: rec.max,
          used: rec.used,
        }, 200, cors);
      }

      /* ---------------- consume one report slot ---------------- */
      if (path === "/consume" && request.method === "POST") {
        if (!enforced) return json({ ok: true, enforced: false, generationId: "open" }, 200, cors);

        const token = request.headers.get("X-Access-Token") || "";
        if (!token) {
          if (String(env.REQUIRE_TOKEN) === "true") {
            return json({ ok: false, code: "no_token", error: "Access link required" }, 403, cors);
          }
          // Open demo: allow, but still hand out a generation id.
          const gid = randomId("gen");
          await kv.put("gen:" + gid, JSON.stringify({ token: "" }), { expirationTtl: GENERATION_TTL_SECONDS });
          return json({ ok: true, enforced: false, generationId: gid }, 200, cors);
        }

        const rec = await getToken(kv, token);
        if (!rec) return json({ ok: false, code: "invalid_token", error: "Unknown access link" }, 403, cors);
        if (rec.active === false) {
          return json({ ok: false, code: "revoked", error: "This link has been revoked", remaining: 0, max: rec.max }, 403, cors);
        }
        if (rec.used >= rec.max) {
          return json({ ok: false, code: "exhausted", error: "No reports left on this link", remaining: 0, max: rec.max }, 403, cors);
        }

        rec.used += 1;
        rec.lastUsed = new Date().toISOString();
        await kv.put("tok:" + token, JSON.stringify(rec));

        const gid = randomId("gen");
        await kv.put("gen:" + gid, JSON.stringify({ token }), { expirationTtl: GENERATION_TTL_SECONDS });

        return json({
          ok: true,
          enforced: true,
          generationId: gid,
          remaining: Math.max(0, rec.max - rec.used),
          max: rec.max,
        }, 200, cors);
      }

      /* ---------------- listing fetcher ---------------- */
      if (path === "/fetch-listing" && request.method === "GET") {
        const target = url.searchParams.get("url");
        if (!target) return json({ error: "missing url parameter" }, 400, cors);
        let t;
        try { t = new URL(target); } catch { return json({ error: "invalid url" }, 400, cors); }
        if (!/^https?:$/.test(t.protocol)) return json({ error: "only http/https allowed" }, 400, cors);
        if (!LISTING_HOSTS.has(t.hostname)) {
          return json({ error: "host not in allowlist", host: t.hostname, allowed: [...LISTING_HOSTS] }, 403, cors);
        }
        let up;
        try {
          up = await fetch(t.toString(), { headers: BROWSER_HEADERS, redirect: "follow" });
        } catch (e) {
          return json({ error: "fetch failed", detail: String(e).slice(0, 200) }, 502, cors);
        }
        const text = await up.text();
        return new Response(text, {
          status: up.status,
          headers: { ...cors, "Content-Type": up.headers.get("Content-Type") || "text/html; charset=utf-8" },
        });
      }

      /* ---------------- market lookup (OMI + portals, cached) ---------------- */
      if (request.method === "GET" && path === "/market-lookup") {
        if (!env.GEMINI_API_KEY) return json({ error: "Server is missing GEMINI_API_KEY secret" }, 500, cors);
        const comune = (url.searchParams.get("comune") || "").trim();
        const province = (url.searchParams.get("province") || "").trim();
        if (!comune) return json({ error: "missing comune parameter" }, 400, cors);

        const cacheKey = "mkt:" + comune.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          + (province ? "|" + province.toUpperCase() : "");
        if (kv && url.searchParams.get("refresh") !== "1") {
          const hit = await kv.get(cacheKey);
          if (hit) {
            return new Response(hit, { status: 200, headers: { ...cors, "Content-Type": "application/json", "X-Cache": "hit" } });
          }
        }

        const prompt = [
          "You are an Italian chartered property valuer. Using web search, report CURRENT market figures for",
          `the comune of ${comune}${province ? " (" + province + ")" : ""}, Lombardy, Italy.`,
          "",
          "Keep the price concepts SEPARATE and never merge them:",
          " - OMI (Agenzia delle Entrate) zonal quotations: these are TRANSACTION-level ranges.",
          " - Portal ASKING prices (immobiliare.it, idealista.it): these are asking, not closing, prices.",
          "Residential apartments in normal (not luxury, not derelict) condition.",
          "Reflect the real local submarket: lakefront, mountain, resort, student and metropolitan",
          "areas must NOT be smoothed into a provincial average.",
          "",
          "Return ONLY this JSON, using null where you have no reliable figure:",
          '{"comune":"","province":"","omi_zone":"","omi_semester":"",',
          '"omi_sale_min_eur_m2":null,"omi_sale_max_eur_m2":null,',
          '"omi_rent_min_eur_m2_month":null,"omi_rent_max_eur_m2_month":null,',
          '"asking_sale_eur_m2":null,"asking_rent_eur_m2_month":null,',
          '"renovated_asking_sale_eur_m2":null,',
          '"asking_to_transaction_discount_pct":null,',
          '"submarket":"","confidence":0,"sources":[{"name":"","url":""}],"as_of":"YYYY-MM-DD"}'
        ].join("\n");

        let resp;
        try {
          const u = new URL(UPSTREAM + "/v1beta/models/gemini-2.5-flash:generateContent");
          u.searchParams.set("key", env.GEMINI_API_KEY);
          resp = await fetch(u.toString(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              tools: [{ google_search: {} }],
              generationConfig: { temperature: 0, maxOutputTokens: 2048 }
            })
          });
        } catch (e) {
          return json({ error: "lookup failed", detail: String(e).slice(0, 200) }, 502, cors);
        }
        if (!resp.ok) {
          const t = await resp.text();
          return json({ error: "upstream error", status: resp.status, detail: t.slice(0, 300) }, resp.status, cors);
        }
        const data = await resp.json();
        const text = (((data.candidates || [])[0] || {}).content || {}).parts || [];
        const raw = text.map((p) => p.text || "").join("").trim();
        const match = raw.replace(/```json|```/g, "").match(/\{[\s\S]*\}/);
        if (!match) return json({ error: "no structured result", raw: raw.slice(0, 300) }, 502, cors);

        let parsed;
        try { parsed = JSON.parse(match[0]); }
        catch (e) { return json({ error: "unparseable result", raw: match[0].slice(0, 300) }, 502, cors); }

        parsed.comune = parsed.comune || comune;
        parsed.province = parsed.province || province;
        parsed.fetched_at = new Date().toISOString();
        const body = JSON.stringify(parsed);
        if (kv) await kv.put(cacheKey, body, { expirationTtl: MARKET_CACHE_TTL_SECONDS });
        return new Response(body, { status: 200, headers: { ...cors, "Content-Type": "application/json", "X-Cache": "miss" } });
      }

      /* ---------------- Gemini: model listing ---------------- */
      if (request.method === "GET" && path === "/v1beta/models") {
        if (!env.GEMINI_API_KEY) return json({ error: "Server is missing GEMINI_API_KEY secret" }, 500, cors);
        const gate = await checkAccess(request, kv, env, { needsGeneration: false });
        if (!gate.ok) return json(gate.body, gate.status, cors);

        const u = new URL(UPSTREAM + "/v1beta/models");
        u.searchParams.set("pageSize", url.searchParams.get("pageSize") || "200");
        u.searchParams.set("key", env.GEMINI_API_KEY);
        const r = await fetch(u.toString());
        const body = await r.text();
        return new Response(body, {
          status: r.status,
          headers: { ...cors, "Content-Type": r.headers.get("Content-Type") || "application/json" },
        });
      }

      /* ---------------- Gemini: generateContent ---------------- */
      if (request.method === "POST" && /^\/v1beta\/models\/[^/]+:generateContent$/.test(path)) {
        if (!env.GEMINI_API_KEY) return json({ error: "Server is missing GEMINI_API_KEY secret" }, 500, cors);

        const model = path.slice("/v1beta/models/".length, -":generateContent".length);
        const isImage = /image/i.test(model);

        // Image generation is the paid deliverable: it needs a live generation id,
        // which can only be obtained by spending one of the link's report slots.
        const gate = await checkAccess(request, kv, env, { needsGeneration: isImage });
        if (!gate.ok) return json(gate.body, gate.status, cors);

        const u = new URL(UPSTREAM + path);
        u.searchParams.set("key", env.GEMINI_API_KEY);

        let body;
        try { body = await request.text(); }
        catch { return json({ error: "Could not read request body" }, 400, cors); }

        const r = await fetch(u.toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        const text = await r.text();
        return new Response(text, {
          status: r.status,
          headers: { ...cors, "Content-Type": r.headers.get("Content-Type") || "application/json" },
        });
      }

      return json({ error: "Not found", path }, 404, cors);
    } catch (e) {
      return json({ error: "worker_error", detail: String(e && e.message || e).slice(0, 300) }, 500, cors);
    }
  },
};

/* ===================== helpers ===================== */

async function getToken(kv, token) {
  const raw = await kv.get("tok:" + token);
  if (!raw) return null;
  try {
    const rec = JSON.parse(raw);
    if (typeof rec.max !== "number") rec.max = DEFAULT_MAX_USES;
    if (typeof rec.used !== "number") rec.used = 0;
    return rec;
  } catch { return null; }
}

/**
 * Decides whether a Gemini call may proceed.
 *  - open mode (no KV)            -> always allowed
 *  - token present                -> must exist, be active and have slots left
 *  - no token                     -> allowed unless REQUIRE_TOKEN === "true"
 *  - needsGeneration (image call) -> a valid, unexpired generation id is required
 */
async function checkAccess(request, kv, env, opts) {
  if (!kv) return { ok: true };

  const token = request.headers.get("X-Access-Token") || "";
  const requireToken = String(env.REQUIRE_TOKEN) === "true";

  if (!token) {
    if (requireToken) {
      return { ok: false, status: 403, body: { error: "Access link required", code: "no_token" } };
    }
    if (opts.needsGeneration) {
      const gid = request.headers.get("X-Generation-Id") || "";
      if (!gid) return { ok: false, status: 403, body: { error: "No active report generation", code: "no_generation" } };
      const g = await kv.get("gen:" + gid);
      if (!g) return { ok: false, status: 403, body: { error: "Report session expired", code: "expired_generation" } };
    }
    return { ok: true };
  }

  const rec = await getToken(kv, token);
  if (!rec) return { ok: false, status: 403, body: { error: "Unknown access link", code: "invalid_token" } };
  if (rec.active === false) {
    return { ok: false, status: 403, body: { error: "This link has been revoked", code: "revoked", remaining: 0, max: rec.max } };
  }
  if (rec.used > rec.max) {
    return { ok: false, status: 403, body: { error: "No reports left on this link", code: "exhausted", remaining: 0, max: rec.max } };
  }

  if (opts.needsGeneration) {
    const gid = request.headers.get("X-Generation-Id") || "";
    if (!gid) {
      return { ok: false, status: 403, body: { error: "No active report generation", code: "no_generation", remaining: Math.max(0, rec.max - rec.used), max: rec.max } };
    }
    const raw = await kv.get("gen:" + gid);
    if (!raw) {
      return { ok: false, status: 403, body: { error: "Report session expired", code: "expired_generation", remaining: Math.max(0, rec.max - rec.used), max: rec.max } };
    }
    let g = {};
    try { g = JSON.parse(raw); } catch {}
    if (g.token && g.token !== token) {
      return { ok: false, status: 403, body: { error: "Generation does not belong to this link", code: "generation_mismatch" } };
    }
    const images = (g.images || 0) + 1;
    if (images > MAX_IMAGES_PER_GENERATION) {
      return { ok: false, status: 429, body: { error: "Image limit reached for this report", code: "generation_image_limit", remaining: Math.max(0, rec.max - rec.used), max: rec.max } };
    }
    g.images = images;
    await kv.put("gen:" + gid, JSON.stringify(g), { expirationTtl: GENERATION_TTL_SECONDS });
  }

  return { ok: true };
}

async function handleAdmin(request, env, url, cors, kv) {
  if (!env.ADMIN_SECRET) {
    return json({ error: "ADMIN_SECRET is not configured on the Worker" }, 500, cors);
  }
  const given = request.headers.get("X-Admin-Secret") || url.searchParams.get("secret") || "";
  if (given !== env.ADMIN_SECRET) {
    return json({ error: "Unauthorized" }, 401, cors);
  }
  if (!kv) {
    return json({ error: "KV namespace 'QUOTA' is not bound — create it to enable access links." }, 503, cors);
  }

  const path = url.pathname;

  // Mint a new customer link
  if (path === "/admin/token" && request.method === "POST") {
    let payload = {};
    try { payload = JSON.parse((await request.text()) || "{}"); } catch {}
    const max = Number.isFinite(payload.max) && payload.max > 0 ? Math.floor(payload.max) : DEFAULT_MAX_USES;
    const token = randomId("ita").replace("ita_", "");
    const rec = {
      max,
      used: 0,
      active: true,
      note: String(payload.note || "").slice(0, 120),
      created: new Date().toISOString(),
    };
    await kv.put("tok:" + token, JSON.stringify(rec));
    return json({ ok: true, token, max, note: rec.note, created: rec.created }, 200, cors);
  }

  // Inspect one token
  if (path === "/admin/token" && request.method === "GET") {
    const token = url.searchParams.get("token") || "";
    if (!token) return json({ error: "missing token parameter" }, 400, cors);
    const rec = await getToken(kv, token);
    if (!rec) return json({ error: "not found", token }, 404, cors);
    return json({ ok: true, token, ...rec, remaining: Math.max(0, rec.max - rec.used) }, 200, cors);
  }

  // Revoke / reactivate / top up
  if (path === "/admin/token" && request.method === "PUT") {
    let payload = {};
    try { payload = JSON.parse((await request.text()) || "{}"); } catch {}
    const token = payload.token || url.searchParams.get("token") || "";
    if (!token) return json({ error: "missing token" }, 400, cors);
    const rec = await getToken(kv, token);
    if (!rec) return json({ error: "not found", token }, 404, cors);
    if (typeof payload.active === "boolean") rec.active = payload.active;
    if (Number.isFinite(payload.max) && payload.max > 0) rec.max = Math.floor(payload.max);
    if (payload.resetUsed === true) rec.used = 0;
    await kv.put("tok:" + token, JSON.stringify(rec));
    return json({ ok: true, token, ...rec, remaining: Math.max(0, rec.max - rec.used) }, 200, cors);
  }

  // List issued tokens
  if (path === "/admin/tokens" && request.method === "GET") {
    const list = await kv.list({ prefix: "tok:", limit: 200 });
    const out = [];
    for (const k of list.keys) {
      const rec = await getToken(kv, k.name.slice(4));
      if (rec) out.push({ token: k.name.slice(4), ...rec, remaining: Math.max(0, rec.max - rec.used) });
    }
    out.sort((a, b) => String(b.created || "").localeCompare(String(a.created || "")));
    return json({ ok: true, count: out.length, tokens: out }, 200, cors);
  }

  return json({ error: "Unknown admin endpoint", path }, 404, cors);
}

function randomId(prefix) {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return prefix + "_" + hex;
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...(headers || {}), "Content-Type": "application/json" },
  });
}
