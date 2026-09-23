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
| `agent/` | **Mail agent**: reads emailed payment receipts, mints access links on your approval |

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
   | `ALLOWED_ORIGIN` | Variable | *(optional)* `https://iltuoarchitetto2dto5d.netlify.app` |
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

## Energy: how the class and consumption are worked out

**The pre-renovation class is never invented.** If the listing carried an APE
class, or the owner typed one, that class is the "before" class throughout the
report — summary tile, APE ladder, consumption table and the saving figure all
read from one engine, so nothing can contradict it. Only when no class exists
at all does the report fall back to a screening estimate, and it says so on the
tile.

**The pre-renovation consumption follows the same hierarchy**: a declared
annual consumption from 12 months of bills wins; failing that the EPgl,nren
index from the certificate or the advert; failing that the consumption is
modelled from the declared class. Every tile names which of the three applies.

An advertisement publishes EPgl,nren as an *index* in kWh/m²·year, not a year's
total, so the unit is resolved before the number is used — a figure under
600 is read as an index whatever unit was claimed for it, because no heated
dwelling runs on that in a year.

**The post-renovation class is a band, not a single letter.** APE classes are
ratios to a reference building (A4 ≤0.4 … F ≤3.5, G open above), not kWh/m²
thresholds. A recorded before-class therefore only narrows the property to a
ratio *interval*; the heating scenario is propagated through both ends of that
interval and the result shown as a band (e.g. "C–D"), explicitly labelled
indicative and not a certified APE.

The consumption model works in useful heating demand, not a primary index:

```
Q_heat,post = Q_heat,pre × Π(1 − reduction_i)
E_gas       = (Q_heat + Q_DHW) / (seasonal_efficiency × gas_kWh_per_m³)
E_heatpump  = (Q_heat + Q_DHW) / SCOP
Saving      = Bill_before − Bill_after
```

Screening defaults: gas seasonal efficiency 0.82, SCOP 3.2, 10.5 kWh/m³ gas,
20 kWh/m²·year useful hot water, 2,200 kWh/year appliance electricity (excluded
from the APE primary-energy figure). Non-renewable conversion factors 1.05 gas
and 1.95 grid electricity, per the regional annex. Demand reductions are
planning assumptions applied multiplicatively — windows 12%, internal wall
insulation 22%, controls 5% — **not** values prescribed by CENED.

Tariff defaults (€0.30/kWh electricity, €1.10/m³ gas, €0.12/kWh district heat)
are **sensitivity inputs, not ARERA quotations**, and the report says so. The
displayed range is ±35% of the absolute saving plus €150; it is a stress range,
not a statistical confidence interval.

The headline percentage is the **bill** saving, because that is what a reader
compares against their own invoices; the heating-demand cut is reported
separately, since changing the energy vector moves the bill without changing
how much heat the flat needs.

## Plan and render fidelity

The proposal has to be *this* apartment after the work, not a nice picture of
a different one. Four things enforce that.

**Every room gets a size, even when the plan prints none.** The plan reader
refuses to invent metres — correct for evidence, but it leaves rooms
dimensionless and then the renders pick whatever scale looks comfortable.
`calibratePlanScale` closes the gap without inventing anything: the model is
asked only for proportions it can see (each room's share of the interior, its
aspect ratio), and the metres are computed **in code** by distributing the
known net area across those shares. Printed dimensions always win and are
marked as plan evidence; derived ones are labelled a proportional estimate and
never promoted to a measurement. Balconies and loggias stay outside the
interior and cannot be absorbed into a room.

**The envelope is frozen and only internal walls and doors may move.** External
walls, the entrance, every window and every balcony door keep their position
and size; no space may be added that is not already in the plan; the total area
is a zero-sum constraint. Scenario flexibility applies to internal partitions
only — Essential locks the layout entirely, Premium may reorganise freely but
strictly inside the existing perimeter.

**Renders are taken from where the client stood.** The client's own photograph
of the room is passed to the image model as the authority for the camera —
same standing point, height, direction and lens width — and for every
immovable feature. Where photograph and plan disagree about walls or openings,
the plan wins, because it is the state after the work. Walls, windows,
doorways, radiators, columns and what is visible *through* each opening must
appear in the same left-to-right order the client sees. A more flattering
angle is a defect: it makes the before/after comparison impossible.

**The furniture schedule is a closed list.** Every visible piece must be an
article from the furniture tab, at its real centimetres and in its stated
colour and material, with the product photograph supplied as reference. No
substitutions, no invented extras, no rescaling to fill a gap — if a piece will
not fit, the render shows fewer pieces rather than a larger room.

### The run always produces something

Generation used to be all-or-nothing: the drawing was committed only after
every verification step had returned. One stalled check therefore cost the
client the image they had paid for, and the card span with no result and no
error — indistinguishable from a hang.

Now the image is committed the moment it comes back, and the checks refine
that same record in place. Every optional step also runs against a clock
(`withTimeout`), so a verifier that never answers degrades to a warning
instead of stopping the run. The image load inside `imgPartDownscaled` was the
one await in the pipeline with no timeout **and** no error path — a picture
that neither loaded nor failed hung the run forever; it now falls back to the
full-size image after 15 seconds.

**Generate all three alternatives** with one button. Image calls are
serialised, so the three scenarios queue rather than compete, and each image
appears as it is ready.

### Prompt budget

Image models follow short, concrete instructions far better than long ones,
and the plan prompt had grown to ~7,800 tokens. Two things were wrong with it:

- the **full Italian legal catalogue** was being sent to an image model, which
  cannot render a U-value or a permit route. The rules that *do* show in a
  drawing — frozen envelope, ceiling heights, minimum room areas, door and
  corridor clear widths, a window in every habitable room — stay in the image
  prompt. The rest moved to `verifyLombardyConformity`, which reads the
  finished drawing, and is where a legal check can actually be made.
- the **product list was sent twice**, once as the readable furniture schedule
  and again as raw JSON.

The plan prompt is now ~5,200 tokens and the room prompts ~4,100, with every
constraint still enforced — just in the place where it works.

### Furniture you already own

Tick what you are keeping, room by room, in step 2. Kept pieces are drawn back
into the renders as your photographs show them and are **dropped from the
shopping list**, so the same sofa is never billed twice. Free text covers
anything the categories miss ("grandmother's walnut dresser against the left
wall").

### Does it comply?

After the plan is generated it is read against the Italian and Lombardy rules —
envelope invariance, DM 5/7/1975 dimensions and daylight, DM 236/1989
accessibility, NTC 2018 structure, riser and wet-room positions — and the
result appears in the Compliance tab with the likely permit route (CILA / SCIA
/ PdC). A blocking finding fails the plan and triggers a regeneration.

A check the drawings cannot settle is reported as **unsettled, never as
passed**. This is a reading of two drawings, not a professional assessment, and
the tab says so.

### Product links

Each article links straight to its product page where one has been confirmed.
Where none has, the row links to a retailer search and **says that is what it
is** — the tab counts how many of each, so a list you cannot order from is
visible at a glance rather than discovered at checkout.

## Return on investment: the 30-year investment case

A separate report tab answers the buyer's question rather than the owner's:
*should I buy this flat, renovate it, and what comes back over thirty years?*

**Money in** is everything it takes to own the finished flat — the purchase
price, *imposta di registro*, agency commission plus VAT, the notary
allowance, the construction works with their permits, fees, contingency and
VAT, and the furniture. The offer to aim for is the asking price less the
haircut between asking and achievable prices. The OMI band is shown beside it
as a **cross-check, not a floor**: OMI quotes a generic property in the zone,
and a dated flat legitimately transacts below the band bottom.

**Money back** comes from three separate places, none of which double counts
another: the value uplift at completion, the net rent after the itemised
deductions and *cedolare secca*, and the renovation tax credit spread over ten
years. The report also solves the **walk-away price** — the highest purchase
price at which the thirty-year net present value is still zero.

**The energy saving enters the NPV through an occupancy choice**, because who
receives it depends entirely on who pays the bills. The tab has three modes and
shows the NPV of each on its selector:

| Mode | Rent | Energy bill saving |
|---|---|---|
| Let — tenant pays the bills *(default)* | full net rent | none to the owner — it arrives as the energy-class premium already inside the rent, quantified on the page |
| Let with bills included | full net rent | full saving, indexed at 3%/year |
| Lived in by the owner | none | full saving, indexed at 3%/year |

No mode counts the same improvement twice. The rent model applies an
energy-class adjustment (F is −3%, C is +1.5%, and so on), so on an ordinary
let the class change is *already* paid for through the rent; adding the bill
saving on top would pay the owner twice. Energy prices are indexed at 3%/year
against 1.5% for rents, so the two use separate escalation rates.

The owner-occupied mode carries a warning on the page: it has no rent coming
in, but it also ignores the rent you stop paying elsewhere, so it is the cost
of owning rather than a true own-versus-rent comparison.

A chart plots where you would stand if you sold in any given year — rent and
tax instalments banked, plus net sale proceeds, less everything put in — for
all three scenarios on one money axis, so the tab answers *which* scenario and
not only *whether*. Year 0 on that chart is the immediate flip.

All rates are planning assumptions, disclosed on the page, and the report says
so. The ones that matter most:

| Assumption | Default | Note |
|---|---|---|
| Discount rate | 4.5% real | applied to real cash flows |
| Capital growth | 1.5%/year | from completion |
| Rent growth | 1.5%/year | |
| Renovation deduction | 36%, cap €96,000/unit, over 10 years | the main-home rate of 50% is shown alongside |
| Bonus mobili | 50%, cap €5,000 | only where qualifying works are done |
| Imposta di registro | 9% | on a cadastral base **proxied** at 60% of price — the real base is the revalued *rendita catastale*, which the report does not have |
| Purchase costs | 3% agency + 22% VAT, €2,500 notary | |
| Selling costs | 3% | |
| Plusvalenza | 26%, only inside 5 years of ownership | |

Excluded and stated as excluded: mortgage interest, IMU, furnishing
replacement, void periods beyond the vacancy allowance already in the rent
model, and renovation overrun beyond the contingency. **The fiscal rates turn
on whether the flat becomes your main home and are reset by each budget law —
they are planning inputs to confirm with a commercialista, not quotations.**

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
https://iltuoarchitetto2dto5d.netlify.app/standalone.html?token=9f3c1a2b...
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

## Selling it: the receipt-to-access mail agent

`agent/` holds a Google Apps Script that watches the studio inbox. When a
client emails a payment receipt it reads the receipt with Gemini, emails you a
summary with an approve link, and on your click mints a 3-report link and
replies in the client's own thread.

The human click is deliberate: a model reading a receipt image can be fooled
by a forgery, and this is paid access. The agent does the work and leaves you
one decision, with everything worth checking listed for you.

It stores no Gemini key — it calls the Worker exactly as the site does, with
an `X-Admin-Secret` header that exempts it from customer metering. Setup,
configuration and troubleshooting are in `agent/README.md`.

## Hosting on Netlify

1. https://app.netlify.com → **Add new site → Import an existing project → GitHub**
   → pick `aniakh/Iltuoarchitetto`, branch `main`.
2. Build command: **empty**. Publish directory: `.`
3. **Site configuration → Change site name** to pick your subdomain.

The site is live at **https://iltuoarchitetto2dto5d.netlify.app**:

| Page | What it is |
|---|---|
| [`/`](https://iltuoarchitetto2dto5d.netlify.app/) | The bilingual landing page |
| [`/standalone.html`](https://iltuoarchitetto2dto5d.netlify.app/standalone.html) | The single-file vitrine + planner — this is what you send to clients |
| [`/demo.html`](https://iltuoarchitetto2dto5d.netlify.app/demo.html) | The same planner, served from `assets/` |
| `/admin.html` | Private: mint customer links (noindex) |

Pushes to `main` redeploy automatically. The landing page's two contact forms
use Netlify Forms — enable **Forms** in the site settings to collect them.

## Note

Compliance checks, cost estimates and tax bonuses shown in the planner are
indicative only and do not replace a project by a qualified professional.
