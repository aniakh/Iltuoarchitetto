/* Il Tuo Architetto — app toolbar, IT/EN translation, trials counter
 * ===================================================================
 * The planner is a pre-compiled React bundle with its copy written in
 * English, so translation happens at the DOM level:
 *
 *   1. DICT below holds curated EN -> IT for the UI people read most.
 *      Curated wins, so key terms stay consistent.
 *   2. Anything not in DICT is sent once to Gemini (through the same
 *      Worker proxy, as a text call, so it never spends a report slot)
 *      and cached in localStorage. After the first switch it is instant.
 *   3. A MutationObserver re-applies translations as React re-renders.
 *
 * Loaded after ita-runtime.js and before the app bundle.
 */
(function () {
  "use strict";

  var LANG_KEY = "ita_lang";
  var CACHE_KEY = "ita_tr_cache_v1";
  var MARK = "data-ita-tr";

  /* ---------------- curated dictionary ---------------- */
  var DICT = {
    /* ---- landing / hero ---- */
    "Renovation planning for Lombardy homes": "Progettazione di ristrutturazioni per case in Lombardia",
    "See what your home could become —": "Scopri come potrebbe diventare la tua casa —",
    "before you spend a euro on it": "prima di spenderci un euro",
    "Upload your floor plan, tell us what you’d like to change, and get three fully-costed renovation options in minutes — grounded in real market data and checked against Italian building regulations.":
      "Carica la planimetria, indicaci cosa vorresti cambiare e ricevi in pochi minuti tre proposte di ristrutturazione complete — basate su dati di mercato reali e verificate secondo le norme edilizie italiane.",
    "Start your project": "Inizia il tuo progetto",
    "See how it works": "Scopri come funziona",
    "See an example": "Guarda un esempio",
    "Free to explore · No account needed · Your project stays in this browser session":
      "Esplorazione libera · Nessun account richiesto · Il progetto resta in questa sessione del browser",
    "to your first options": "per le prime proposte",
    "scenarios compared side by side": "scenari messi a confronto",
    "editable, nothing locked in": "tutto modificabile, niente è definitivo",
    "Same exterior • schematic only • not to scale": "Stesso involucro esterno • solo schema • non in scala",
    "Before": "Prima",
    "After": "Dopo",
    "Same footprint, different layout — drag to compare. Illustrative schematic, not a real client project.":
      "Stessa superficie, distribuzione diversa — trascina per confrontare. Schema illustrativo, non un progetto reale.",
    "Grounded in real Lombardy data": "Basato su dati reali della Lombardia",
    "Costs, market values and rents reference checked provincial and municipal sources, never a single national average.":
      "Valori di mercato e affitti fanno riferimento a fonti provinciali e comunali verificate, mai a una singola media nazionale.",
    "Checked against building regulations": "Verificato secondo le norme edilizie",
    "Every plan is tested against national and Lombardy hygiene, safety and accessibility rules before it reaches you.":
      "Ogni planimetria è verificata secondo le norme nazionali e lombarde di igiene, sicurezza e accessibilità prima di arrivare a te.",
    "Reviewed, not just generated": "Verificato, non solo generato",
    "Three options, one decision": "Tre proposte, una decisione",
    "How it works": "Come funziona",
    "Four short steps from your existing plan to a decision you can act on.":
      "Quattro semplici passaggi dalla tua planimetria a una decisione concreta.",
    "Property": "Immobile",
    "Floor plan": "Planimetria",
    "Renovation & style": "Interventi e stile",
    "Your options": "Le tue proposte",
    "Postcode, size, rooms and your target budget": "CAP, superficie, locali e budget indicativo",
    "Upload your plan and a few room photos": "Carica la planimetria e qualche foto delle stanze",
    "Choose what to change and the look you want": "Scegli cosa cambiare e lo stile che desideri",
    "Compare Essential, Balanced and Premium side by side": "Confronta Essential, Balanced e Premium",
    "Frequently asked": "Domande frequenti",
    "The questions we hear most before someone starts their project.":
      "Le domande che riceviamo più spesso prima di iniziare un progetto.",
    "Does this replace my architect?": "Sostituisce il mio architetto?",
    "Where do the costs and values come from?": "Da dove vengono i valori indicati?",
    "Is my project saved anywhere?": "Il mio progetto viene salvato?",
    "How accurate are the renders?": "Quanto sono accurati i render?",
    "Ready to see your own options?": "Pronto a vedere le tue proposte?",
    "Ready to see your options?": "Pronto a vedere le tue proposte?",
    "Bring your floor plan and a few photos — the rest takes about five minutes.":
      "Porta la planimetria e qualche foto — il resto richiede circa cinque minuti.",
    "Takes about five minutes. You can stop and adjust anything.":
      "Richiede circa cinque minuti. Puoi fermarti e modificare tutto.",

    /* ---- wizard chrome ---- */
    "Back": "Indietro", "Next": "Avanti", "Continue": "Continua", "Start": "Inizia",
    "Close": "Chiudi", "Save": "Salva", "Cancel": "Annulla", "Edit": "Modifica",
    "Settings": "Impostazioni", "Help": "Aiuto", "Print": "Stampa", "Export": "Esporta",
    "Upload": "Carica", "Remove": "Rimuovi", "Add": "Aggiungi", "Retry": "Riprova",
    "Optional": "Facoltativo", "Required": "Obbligatorio", "Yes": "Sì", "No": "No",

    /* ---- report tabs ---- */
    "Comparison": "Confronto",
    "Plans & room views": "Planimetrie e viste",
    "Scope & details": "Interventi e dettagli",
    "Energy summary": "Riepilogo energetico",
    "Energy calculations": "Calcoli energetici",
    "Schedule": "Cronoprogramma",
    "Value & rent": "Valore e affitto",
    "Furniture & materials": "Arredi e materiali",
    "Compliance": "Conformità",

    /* ---- plan & renders ---- */
    "Generate furnished plan": "Genera planimetria arredata",
    "Regenerate furnished plan": "Rigenera planimetria arredata",
    "Generate room views for every space": "Genera le viste di tutte le stanze",
    "Regenerate room views": "Rigenera le viste delle stanze",
    "Unlock plan & renders": "Sblocca planimetria e render",
    "Sblocca planimetria e render": "Sblocca planimetria e render",
    "No plan has been generated for this option.": "Nessuna planimetria generata per questa proposta.",
    "Upload your existing plan in step 2.": "Carica la planimetria esistente nel passaggio 2.",
    "Creating the furnished plan…": "Creazione della planimetria arredata…",
    "Waiting for the image service…": "Attendo il servizio di generazione immagini…",
    "Comparing the complete plan to your original…": "Confronto la planimetria con l'originale…",
    "Mapping walls, openings, furniture and camera positions…": "Mappatura di pareti, aperture, arredi e inquadrature…",
    "Proposed plan": "Planimetria proposta",

    /* ---- solutions ---- */
    "Essential": "Essential", "Balanced": "Balanced", "Premium": "Premium",

    /* ---- access ---- */
    "Reports included": "Report inclusi",
    "Demo · open access": "Demo · accesso libero",
    "No limit active on this link.": "Nessun limite attivo su questo link."
  };

  /* ---------------- cache ---------------- */
  var cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}") || {}; } catch (e) { cache = {}; }
  function saveCache() {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) {}
  }

  function lookup(s) {
    if (Object.prototype.hasOwnProperty.call(DICT, s)) return DICT[s];
    if (Object.prototype.hasOwnProperty.call(cache, s)) return cache[s];
    return null;
  }

  /* ---------------- DOM walking ---------------- */
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1, TEXTAREA: 1 };
  var ATTRS = ["placeholder", "title", "aria-label"];

  function translatable(s) {
    if (!s) return false;
    var t = s.trim();
    if (t.length < 2) return false;
    if (!/[A-Za-z]/.test(t)) return false;         // numbers / symbols only
    if (/^[\d\s.,:;%€$·—–\-+/()]+$/.test(t)) return false;
    return true;
  }

  var pending = new Set();

  function apply(root, collect) {
    var lang = current();
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (n) {
        if (n.nodeType === 1) return SKIP_TAGS[n.tagName] ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n, textNodes = [];
    while ((n = walker.nextNode())) textNodes.push(n);

    textNodes.forEach(function (node) {
      var parent = node.parentElement;
      if (!parent || SKIP_TAGS[parent.tagName]) return;
      if (parent.closest && parent.closest("#ita-toolbar")) return;   // our own chrome
      var original = parent.getAttribute(MARK);
      var raw = node.nodeValue;
      var trimmed = raw.trim();

      if (lang === "en") {
        if (original != null) { node.nodeValue = original; parent.removeAttribute(MARK); }
        return;
      }
      if (!translatable(trimmed)) return;
      var source = original != null ? original : trimmed;
      var hit = lookup(source);
      if (hit) {
        if (original == null) parent.setAttribute(MARK, source);
        if (trimmed !== hit) node.nodeValue = raw.replace(trimmed, hit);
      } else if (collect) {
        pending.add(source);
      }
    });

    // attributes people read
    var els = root.querySelectorAll ? root.querySelectorAll("*") : [];
    Array.prototype.forEach.call(els, function (el) {
      if (el.closest && el.closest("#ita-toolbar")) return;
      ATTRS.forEach(function (a) {
        var v = el.getAttribute && el.getAttribute(a);
        if (!v) return;
        var key = MARK + "-" + a;
        var orig = el.getAttribute(key);
        if (lang === "en") { if (orig != null) { el.setAttribute(a, orig); el.removeAttribute(key); } return; }
        if (!translatable(v)) return;
        var source = orig != null ? orig : v;
        var hit = lookup(source);
        if (hit) { if (orig == null) el.setAttribute(key, source); el.setAttribute(a, hit); }
        else if (collect) pending.add(source);
      });
    });
  }

  /* ---------------- AI fallback (batched, cached) ---------------- */
  var translating = false;

  async function translatePending() {
    if (translating) return;
    var list = Array.from(pending).filter(function (s) { return !lookup(s); });
    if (!list.length) return;
    var proxy = window.ITA && window.ITA.proxy;
    if (!proxy) return;                                   // no proxy -> curated only
    translating = true;
    setStatus("Traduzione in corso…");
    try {
      for (var i = 0; i < list.length; i += 60) {
        var batch = list.slice(i, i + 60);
        var prompt =
          "Translate these UI strings from English to Italian for an architecture / home-renovation web app.\n" +
          "Rules: return ONLY a JSON object mapping each original string to its Italian translation. " +
          "Keep numbers, units, product codes and proper nouns unchanged. Keep the same tone (professional, direct, informal 'tu'). " +
          "Do not add or remove punctuation at the ends. If a string is already Italian, return it unchanged.\n\n" +
          JSON.stringify(batch);
        var res = await fetch(window.ITA.geminiUrl("gemini-2.5-flash", ""), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0, maxOutputTokens: 8192, responseMimeType: "application/json" }
          })
        });
        if (!res.ok) break;
        var data = await res.json();
        var txt = (((data.candidates || [])[0] || {}).content || {}).parts || [];
        txt = txt.map(function (p) { return p.text || ""; }).join("").trim();
        var obj = null;
        try { obj = JSON.parse(txt.replace(/^```json|```$/g, "").trim()); } catch (e) {}
        if (obj && typeof obj === "object") {
          Object.keys(obj).forEach(function (k) {
            if (typeof obj[k] === "string" && obj[k].trim()) cache[k] = obj[k].trim();
          });
          saveCache();
          apply(document.body, false);
        }
      }
    } catch (e) {
      // leave the untranslated strings in English rather than breaking the page
    } finally {
      translating = false;
      pending.clear();
      setStatus("");
    }
  }

  /* ---------------- language state ---------------- */
  function current() {
    try { return localStorage.getItem(LANG_KEY) === "it" ? "it" : "en"; } catch (e) { return "en"; }
  }
  function setLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    pending.clear();
    apply(document.body, lang === "it");
    renderToolbar();
    if (lang === "it") translatePending();
  }

  /* ---------------- toolbar ---------------- */
  var statusText = "";
  function setStatus(s) { statusText = s; var el = document.getElementById("ita-tr-status"); if (el) el.textContent = s; }

  function renderToolbar() {
    var bar = document.getElementById("ita-toolbar");
    if (!bar) return;
    var lang = current();
    var it = lang === "it";
    var q = window.ITA || {};
    var quota = "";
    if (q.enforced && q.remaining != null) {
      var color = q.remaining > 1 ? "#3479A8" : (q.remaining === 1 ? "#E0BC30" : "#C0392B");
      quota =
        '<span style="display:inline-flex;align-items:center;gap:7px;padding:5px 12px;border-radius:999px;' +
        'background:#F4F6F8;border:1px solid #E2E8EF">' +
          '<span style="width:8px;height:8px;border-radius:50%;background:' + color + '"></span>' +
          '<strong style="color:' + color + '">' + q.remaining + ' / ' + (q.max || 3) + '</strong>' +
          '<span style="color:#7B8B96">' + (it ? "report rimanenti" : "reports left") + '</span>' +
        '</span>';
    } else if (q.hasProxy) {
      quota = '<span style="color:#7B8B96;font-size:12.5px">' + (it ? "Demo · accesso libero" : "Demo · open access") + '</span>';
    }

    bar.innerHTML =
      '<div style="max-width:1180px;margin:0 auto;padding:0 16px;height:48px;display:flex;' +
      'align-items:center;justify-content:space-between;gap:12px">' +
        '<a href="index.html" style="display:inline-flex;align-items:center;gap:7px;color:#3479A8;' +
        'font-weight:700;font-size:13.5px;text-decoration:none;white-space:nowrap">&larr; Il Tuo Architetto</a>' +
        '<div style="display:flex;align-items:center;gap:12px">' +
          '<span id="ita-tr-status" style="font-size:12px;color:#7B8B96">' + statusText + '</span>' +
          quota +
          '<span style="display:inline-flex;border:1px solid #E2E8EF;border-radius:999px;overflow:hidden;background:#fff">' +
            '<button data-ita-lang="it" style="border:none;cursor:pointer;font-family:inherit;font-size:12px;' +
            'font-weight:700;padding:6px 12px;background:' + (it ? "#3479A8" : "transparent") + ';color:' + (it ? "#fff" : "#7B8B96") + '">IT</button>' +
            '<button data-ita-lang="en" style="border:none;cursor:pointer;font-family:inherit;font-size:12px;' +
            'font-weight:700;padding:6px 12px;background:' + (!it ? "#3479A8" : "transparent") + ';color:' + (!it ? "#fff" : "#7B8B96") + '">EN</button>' +
          '</span>' +
        '</div>' +
      '</div>';

    bar.querySelectorAll("[data-ita-lang]").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-ita-lang")); });
    });
  }

  function mountToolbar() {
    if (document.getElementById("ita-toolbar")) return;
    var bar = document.createElement("div");
    bar.id = "ita-toolbar";
    bar.style.cssText =
      "position:fixed;top:0;left:0;right:0;z-index:99990;background:rgba(255,255,255,.97);" +
      "border-bottom:1px solid #E2E8EF;backdrop-filter:saturate(160%) blur(8px);" +
      "font-family:'Source Sans 3','Segoe UI',sans-serif";
    document.body.appendChild(bar);
    document.body.style.paddingTop = "48px";
    // the old floating back-link and quota badge are redundant now
    var old = document.querySelector('a[href="index.html"]:not(#ita-toolbar a)');
    if (old && old.parentElement === document.body) old.style.display = "none";
    var badgeHide = function () {
      var b = document.getElementById("ita-quota-badge");
      if (b) b.style.display = "none";
    };
    badgeHide();
    setTimeout(badgeHide, 500);
    renderToolbar();
    if (window.ITA && window.ITA.onChange) window.ITA.onChange(renderToolbar);
  }

  /* ---------------- observe React re-renders ---------------- */
  var timer = null;
  function schedule() {
    if (current() !== "it") return;
    clearTimeout(timer);
    timer = setTimeout(function () {
      apply(document.body, true);
      translatePending();
    }, 220);
  }

  function boot() {
    mountToolbar();
    if (current() === "it") { apply(document.body, true); translatePending(); }
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.target && m.target.id === "ita-toolbar") continue;
        schedule();
        break;
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.ITA_I18N = { setLang: setLang, dict: DICT, cache: cache, apply: apply };
})();
