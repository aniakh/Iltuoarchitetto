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
| `standalone.html` | **Single self-contained file**: vitrine + planner, no `assets/` needed |
| `tools/build-standalone.js` | Regenerates `standalone.html` from `demo.html` |
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

**The pre-renovation value is the announcement price.** If a listing URL was
pasted, the extracted asking price is used *unchanged* as the current value —
it is the real price of that specific property, not a zonal average. Failing
that, the "Asking / owner price" field is used. Only when neither exists is the
value modelled from market references, and the report always states which of
the three applies.

**Post-renovation value** starts from that exact figure and applies a
conservative, capped uplift per scenario (Essential 6% · Balanced 12% ·
Premium 18%), combining the condition step-up with any energy-class gain, then
caps the result at 96% of the local renovated comparable so a good interior in
an ordinary building is never valued as a new-build.

**OMI (Agenzia delle Entrate) is weighted against portal asking prices**, not
confused with them: 60% OMI indication + 40% portal asking with a 6%
asking→achievable haircut, with the OMI band positioned by the property's
declared condition. Portals publish *asking* prices; OMI publishes
*transaction* quotations.

**Rent** is a full NOI model, not a €/m² multiplication: local asking rent →
size and property factors (floor, lift, outdoor space, condominium fees,
energy class) → contract haircut → post-renovation uplift capped per scenario
→ a gross-yield sanity cap. Deductions for vacancy, management, owner's share
of condominium, maintenance and insurance are itemised, and the result is also
shown after *cedolare secca* at both 21% and 10% (canone concordato).

Every figure carries a confidence score, a conservative/base/upside scenario
set, and a step-by-step trace of how it was derived.

### Where the numbers come from

**Live lookup (authoritative).** The value tab automatically calls the Worker's
`/market-lookup?comune=X&province=Y`, which uses grounded search for that
comune's OMI sale/rent range, portal asking rate, renovated comparable and a
locally-estimated asking→transaction discount. Results cache in KV for 14 days,
so each comune is fetched once. This is what keeps lakefront, resort, student
and metropolitan submarkets from being flattened into a provincial average.

**Modelled fallback** (until a lookup succeeds): every one of Lombardy's ~1,500
comuni resolves to its **provincial** baseline through the built-in ISTAT
municipality table rather than one region-wide average, and the OMI band is
derived from that local asking reference. The fallback is deliberately
conservative and cannot tell a large town from a small village — the live
lookup is what makes it local.

## The single-file standalone page

`standalone.html` is the whole product in one file — the vitrine and the
planner together, with the fonts, stylesheet and runtime scripts inlined. It
opens from a static host, a USB stick or a double-click on the file itself,
with no `assets/` folder beside it.

Rebuild it whenever `demo.html` or anything in `assets/` changes:

```bash
node tools/build-standalone.js
```

The build keeps only the latin and latin-ext font subsets and collapses each
family to a single weight-range face, so the fonts are embedded once rather
than once per weight — that is the difference between a 2.4 MB page and a
1.0 MB one.

### What it does NOT inline — and why

The Gemini API key is **not** in the file, and the 3-report counter is **not**
kept in the browser. Both still live in the Cloudflare Worker:

- a key inside the file would be readable by anyone who opens it;
- a counter inside the file resets with a cleared cache or an incognito window.

So the standalone page is self-contained in its *assets*, but it still calls
your Worker for AI and for the quota. That is what makes "3 uses" actually
mean three uses. Give each customer a link or a copy carrying their token:

```
standalone.html?token=9f3c1a2b...
```

> **If you set `ALLOWED_ORIGIN` on the Worker**, a copy opened directly from
> disk (`file://`, which has a `null` origin) will be refused by CORS and the
> AI features will not run. Either leave `ALLOWED_ORIGIN` unset, or host the
> file and hand out the URL rather than the file.

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
