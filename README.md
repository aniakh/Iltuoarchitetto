# Il Tuo Architetto

Vitrine (showcase) website for **Il Tuo Architetto** — an AI-powered home
renovation tool for Lombardy, Italy. Built from the `RenovaStudio Lombardia`
prototype.

- **`index.html`** — bilingual (IT / EN) marketing landing page.
- **`demo.html`** — the live, interactive renovation tool (5-step wizard:
  property → floor plan → interventions → style → 3 solutions).
- **`prototype.html`** — self-contained merged prototype (React + Babel inline,
  no build step). Adds a **current property value** field (manual or pulled from
  the listing), a **preferred budget & time limit** section that sizes the three
  proposals to budget −25% / budget / +25% (hard cap), and a refined **Market
  Analysis** tab (OMI · immobiliare.it · idealista · Borsino Immobiliare · ADE ·
  Banca d'Italia) covering after-renovation price, gross/net rent income and
  renovation & capital ROI. Open it directly over HTTP; paste a Google AI Studio
  key in the header to enable listing extraction and renders.
- **`src/demo-app.jsx`** — the demo's React source (the editable source of truth).
- **`assets/`** — fonts (Cormorant Garamond + Source Sans 3), CSS, the i18n
  script, the React runtime, `js/demo-app.js` (the compiled demo) and
  `js/config.js` (runtime config; see proxy section below).
- **`worker/gemini-proxy.js`** — Cloudflare Worker that holds your Gemini API
  key server-side so visitors don't need their own.
- **`netlify.toml`** — Netlify hosting config.

## Run locally

It is fully static — serve the folder over HTTP (so the demo's relative
assets and API calls work; `file://` is not recommended):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

The language toggle (IT/EN, top-right) is remembered across visits. The demo
talks directly to the Google Gemini API, so its listing extraction, floor-plan
analysis and photorealistic renders need a personal **Google AI Studio API
key** (`AIza…`), entered in the tool's header.

## Editing the demo

`assets/js/demo-app.js` is generated from `src/demo-app.jsx`. After editing the
source, recompile it with Babel (JSX → JS):

```bash
npx babel src/demo-app.jsx --presets @babel/preset-react -o assets/js/demo-app.js
```

## Hosting on Netlify (cleaner URL than GitHub Pages)

1. Sign up at https://app.netlify.com/signup (free, no card).
2. **Add new site → Import an existing project → GitHub** → pick
   `aniakh/Iltuoarchitetto` → branch `main`. Leave the build command **empty**
   and set the publish directory to `.` (or accept what `netlify.toml` provides).
   Click **Deploy**.
3. After deploy, open **Site configuration → Change site name** and set it to
   `iltuoarchitetto`. The site is now live at
   **https://iltuoarchitetto.netlify.app**.

Pushes to `main` redeploy automatically.

## Letting visitors use the demo without their own API key

By default each visitor pastes their own Google AI Studio key into the demo
header. To remove that step — and never expose your key in the public site —
deploy the included Cloudflare Worker as a proxy:

1. **Sign in** at https://dash.cloudflare.com/ (free).
2. **Workers & Pages → Create → Create Worker**. Name it
   `iltuoarchitetto-proxy` and click **Deploy** (the default Hello World
   placeholder is fine for a first deploy).
3. Click **Edit code**, replace the whole file with the contents of
   `worker/gemini-proxy.js`, then **Save and Deploy**.
4. **Settings → Variables and Secrets → Add Secret**:
   - Name: `GEMINI_API_KEY`
   - Value: your `AIza…` key from https://aistudio.google.com/apikey

   Optionally also add a plain variable `ALLOWED_ORIGIN` set to
   `https://iltuoarchitetto.netlify.app` to restrict who can call the proxy.
5. Copy the Worker URL (looks like
   `https://iltuoarchitetto-proxy.<account>.workers.dev`).
6. Edit **`assets/js/config.js`**, set:
   ```js
   window.GEMINI_PROXY = "https://iltuoarchitetto-proxy.<account>.workers.dev";
   ```
   Commit and push — Netlify redeploys and the key field disappears from the
   demo header. Visitors can now use every AI feature with no setup.

Your `AIza…` key stays as a Cloudflare secret; it is never sent to the browser.

## Note

Compliance checks, cost estimates and tax bonuses shown in the demo are
indicative only and do not replace a project by a qualified professional.
