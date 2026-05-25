# Il Tuo Architetto

Vitrine (showcase) website for **Il Tuo Architetto** — an AI-powered home
renovation tool for Lombardy, Italy. Built from the `RenovaStudio Lombardia`
prototype.

- **`index.html`** — bilingual (IT / EN) marketing landing page.
- **`demo.html`** — the live, interactive renovation tool (5-step wizard:
  property → floor plan → interventions → style → 3 solutions).
- **`src/demo-app.jsx`** — the demo's React source (the editable source of truth).
- **`assets/`** — fonts (Cormorant Garamond + Source Sans 3), CSS, the i18n
  script, the React runtime, and `js/demo-app.js` (the compiled demo app).

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

## Note

Compliance checks, cost estimates and tax bonuses shown in the demo are
indicative only and do not replace a project by a qualified professional.
