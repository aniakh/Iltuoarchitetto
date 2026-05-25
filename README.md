# Il Tuo Architetto

Vitrine (showcase) website for **Il Tuo Architetto** — an AI-powered home
renovation tool for Lombardy, Italy. Built from the `RenovaStudio Lombardia`
prototype.

- **`index.html`** — bilingual (IT / EN) marketing landing page.
- **`demo.html`** — the live, interactive renovation tool (5-step wizard:
  property → floor plan → interventions → style → 3 solutions).
- **`assets/`** — fonts (Cormorant Garamond + Source Sans 3), CSS, the i18n
  script, and the React / Babel runtime used by the demo.

## Run locally

It is fully static — serve the folder over HTTP (the demo uses in-browser
Babel, which needs `http://`, not `file://`):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

The language toggle (IT/EN, top-right) is remembered across visits. The demo's
photorealistic render generation needs a personal Google AI Studio API key,
entered in the tool's header.

## Note

Compliance checks, cost estimates and tax bonuses shown in the demo are
indicative only and do not replace a project by a qualified professional.
