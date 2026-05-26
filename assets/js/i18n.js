/* Il Tuo Architetto — bilingual (IT/EN) content + toggle */
const I18N = {
  it: {
    "nav.features": "Funzioni",
    "nav.how": "Come funziona",
    "nav.solutions": "Soluzioni",
    "nav.professionals": "Professionisti",
    "nav.contact": "Contatti",
    "nav.demo": "Prova la demo",
    "brand.sub": "Studio di Architettura Colombo",

    "top.phone": "+39 339 144 6039",
    "top.email": "info@iltuoarchitetto.it",

    "hero.eyebrow": "Ristrutturazione intelligente per la Lombardia",
    "hero.title.a": "Realizziamo insieme",
    "hero.title.accent": "la tua idea",
    "hero.subhead": "di casa, di luogo di lavoro, il tuo progetto.",
    "hero.lead": "Il Tuo Architetto aiuta le persone a realizzare luoghi dove vivere e lavorare, occupandosi di tutto quello che occorre — dal progetto al cantiere, facendo risparmiare tempo, controllando i costi, affrontando la burocrazia. Con un approccio umano, concreto e creativo.",
    "hero.cta1": "Prova la demo AI",
    "hero.cta2": "Scopri come funziona",
    "hero.m1.n": "3", "hero.m1.l": "soluzioni per ogni budget",
    "hero.m2.n": "8", "hero.m2.l": "stili di design",
    "hero.m3.n": "100%", "hero.m3.l": "conforme alle norme",

    "mock.title": "Il Tuo Architetto",
    "mock.sub": "3 soluzioni · render · conformità",
    "mock.render": "Render fotorealistico",
    "mock.c1": "Essential", "mock.c1p": "€ 38.000",
    "mock.c2": "Balanced", "mock.c2p": "€ 61.000",
    "mock.c3": "Premium", "mock.c3p": "€ 94.000",

    "strip.label": "Conforme alle normative",

    "feat.eyebrow": "Cosa puoi fare",
    "feat.title": "Tutto il progetto, in un unico strumento",
    "feat.sub": "Dall'analisi dell'immobile al render finale, ogni passaggio è automatizzato e verificato.",
    "feat.1.t": "Estrazione dall'annuncio",
    "feat.1.d": "Incolla un link immobiliare.it: indirizzo, superficie, classe energetica e prezzo si compilano da soli.",
    "feat.2.t": "Analisi della planimetria",
    "feat.2.d": "Claude Vision legge la planimetria, calcola le aree e blocca i vincoli spaziali nel prompt di render.",
    "feat.3.t": "Render fotorealistici",
    "feat.3.d": "Visualizzazioni realistiche in 8 stili: Japandi, Scandinavo, Mediterraneo, Minimalista e altri.",
    "feat.4.t": "Conformità normativa",
    "feat.4.d": "Controllo automatico su altezze, aerazione, accessibilità, struttura e vincoli della Lombardia.",
    "feat.5.t": "Stima dei costi",
    "feat.5.d": "Computo di costruzione e arredo con prezzi di mercato aggiornati al 2026.",
    "feat.6.t": "Efficienza energetica",
    "feat.6.d": "Confronto ante e post operam, risparmio annuo in € e salto di classe energetica.",
    "feat.7.t": "Bonus fiscali 2026",
    "feat.7.d": "Detrazioni 36–50%, cashflow anno per anno e quadro completo degli incentivi disponibili.",
    "feat.8.t": "ROI immobiliare",
    "feat.8.d": "Incremento di valore, rendimento da locazione e profitto stimato in caso di rivendita.",
    "feat.9.t": "Stili & feng shui",
    "feat.9.d": "Palette personalizzate, atmosfere e principi feng shui per un risultato su misura.",

    "how.eyebrow": "Il processo",
    "how.title": "Cinque passaggi, tre soluzioni",
    "how.sub": "Un percorso guidato che porta dai dati dell'immobile a progetti completi e cantierabili.",
    "how.1.t": "Proprietà", "how.1.d": "Inserisci i dati o incolla il link dell'annuncio.",
    "how.2.t": "Planimetria", "how.2.d": "Carica la planimetria: le aree vengono lette in automatico.",
    "how.3.t": "Interventi", "how.3.d": "Scegli gli interventi: cucina, bagno, finiture, impianti.",
    "how.4.t": "Stile", "how.4.d": "Definisci stile, atmosfera e preferenze cromatiche.",
    "how.5.t": "Analisi", "how.5.d": "Ricevi 3 soluzioni con render, costi e conformità.",

    "sol.eyebrow": "Tre proposte, un solo clic",
    "sol.title": "Essential · Balanced · Premium",
    "sol.sub": "Ogni analisi genera tre livelli di intervento, così puoi scegliere in base al budget.",
    "sol.tag": "Consigliata",
    "sol.1.t": "Essential",
    "sol.1.d": "Il massimo risultato con il budget contenuto.",
    "sol.1.l1": "Interventi prioritari",
    "sol.1.l2": "Finiture essenziali di qualità",
    "sol.1.l3": "Conformità garantita",
    "sol.2.t": "Balanced",
    "sol.2.d": "Il miglior equilibrio tra costo e valore.",
    "sol.2.l1": "Ristrutturazione completa",
    "sol.2.l2": "Efficienza energetica migliorata",
    "sol.2.l3": "Massimo recupero dei bonus",
    "sol.3.t": "Premium",
    "sol.3.d": "Materiali e finiture di alta gamma.",
    "sol.3.l1": "Design e materiali pregiati",
    "sol.3.l2": "Massimo incremento di valore",
    "sol.3.l3": "Domotica ed efficienza top",

    "aud.eyebrow": "Per chi è",
    "aud.title": "Pensato per chi ristruttura davvero",
    "aud.1.t": "Proprietari",
    "aud.1.d": "Visualizza la tua futura casa, conosci i costi reali e i bonus prima di iniziare.",
    "aud.2.t": "Agenzie immobiliari",
    "aud.2.d": "Mostra il potenziale di ogni immobile e accelera la vendita con render convincenti.",
    "aud.3.t": "Architetti & imprese",
    "aud.3.d": "Velocizza preventivi e proposte con un primo progetto conforme in pochi minuti.",

    /* === Preventivo (clients → professionals) === */
    "prev.eyebrow": "Dai render al cantiere",
    "prev.title": "Richiedi un preventivo a un professionista",
    "prev.p1": "Hai trovato la soluzione perfetta nella demo? Mettiamo in contatto te e gli architetti, ingegneri e geometri del nostro network in Lombardia.",
    "prev.p2": "Riceverai preventivi personalizzati sulla base del progetto che hai generato — render, computi e vincoli normativi inclusi.",
    "prev.l1": "Professionisti verificati e abilitati",
    "prev.l2": "Risposta entro 48 ore",
    "prev.l3": "Servizio gratuito per il proprietario",
    "prev.f.t": "Richiedi un preventivo",
    "prev.f.name": "Nome e cognome",
    "prev.f.email": "Email",
    "prev.f.phone": "Telefono",
    "prev.f.city": "Città dell'immobile",
    "prev.f.budget": "Budget indicativo",
    "prev.f.b.opt1": "Seleziona…",
    "prev.f.b.opt2": "Fino a 30.000 €",
    "prev.f.b.opt3": "30.000 – 60.000 €",
    "prev.f.b.opt4": "60.000 – 100.000 €",
    "prev.f.b.opt5": "Oltre 100.000 €",
    "prev.f.msg": "Descrivi il tuo progetto",
    "prev.f.msg.ph": "Es. Ristrutturazione totale di un appartamento di 85 m² in via …, progetto Essential generato dalla demo …",
    "prev.f.cta": "Invia richiesta",
    "prev.f.ok": "✓ Richiesta ricevuta. Ti contatteremo entro 48 ore.",

    /* === Professional subscription === */
    "pro.eyebrow": "Sei un professionista?",
    "pro.title": "Architetti, ingegneri e geometri: entra nel network",
    "pro.p1": "Iscriviti gratuitamente al network di Il Tuo Architetto e ricevi richieste di preventivo dai clienti che generano un progetto con la nostra piattaforma AI.",
    "pro.p2": "I lead arrivano già qualificati: render fotorealistici, computo dei costi e vincoli normativi della Lombardia già definiti.",
    "pro.l1": "Lead profilati e geolocalizzati",
    "pro.l2": "Tu scegli i progetti su cui rispondere",
    "pro.l3": "Iscrizione gratuita, nessun obbligo",
    "pro.f.t": "Iscriviti al network",
    "pro.f.name": "Nome e cognome",
    "pro.f.email": "Email professionale",
    "pro.f.phone": "Telefono",
    "pro.f.profession": "Professione",
    "pro.f.p.opt1": "Seleziona…",
    "pro.f.p.opt2": "Architetto",
    "pro.f.p.opt3": "Ingegnere",
    "pro.f.p.opt4": "Geometra",
    "pro.f.p.opt5": "Impresa edile",
    "pro.f.p.opt6": "Altro",
    "pro.f.piva": "Partita IVA",
    "pro.f.area": "Provincia / area di competenza",
    "pro.f.area.ph": "Es. Milano, Monza-Brianza, Como",
    "pro.f.spec": "Specializzazione",
    "pro.f.spec.ph": "Es. residenziale, ristrutturazioni storiche, efficienza energetica",
    "pro.f.cta": "Iscrivimi al network",
    "pro.f.ok": "✓ Iscrizione ricevuta. Ti contatteremo per la verifica.",

    "cta.title": "Pronto a vedere la tua casa trasformata?",
    "cta.sub": "Prova la demo gratuita: dall'annuncio al render fotorealistico in pochi minuti.",
    "cta.btn": "Prova la demo",

    "foot.tag": "Studio di Architettura Colombo — ristrutturazione assistita dall'intelligenza artificiale, conforme alle norme edilizie della Lombardia.",
    "foot.col1": "Prodotto", "foot.col2": "Risorse", "foot.col3": "Contatti",
    "foot.demo": "Demo", "foot.features": "Funzioni", "foot.pricing": "Preventivo",
    "foot.how": "Come funziona", "foot.solutions": "Soluzioni", "foot.compliance": "Conformità",
    "foot.professionals": "Professionisti", "foot.about": "Chi siamo", "foot.privacy": "Privacy",
    "foot.rights": "Tutti i diritti riservati.",
    "foot.disc": "Le verifiche di conformità, le stime di costo e i bonus fiscali hanno valore puramente indicativo e non sostituiscono il progetto di un tecnico abilitato. Le normative citate (DM 5/7/1975, DPR 380/2001, L.R. Lombardia 12/2005 e successive) vanno sempre verificate con un professionista.",
  },
  en: {
    "nav.features": "Features",
    "nav.how": "How it works",
    "nav.solutions": "Solutions",
    "nav.professionals": "Professionals",
    "nav.contact": "Contact",
    "nav.demo": "Try the demo",
    "brand.sub": "Colombo Architecture Studio",

    "top.phone": "+39 339 144 6039",
    "top.email": "info@iltuoarchitetto.it",

    "hero.eyebrow": "Smart renovation for Lombardy",
    "hero.title.a": "We bring your",
    "hero.title.accent": "idea to life",
    "hero.subhead": "for your home, your workplace, your project.",
    "hero.lead": "Il Tuo Architetto helps people create places to live and work, taking care of everything — from design to construction — saving time, controlling costs, and handling bureaucracy. With a human, concrete and creative approach.",
    "hero.cta1": "Try the AI demo",
    "hero.cta2": "See how it works",
    "hero.m1.n": "3", "hero.m1.l": "solutions for every budget",
    "hero.m2.n": "8", "hero.m2.l": "design styles",
    "hero.m3.n": "100%", "hero.m3.l": "code-compliant",

    "mock.title": "Il Tuo Architetto",
    "mock.sub": "3 solutions · renders · compliance",
    "mock.render": "Photorealistic render",
    "mock.c1": "Essential", "mock.c1p": "€38,000",
    "mock.c2": "Balanced", "mock.c2p": "€61,000",
    "mock.c3": "Premium", "mock.c3p": "€94,000",

    "strip.label": "Compliant with",

    "feat.eyebrow": "What you can do",
    "feat.title": "The whole project, in a single tool",
    "feat.sub": "From property analysis to the final render, every step is automated and verified.",
    "feat.1.t": "Listing extraction",
    "feat.1.d": "Paste an immobiliare.it link: address, area, energy class and price fill in automatically.",
    "feat.2.t": "Floor-plan analysis",
    "feat.2.d": "Claude Vision reads the plan, computes areas and locks spatial constraints into the render prompt.",
    "feat.3.t": "Photorealistic renders",
    "feat.3.d": "Realistic visuals in 8 styles: Japandi, Scandinavian, Mediterranean, Minimalist and more.",
    "feat.4.t": "Code compliance",
    "feat.4.d": "Automatic checks on ceiling heights, ventilation, accessibility, structure and Lombardy constraints.",
    "feat.5.t": "Cost estimation",
    "feat.5.d": "Construction and furniture bill of quantities with market prices updated to 2026.",
    "feat.6.t": "Energy efficiency",
    "feat.6.d": "Before-and-after comparison, annual savings in € and energy-class improvement.",
    "feat.7.t": "2026 tax bonuses",
    "feat.7.d": "36–50% deductions, year-by-year cashflow and a full picture of available incentives.",
    "feat.8.t": "Property ROI",
    "feat.8.d": "Value uplift, rental yield and estimated profit in case of resale.",
    "feat.9.t": "Styles & feng shui",
    "feat.9.d": "Custom palettes, moods and feng shui principles for a tailor-made result.",

    "how.eyebrow": "The process",
    "how.title": "Five steps, three solutions",
    "how.sub": "A guided path that turns property data into complete, build-ready projects.",
    "how.1.t": "Property", "how.1.d": "Enter the data or paste the listing link.",
    "how.2.t": "Floor plan", "how.2.d": "Upload the plan: areas are read automatically.",
    "how.3.t": "Interventions", "how.3.d": "Pick the works: kitchen, bathroom, finishes, systems.",
    "how.4.t": "Style", "how.4.d": "Set the style, mood and colour preferences.",
    "how.5.t": "Analysis", "how.5.d": "Get 3 solutions with renders, costs and compliance.",

    "sol.eyebrow": "Three proposals, one click",
    "sol.title": "Essential · Balanced · Premium",
    "sol.sub": "Every analysis generates three levels of intervention, so you can choose by budget.",
    "sol.tag": "Recommended",
    "sol.1.t": "Essential",
    "sol.1.d": "Maximum result on a contained budget.",
    "sol.1.l1": "Priority interventions",
    "sol.1.l2": "Quality essential finishes",
    "sol.1.l3": "Guaranteed compliance",
    "sol.2.t": "Balanced",
    "sol.2.d": "The best balance of cost and value.",
    "sol.2.l1": "Full renovation",
    "sol.2.l2": "Improved energy efficiency",
    "sol.2.l3": "Maximum bonus recovery",
    "sol.3.t": "Premium",
    "sol.3.d": "High-end materials and finishes.",
    "sol.3.l1": "Premium design and materials",
    "sol.3.l2": "Maximum value uplift",
    "sol.3.l3": "Top home automation & efficiency",

    "aud.eyebrow": "Who it's for",
    "aud.title": "Built for people who really renovate",
    "aud.1.t": "Homeowners",
    "aud.1.d": "Visualise your future home and know the real costs and bonuses before you start.",
    "aud.2.t": "Real-estate agencies",
    "aud.2.d": "Show every property's potential and speed up sales with convincing renders.",
    "aud.3.t": "Architects & builders",
    "aud.3.d": "Speed up quotes and proposals with a first compliant project in minutes.",

    "prev.eyebrow": "From renders to construction",
    "prev.title": "Get a quote from a professional",
    "prev.p1": "Found the perfect solution in the demo? We'll put you in touch with the architects, engineers and surveyors in our Lombardy network.",
    "prev.p2": "You'll receive personalised quotes based on the project you generated — renders, costs and code constraints included.",
    "prev.l1": "Verified, licensed professionals",
    "prev.l2": "Response within 48 hours",
    "prev.l3": "Free service for the homeowner",
    "prev.f.t": "Request a quote",
    "prev.f.name": "Full name",
    "prev.f.email": "Email",
    "prev.f.phone": "Phone",
    "prev.f.city": "City of the property",
    "prev.f.budget": "Indicative budget",
    "prev.f.b.opt1": "Select…",
    "prev.f.b.opt2": "Up to €30,000",
    "prev.f.b.opt3": "€30,000 – €60,000",
    "prev.f.b.opt4": "€60,000 – €100,000",
    "prev.f.b.opt5": "Over €100,000",
    "prev.f.msg": "Describe your project",
    "prev.f.msg.ph": "E.g. Full renovation of an 85 m² apartment in …, Essential project generated by the demo …",
    "prev.f.cta": "Send request",
    "prev.f.ok": "✓ Request received. We'll be in touch within 48 hours.",

    "pro.eyebrow": "Are you a professional?",
    "pro.title": "Architects, engineers and surveyors: join the network",
    "pro.p1": "Sign up for free to the Il Tuo Architetto network and receive quote requests from clients who generated a project with our AI platform.",
    "pro.p2": "Leads come pre-qualified: photorealistic renders, cost estimates and Lombardy compliance already defined.",
    "pro.l1": "Profiled, geo-located leads",
    "pro.l2": "You choose the projects to respond to",
    "pro.l3": "Free sign-up, no commitment",
    "pro.f.t": "Join the network",
    "pro.f.name": "Full name",
    "pro.f.email": "Professional email",
    "pro.f.phone": "Phone",
    "pro.f.profession": "Profession",
    "pro.f.p.opt1": "Select…",
    "pro.f.p.opt2": "Architect",
    "pro.f.p.opt3": "Engineer",
    "pro.f.p.opt4": "Surveyor",
    "pro.f.p.opt5": "Building company",
    "pro.f.p.opt6": "Other",
    "pro.f.piva": "VAT number (Partita IVA)",
    "pro.f.area": "Province / area of operation",
    "pro.f.area.ph": "E.g. Milano, Monza-Brianza, Como",
    "pro.f.spec": "Specialisation",
    "pro.f.spec.ph": "E.g. residential, heritage renovation, energy efficiency",
    "pro.f.cta": "Sign me up",
    "pro.f.ok": "✓ Sign-up received. We'll be in touch to verify.",

    "cta.title": "Ready to see your home transformed?",
    "cta.sub": "Try the free demo: from listing to photorealistic render in minutes.",
    "cta.btn": "Try the demo",

    "foot.tag": "Colombo Architecture Studio — AI-assisted renovation, compliant with Lombardy building codes.",
    "foot.col1": "Product", "foot.col2": "Resources", "foot.col3": "Contact",
    "foot.demo": "Demo", "foot.features": "Features", "foot.pricing": "Get a quote",
    "foot.how": "How it works", "foot.solutions": "Solutions", "foot.compliance": "Compliance",
    "foot.professionals": "Professionals", "foot.about": "About", "foot.privacy": "Privacy",
    "foot.rights": "All rights reserved.",
    "foot.disc": "Compliance checks, cost estimates and tax bonuses are indicative only and do not replace a project by a qualified professional. The regulations referenced (DM 5/7/1975, DPR 380/2001, L.R. Lombardia 12/2005 and subsequent) must always be verified with a professional.",
  }
};

function applyLang(lang) {
  const dict = I18N[lang] || I18N.it;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] != null) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-attr]").forEach(el => {
    const spec = el.getAttribute("data-i18n-attr"); // "placeholder:key" or "title:key"
    spec.split(",").forEach(pair => {
      const [attr, key] = pair.split(":").map(s => s.trim());
      if (dict[key] != null) el.setAttribute(attr, dict[key]);
    });
  });
  document.querySelectorAll(".lang-toggle button").forEach(b => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
  try { localStorage.setItem("ita_lang", lang); } catch (e) {}
}

document.addEventListener("DOMContentLoaded", () => {
  let lang = "it";
  try { lang = localStorage.getItem("ita_lang") || (navigator.language || "it").slice(0,2); } catch (e) {}
  if (!I18N[lang]) lang = "it";
  applyLang(lang);
  document.querySelectorAll(".lang-toggle button").forEach(b => {
    b.addEventListener("click", () => applyLang(b.dataset.lang));
  });

  // mobile nav
  const burger = document.querySelector(".nav-burger");
  const links = document.querySelector(".nav-links");
  if (burger && links) burger.addEventListener("click", () => links.classList.toggle("open"));
  document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => links && links.classList.remove("open")));

  // scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // Form submission handler — Netlify Forms via AJAX so we can show inline success
  document.querySelectorAll("form[data-ajax-netlify]").forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const okMsg = form.querySelector(".form-success");
      const data = new FormData(form);
      const body = new URLSearchParams();
      data.forEach((v, k) => body.append(k, v));
      const original = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "…"; }
      try {
        await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
        if (okMsg) okMsg.classList.remove("hidden");
        form.reset();
      } catch (err) {
        if (okMsg) { okMsg.classList.remove("hidden"); okMsg.textContent = (lang === "it" ? "⚠️ Errore di invio. Riprova più tardi." : "⚠️ Submission error. Please try again."); }
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = original; }
      }
    });
  });
});
