# Il Tuo Architetto

Vitrine site + AI renovation planner for **Il Tuo Architetto** (Studio di
Architettura Colombo) — Lombardy, Italy.

| File | What it is |
|---|---|
| `index.html` | Bilingual (IT/EN) marketing landing page |
| `demo.html` | The guided planner dashboard — fully self-contained, no CDN |
| `admin.html` | Private page to mint access links for paying customers |
| `assets/` | Local fonts, CSS, i18n, `config.js` (proxy URL), `ita-runtime.js` |
| `worker/gemini-proxy.js` | Cloudflare Worker: Gemini proxy + listing fetcher + access quota |
| `netlify.toml` | Netlify hosting config |

The dashboard has **no external dependencies** — React, the fonts and all data
are local, so it runs anywhere you can serve static files.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Architecture

```
  visitor's browser                 Cloudflare Worker              Google
 ┌──────────────────┐            ┌──────────────────────┐      ┌───────────┐
 │ demo.html        │  no key →  │ adds GEMINI_API_KEY  │  →   │ Gemini API│
 │ ita-runtime.js   │            │ checks access quota  │      └───────────┘
 │  ?token=abc123   │            │ fetches listing HTML │
 └──────────────────┘            └──────────┬───────────┘
                                            │ KV: how many reports left
                                            ▼
                                    ┌──────────────┐
                                    │ ITA_QUOTA KV │
                                    └──────────────┘
```

Your `AIza…` key lives only as a Cloudflare secret — it is never sent to a
browser and never appears in this repository.

## Cloudflare Worker setup

1. https://dash.cloudflare.com → **Workers & Pages → Create → Create Worker**,
   name it `iltuoarchitetto-proxy`, **Deploy**.
2. **Edit code** → paste the whole of `worker/gemini-proxy.js` → **Save and Deploy**.
3. **Settings → Variables and Secrets**:

   | Name | Type | Value |
   |---|---|---|
   | `GEMINI_API_KEY` | Secret | your key from https://aistudio.google.com/apikey |
   | `ADMIN_SECRET` | Secret | any long random string you invent |
   | `ALLOWED_ORIGIN` | Variable | *(optional)* your site URL, e.g. `https://iltuoarchitetto.netlify.app` |
   | `REQUIRE_TOKEN` | Variable | *(optional)* `true` to refuse visitors without an access link |

4. Copy the Worker URL and put it in `assets/js/config.js`:
   ```js
   window.GEMINI_PROXY = "https://iltuoarchitetto-proxy.<account>.workers.dev";
   ```

## Market data: how property value and rent are worked out

Italian portals (immobiliare.it, idealista) publish **asking** prices; OMI
(Agenzia delle Entrate) publishes **transaction** quotations, which sit below
them. The report must not treat one as the other, so there are two layers:

**1. Live lookup (authoritative).** The value tab automatically calls the
Worker's `/market-lookup?comune=X&province=Y`, which uses grounded search to
retrieve the OMI sale/rent range, the portal asking rate, a renovated
comparable and a locally-estimated asking→transaction discount for that
specific comune. Results are cached in KV for 14 days, so a comune is looked
up once and every later visitor and scenario reuses it.

This layer is what keeps lakefront, resort, student and metropolitan
submarkets from being flattened into a provincial average.

**2. Modelled fallback** (used until a lookup succeeds):

- Every one of Lombardy's ~1,500 comuni resolves to its **provincial**
  baseline via the built-in ISTAT municipality table, not a single
  region-wide average.
- The provincial asking rate is stepped down to transaction level
  (`ASKING_TO_TRANSACTION_SALE`), and asking rent to achieved rent
  (`ASKING_TO_ACHIEVED_RENT`), so the figure shown is closer to what a
  property would actually sell or let for.
- Post-renovation value scales with how complete each scenario is, with
  diminishing returns, and is capped at the best renovated comparable for
  the area — a good interior in an ordinary building is not a new-build.

The fallback is deliberately conservative and cannot distinguish a large town
from a small village. Treat its figures as indicative; the live lookup is what
makes them local. Everything is labelled in the report with the basis used.

## Access links — capping reports at 3 per customer

Each paying customer gets a personal link that works a fixed number of times
(3 by default). The counter lives **on the server**, so clearing cookies,
using incognito, switching device or sharing the link does not reset it.

### 1. Create the KV namespace (this is what stores the counters)

- Cloudflare → **Storage & Databases → KV → Create namespace**, name it `ITA_QUOTA`.
- Worker → **Settings → Bindings → Add → KV namespace**
  - Variable name: `QUOTA`
  - Namespace: `ITA_QUOTA`

Until this binding exists the Worker runs in **open mode**: everything works,
nothing is metered. Quota switches on the moment `QUOTA` is bound.

The same namespace also caches market lookups, so binding it makes the value
and rent figures load instantly after the first visitor for each comune.

### 2. Mint a link

Open `admin.html` on your site, enter the Worker URL and your `ADMIN_SECRET`,
then create a link. You get something like:

```
https://your-site.netlify.app/demo.html?token=9f3c1a2b...
```

Send that to the customer. The page shows them how many reports remain, and
once the third one is used the unlock button is refused with a clear message.

### How the cap is enforced

- `POST /consume` spends one slot and returns a short-lived `generationId`.
- Photorealistic renders are refused unless the request carries a **live**
  `generationId` — so a slot has to be spent before any render can be produced;
  skipping the counter in the browser does not help.
- Text/vision calls (the free tabs) stay open while the link has slots left.
- A single report may make at most 60 image calls, which bounds replay of an
  old `generationId` inside its 3-hour window.

You can revoke or reactivate any link from `admin.html`.

> **Note on KV limits.** Cloudflare's free KV tier allows 1,000 writes/day.
> A full report uses roughly 25 writes, so ~40 reports/day. Paid KV is $5/mo
> if you outgrow it. KV is also eventually consistent and has no atomic
> counters — fine for one customer clicking a button, but two perfectly
> simultaneous clicks could in theory read the same counter. Durable Objects
> would be the fix if you ever need strict accounting.

## Hosting on Netlify

1. https://app.netlify.com → **Add new site → Import an existing project → GitHub**
   → pick `aniakh/Iltuoarchitetto`, branch `main`.
2. Build command: **empty**. Publish directory: `.`
3. **Site configuration → Change site name** to pick your subdomain.

Pushes to `main` redeploy automatically. The landing page's two contact forms
use Netlify Forms — enable **Forms** in the site settings to collect them.

## Note

Compliance checks, cost estimates and tax bonuses shown in the planner are
indicative only and do not replace a project by a qualified professional.
