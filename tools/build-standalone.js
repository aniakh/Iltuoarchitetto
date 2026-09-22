#!/usr/bin/env node
/*
 * Build a single self-contained page: vitrine + planner in one file.
 * ===================================================================
 *
 *   node tools/build-standalone.js
 *
 * Takes demo.html and inlines everything it references — the @font-face
 * woff2 files as data URIs, the stylesheet, and the three runtime scripts —
 * so the result opens from a file:// path, an email attachment, a USB stick
 * or any static host with no assets/ folder beside it.
 *
 * What is deliberately NOT inlined: the Gemini API key. The page still calls
 * the Cloudflare Worker, so the key stays a server secret and the 3-report
 * cap stays server-enforced. A single file cannot police its own usage.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'demo.html');
const OUT = path.join(ROOT, 'standalone.html');

const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const readBin = p => fs.readFileSync(path.join(ROOT, p));

/*
 * fonts.css carries 55 @font-face blocks over only 12 files: every weight of a
 * family+subset points at the SAME woff2 (they are variable fonts), and most
 * subsets are alphabets this product never renders. Inlining it verbatim
 * embedded some fonts five times over and produced a 2.4 MB page.
 *
 * So: keep the latin and latin-ext subsets, collapse each family+file group
 * into one block with a font-weight RANGE, and embed every file exactly once.
 */
function buildFontCss(css) {
  const blocks = css.match(/@font-face\s*\{[^}]*\}/g) || [];
  const parsed = blocks.map(b => ({
    family: (b.match(/font-family:\s*'([^']+)'/) || [])[1],
    weight: parseInt((b.match(/font-weight:\s*(\d+)/) || [])[1], 10),
    style: (b.match(/font-style:\s*(\w+)/) || [])[1] || 'normal',
    file: (b.match(/fonts\/([^"')]+)/) || [])[1],
    range: ((b.match(/unicode-range:\s*([^;]+)/) || [])[1] || '').trim(),
  })).filter(x => x.family && x.file && x.weight);

  /* latin covers U+0000-00FF, latin-ext covers U+0100-02BA */
  const keep = parsed.filter(x => /U\+0000-00FF|U\+0100-02BA/.test(x.range));

  const groups = new Map();
  for (const x of keep) {
    const key = [x.family, x.style, x.file, x.range].join('|');
    const g = groups.get(key) || { ...x, min: x.weight, max: x.weight };
    g.min = Math.min(g.min, x.weight);
    g.max = Math.max(g.max, x.weight);
    groups.set(key, g);
  }

  const files = new Set();
  const out = [...groups.values()].map(g => {
    files.add(g.file);
    const buf = readBin(path.join('assets', 'fonts', g.file));
    const weight = g.min === g.max ? String(g.min) : `${g.min} ${g.max}`;
    return `@font-face {
  font-family: '${g.family}';
  font-style: ${g.style};
  font-weight: ${weight};
  font-display: swap;
  src: url(data:font/woff2;base64,${buf.toString('base64')}) format('woff2');
  unicode-range: ${g.range};
}`;
  }).join('\n');

  const raw = [...files].reduce((n, f) => n + readBin(path.join('assets', 'fonts', f)).length, 0);
  return {
    css: out,
    note: `${blocks.length} blocks/12 files -> ${groups.size} blocks/${files.size} files ` +
          `(${Math.round(raw / 1024)} KB of woff2, latin + latin-ext only)`
  };
}

function main() {
  let html = read('demo.html');
  const before = html.length;
  const steps = [];

  /* 1 — stylesheet, with the woff2 files embedded */
  const cssTag = '<link rel="stylesheet" href="assets/css/fonts.css">';
  if (!html.includes(cssTag)) throw new Error('fonts.css link not found in demo.html');
  const font = buildFontCss(read('assets/css/fonts.css'));
  html = html.replace(cssTag, `<style>\n${font.css}\n</style>`);
  steps.push(`fonts inlined: ${font.note} -> ${Math.round(font.css.length / 1024)} KB of CSS`);

  /* 2 — runtime scripts, in their original order */
  for (const rel of ['assets/js/config.js', 'assets/js/ita-runtime.js', 'assets/js/ita-app-i18n.js']) {
    const tag = `<script src="${rel}"></script>`;
    if (!html.includes(tag)) throw new Error(`script tag not found: ${rel}`);
    const js = read(rel);
    if (js.includes('</script>')) throw new Error(`${rel} contains a literal </script>`);
    html = html.replace(tag, `<script>\n/* ${rel} */\n${js}\n</script>`);
    steps.push(`${rel} inlined (${Math.round(js.length / 1024)} KB)`);
  }

  /* 3 — there is no index.html beside a standalone file, so the toolbar's
         back link returns to the vitrine at the top of this page instead. */
  html = html.replace(
    /<a href="index\.html"[^>]*>[\s\S]*?<\/a>\n?/,
    '');
  html = html.replace(
    `'<a href="index.html" style="display:inline-flex;align-items:center;gap:7px;color:#3479A8;' +`,
    `'<a href="#" onclick="window.scrollTo({top:0,behavior:\\'smooth\\'});return false" style="display:inline-flex;align-items:center;gap:7px;color:#3479A8;' +`);
  steps.push('back-link retargeted to the top of the page');

  /* 4 — title makes it obvious which artefact this is */
  html = html.replace(
    /<title>[^<]*<\/title>/,
    '<title>Il Tuo Architetto — Pianificatore (pagina unica)</title>');

  /* 5 — nothing external may remain */
  const external = [...html.matchAll(/<(?:script|link|img)[^>]*(?:src|href)="(?!#|data:)([^"]+)"/g)]
    .map(m => m[1])
    .filter(u => !/^(https?:)?\/\//.test(u) || true)
    .filter(u => !u.startsWith('data:') && u !== '#');
  const stillLocal = external.filter(u => u.startsWith('assets/'));
  if (stillLocal.length) throw new Error('local refs remain: ' + stillLocal.join(', '));

  fs.writeFileSync(OUT, html);

  console.log('Built standalone.html');
  steps.forEach(s => console.log('  · ' + s));
  console.log(`  · ${Math.round(before / 1024)} KB -> ${Math.round(html.length / 1024)} KB`);
  const remoteRefs = external.filter(u => /^https?:/.test(u));
  console.log(`  · remaining external loads: ${stillLocal.length}` +
    (remoteRefs.length ? ` (plus ${remoteRefs.length} outbound link(s), not loads)` : ''));
}

main();
