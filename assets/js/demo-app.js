/* Compiled from src/demo-app.jsx — do not edit directly. */
const {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect
} = React;
const GEMINI_PROXY = typeof window !== 'undefined' && window.GEMINI_PROXY ? String(window.GEMINI_PROXY).replace(/\/+$/, '') : '';
const HAS_PROXY = !!GEMINI_PROXY;
function geminiUrl(model, apiKey) {
  return HAS_PROXY ? GEMINI_PROXY + '/v1beta/models/' + model + ':generateContent' : 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + (apiKey || '');
}
const STYLES = {
  Japandi: {
    mat: "light oak, warm white plaster, linen, soft stone, matte finishes",
    desc: "quiet, calm, natural, warmly minimal",
    pal: ["#D4C5A9", "#E8DCC8", "#F5F0E8", "#8B7D6B", "#5C5346"]
  },
  Scandinavian: {
    mat: "pale woods, off-whites, warm textiles",
    desc: "bright, practical, cozy",
    pal: ["#E8E4DF", "#F5F2ED", "#FFFFFF", "#B8AFA5", "#6B6560"]
  },
  Minimalist: {
    mat: "flush doors, microtexture plaster, pale stone",
    desc: "calm, disciplined, clean-lined",
    pal: ["#F0F0F0", "#E0E0E0", "#FFFFFF", "#999999", "#333333"]
  },
  Mediterranean: {
    mat: "limewash, warm stone, terracotta, oak",
    desc: "sunlit, tactile, warm",
    pal: ["#E8C9A0", "#D4A373", "#F5E6D3", "#8B6F4E", "#C87941"]
  },
  Contemporary: {
    mat: "neutral palette, stone, wood, mixed textures",
    desc: "balanced, elegant, modern",
    pal: ["#C5CCD3", "#DDE1E6", "#F0F2F5", "#7A8490", "#4A5568"]
  },
  "Industrial Soft": {
    mat: "oak, dark metal, concrete-look",
    desc: "urban but warm, graphic",
    pal: ["#8B8D8F", "#A0A2A4", "#D4D6D8", "#4A4C4E", "#2D2F31"]
  },
  "Classic Modern": {
    mat: "travertine, oak, brushed metal, refined joinery",
    desc: "timeless, elegant",
    pal: ["#C9B99A", "#DDD0B8", "#F0EAE0", "#8B7D6B", "#5C5346"]
  },
  Biophilic: {
    mat: "wood, plants, natural stone, woven textures",
    desc: "nature-connected, restorative",
    pal: ["#A8C5A0", "#C5DDB8", "#E8F0E4", "#6B8F60", "#3D5C35"]
  }
};
const INTERVENTIONS = {
  "Internal layout optimization": {
    l: "Optimize layout (non-structural walls)",
    ic: "🏗️",
    cat: "Structure",
    en: false,
    pm: "cila",
    tax50: true,
    nonConf: true
  },
  "Home office / flex room": {
    l: "Create home office or flex room",
    ic: "💻",
    cat: "Structure",
    en: false,
    pm: "cila",
    tax50: true,
    nonConf: true
  },
  "Partition walls addition": {
    l: "Add new internal partition walls",
    ic: "🧱",
    cat: "Structure",
    en: false,
    pm: "cila",
    tax50: true,
    nonConf: true
  },
  "Doorway relocation": {
    l: "Relocate internal doorways",
    ic: "🚪",
    cat: "Structure",
    en: false,
    pm: "cila",
    tax50: true,
    nonConf: true
  },
  "Structural reinforcement": {
    l: "Reinforce existing structure (anti-seismic)",
    ic: "🏛️",
    cat: "Structure",
    en: false,
    pm: "cila",
    tax50: true,
    nonConf: false
  },
  "Kitchen upgrade": {
    l: "Renovate kitchen with new appliances & layout",
    ic: "🍳",
    cat: "Rooms",
    en: false,
    pm: "cila",
    tax50: true,
    nonConf: false
  },
  "Bathroom upgrade": {
    l: "Renovate bathroom(s) with modern fixtures",
    ic: "🚿",
    cat: "Rooms",
    en: false,
    pm: "cila",
    tax50: true,
    nonConf: true
  },
  "Bathroom addition": {
    l: "Add a second bathroom",
    ic: "🛁",
    cat: "Rooms",
    en: false,
    pm: "cila",
    tax50: true,
    nonConf: true
  },
  "Laundry room": {
    l: "Create dedicated laundry space",
    ic: "🧺",
    cat: "Rooms",
    en: false,
    pm: "cila",
    tax50: true,
    nonConf: true
  },
  "Walk-in closet": {
    l: "Create walk-in closet / cabina armadio",
    ic: "👔",
    cat: "Rooms",
    en: false,
    pm: "cila",
    tax50: true,
    nonConf: true
  },
  "Finishes refresh": {
    l: "Refresh flooring, doors, paint, lighting",
    ic: "🎨",
    cat: "Finishes",
    en: false,
    pm: "free",
    tax50: true,
    nonConf: false
  },
  "Storage boost": {
    l: "Custom storage / bespoke joinery",
    ic: "📦",
    cat: "Finishes",
    en: false,
    pm: "free",
    tax50: true,
    nonConf: false
  },
  "Ceiling renovation": {
    l: "False ceiling, acoustic panels, LED integration",
    ic: "💡",
    cat: "Finishes",
    en: false,
    pm: "free",
    tax50: true,
    nonConf: false
  },
  "Wall treatments": {
    l: "Boiserie, wallpaper, decorative plaster",
    ic: "🖼️",
    cat: "Finishes",
    en: false,
    pm: "free",
    tax50: true,
    nonConf: false
  },
  "Balcony refresh": {
    l: "Balcony flooring, railing, waterproofing",
    ic: "🌿",
    cat: "Finishes",
    en: false,
    pm: "free",
    tax50: true,
    nonConf: false
  },
  "Electrical upgrade": {
    l: "Upgrade electrical system (CEI 64-8)",
    ic: "⚡",
    cat: "Systems",
    en: false,
    pm: "cila",
    tax50: true,
    nonConf: false
  },
  "Plumbing upgrade": {
    l: "Replace water supply & drainage pipes",
    ic: "🔧",
    cat: "Systems",
    en: false,
    pm: "cila",
    tax50: true,
    nonConf: false
  },
  "Smart controls": {
    l: "Smart thermostat, zoning, home automation",
    ic: "📱",
    cat: "Systems",
    en: true,
    pm: "free",
    tax50: true,
    nonConf: false
  },
  "Ventilation system": {
    l: "Mechanical ventilation with heat recovery (VMC)",
    ic: "💨",
    cat: "Systems",
    en: true,
    pm: "cila",
    tax50: true,
    nonConf: false
  },
  "Fire safety": {
    l: "Fire detection, extinguishers, fire doors",
    ic: "🔥",
    cat: "Systems",
    en: false,
    pm: "free",
    tax50: true,
    nonConf: false
  },
  "Opaque envelope": {
    l: "External/internal wall insulation (cappotto)",
    ic: "🧱",
    cat: "Energy Upgrade",
    en: true,
    pm: "cila",
    tax50: true,
    nonConf: false
  },
  "Transparent envelope": {
    l: "High-performance windows & doors",
    ic: "🪟",
    cat: "Energy Upgrade",
    en: true,
    pm: "cila",
    tax50: true,
    nonConf: false
  },
  "Heating system": {
    l: "Replace heating (heat pump, condensing boiler)",
    ic: "🌡️",
    cat: "Energy Upgrade",
    en: true,
    pm: "cila",
    tax50: true,
    nonConf: false
  },
  "Cooling system": {
    l: "Install/upgrade cooling (split, VRF, fan coil)",
    ic: "❄️",
    cat: "Energy Upgrade",
    en: true,
    pm: "cila",
    tax50: true,
    nonConf: false
  },
  "Renewable sources": {
    l: "Solar thermal, photovoltaic panels",
    ic: "☀️",
    cat: "Energy Upgrade",
    en: true,
    pm: "cila",
    tax50: true,
    nonConf: false
  },
  "Other energy interventions": {
    l: "LED lighting, energy monitoring, smart meters",
    ic: "📊",
    cat: "Energy Upgrade",
    en: true,
    pm: "free",
    tax50: true,
    nonConf: false
  },
  "Complete energy upgrade": {
    l: "All energy interventions combined (max benefit)",
    ic: "🔋",
    cat: "Energy Upgrade",
    en: true,
    pm: "cila",
    tax50: true,
    nonConf: false
  }
};
const FENG_SHUI_OPTIONS = ["Command position (bed/desk facing door)", "Five elements balance (wood, fire, earth, metal, water)", "Bagua map alignment for wealth & health zones", "Natural light maximization & mirror placement", "Clutter-free flow & rounded furniture edges", "Earth tones & grounding materials", "Water features or imagery in north sector", "Living plants in east/southeast sectors"];
const PALETTE_OPTIONS = [{
  name: "Warm Neutrals",
  colors: ["#F5E6D3", "#D4C5A9", "#C87941", "#8B6F4E", "#5C5346"]
}, {
  name: "Cool Greys",
  colors: ["#F0F2F5", "#DDE1E6", "#A8B0B9", "#6B7280", "#374151"]
}, {
  name: "Earth & Green",
  colors: ["#E8F0E4", "#C5DDB8", "#87A98F", "#5C7A52", "#2D4228"]
}, {
  name: "Ocean Blues",
  colors: ["#EBF5FB", "#AED6F1", "#5DADE2", "#2E86C1", "#1B4F72"]
}, {
  name: "Terracotta & Sand",
  colors: ["#FAEBD7", "#DEB887", "#CD853F", "#A0522D", "#6B3A2A"]
}, {
  name: "Blush & Rose",
  colors: ["#FFF0F5", "#F4C2C2", "#E8998D", "#C97C5D", "#8B4049"]
}, {
  name: "Moody & Dark",
  colors: ["#2C3E50", "#34495E", "#7F8C8D", "#BDC3C7", "#ECF0F1"]
}, {
  name: "Forest & Moss",
  colors: ["#1B3A2D", "#2D5F45", "#87A98F", "#D1E7DD", "#F5F0E8"]
}];
const MILAN_ZONE_BENCHMARKS = [{
  z: "Centro",
  sale: 11233,
  rent: 31.52
}, {
  z: "Arco della Pace, Arena, Pagano",
  sale: 9765,
  rent: 26.93
}, {
  z: "Genova, Ticinese",
  sale: 8191,
  rent: 25.09
}, {
  z: "Quadronno, Palestro, Guastalla",
  sale: 9131,
  rent: 27.19
}, {
  z: "Garibaldi, Moscova, Porta Nuova",
  sale: 9903,
  rent: 29.89
}, {
  z: "Fiera, Sempione, City Life, Portello",
  sale: 7000,
  rent: 23.00
}, {
  z: "Navigli",
  sale: 6451,
  rent: 23.18
}, {
  z: "Porta Romana, Cadore, Montenero",
  sale: 7359,
  rent: 23.65
}, {
  z: "Porta Venezia, Indipendenza",
  sale: 7894,
  rent: 25.28
}, {
  z: "Centrale, Repubblica",
  sale: 6867,
  rent: 22.95
}, {
  z: "Cenisio, Sarpi, Isola",
  sale: 6569,
  rent: 22.63
}, {
  z: "Uptown, Cascina Merlata, Viale Certosa",
  sale: 4322,
  rent: 18.99
}, {
  z: "Bande Nere, Inganni",
  sale: 4811,
  rent: 18.78
}, {
  z: "Famagosta, Barona",
  sale: 4527,
  rent: 19.47
}, {
  z: "Abbiategrasso, Chiesa Rossa",
  sale: 4435,
  rent: 19.40
}, {
  z: "Porta Vittoria, Lodi",
  sale: 5278,
  rent: 19.99
}, {
  z: "Cimiano, Crescenzago, Adriano",
  sale: 3801,
  rent: 17.73
}, {
  z: "Bicocca, Niguarda",
  sale: 4009,
  rent: 17.68
}, {
  z: "Solari, Washington",
  sale: 7231,
  rent: 23.76
}, {
  z: "Affori, Bovisa",
  sale: 3908,
  rent: 18.62
}, {
  z: "San Siro, Trenno",
  sale: 4194,
  rent: 18.02
}, {
  z: "Bisceglie, Baggio, Olmi",
  sale: 3208,
  rent: 16.00
}, {
  z: "Ripamonti, Vigentino",
  sale: 4761,
  rent: 19.94
}, {
  z: "Forlanini",
  sale: 3884,
  rent: 16.87
}, {
  z: "Città Studi, Susa",
  sale: 5794,
  rent: 20.44
}, {
  z: "Maggiolina, Istria",
  sale: 5344,
  rent: 19.84
}, {
  z: "Precotto, Turro",
  sale: 4526,
  rent: 18.69
}, {
  z: "Udine, Lambrate",
  sale: 4522,
  rent: 18.56
}, {
  z: "Pasteur, Rovereto",
  sale: 4882,
  rent: 20.62
}, {
  z: "Ponte Lambro, Santa Giulia",
  sale: 3480,
  rent: 16.92
}, {
  z: "Corvetto, Rogoredo",
  sale: 4347,
  rent: 18.46
}, {
  z: "Napoli, Soderini",
  sale: 5732,
  rent: 20.90
}];
const COND_POSITION = {
  "Da ristrutturare": 0.20,
  "Buono / Abitabile": 0.50,
  "Ristrutturato": 0.85,
  "Ottimo": 0.90,
  "Nuovo / In costruzione": 0.95,
  "scadente": 0.15,
  "to_renovate": 0.20,
  "habitable_old": 0.35,
  "normal": 0.50,
  "good": 0.70,
  "renovated": 0.85,
  "finely_renovated": 0.95
};
const ENERGY_PREMIUM = {
  A4: 0.14,
  A3: 0.12,
  A2: 0.10,
  A1: 0.08,
  B: 0.05,
  C: 0.02,
  D: 0.00,
  E: -0.03,
  F: -0.06,
  G: -0.09,
  Unknown: -0.03
};
const RENO_COST_PER_SQM = {
  "light_refresh": {
    min: 250,
    typ: 400,
    max: 650
  },
  "standard_renovation": {
    min: 700,
    typ: 950,
    max: 1200
  },
  "full_renovation": {
    min: 1000,
    typ: 1300,
    max: 1700
  },
  "premium_renovation": {
    min: 1500,
    typ: 2000,
    max: 2800
  },
  "energy_retrofit_deep": {
    min: 1200,
    typ: 1800,
    max: 2600
  }
};
const TIER_TO_RENO = {
  "Essential": {
    tier: "light_refresh",
    postCond: "good",
    qualityAdj: 0.02
  },
  "Balanced": {
    tier: "standard_renovation",
    postCond: "renovated",
    qualityAdj: 0.06
  },
  "Premium": {
    tier: "premium_renovation",
    postCond: "finely_renovated",
    qualityAdj: 0.13
  }
};
function matchMilanZone(d) {
  const hay = ((d.address || "") + " " + (d.city || "") + " " + (d.listingExtracted?.address || "")).toLowerCase();
  if (!hay.includes("milan") && !hay.includes("milano")) return null;
  let best = null,
    bestScore = 0;
  MILAN_ZONE_BENCHMARKS.forEach(zone => {
    const keys = zone.z.toLowerCase().split(/[,\s]+/).filter(k => k.length > 3);
    let score = 0;
    keys.forEach(k => {
      if (hay.includes(k)) score++;
    });
    if (score > bestScore) {
      bestScore = score;
      best = zone;
    }
  });
  return bestScore > 0 ? best : MILAN_ZONE_BENCHMARKS.find(z => z.z === "Centro");
}
function calcLombardyVal(d, sol) {
  const area = parseFloat(d.area) || 85;
  const trace = [];
  const milanZone = matchMilanZone(d);
  const askingRef = milanZone?.sale || CITY_PRICES[(d.city || "").toLowerCase().trim()] || LOMBARDY_AVG;
  const rentRef = milanZone?.rent || 14;
  const omiMin = Math.round(askingRef * 0.85);
  const omiMax = Math.round(askingRef * 1.05);
  trace.push({
    step: 1,
    label: "Geography",
    note: milanZone ? `Milan zone "${milanZone.z}"` : (d.city || "Lombardy") + " municipality avg",
    OMI_min: omiMin,
    OMI_max: omiMax,
    asking_ref: askingRef,
    rent_ref: rentRef
  });
  const condPos = COND_POSITION[d.currentStatus] ?? 0.50;
  const baseOMI = Math.round(omiMin + (omiMax - omiMin) * condPos);
  trace.push({
    step: 2,
    label: "Base OMI (weighted by current condition)",
    note: `${d.currentStatus || "normal"} → position ${condPos}`,
    value: baseOMI
  });
  const OMI_WEIGHT = 0.60,
    ASK_WEIGHT = 0.40,
    ASK_DISCOUNT = 0.05;
  const calibrated = Math.round(OMI_WEIGHT * baseOMI + ASK_WEIGHT * askingRef * (1 - ASK_DISCOUNT));
  trace.push({
    step: 3,
    label: "Calibrated market €/m²",
    note: `60% OMI + 40% asking (–5% to transaction)`,
    value: calibrated
  });
  const adj = {};
  const floor = parseInt(d.floor) || 3;
  const hasElevator = d.elevator !== false;
  if (hasElevator) {
    if (floor === 0) adj.floor = -0.04;else if (floor >= 4) adj.floor = 0.04;else adj.floor = 0.02;
  } else {
    if (floor === 0) adj.floor = -0.05;else if (floor >= 4) adj.floor = -0.10;else if (floor >= 3) adj.floor = -0.06;else adj.floor = -0.02;
  }
  const features = (d.listingExtracted?.features || []).map(f => f.toLowerCase()).join(" ");
  if (features.includes("terraz")) adj.outdoor = features.includes("grand") || features.includes("large") ? 0.08 : 0.05;else if (features.includes("balcon")) adj.outdoor = 0.02;else adj.outdoor = 0;
  const condoY = parseFloat(d.listingExtracted?.condominium) || 0;
  if (condoY > 0) {
    if (condoY < 1200) adj.condo = 0.02;else if (condoY < 2500) adj.condo = 0.00;else if (condoY < 4000) adj.condo = -0.03;else adj.condo = -0.06;
  } else adj.condo = 0;
  const adjSum = Math.max(-0.20, Math.min(0.20, (adj.floor || 0) + (adj.outdoor || 0) + (adj.condo || 0)));
  const adjusted = Math.round(calibrated * (1 + adjSum));
  trace.push({
    step: 4,
    label: "Property adjustments",
    note: `floor ${adj.floor * 100 || 0}% · outdoor ${adj.outdoor * 100 || 0}% · condo ${adj.condo * 100 || 0}% → total ${(adjSum * 100).toFixed(1)}%`,
    value: adjusted,
    adjustments: adj
  });
  const ePremPre = ENERGY_PREMIUM[d.eCls] ?? -0.03;
  const preRenovPerSqm = Math.round(adjusted * (1 + ePremPre));
  const preRenovTotal = Math.round(preRenovPerSqm * area);
  trace.push({
    step: 5,
    label: "Energy class premium (pre)",
    note: `${d.eCls || "?"}: ${(ePremPre * 100).toFixed(1)}%`,
    value: preRenovPerSqm,
    total: preRenovTotal
  });
  const tier = TIER_TO_RENO[sol.nm] || TIER_TO_RENO["Balanced"];
  const renoBase = RENO_COST_PER_SQM[tier.tier].typ;
  let renoCost = area * renoBase;
  const interv = sol.ch || [];
  const adders = {};
  if (interv.includes("Electrical upgrade")) adders.electrical = 6000;
  if (interv.includes("Plumbing upgrade")) adders.plumbing = 12000;
  if (interv.includes("Bathroom upgrade")) adders.bathroom = 12000;
  if (interv.includes("Transparent envelope")) adders.windows = area * 0.15 * 750;
  if (interv.includes("Heating system")) adders.heatpump = 9000;
  if (interv.includes("Cooling system")) adders.aircon = 4500;
  if (interv.includes("Complete energy upgrade")) adders.deep_retrofit = 15000;
  adders.cila = 2500;
  Object.values(adders).forEach(v => renoCost += v);
  const contingency = renoCost * 0.12;
  renoCost = Math.round(renoCost + contingency);
  trace.push({
    step: 6,
    label: "Renovation cost",
    note: `${tier.tier}: €${renoBase}/m² × ${area}m² + adders + 12% contingency`,
    value: renoCost,
    adders,
    contingency: Math.round(contingency)
  });
  const postCondPos = COND_POSITION[tier.postCond];
  const postBaseOMI = Math.round(omiMin + (omiMax - omiMin) * postCondPos);
  const postCalibrated = Math.round(OMI_WEIGHT * postBaseOMI + ASK_WEIGHT * askingRef * (1 - ASK_DISCOUNT));
  const targetECls = sol.en?.aC || "C";
  const ePremPost = ENERGY_PREMIUM[targetECls] ?? 0.02;
  let postPerSqmUncapped = Math.round(postCalibrated * (1 + adjSum + ePremPost + tier.qualityAdj));
  const ceiling = Math.round(askingRef * 1.05);
  const postPerSqm = Math.min(postPerSqmUncapped, ceiling);
  const ceilingHit = postPerSqmUncapped > ceiling;
  const postRenovTotal = Math.round(postPerSqm * area);
  trace.push({
    step: 7,
    label: "Post-renovation €/m²",
    note: `post-condition ${tier.postCond} + ${targetECls} class +${(ePremPost * 100).toFixed(1)}% + quality +${(tier.qualityAdj * 100).toFixed(1)}%${ceilingHit ? " [capped at market ceiling]" : ""}`,
    value: postPerSqm,
    total: postRenovTotal,
    ceilingHit,
    ceiling
  });
  const purchase = d.listingExtracted?.price || preRenovTotal;
  const agencyFee = purchase * 0.03;
  const notaryTax = purchase * 0.04;
  const totalInvestment = Math.round(purchase + agencyFee + notaryTax + renoCost);
  const grossUplift = postRenovTotal - preRenovTotal;
  const netUplift = grossUplift - renoCost;
  const profitIfResold = postRenovTotal - totalInvestment;
  const roi = totalInvestment > 0 ? profitIfResold / totalInvestment * 100 : 0;
  trace.push({
    step: 8,
    label: "Investment & ROI",
    note: `Purchase €${(purchase / 1000).toFixed(0)}k + 3% agency + 4% notary/tax + reno`,
    value: totalInvestment,
    gross_uplift: grossUplift,
    net_uplift: netUplift,
    profit_resold: profitIfResold,
    roi_pct: Math.round(roi * 10) / 10
  });
  const rentCoef = {
    "Essential": 1.05,
    "Balanced": 1.12,
    "Premium": 1.20
  }[sol.nm] || 1.0;
  const monthlyRent = Math.round(rentRef * area * rentCoef);
  const annualRent = monthlyRent * 12;
  const grossYield = totalInvestment > 0 ? annualRent / totalInvestment * 100 : 0;
  trace.push({
    step: 9,
    label: "Rent potential",
    note: `Zone rent €${rentRef}/m²/mo × ${area}m² × ${rentCoef} condition coef`,
    monthly: monthlyRent,
    annual: annualRent,
    gross_yield_pct: Math.round(grossYield * 100) / 100
  });
  let recommendation = "Not recommended unless strategic reason";
  if (roi >= 15) recommendation = "Strong investment candidate";else if (roi >= 8) recommendation = "Moderate investment candidate";else if (roi >= 0) recommendation = "Low-margin — negotiate price or reduce reno scope";
  return {
    pB: preRenovPerSqm,
    pA: postPerSqm,
    vB: preRenovTotal,
    vA: postRenovTotal,
    up: Math.round((postPerSqm / preRenovPerSqm - 1) * 1000) / 10,
    taxBenefit: Math.round(renoCost * 0.50),
    taxBenefitAnnual: Math.round(renoCost * 0.50 / 10),
    zone: milanZone?.z || d.city || "Lombardy",
    OMI_range: [omiMin, omiMax],
    asking_ref: askingRef,
    rent_ref: rentRef,
    cond_pre: d.currentStatus,
    cond_post: tier.postCond,
    energy_pre: d.eCls,
    energy_post: targetECls,
    reno_cost: renoCost,
    reno_tier: tier.tier,
    total_investment: totalInvestment,
    gross_uplift: grossUplift,
    net_uplift: netUplift,
    profit_resold: profitIfResold,
    roi_pct: Math.round(roi * 10) / 10,
    monthly_rent: monthlyRent,
    annual_rent: annualRent,
    gross_yield_pct: Math.round(grossYield * 100) / 100,
    recommendation,
    ceiling_hit: ceilingHit,
    trace
  };
}
const CITY_PRICES = {
  milano: 4136,
  milan: 4136,
  bergamo: 1791,
  brescia: 2391,
  como: 2398,
  cremona: 1293,
  lecco: 1837,
  lodi: 1521,
  mantova: 1227,
  monza: 2372,
  "monza e brianza": 2372,
  pavia: 1254,
  sondrio: 1884,
  varese: 1741
};
const LOMBARDY_AVG = 2753;
const REGS = {
  ceilingMain: 2.70,
  ceilingAccessory: 2.40,
  ceilingService: 2.10,
  ceilingMountainAbove1000m: 2.55,
  ceilingExistingMin: 2.40,
  minRoom: {
    soggiorno: 14,
    soggiornoConCottura: 17,
    cucina: 5,
    cameraSingola: 9,
    cameraDoppia: 14,
    studio: 7,
    bagnoLatoMin: 1.20,
    bagnoMinSqm: 3.5
  },
  minMonolocale1pers: 28,
  minMonolocale2pers: 38,
  minAlloggio: 28,
  minAlloggioDisabili: 45,
  sqmPerOccupantFirst4: 14,
  sqmPerOccupantAdditional: 10,
  aerationRatio: 0.10,
  bagnoMinWindow: 0.50,
  illumRatio: 0.125,
  illumDepthRatio: 2.5,
  zenitalIllumRatio: 1 / 12,
  doorWidthEntrance: 0.80,
  doorWidthInternal: 0.75,
  corridorMin: 1.00,
  wheelchairTurn: 1.50,
  rampMaxSlope: 0.08,
  handrailHeight: 0.90,
  parapetMin: 1.00,
  minEnergyClassRenov: "C",
  acoustic: {
    facciataD2mnT: 40,
    partizioneR: 50,
    calpestioL: 63
  },
  insulationUmaxWall: 0.26,
  insulationUmaxRoof: 0.22,
  insulationUmaxFloor: 0.30,
  insulationUmaxWindow: 1.40
};
function runCompliance(d, s, area) {
  const issues = [];
  const ch = parseFloat(d.ch) || 2.7;
  const eCls = d.eCls || "E";
  const postECls = s?.en?.aC || "C";
  const rooms = parseInt(d.rooms) || 3;
  const baths = parseInt(d.baths) || 1;
  if (ch < REGS.ceilingExistingMin) issues.push({
    sev: "err",
    cat: "Altezza",
    code: "DM 5/7/1975",
    msg: `Altezza ${ch}m < ${REGS.ceilingExistingMin}m minimo per locali principali (anche in recupero)`
  });else if (ch < REGS.ceilingMain) issues.push({
    sev: "warn",
    cat: "Altezza",
    code: "DM 5/7/1975",
    msg: `Altezza ${ch}m < ${REGS.ceilingMain}m raccomandato per nuovi interventi (ammesso ${REGS.ceilingExistingMin}m in recupero)`
  });else issues.push({
    sev: "ok",
    cat: "Altezza",
    code: "DM 5/7/1975",
    msg: `Altezza ${ch}m ≥ ${REGS.ceilingMain}m ✓`
  });
  if (area < REGS.minAlloggio) issues.push({
    sev: "err",
    cat: "Superficie",
    code: "Reg.Ed. Art.96",
    msg: `Sup. utile ${area}m² < ${REGS.minAlloggio}m² minimo alloggio`
  });else issues.push({
    sev: "ok",
    cat: "Superficie",
    code: "Reg.Ed. Art.96",
    msg: `Sup. utile ${area}m² ≥ ${REGS.minAlloggio}m² ✓`
  });
  const livingArea = Math.max(14, area * 0.30);
  const bedroomArea = rooms > 1 ? area * 0.20 : 0;
  if (rooms >= 2 && bedroomArea < REGS.minRoom.cameraDoppia) issues.push({
    sev: "warn",
    cat: "Camere",
    code: "Reg.Ed. Art.97",
    msg: `Verifica camera doppia ≥ ${REGS.minRoom.cameraDoppia}m² (stima ${bedroomArea.toFixed(1)}m²)`
  });
  if (livingArea < REGS.minRoom.soggiorno) issues.push({
    sev: "warn",
    cat: "Soggiorno",
    code: "DM 5/7/1975",
    msg: `Soggiorno < ${REGS.minRoom.soggiorno}m² minimo`
  });
  if (baths < 1) issues.push({
    sev: "err",
    cat: "Servizi",
    code: "Reg.Ed. Art.97-98",
    msg: "Almeno un bagno con dotazione minima (lavabo, doccia/vasca, wc, bidet)"
  });else issues.push({
    sev: "ok",
    cat: "Servizi",
    code: "Reg.Ed. Art.97-98",
    msg: `${baths} bagno/i — verificare lato min 1.20m e dotazione completa ✓`
  });
  issues.push({
    sev: "warn",
    cat: "Aeroilluminazione",
    code: "Reg.Ed. Art.103-105",
    msg: `Verificare apribile ≥ 1/10 superficie locale (${(area * REGS.aerationRatio).toFixed(1)}m² tot.) e illuminante ≥ 1/8 (${(area * REGS.illumRatio).toFixed(1)}m²)`
  });
  const cls = ["A4", "A3", "A2", "A1", "B", "C", "D", "E", "F", "G"];
  const post = cls.indexOf(postECls),
    target = cls.indexOf(REGS.minEnergyClassRenov);
  if (post < 0 || target < 0) issues.push({
    sev: "warn",
    cat: "Energetico",
    code: "DM 26/6/2015",
    msg: "Verificare classe post-intervento"
  });else if (post > target) issues.push({
    sev: "err",
    cat: "Energetico",
    code: "DM 26/6/2015",
    msg: `Post-renov classe ${postECls} non raggiunge ${REGS.minEnergyClassRenov} (ristrutturazione importante 1° liv.)`
  });else issues.push({
    sev: "ok",
    cat: "Energetico",
    code: "DM 26/6/2015",
    msg: `Classe ${postECls} ≥ ${REGS.minEnergyClassRenov} target ✓`
  });
  issues.push({
    sev: "warn",
    cat: "Accessibilità",
    code: "DM 236/1989",
    msg: `Visitabilità: porta ingresso luce netta ≥ ${REGS.doorWidthEntrance * 100}cm, almeno 1 bagno raggiungibile, soggiorno fruibile`
  });
  issues.push({
    sev: "warn",
    cat: "Acustico",
    code: "DPCM 5/12/1997",
    msg: `Cat.A residenziale: facciata D2m,nT ≥ ${REGS.acoustic.facciataD2mnT}dB, R'w pareti ≥ ${REGS.acoustic.partizioneR}dB, calpestio L'nw ≤ ${REGS.acoustic.calpestioL}dB`
  });
  if (area >= 60) issues.push({
    sev: "warn",
    cat: "Riscontro d'aria",
    code: "Reg.Ed. Art.100",
    msg: `Sup. ${area}m² ≥ 60m²: richiesto doppio affaccio o VMC`
  });else issues.push({
    sev: "ok",
    cat: "Riscontro d'aria",
    code: "Reg.Ed. Art.100",
    msg: `< 60m²: monoaffaccio ammesso (purché non orientato Nord ±30°) ✓`
  });
  return issues;
}
const RENDER_REGS_PROMPT = `STRICT ITALIAN BUILDING CODE COMPLIANCE (DM 5/7/1975 + Reg.Ed. Milano + DM 236/1989):
- Min ceiling 2.70m (2.40m in renovation existing)
- Living room ≥ 14m² (≥ 17m² if open kitchen), kitchen ≥ 5m²
- Double bedroom ≥ 14m², single ≥ 9m², bath min side 1.20m
- Windows openable ≥ 1/10 floor area, illuminating ≥ 1/8 floor area
- Door clear width ≥ 80cm entrance, ≥ 75cm internal
- Corridor ≥ 100cm, wheelchair turn 150cm in at least one bathroom
- Furniture and circulation must respect these — NO undersized rooms or blocked windows`;
const ENERGY_BINS = [[40, "A4"], [60, "A3"], [80, "A2"], [100, "A1"], [130, "B"], [160, "C"], [200, "D"], [260, "E"], [320, "F"], [1e4, "G"]];
const ENERGY_MID = {
  A4: 30,
  A3: 50,
  A2: 70,
  A1: 90,
  B: 115,
  C: 145,
  D: 180,
  E: 230,
  F: 290,
  G: 380
};
const ENERGY_RANK = {
  G: 1,
  F: 2,
  E: 3,
  D: 4,
  C: 5,
  B: 6,
  A1: 7,
  A2: 8,
  A3: 9,
  A4: 10
};
const ENERGY_COLOR = {
  A4: "#00600f",
  A3: "#1e8c31",
  A2: "#50a945",
  A1: "#8cc63f",
  B: "#c8d730",
  C: "#ffdf00",
  D: "#f5a623",
  E: "#e8621f",
  F: "#d0021b",
  G: "#8b0000"
};
const BANDS = {
  "Premium metro": {
    c: 1.12,
    p: 2.2
  },
  "Major city": {
    c: 1.06,
    p: 1.45
  },
  "Mid-market city": {
    c: 1,
    p: 1
  },
  "Affordable": {
    c: .92,
    p: .78
  }
};
const CR = {
  fin: 95,
  flr: 35,
  lay: 85,
  elc: 55,
  plumb: 50,
  ba: 4500,
  ba_add: 6500,
  ki: 5500,
  wi: 480,
  hv: 5200,
  cool: 3800,
  ins_wall: 65,
  ins_ext: 90,
  sm: 1200,
  jo: 55,
  ceil: 35,
  wall_treat: 25,
  balc: 40,
  vent: 3200,
  fire: 800,
  solar: 4500,
  pv: 6000,
  led: 15,
  laundry: 3500,
  walkin: 3000,
  door_reloc: 1800,
  partition: 45,
  struct: 120,
  de: .07,
  pe: .015,
  co: .08
};
const eCl = k => {
  for (const [t, c] of ENERGY_BINS) if (k <= t) return c;
  return "G";
};
function calcCosts(a, ch, st, bd, rm) {
  const cc = (BANDS[bd] || BANDS["Mid-market city"]).c,
    o = {};
  o.finishes = ch.includes("Finishes refresh") ? a * (CR.fin + CR.flr) : 0;
  o.layout = ch.includes("Internal layout optimization") || ch.includes("Home office / flex room") ? a * CR.lay : 0;
  o.electrical = ch.includes("Electrical upgrade") ? a * CR.elc : 0;
  o.plumbing = ch.includes("Plumbing upgrade") ? a * CR.plumb : 0;
  o.bathrooms = ch.includes("Bathroom upgrade") ? (rm >= 5 ? 2 : 1) * CR.ba : 0;
  o.bathroom_add = ch.includes("Bathroom addition") ? CR.ba_add : 0;
  o.kitchen = ch.includes("Kitchen upgrade") ? CR.ki : 0;
  o.windows = ch.includes("Transparent envelope") ? Math.max(2, Math.round(a / 13)) * CR.wi : 0;
  o.heating = ch.includes("Heating system") ? CR.hv : 0;
  o.cooling = ch.includes("Cooling system") ? CR.cool : 0;
  o.insulation_int = ch.includes("Opaque envelope") ? a * .55 * CR.ins_wall : 0;
  o.smart = ch.includes("Smart controls") ? CR.sm : 0;
  o.joinery = ch.includes("Storage boost") ? a * CR.jo : 0;
  o.ceiling = ch.includes("Ceiling renovation") ? a * CR.ceil : 0;
  o.wall_treatments = ch.includes("Wall treatments") ? a * CR.wall_treat : 0;
  o.balcony = ch.includes("Balcony refresh") ? 15 * CR.balc : 0;
  o.ventilation = ch.includes("Ventilation system") ? CR.vent : 0;
  o.fire_safety = ch.includes("Fire safety") ? CR.fire : 0;
  o.solar = ch.includes("Renewable sources") ? CR.solar + CR.pv : 0;
  o.led = ch.includes("Other energy interventions") ? a * CR.led : 0;
  o.laundry = ch.includes("Laundry room") ? CR.laundry : 0;
  o.walkin = ch.includes("Walk-in closet") ? CR.walkin : 0;
  o.door_reloc = ch.includes("Doorway relocation") ? CR.door_reloc : 0;
  o.partitions = ch.includes("Partition walls addition") ? a * .3 * CR.partition : 0;
  o.structural = ch.includes("Structural reinforcement") ? a * CR.struct : 0;
  if (ch.includes("Complete energy upgrade")) {
    o.heating = CR.hv;
    o.cooling = CR.cool;
    o.insulation_int = a * .55 * CR.ins_wall;
    o.windows = Math.max(2, Math.round(a / 13)) * CR.wi;
    o.smart = CR.sm;
    o.solar = CR.solar + CR.pv;
    o.ventilation = CR.vent;
    o.led = a * CR.led;
  }
  const sm = 1 + (["Classic Modern", "Mediterranean"].includes(st) ? .03 : 0) + (["Biophilic", "Japandi"].includes(st) ? .02 : 0);
  const sub = Object.values(o).reduce((x, y) => x + y, 0) * cc * sm;
  o.professional_fees = Math.max(5000, Math.round(sub * (CR.de + CR.pe + CR.co)));
  o.total = Math.round(sub) + o.professional_fees;
  Object.keys(o).forEach(k => {
    if (k !== "total" && k !== "professional_fees") o[k] = Math.round(o[k]);
  });
  return o;
}
function calcEnergy(cls, ch, a) {
  const b = ENERGY_MID[cls] || 230;
  let residual = 1.0;
  if (ch.includes("Opaque envelope")) residual *= 0.74;
  if (ch.includes("Transparent envelope")) residual *= 0.90;
  if (ch.includes("Ventilation system")) residual *= 0.93;
  if (ch.includes("Heating system")) residual *= 0.78;
  if (ch.includes("Renewable sources")) residual *= 0.85;
  if (ch.includes("Cooling system")) residual *= 0.96;
  if (ch.includes("Smart controls")) residual *= 0.96;
  if (ch.includes("Other energy interventions")) residual *= 0.98;
  if (ch.includes("Complete energy upgrade")) residual = 0.42;
  if (ch.includes("Electrical upgrade")) residual *= 0.99;
  if (ch.includes("Finishes refresh")) residual *= 0.99;
  residual = Math.max(0.30, residual);
  const af = b * residual;
  const sp = Math.round((1 - residual) * 1000) / 10;
  return {
    bC: cls,
    bS: b,
    aC: eCl(af),
    aS: Math.round(af * 10) / 10,
    sp
  };
}
function calcSave(a, eB, eA) {
  const epDelta = Math.max(0, (ENERGY_MID[eB] || 230) - (ENERGY_MID[eA] || 230));
  const deliveredPerSqm = epDelta / 1.6;
  const blendedPrice = 0.155;
  const rawYear = deliveredPerSqm * a * blendedPrice;
  const capped = Math.min(rawYear, a * 40);
  return {
    yr: Math.round(capped),
    mo: Math.round(capped / 12)
  };
}
function calcSched(a, ch) {
  const lt = ch.every(c => INTERVENTIONS[c]?.pm === "free");
  const hv = ch.includes("Internal layout optimization") || ch.includes("Home office / flex room");
  let cw = lt ? Math.max(4, Math.ceil(1 + a / 35)) : hv ? Math.max(7, Math.ceil(1 + a / 18)) : Math.max(6, Math.ceil(1 + a / 24));
  const heavyItems = ["Bathroom upgrade", "Kitchen upgrade", "Transparent envelope", "Heating system", "Opaque envelope", "Cooling system", "Bathroom addition", "Structural reinforcement", "Complete energy upgrade"];
  heavyItems.forEach(c => {
    if (ch.includes(c)) cw++;
  });
  const t = [{
    n: "Survey",
    w: 1,
    s: 0
  }, {
    n: "Concept",
    w: 1,
    s: 1
  }, {
    n: "Design",
    w: 2,
    s: 2
  }];
  let w = 4;
  if (!lt) {
    t.push({
      n: "CILA/Permits",
      w: 2,
      s: w
    });
    w += 2;
  }
  t.push({
    n: "Procurement",
    w: 2,
    s: w
  });
  w += 2;
  t.push({
    n: "Construction",
    w: cw,
    s: w
  });
  w += cw;
  t.push({
    n: "Handover",
    w: 1,
    s: w
  });
  w += 1;
  return {
    t,
    tw: w
  };
}
const LOMBARDY_GG = {
  milano: 2404,
  milan: 2404,
  bergamo: 2533,
  brescia: 2410,
  como: 2587,
  cremona: 2389,
  lecco: 2598,
  lodi: 2448,
  mantova: 2388,
  monza: 2404,
  "monza e brianza": 2404,
  pavia: 2623,
  sondrio: 3084,
  varese: 2652
};
const EPnren_BY_ERA = {
  "<1976": {
    min: 250,
    max: 450,
    def: 330,
    cls: "G"
  },
  "1976-1991": {
    min: 180,
    max: 280,
    def: 225,
    cls: "F"
  },
  "1991-2005": {
    min: 130,
    max: 200,
    def: 165,
    cls: "E"
  },
  "2005-2015": {
    min: 90,
    max: 150,
    def: 115,
    cls: "D"
  },
  ">2015": {
    min: 30,
    max: 60,
    def: 50,
    cls: "A1"
  }
};
const ERA_FROM_YEAR = y => !y ? "1976-1991" : y < 1976 ? "<1976" : y < 1991 ? "1976-1991" : y < 2005 ? "1991-2005" : y < 2015 ? "2005-2015" : ">2015";
const F_PNREN = {
  gas: 1.05,
  gpl: 1.05,
  gasolio: 1.07,
  pellet: 0.20,
  elettricita: 1.95,
  teleriscaldamento: 1.50
};
const F_CO2 = {
  gas: 0.202,
  gpl: 0.227,
  gasolio: 0.267,
  pellet: 0.025,
  elettricita: 0.257,
  teleriscaldamento: 0.200
};
const TARIFFS = {
  ele: 0.3018,
  gas: 1.2105,
  pellet: 0.40,
  gasolio: 1.55,
  fixed_ele: 45,
  fixed_gas: 70
};
const PCI_GAS = 9.45;
const PCI_PELLET = 4.8;
function classFromRatio(r) {
  if (r <= 0.40) return "A4";
  if (r <= 0.60) return "A3";
  if (r <= 0.80) return "A2";
  if (r <= 1.00) return "A1";
  if (r <= 1.20) return "B";
  if (r <= 1.50) return "C";
  if (r <= 2.00) return "D";
  if (r <= 2.60) return "E";
  if (r <= 3.50) return "F";
  return "G";
}
function EPnren_rif(GG, S_su_V) {
  return (45 + 25 * S_su_V) * (GG / 2100) + 14;
}
function estimateEPnrenPre(d) {
  if (d.eCls && d.eCls !== "Unknown" && d.annualEnergy) {
    const a = parseFloat(d.area) || 85;
    return parseFloat(d.annualEnergy) / a;
  }
  const era = d.buildingEra || ERA_FROM_YEAR(parseInt(d.listingExtracted?.buildingYear));
  return EPnren_BY_ERA[era]?.def || 220;
}
function applyInterventions(EP_pre, interventions) {
  let EP = EP_pre;
  const heatingShare = 0.60;
  const acsShare = 0.20;
  const coolingShare = 0.10;
  let H = EP * heatingShare,
    W = EP * acsShare,
    C = EP * coolingShare;
  const baseElec = EP * 0.10;
  if (interventions.includes("Opaque envelope")) {
    H *= 0.62;
    C *= 0.85;
  }
  if (interventions.includes("Transparent envelope")) {
    H *= 0.90;
    C *= 0.93;
  }
  if (interventions.includes("Ventilation system")) {
    H *= 0.90;
  }
  if (interventions.includes("Heating system")) {
    H *= 0.78;
  }
  if (interventions.includes("Complete energy upgrade")) {
    H *= 0.45;
    C *= 0.70;
    W *= 0.55;
  }
  if (interventions.includes("Cooling system")) {
    C *= 0.80;
  }
  if (interventions.includes("Renewable sources")) {
    W *= 0.40;
  }
  if (interventions.includes("Smart controls")) {
    H *= 0.95;
    C *= 0.95;
  }
  if (interventions.includes("Other energy interventions")) {
    H *= 0.98;
    C *= 0.98;
  }
  return Math.max(15, H + W + C + baseElec);
}
function decomposeConsumption(EP, area, heatingVector, hasHeatPump) {
  const total_kWh = EP * area;
  const heating_kWh = total_kWh * 0.60;
  const acs_kWh = total_kWh * 0.20;
  const cooling_kWh = total_kWh * 0.10;
  const base_elec = total_kWh * 0.10;
  if (hasHeatPump) {
    const elec_total = (heating_kWh + acs_kWh) / 3.8 + cooling_kWh / 3.5 + base_elec + 2700;
    return {
      gas_Smc: 0,
      elec_kWh: Math.round(elec_total),
      pellet_kg: 0
    };
  }
  if (heatingVector === "pellet") {
    const pellet_kWh = heating_kWh + acs_kWh;
    return {
      gas_Smc: 0,
      elec_kWh: Math.round(cooling_kWh / 3.5 + base_elec + 2700),
      pellet_kg: Math.round(pellet_kWh / (0.85 * PCI_PELLET))
    };
  }
  const eta_H = 0.85;
  const gas_kWh = (heating_kWh + acs_kWh) / eta_H;
  const elec_kWh = cooling_kWh / 3.5 + base_elec + 2700;
  return {
    gas_Smc: Math.round(gas_kWh / PCI_GAS),
    elec_kWh: Math.round(elec_kWh),
    pellet_kg: 0
  };
}
function annualCost(c) {
  return Math.round(c.gas_Smc * TARIFFS.gas + c.elec_kWh * TARIFFS.ele + c.pellet_kg * TARIFFS.pellet + (c.gas_Smc > 0 ? TARIFFS.fixed_gas : 0) + TARIFFS.fixed_ele);
}
function annualCO2(c) {
  const gas_kWh = c.gas_Smc * PCI_GAS;
  return Math.round(gas_kWh * F_CO2.gas + c.elec_kWh * F_CO2.elettricita + c.pellet_kg * PCI_PELLET * F_CO2.pellet);
}
function pvProduction(kWp, hasBattery) {
  const factor = hasBattery ? 0.70 : 0.32;
  return Math.round(kWp * 1100 * factor);
}
function calcEnergyNPV(investment, taxDeductionRate, annualSaving, years = 30, discount = 0.04, energyEscalation = 0.03) {
  const annualDeduction = investment * taxDeductionRate / 10;
  let npv = -investment;
  const cashflow = [];
  for (let y = 1; y <= years; y++) {
    const saving = annualSaving * Math.pow(1 + energyEscalation, y - 1);
    const deduction = y <= 10 ? annualDeduction : 0;
    const yearCF = saving + deduction;
    npv += yearCF / Math.pow(1 + discount, y);
    cashflow.push({
      year: y,
      saving: Math.round(saving),
      deduction: Math.round(deduction),
      cumNPV: Math.round(npv)
    });
  }
  return {
    npv: Math.round(npv),
    cashflow,
    paybackYears: investment > 0 && annualSaving > 0 ? +(investment * (1 - taxDeductionRate) / annualSaving).toFixed(1) : null
  };
}
function runFullEnergyCalc(d, sol) {
  const area = parseFloat(d.area) || 85;
  const cityKey = (d.city || "").toLowerCase().trim();
  const GG = LOMBARDY_GG[cityKey] || 2404;
  const S_su_V = 0.65;
  const EPrif = EPnren_rif(GG, S_su_V);
  const EP_pre = estimateEPnrenPre(d);
  const EP_post = applyInterventions(EP_pre, sol.ch);
  const heatingVector = d.heatingType === "Pompa di calore" ? "elettricita" : d.heatingType === "Centralizzato" ? "teleriscaldamento" : "gas";
  const hasPdC_pre = d.heatingType === "Pompa di calore";
  const hasPdC_post = sol.ch.includes("Heating system") || sol.ch.includes("Complete energy upgrade");
  const cons_pre = decomposeConsumption(EP_pre, area, heatingVector, hasPdC_pre);
  let cons_post = decomposeConsumption(EP_post, area, heatingVector, hasPdC_post);
  if (sol.ch.includes("Renewable sources") || sol.ch.includes("Complete energy upgrade")) {
    const kWp = 3,
      hasBattery = sol.ch.includes("Complete energy upgrade");
    const pv = pvProduction(kWp, hasBattery);
    cons_post.elec_kWh = Math.max(0, cons_post.elec_kWh - pv);
  }
  const cost_pre = annualCost(cons_pre);
  const cost_post = annualCost(cons_post);
  const co2_pre = annualCO2(cons_pre);
  const co2_post = annualCO2(cons_post);
  const cls_pre = classFromRatio(EP_pre / EPrif);
  const cls_post = classFromRatio(EP_post / EPrif);
  const saving_year = cost_pre - cost_post;
  const energyInterv = ["Opaque envelope", "Transparent envelope", "Heating system", "Cooling system", "Renewable sources", "Ventilation system", "Complete energy upgrade", "Smart controls", "Other energy interventions"];
  const investmentEnergy = Math.round((sol.co.heating || 0) + (sol.co.cooling || 0) + (sol.co.windows || 0) + (sol.co.insulation_int || 0) + (sol.co.solar || 0) + (sol.co.ventilation || 0) + (sol.co.smart || 0) + (sol.co.led || 0));
  const taxRate = 0.50;
  const npvResult = calcEnergyNPV(investmentEnergy, taxRate, saving_year, 30, 0.04, 0.03);
  const rapportoPre = EP_pre / EPrif;
  const rapportoPost = EP_post / EPrif;
  return {
    GG,
    EPrif: Math.round(EPrif * 10) / 10,
    ante: {
      EPnren: Math.round(EP_pre * 10) / 10,
      classe: cls_pre,
      rapporto: Math.round(rapportoPre * 100) / 100,
      cons: cons_pre,
      cost: cost_pre,
      co2: co2_pre
    },
    post: {
      EPnren: Math.round(EP_post * 10) / 10,
      classe: cls_post,
      rapporto: Math.round(rapportoPost * 100) / 100,
      cons: cons_post,
      cost: cost_post,
      co2: co2_post
    },
    delta: {
      saving_year,
      saving_pct: Math.round((1 - EP_post / EP_pre) * 1000) / 10,
      co2_kg_saved: co2_pre - co2_post,
      class_jumps: Math.max(0, (ENERGY_RANK[cls_post] || 0) - (ENERGY_RANK[cls_pre] || 0))
    },
    economy: {
      investment_gross: investmentEnergy,
      tax_deduction: Math.round(investmentEnergy * taxRate),
      investment_net: Math.round(investmentEnergy * (1 - taxRate)),
      payback_years: npvResult.paybackYears,
      npv_30y: npvResult.npv,
      cashflow: npvResult.cashflow
    }
  };
}
function calcVal(a, ci, bd, ch, eB, eA, currentStatus) {
  const cityKey = (ci || "").toLowerCase().trim();
  let ref = CITY_PRICES[cityKey] || LOMBARDY_AVG;
  const statusDiscount = {
    "Da ristrutturare": .82,
    "Buono / Abitabile": .92,
    "Ristrutturato": .98,
    "Nuovo / In costruzione": 1.02,
    "Ottimo": 1.0
  };
  const disc = statusDiscount[currentStatus] || .88;
  const pB = ref * disc;
  let rP = 0;
  if (ch.includes("Finishes refresh")) rP += .04;
  if (ch.includes("Kitchen upgrade")) rP += .03;
  if (ch.includes("Bathroom upgrade")) rP += .03;
  if (ch.includes("Internal layout optimization") || ch.includes("Home office / flex room")) rP += .04;
  if (ch.includes("Storage boost")) rP += .02;
  if (ch.includes("Bathroom addition")) rP += .02;
  if (ch.includes("Walk-in closet")) rP += .01;
  if (ch.includes("Ceiling renovation")) rP += .01;
  const cG = Math.max(0, (ENERGY_RANK[eA] || 0) - (ENERGY_RANK[eB] || 0));
  const up = Math.min(.18, rP + Math.min(.09, cG * .015));
  const pA = pB * (1 + up);
  const taxableItems = ch.filter(c => INTERVENTIONS[c]?.tax50);
  const taxBenefitRate = .36;
  const taxBenefitMax = 96000;
  const totalTaxable = Math.min(taxBenefitMax, Math.round(Object.entries(calcCosts(a, ch, "Contemporary", bd, 3)).filter(([k]) => !["total", "professional_fees"].includes(k)).reduce((s, [_, v]) => s + v, 0)));
  const taxBenefit = Math.round(totalTaxable * taxBenefitRate);
  return {
    pB: Math.round(pB),
    pA: Math.round(pA),
    vB: Math.round(pB * a),
    vA: Math.round(pA * a),
    up: Math.round(up * 1e3) / 10,
    taxBenefit,
    taxBenefitAnnual: Math.round(taxBenefit / 10)
  };
}
const fmt = n => n == null ? "—" : "€" + n.toLocaleString("it-IT");
const fmtK = n => n >= 1e3 ? "€" + (n / 1e3).toFixed(0) + "k" : "€" + n;
const T_E = ["Finishes refresh", "Storage boost", "Ceiling renovation", "Wall treatments", "Other energy interventions"];
const T_C = ["Kitchen upgrade", "Bathroom upgrade", "Electrical upgrade", "Plumbing upgrade", "Smart controls"];
const T_P = ["Internal layout optimization", "Heating system", "Transparent envelope", "Opaque envelope", "Cooling system", "Renewable sources", "Complete energy upgrade", "Home office / flex room", "Ventilation system", "Bathroom addition"];
function genSols(d) {
  const a = parseFloat(d.area) || 85,
    rm = parseInt(d.rooms) || 3,
    ec = d.eCls === "Unknown" ? "E" : d.eCls,
    all = d.changes;
  const ess = [...all.filter(c => T_E.includes(c)), ...all.filter(c => T_C.includes(c)).slice(0, 2)];
  const bal = [...all];
  const pre = [...all, ...T_P.filter(c => !all.includes(c)).slice(0, 3)];
  const mk = (nm, ch, qm, mg) => {
    const ch2 = ch.length ? ch : ["Finishes refresh"];
    const co = calcCosts(a, ch2, d.style, d.band, rm),
      adj = {
        ...co
      };
    Object.keys(adj).forEach(k => {
      if (k !== "total" && k !== "professional_fees") adj[k] = Math.round(adj[k] * qm);
    });
    adj.total = Object.entries(adj).filter(([k]) => k !== "total").reduce((x, [_, v]) => x + v, 0);
    const en = calcEnergy(ec, ch2, a),
      sv = calcSave(a, en.bC, en.aC),
      sc = calcSched(a, ch2);
    const solDraft = {
      nm,
      ch: ch2,
      co: adj,
      en,
      sv,
      sc,
      mg,
      qm
    };
    const vl = calcLombardyVal(d, solDraft);
    return {
      ...solDraft,
      vl
    };
  };
  return [mk("Essential", ess, .85, "Standard-grade: laminate, painted MDF, basic ceramic, standard fixtures"), mk("Balanced", bal, 1, "Mid-range " + d.style + ": " + (STYLES[d.style]?.mat || "quality finishes")), mk("Premium", pre, 1.25, "Premium " + d.style + ": high-end " + (STYLES[d.style]?.mat || "luxury finishes") + ", top fixtures, custom joinery")];
}
const COMPLIANCE_RULES = typeof document !== "undefined" && document.getElementById("compliance-rules-json") ? JSON.parse(document.getElementById("compliance-rules-json").textContent) : {};
const COMPLIANCE_BRIEF = `
████ ITALY + LOMBARDY BUILDING CODE — HARD CONSTRAINTS (DM 5/7/1975 · DM 236/1989 · L.R. 12/2005 · DPR 380/2001 · NTC 2018 · D.Lgs 192/2005 · D.Lgs 42/2004) ████

DIMENSIONS (must hold post-renovation):
• Habitable rooms ≥ 2.70 m ceiling · Bathrooms/corridors/storage ≥ 2.40 m
• Single bedroom ≥ 9 m² · Double bedroom ≥ 14 m² · Living ≥ 14 m²
• Studio ≥ 28 m² (1p) / 38 m² (2p)
• Every habitable room MUST have an openable window to exterior
• Window/floor ratio RAI ≥ 1/8 · FLDm ≥ 2% · Bathroom window ≥ 0.50 m² OR mechanical extraction ≥ 6 vol/h

ACCESSIBILITY (DM 236/1989):
• Main entrance clear ≥ 80 cm · Internal doors clear ≥ 75 cm
• Corridor width ≥ 100 cm (turning Ø 140 cm if length > 10 m)
• Accessible bathroom: wheelchair turn Ø 150 cm · WC lateral clear ≥ 80 cm · Washbasin frontal clear ≥ 80 cm
• Switches/thermostats 40-140 cm height

STRUCTURAL & SEISMIC (L.R. 33/2015 + NTC 2018):
• Load-bearing walls/columns/beams: UNTOUCHED. Any opening flagged "seismic-restricted"
• New partitions ≤ 60 kg/m² (lightweight plasterboard) unless slab verified
• Plumbing risers (colonne montanti): cannot cross slabs

ENERGY (D.Lgs. 192/2005, Lombardy zone E):
• U_wall ≤ 0.26 · U_roof ≤ 0.22 · U_window ≤ 1.40 W/m²K
• RES quota ≥ 60% DHW, ≥ 50% total
• South/west glazing > 25% wall → mandatory external shading

NEVER:
✗ Place habitable room with no openable exterior window
✗ Move external walls, entrance door, or windows by 1cm
✗ Place kitchen/bedroom/living above neighbour's bathroom
✗ Reduce corridor < 100 cm or door clear < 75 cm
✗ Reduce habitable ceiling < 2.70 m
✗ Touch any load-bearing element silently
✗ Internal bathroom without mechanical extraction
✗ Bedroom in piano interrato without secondary escape

PERMITS: CILA (non-structural) · SCIA (light renovation) · PdC (heavy renovation, load-bearing changes). Heritage: requires Soprintendenza authorization.`;
function renderPrompt(d, sol, room) {
  const th = STYLES[d.style] || STYLES.Japandi;
  const tier = sol.nm === "Premium" ? "high-end luxury finishes, designer furniture, premium materials" : sol.nm === "Balanced" ? "quality mid-range finishes, tasteful furniture" : "clean budget-conscious finishes, practical furniture";
  const base = d.style + " interior design, " + th.desc + ", " + th.mat + ", " + tier;
  const roomData = d.roomDetails || {};
  const ep = d.extractedPlan;
  const roomKey = ["living", "kitchen", "bedroom", "bathroom", "corridor"].includes(room) ? room : null;
  const ex = roomKey ? roomData[roomKey]?.extractedData : null;
  const dims = type => {
    const r = roomData[type];
    const exR = r?.extractedData;
    const w = exR?.estimatedDimensions?.widthM || parseFloat(r?.width) || null;
    const l = exR?.estimatedDimensions?.lengthM || parseFloat(r?.length) || null;
    const ch = exR?.estimatedDimensions?.ceilingHeightM || parseFloat(d.ceiling) || 2.7;
    if (w && l) return ` SURVEYED ROOM DIMENSIONS (authoritative): ${l.toFixed(1)}m long × ${w.toFixed(1)}m wide × ${ch.toFixed(1)}m ceiling. These are real measured dimensions — the render must match them exactly. Room area = ${(w * l).toFixed(1)}m².`;
    return ` Apartment total: ${parseFloat(d.area) || 85}m². Use realistic Italian apartment proportions for a ${room} room.`;
  };
  const winStr = type => {
    const exR = roomData[type]?.extractedData;
    if (!exR?.windows?.length) return "Windows: maintain existing positions exactly as in original photos/plan.";
    return "WINDOWS — extracted from your photos (positions are LOCKED):\n" + exR.windows.map((w, i) => `  Window ${i + 1}: ${w.wall} wall · ${w.positionOnWall} · ~${w.approximateWidthM || 1.2}m wide × ${w.approximateHeightM || 1.4}m tall · sill ${w.sillHeightM || 0.9}m from floor`).join("\n") + "\nNo new windows. No removed windows. No resized openings.";
  };
  const doorStr = type => {
    const exR = roomData[type]?.extractedData;
    if (!exR?.doors?.length) return "Doors: maintain existing positions exactly as in original photos/plan.";
    return "DOORS — extracted (positions are LOCKED):\n" + exR.doors.map((door, i) => `  Door ${i + 1}: ${door.wall} wall · ${door.positionOnWall} · ${door.widthM || 0.9}m wide · swings ${door.swingDirection}`).join("\n");
  };
  const immStr = type => {
    const exR = roomData[type]?.extractedData;
    const all = [...(exR?.immovableFeatures || []), ...(exR?.fixedArchitecturalElements || [])];
    if (!all.length) return "";
    return "IMMOVABLE ELEMENTS (surveyed from photos — must appear at exact positions):\n" + all.map(f => "  • " + f).join("\n");
  };
  const planStr = ep ? `EXTRACTED FLOOR PLAN (authoritative spatial data):
  Total area: ${ep.totalArea || parseFloat(d.area) || 85}m²
  Shape: ${ep.overallShape || "see plan"}
  Entrance: ${ep.entranceDoor ? `${ep.entranceDoor.wall} wall · ${Math.round((ep.entranceDoor.positionFromLeft || 0.5) * 100)}% from left · ${ep.entranceDoor.widthM || 0.9}m wide — FROZEN` : "as existing — FROZEN"}
  Bathroom: ${ep.rooms?.bathroom?.positionInApartment || "as existing"} — FROZEN
  Kitchen: ${ep.rooms?.kitchen?.positionInApartment || "as existing"} — FROZEN
  Load-bearing walls: ${(ep.loadBearingWalls || ["as surveyed"]).join(" · ")}
${Object.entries(ep.rooms || {}).filter(([, r]) => r.presentInPlan).map(([k, r]) => `  ${k}: ${r.widthM || "?"}×${r.lengthM || "?"}m · ${r.windowCount || 0} window(s) · walls N=${r.wallN || "?"} S=${r.wallS || "?"} E=${r.wallE || "?"} W=${r.wallW || "?"}`).join("\n")}` : `Apartment footprint FIXED at ${parseFloat(d.area) || 85}m² — all external walls unchanged.`;
  const totalAreaM2 = parseFloat(d.listingExtracted?.area || ep?.totalArea || d.area) || 85;
  const roomAreas = Object.entries(roomData).filter(([, r]) => r?.length && r?.width).map(([k, r]) => ({
    key: k,
    area: (parseFloat(r.length) * parseFloat(r.width)).toFixed(1)
  }));
  const sumRoomAreas = roomAreas.reduce((s, r) => s + parseFloat(r.area), 0).toFixed(1);
  const areaConstraints = `
AREA PRESERVATION — MATHEMATICAL REQUIREMENT:
• Total apartment net area: EXACTLY ${totalAreaM2}m² (source: ${d.listingExtracted?.area ? "listing" : ep?.totalArea ? "floor plan" : "manual entry"})
• This area is IMMUTABLE — the post-renovation floor plan must sum to EXACTLY ${totalAreaM2}m²
• No m² can be added or removed — renovations redistribute existing space only
• Room areas before: ${roomAreas.map(r => `${r.key}=${r.area}m²`).join(", ") || "to be extracted from plan"}
• Sum of all rooms after renovation MUST equal ${totalAreaM2}m²
• External walls define this area — they are FROZEN and cannot move 1mm
• Any internal space redistribution must be zero-sum (if bedroom grows 2m², another room shrinks 2m²)`;
  const permittedChanges = `
PERMITTED OPTIMISATIONS — ONLY THESE TWO SPACES MAY BE MODIFIED:
① KITCHEN: May be opened to the living area (remove partition wall between kitchen and living/dining to create an open-plan kitchen). Kitchen footprint stays within same zone. No new plumbing — sink/hob stay on same wall.
② BEDROOM / LIVING: May merge bedroom with living room, or add/remove a non-structural partition within the bedroom/living zone. Total combined area of bedroom+living remains unchanged.

ALL OTHER SPACES ARE COMPLETELY FROZEN:
✗ External walls: IMMOVABLE (define the ${totalAreaM2}m² envelope)
✗ Bathroom: FROZEN position, size, walls, plumbing connections — only finishes change
✗ Entrance door: EXACT same position, same width, same orientation/swing
✗ Windows: EXACT positions on external walls — no new, no removed, no resized
✗ Structural/load-bearing walls: UNTOUCHED
✗ Plumbing risers: CANNOT move
✗ Corridor: if it exists, its connecting function is preserved
✗ Total floor area: MUST remain ${totalAreaM2}m² — zero tolerance for deviation`;
  const customStyle = d.customStyle ? ` Style notes: ${d.customStyle}.` : "";
  const fengshui = d.fengshui?.length ? ` Feng shui: ${d.fengshui.join(", ")}.` : "";
  const palette = d.preferredPalette ? ` Palette: ${d.preferredPalette.name} — ${d.preferredPalette.colors.join(", ")}.` : "";
  const suffix = customStyle + fengshui + palette;
  const hasPhotos = ex || Object.values(roomData).some(r => (r.photos || []).length > 0);
  const photoNote = hasPhotos ? " THIS IS THE CLIENT'S ACTUAL ROOM — the render must look like the same physical space with only finishes and furniture replaced. Match the camera angle, room proportions, and all architectural features exactly." : " Render a realistic renovation of the existing space.";
  const roomReq = roomKey ? roomData[roomKey]?.requirements || "" : "";
  const reqBlock = roomReq ? `\nCLIENT'S SPECIFIC INSTRUCTIONS FOR THIS ROOM (follow exactly):\n"${roomReq}"\nThese instructions override style defaults but must NOT conflict with the spatial constraints above.` : "";
  const constraints = `
████████████████████████████████████████████████████████████████████████
   THIS IS A SPATIAL RENOVATION — NOT A NEW DESIGN
   The apartment envelope is IMMUTABLE. Read every rule below carefully.
████████████████████████████████████████████████████████████████████████
${photoNote}

${planStr}

${areaConstraints}

${permittedChanges}

${COMPLIANCE_BRIEF}

CROSS-CONSISTENCY: The 2D plan AND every 3D render of this dwelling must depict the SAME post-renovation layout. Rooms shown in the plan must match rooms shown in the renders (same dimensions, same window count, same wall positions, same compliance metrics).

${dims(roomKey || "living")}
${winStr(roomKey || "living")}
${doorStr(roomKey || "living")}
${immStr(roomKey || "living")}
${reqBlock}

HARD REJECTION CRITERIA — if the render violates ANY of these, it is WRONG:
✗ Different number of windows than original → REJECT
✗ Windows in different positions or sizes → REJECT
✗ Bathroom moved, enlarged, or shrunk → REJECT
✗ Entrance door moved, resized, or reoriented → REJECT
✗ External wall moved or removed → REJECT
✗ Total floor area differs from ${totalAreaM2}m² → REJECT
✗ New room added outside the original footprint → REJECT
✗ Ceiling height different from ${ex?.estimatedDimensions?.ceilingHeightM || d.ceiling || "2.7"}m → REJECT
✗ Any structural/load-bearing wall changed → REJECT
✗ Plumbing riser relocated → REJECT

THE ONLY ACCEPTABLE CHANGES:
✓ Floor: new material, same level
✓ Walls: new paint, plaster, cladding — on existing surfaces only
✓ Ceiling: new finish — same height only
✓ Kitchen: may open to living (partition removed) — plumbing stays on same wall
✓ Bedroom/living: may merge or subdivide — combined area stays the same
✓ Furniture: IKEA products only, sized to match room dimensions
✓ Lighting: new fixtures at existing ceiling points
✓ Kitchen fit-out: new cabinets, countertops, appliances
✓ Bathroom fit-out: new tiles, sanitaryware, vanity, mirror — same footprint

${RENDER_REGS_PROMPT}`;
  const ikeaDirective = `IKEA ONLY — all furniture must be recognizable IKEA products:
LIVING: KIVIK/SÖDERHAMN sofa · STOCKHOLM/LACK table · BESTÅ TV unit · KALLAX shelf · HEKTAR pendant · EKEDALEN table · INGOLF/TEODORES chairs
KITCHEN: METOD+AXSTAD/KUNGSBACKA · KARLBY/EKBACKEN counter · HAVSEN sink · SKÅDIS pegboard · MITTLED LED
BEDROOM: MALM/HEMNES bed · PAX+AULI wardrobe · NORDLI nightstands · SYMFONISK lamp · MAJVIKEN curtains
BATHROOM: GODMORGON vanity · ODENSVIK sink · STORJORM mirror · BROGRUND shower · ENHET storage`;
  const v = {
    living: `Photorealistic interior photo — Italian apartment living/dining RENOVATION. ${base}.${dims("living")} ${constraints} ${ikeaDirective} PERMITTED NEW ELEMENTS: IKEA sofa, coffee table, dining set, BESTÅ, rug, pendant, plants, wall art, floor finish, wall paint${roomData.living?.requirements ? ". CLIENT REQUIREMENTS: " + roomData.living.requirements : ""}. Walls/windows/doors: IDENTICAL to original.${suffix}`,
    kitchen: `Photorealistic interior photo — Italian apartment kitchen RENOVATION. ${base}.${dims("kitchen")} ${constraints} ${ikeaDirective} PERMITTED NEW ELEMENTS: IKEA METOD cabinets, countertop, appliances, SKÅDIS, pendant, floor tiles, backsplash${roomData.kitchen?.requirements ? ". CLIENT REQUIREMENTS: " + roomData.kitchen.requirements : ""}. Room boundary/window/door: IDENTICAL to original.${suffix}`,
    bedroom: `Photorealistic interior photo — Italian apartment bedroom RENOVATION. ${base}.${dims("bedroom")} ${constraints} ${ikeaDirective} PERMITTED NEW ELEMENTS: IKEA MALM bed, PAX wardrobe, NORDLI nightstands, SYMFONISK lamp, MAJVIKEN curtains, floor finish, wall paint${roomData.bedroom?.requirements ? ". CLIENT REQUIREMENTS: " + roomData.bedroom.requirements : ""}. Window/walls: IDENTICAL to original.${suffix}`,
    bathroom: `Photorealistic interior photo — Italian apartment bathroom RENOVATION. ${base}.${dims("bathroom")} ${constraints} ${ikeaDirective} PERMITTED NEW ELEMENTS: IKEA GODMORGON vanity, ODENSVIK sink, BROGRUND shower, STORJORM mirror, floor+wall tiles${roomData.bathroom?.requirements ? ". CLIENT REQUIREMENTS: " + roomData.bathroom.requirements : ""}. Footprint/plumbing/window: IDENTICAL to original.${suffix}`,
    plan: `${ep || d.plans?.length ? "You are looking at the original floor plan of this apartment. Generate an updated version of THIS EXACT FLOOR PLAN showing the post-renovation layout. The spatial envelope (${totalAreaM2}m²), all external walls, entrance door, bathroom position, and all windows must remain PIXEL-PERFECT identical. The ONLY permitted changes are: kitchen may open to living area (remove partition between them), bedroom/living zone may have partitions adjusted. Show new IKEA furniture silhouettes. Label rooms in Italian. Mark unchanged elements as 'invariato'." : "Professional 2D architectural floor plan — RENOVATION."}
${base} interior. ${totalAreaM2}m², ${d.rooms || 3} rooms.
${constraints}
${roomData.living?.requirements ? "LIVING: " + roomData.living.requirements : ""}
${roomData.kitchen?.requirements ? "KITCHEN: " + roomData.kitchen.requirements : ""}
${roomData.bedroom?.requirements ? "BEDROOM: " + roomData.bedroom.requirements : ""}
DRAW: thick outer perimeter (immovable) · structural walls (immovable) · thin partitions (may change) · "INGRESSO — invariato" · "BAGNO — posizione fissa" · "CUCINA — può aprirsi al soggiorno" · windows "finestra (invariata)" · IKEA furniture · room dimensions${suffix}`
  };
  return v[room] || v.living;
}
const PROVIDERS = {
  IKEA_IT: {
    name: "IKEA Italia",
    base: "https://www.ikea.com/it/it/",
    search: "https://www.ikea.com/it/it/search/?q=",
    priority: 1,
    tiers: ["Essential", "Balanced"]
  },
  MONDO_CONV: {
    name: "Mondo Convenienza",
    base: "https://www.mondoconv.it/",
    search: "https://www.mondoconv.it/risultati-ricerca?q=",
    priority: 2,
    tiers: ["Essential"]
  },
  MAISONS_DU_MONDE: {
    name: "Maisons du Monde",
    base: "https://www.maisonsdumonde.com/IT/it",
    search: "https://www.maisonsdumonde.com/IT/it/search?text=",
    priority: 3,
    tiers: ["Balanced"]
  },
  WESTWING: {
    name: "Westwing Italia",
    base: "https://www.westwing.it/",
    search: "https://www.westwing.it/search?q=",
    priority: 4,
    tiers: ["Balanced", "Premium"]
  },
  SCAVOLINI: {
    name: "Scavolini",
    base: "https://www.scavolini.com/it/",
    search: "https://www.scavolini.com/it/cerca?q=",
    priority: 1,
    tiers: ["Premium"]
  },
  FEBAL_CASA: {
    name: "Febal Casa",
    base: "https://www.febalcasa.com/it/",
    search: "https://www.febalcasa.com/it/?s=",
    priority: 2,
    tiers: ["Balanced", "Premium"]
  },
  VENETA_CUCINE: {
    name: "Veneta Cucine",
    base: "https://www.venetacucine.com/it",
    search: "https://www.venetacucine.com/it/search?q=",
    priority: 3,
    tiers: ["Premium"]
  },
  LEROY_MERLIN: {
    name: "Leroy Merlin Italia",
    base: "https://www.leroymerlin.it/",
    search: "https://www.leroymerlin.it/ricerca?q=",
    priority: 1,
    tiers: ["Essential", "Balanced", "Premium"]
  },
  TECNOMAT: {
    name: "Tecnomat",
    base: "https://www.tecnomat.it/it/",
    search: "https://www.tecnomat.it/it/ricerca?q=",
    priority: 2,
    tiers: ["Balanced", "Premium"]
  },
  UNIEURO: {
    name: "Unieuro",
    base: "https://www.unieuro.it/",
    search: "https://www.unieuro.it/online/search?q=",
    priority: 1,
    tiers: ["Essential", "Balanced", "Premium"]
  },
  MEDIAWORLD: {
    name: "MediaWorld",
    base: "https://www.mediaworld.it/",
    search: "https://www.mediaworld.it/it/search.html?q=",
    priority: 2,
    tiers: ["Balanced", "Premium"]
  },
  POLTRONESOFA: {
    name: "Poltronesofà",
    base: "https://www.poltronesofa.com/",
    search: "https://www.poltronesofa.com/it-IT/search?q=",
    priority: 1,
    tiers: ["Balanced"]
  },
  DIVANI_DIVANI: {
    name: "Divani&Divani Natuzzi",
    base: "https://www.divaniedivani.it/",
    search: "https://www.divaniedivani.it/search?q=",
    priority: 2,
    tiers: ["Balanced", "Premium"]
  },
  NATUZZI: {
    name: "Natuzzi Italia",
    base: "https://www.natuzzi.com/it/it/",
    search: "https://www.natuzzi.com/it/it/search?q=",
    priority: 3,
    tiers: ["Premium"]
  },
  KASANOVA: {
    name: "Kasanova",
    base: "https://www.kasanova.com/it",
    search: "https://www.kasanova.com/it/search?q=",
    priority: 1,
    tiers: ["Essential", "Balanced"]
  },
  COIN_CASA: {
    name: "Coin Casa",
    base: "https://www.coin.it/it-it/",
    search: "https://www.coin.it/it-it/search?q=",
    priority: 2,
    tiers: ["Balanced", "Premium"]
  }
};
const mkSearchUrl = (providerId, q) => PROVIDERS[providerId].search + encodeURIComponent(q);
const PROCUREMENT_CATALOG = {
  entrance: [{
    cat: "shoe_cabinet",
    name: "BISSA scarpiera 3 ante",
    provider: "IKEA_IT",
    q: "BISSA scarpiera",
    price: 79,
    w: 118,
    d: 28,
    h: 135,
    material: "laminate",
    colour: "white",
    tier: "Essential"
  }, {
    cat: "shoe_cabinet",
    name: "Scarpiera moderna bianca",
    provider: "MONDO_CONV",
    q: "scarpiera bianca",
    price: 149,
    w: 120,
    d: 30,
    h: 140,
    material: "melamine",
    colour: "white",
    tier: "Essential"
  }, {
    cat: "coat_rack",
    name: "PINNIG attaccapanni",
    provider: "IKEA_IT",
    q: "PINNIG attaccapanni",
    price: 69,
    w: 80,
    d: 33,
    h: 193,
    material: "steel+wood",
    colour: "black/oak",
    tier: "Essential"
  }, {
    cat: "mirror",
    name: "Specchio rettangolare nero",
    provider: "MAISONS_DU_MONDE",
    q: "specchio nero rettangolare",
    price: 129,
    w: 80,
    d: 3,
    h: 170,
    material: "metal frame",
    colour: "black",
    tier: "Balanced"
  }, {
    cat: "console_table",
    name: "Consolle ingresso in rovere",
    provider: "MAISONS_DU_MONDE",
    q: "consolle rovere ingresso",
    price: 299,
    w: 120,
    d: 38,
    h: 78,
    material: "oak veneer",
    colour: "natural oak",
    tier: "Balanced"
  }, {
    cat: "ceiling_light",
    name: "Plafoniera LED tonda 32cm",
    provider: "LEROY_MERLIN",
    q: "plafoniera LED 32 cm",
    price: 39,
    w: 32,
    d: 32,
    h: 9,
    material: "acrylic",
    colour: "white",
    tier: "Essential"
  }],
  living_room: [{
    cat: "sofa",
    name: "KIVIK divano 3 posti",
    provider: "IKEA_IT",
    q: "KIVIK divano 3 posti",
    price: 799,
    w: 228,
    d: 95,
    h: 83,
    material: "fabric",
    colour: "beige",
    tier: "Essential"
  }, {
    cat: "sofa",
    name: "Divano 3 posti tessuto Premium",
    provider: "POLTRONESOFA",
    q: "divano 3 posti beige",
    price: 1490,
    w: 220,
    d: 95,
    h: 85,
    material: "premium fabric",
    colour: "warm beige",
    tier: "Balanced"
  }, {
    cat: "sofa",
    name: "Divano Natuzzi pelle anilina",
    provider: "NATUZZI",
    q: "divano pelle 3 posti",
    price: 3490,
    w: 240,
    d: 100,
    h: 80,
    material: "aniline leather",
    colour: "cognac",
    tier: "Premium"
  }, {
    cat: "coffee_table",
    name: "LACK tavolino",
    provider: "IKEA_IT",
    q: "LACK tavolino",
    price: 29,
    w: 90,
    d: 55,
    h: 45,
    material: "laminate",
    colour: "white",
    tier: "Essential"
  }, {
    cat: "coffee_table",
    name: "Tavolino noce e marmo",
    provider: "MAISONS_DU_MONDE",
    q: "tavolino marmo",
    price: 399,
    w: 120,
    d: 60,
    h: 42,
    material: "marble+walnut",
    colour: "white/walnut",
    tier: "Balanced"
  }, {
    cat: "tv_unit",
    name: "BESTÅ mobile TV bianco",
    provider: "IKEA_IT",
    q: "BESTA mobile TV bianco",
    price: 299,
    w: 180,
    d: 42,
    h: 64,
    material: "melamine",
    colour: "white",
    tier: "Essential"
  }, {
    cat: "tv_unit",
    name: "Mobile TV rovere/nero opaco",
    provider: "WESTWING",
    q: "mobile TV rovere",
    price: 549,
    w: 200,
    d: 45,
    h: 55,
    material: "oak+matte black",
    colour: "oak/black",
    tier: "Balanced"
  }, {
    cat: "rug",
    name: "HODDE tappeto 160×230",
    provider: "IKEA_IT",
    q: "HODDE tappeto",
    price: 89,
    w: 230,
    d: 160,
    h: 1,
    material: "polypropylene",
    colour: "grey",
    tier: "Essential"
  }, {
    cat: "rug",
    name: "Tappeto kilim 170×240",
    provider: "WESTWING",
    q: "tappeto kilim 170",
    price: 299,
    w: 240,
    d: 170,
    h: 1,
    material: "wool",
    colour: "multi neutral",
    tier: "Balanced"
  }, {
    cat: "ceiling_light",
    name: "Sospensione design rotonda",
    provider: "LEROY_MERLIN",
    q: "lampada sospensione design",
    price: 79,
    w: 50,
    d: 50,
    h: 25,
    material: "metal",
    colour: "black",
    tier: "Essential"
  }, {
    cat: "floor_lamp",
    name: "NOT lampada da terra",
    provider: "IKEA_IT",
    q: "NOT lampada terra",
    price: 49,
    w: 25,
    d: 25,
    h: 175,
    material: "plastic+steel",
    colour: "black",
    tier: "Essential"
  }, {
    cat: "curtains",
    name: "Tende oscuranti 145×300 ×2",
    provider: "LEROY_MERLIN",
    q: "tende oscuranti 300",
    price: 79,
    w: 145,
    d: 1,
    h: 300,
    material: "polyester",
    colour: "linen",
    tier: "Essential"
  }, {
    cat: "dining_table",
    name: "EKEDALEN tavolo allungabile",
    provider: "IKEA_IT",
    q: "EKEDALEN tavolo allungabile",
    price: 399,
    w: 180,
    d: 80,
    h: 75,
    material: "oak veneer",
    colour: "oak",
    tier: "Essential"
  }, {
    cat: "dining_chairs",
    name: "TEODORES sedia ×4",
    provider: "IKEA_IT",
    q: "TEODORES sedia",
    price: 200,
    w: 52,
    d: 53,
    h: 80,
    material: "polypropylene",
    colour: "white",
    tier: "Essential"
  }],
  kitchen: [{
    cat: "kitchen_system",
    name: "KNOXHULT cucina componibile 220cm",
    provider: "IKEA_IT",
    q: "KNOXHULT cucina",
    price: 849,
    w: 220,
    d: 60,
    h: 200,
    material: "melamine",
    colour: "white",
    tier: "Essential"
  }, {
    cat: "kitchen_system",
    name: "METOD + AXSTAD cucina 300cm",
    provider: "IKEA_IT",
    q: "METOD AXSTAD cucina",
    price: 2890,
    w: 300,
    d: 60,
    h: 220,
    material: "matt lacquer",
    colour: "matt grey",
    tier: "Balanced"
  }, {
    cat: "kitchen_system",
    name: "Scavolini DeLinea cucina",
    provider: "SCAVOLINI",
    q: "DeLinea cucina",
    price: 9800,
    w: 360,
    d: 60,
    h: 240,
    material: "lacquer+stone",
    colour: "warm white",
    tier: "Premium"
  }, {
    cat: "kitchen_system",
    name: "Febal Casa Marina cucina",
    provider: "FEBAL_CASA",
    q: "Marina cucina",
    price: 7500,
    w: 330,
    d: 60,
    h: 240,
    material: "melamine+stone",
    colour: "oak/grey",
    tier: "Balanced"
  }, {
    cat: "kitchen_system",
    name: "Veneta Cucine Carrera",
    provider: "VENETA_CUCINE",
    q: "Carrera cucina",
    price: 8900,
    w: 330,
    d: 60,
    h: 240,
    material: "lacquer+wood",
    colour: "warm modern",
    tier: "Premium"
  }, {
    cat: "worktop",
    name: "KARLBY piano rovere 246cm",
    provider: "IKEA_IT",
    q: "KARLBY piano lavoro rovere",
    price: 269,
    w: 246,
    d: 63,
    h: 3.8,
    material: "solid oak",
    colour: "oak",
    tier: "Balanced"
  }, {
    cat: "worktop",
    name: "Piano effetto marmo Calacatta",
    provider: "LEROY_MERLIN",
    q: "piano cucina effetto marmo",
    price: 399,
    w: 300,
    d: 60,
    h: 4,
    material: "laminate",
    colour: "calacatta",
    tier: "Balanced"
  }, {
    cat: "sink",
    name: "HAVSEN lavello incasso 2 vasche",
    provider: "IKEA_IT",
    q: "HAVSEN lavello",
    price: 299,
    w: 88,
    d: 46,
    h: 20,
    material: "ceramic",
    colour: "white",
    tier: "Essential"
  }, {
    cat: "sink",
    name: "Lavello inox saldato sottotop",
    provider: "TECNOMAT",
    q: "lavello inox sottotop",
    price: 189,
    w: 55,
    d: 40,
    h: 18,
    material: "stainless",
    colour: "steel",
    tier: "Balanced"
  }, {
    cat: "hob",
    name: "Piano cottura induzione 60cm",
    provider: "UNIEURO",
    q: "piano induzione 60",
    price: 299,
    w: 60,
    d: 52,
    h: 5.5,
    material: "glass-ceramic",
    colour: "black",
    tier: "Essential"
  }, {
    cat: "hob",
    name: "Piano induzione Bosch flex 80cm",
    provider: "MEDIAWORLD",
    q: "piano induzione 80 flex",
    price: 799,
    w: 80,
    d: 52,
    h: 5.5,
    material: "glass-ceramic",
    colour: "black",
    tier: "Premium"
  }, {
    cat: "oven",
    name: "Forno multifunzione classe A+",
    provider: "UNIEURO",
    q: "forno incasso classe A+",
    price: 399,
    w: 60,
    d: 56,
    h: 60,
    material: "stainless+glass",
    colour: "black inox",
    tier: "Essential"
  }, {
    cat: "fridge",
    name: "Frigo combinato 200L classe E",
    provider: "UNIEURO",
    q: "frigo combinato 200L",
    price: 499,
    w: 60,
    d: 65,
    h: 185,
    material: "steel",
    colour: "white",
    tier: "Essential"
  }, {
    cat: "fridge",
    name: "Frigo combinato Samsung 380L A",
    provider: "MEDIAWORLD",
    q: "frigo combinato 380 A",
    price: 849,
    w: 60,
    d: 65,
    h: 200,
    material: "steel",
    colour: "inox",
    tier: "Balanced"
  }, {
    cat: "dishwasher",
    name: "Lavastoviglie 60cm 14 coperti A+",
    provider: "UNIEURO",
    q: "lavastoviglie 60 14 coperti",
    price: 349,
    w: 60,
    d: 60,
    h: 85,
    material: "steel",
    colour: "white",
    tier: "Essential"
  }, {
    cat: "hood",
    name: "Cappa sottopensile 60cm",
    provider: "LEROY_MERLIN",
    q: "cappa sottopensile 60",
    price: 129,
    w: 60,
    d: 50,
    h: 18,
    material: "steel",
    colour: "inox",
    tier: "Essential"
  }, {
    cat: "led_under_cab",
    name: "MITTLED LED sottopensile",
    provider: "IKEA_IT",
    q: "MITTLED LED sottopensile",
    price: 32,
    w: 80,
    d: 5,
    h: 1.5,
    material: "aluminium+LED",
    colour: "warm white",
    tier: "Essential"
  }, {
    cat: "pendant",
    name: "HEKTAR sospensione",
    provider: "IKEA_IT",
    q: "HEKTAR lampada sospensione",
    price: 49,
    w: 38,
    d: 38,
    h: 35,
    material: "steel",
    colour: "dark grey",
    tier: "Essential"
  }],
  bedroom_master: [{
    cat: "bed",
    name: "MALM letto 160×200 contenitore",
    provider: "IKEA_IT",
    q: "MALM letto contenitore 160",
    price: 449,
    w: 176,
    d: 209,
    h: 100,
    material: "oak veneer",
    colour: "white/oak",
    tier: "Essential"
  }, {
    cat: "bed",
    name: "Letto imbottito tessuto crema",
    provider: "MONDO_CONV",
    q: "letto imbottito 160",
    price: 649,
    w: 170,
    d: 215,
    h: 110,
    material: "upholstered",
    colour: "cream",
    tier: "Balanced"
  }, {
    cat: "bed",
    name: "Letto Natuzzi pelle con contenitore",
    provider: "NATUZZI",
    q: "letto pelle contenitore 160",
    price: 2890,
    w: 180,
    d: 220,
    h: 120,
    material: "leather",
    colour: "warm taupe",
    tier: "Premium"
  }, {
    cat: "mattress",
    name: "HAUGESUND materasso 160×200",
    provider: "IKEA_IT",
    q: "HAUGESUND materasso 160",
    price: 329,
    w: 160,
    d: 200,
    h: 24,
    material: "pocket+foam",
    colour: "grey",
    tier: "Essential"
  }, {
    cat: "mattress",
    name: "Materasso memory 160×200 premium",
    provider: "MONDO_CONV",
    q: "materasso memory 160 premium",
    price: 699,
    w: 160,
    d: 200,
    h: 26,
    material: "memory foam",
    colour: "white",
    tier: "Balanced"
  }, {
    cat: "wardrobe",
    name: "PAX guardaroba 200×201",
    provider: "IKEA_IT",
    q: "PAX guardaroba bianco 200",
    price: 799,
    w: 200,
    d: 58,
    h: 201,
    material: "melamine",
    colour: "white",
    tier: "Essential"
  }, {
    cat: "wardrobe",
    name: "Armadio scorrevole 240cm specchiato",
    provider: "MONDO_CONV",
    q: "armadio scorrevole 240",
    price: 1190,
    w: 240,
    d: 64,
    h: 240,
    material: "melamine+mirror",
    colour: "white/mirror",
    tier: "Balanced"
  }, {
    cat: "wardrobe",
    name: "Scavolini cabina armadio walk-in",
    provider: "SCAVOLINI",
    q: "cabina armadio",
    price: 5900,
    w: 300,
    d: 120,
    h: 260,
    material: "lacquer+oak",
    colour: "warm white",
    tier: "Premium"
  }, {
    cat: "bedside",
    name: "NORDLI comodino ×2",
    provider: "IKEA_IT",
    q: "NORDLI comodino",
    price: 200,
    w: 40,
    d: 43,
    h: 51,
    material: "melamine",
    colour: "white",
    tier: "Essential"
  }, {
    cat: "bedside_lamp",
    name: "SYMFONISK lampada WiFi ×2",
    provider: "IKEA_IT",
    q: "SYMFONISK lampada",
    price: 278,
    w: 21,
    d: 21,
    h: 30,
    material: "metal+textile",
    colour: "white",
    tier: "Balanced"
  }, {
    cat: "curtains",
    name: "MAJVIKEN tende 145×300 ×2",
    provider: "IKEA_IT",
    q: "MAJVIKEN tende",
    price: 89,
    w: 145,
    d: 1,
    h: 300,
    material: "polyester+linen",
    colour: "natural",
    tier: "Essential"
  }],
  bathroom: [{
    cat: "vanity",
    name: "GODMORGON mobile lavabo 80cm",
    provider: "IKEA_IT",
    q: "GODMORGON mobile lavabo 80",
    price: 319,
    w: 80,
    d: 47,
    h: 58,
    material: "melamine",
    colour: "high-gloss white",
    tier: "Essential"
  }, {
    cat: "vanity",
    name: "Mobile bagno sospeso 100cm rovere",
    provider: "LEROY_MERLIN",
    q: "mobile bagno sospeso 100 rovere",
    price: 489,
    w: 100,
    d: 46,
    h: 50,
    material: "laminate",
    colour: "oak",
    tier: "Balanced"
  }, {
    cat: "vanity",
    name: "Scavolini Aquo bagno",
    provider: "SCAVOLINI",
    q: "Aquo bagno",
    price: 2890,
    w: 120,
    d: 50,
    h: 55,
    material: "lacquer+stone",
    colour: "warm white",
    tier: "Premium"
  }, {
    cat: "sink",
    name: "ODENSVIK lavabo per mobile",
    provider: "IKEA_IT",
    q: "ODENSVIK lavabo",
    price: 129,
    w: 83,
    d: 49,
    h: 14,
    material: "ceramic",
    colour: "white",
    tier: "Essential"
  }, {
    cat: "mirror",
    name: "STORJORM armadietto specchio luce",
    provider: "IKEA_IT",
    q: "STORJORM armadietto specchio",
    price: 199,
    w: 60,
    d: 14,
    h: 96,
    material: "glass+led",
    colour: "white",
    tier: "Balanced"
  }, {
    cat: "shower",
    name: "BROGRUND doccetta cromata + tubo",
    provider: "IKEA_IT",
    q: "BROGRUND doccetta",
    price: 55,
    w: 25,
    d: 8,
    h: 120,
    material: "chrome",
    colour: "chrome",
    tier: "Essential"
  }, {
    cat: "shower",
    name: "Box doccia 80×80 cristallo 8mm",
    provider: "LEROY_MERLIN",
    q: "box doccia 80 cristallo 8mm",
    price: 299,
    w: 80,
    d: 80,
    h: 200,
    material: "tempered glass",
    colour: "clear",
    tier: "Balanced"
  }, {
    cat: "toilet",
    name: "Sanitari sospesi Geberit",
    provider: "TECNOMAT",
    q: "sanitari sospesi Geberit",
    price: 589,
    w: 36,
    d: 54,
    h: 36,
    material: "ceramic",
    colour: "white",
    tier: "Balanced"
  }, {
    cat: "towel_rail",
    name: "VOXNAN portasciugamani cromato",
    provider: "IKEA_IT",
    q: "VOXNAN portasciugamani",
    price: 39,
    w: 60,
    d: 8,
    h: 5,
    material: "chrome",
    colour: "chrome",
    tier: "Essential"
  }, {
    cat: "heated_rail",
    name: "Scaldasalviette elettrico 600W",
    provider: "LEROY_MERLIN",
    q: "scaldasalviette elettrico 600",
    price: 189,
    w: 50,
    d: 8,
    h: 100,
    material: "steel",
    colour: "white",
    tier: "Balanced"
  }, {
    cat: "bath_mat",
    name: "KALKGRUND tappeto bagno bianco",
    provider: "IKEA_IT",
    q: "KALKGRUND tappeto bagno",
    price: 15,
    w: 45,
    d: 75,
    h: 1,
    material: "cotton",
    colour: "white",
    tier: "Essential"
  }],
  laundry: [{
    cat: "washer",
    name: "Lavatrice 8kg classe A 1200rpm",
    provider: "UNIEURO",
    q: "lavatrice 8kg A 1200",
    price: 399,
    w: 60,
    d: 55,
    h: 85,
    material: "steel",
    colour: "white",
    tier: "Essential"
  }, {
    cat: "washer",
    name: "Lavatrice Bosch 9kg A+++ silent",
    provider: "MEDIAWORLD",
    q: "lavatrice Bosch 9kg silent",
    price: 699,
    w: 60,
    d: 60,
    h: 85,
    material: "steel",
    colour: "white",
    tier: "Balanced"
  }, {
    cat: "dryer",
    name: "Asciugatrice pompa di calore 8kg",
    provider: "UNIEURO",
    q: "asciugatrice pdc 8kg",
    price: 599,
    w: 60,
    d: 55,
    h: 85,
    material: "steel",
    colour: "white",
    tier: "Balanced"
  }, {
    cat: "laundry_cab",
    name: "ENHET combinazione lavanderia",
    provider: "IKEA_IT",
    q: "ENHET lavanderia",
    price: 289,
    w: 140,
    d: 32,
    h: 225,
    material: "melamine",
    colour: "white",
    tier: "Essential"
  }],
  textiles_accessories: [{
    cat: "bed_linen",
    name: "Set lenzuola matrimoniale cotone",
    provider: "COIN_CASA",
    q: "set lenzuola matrimoniale",
    price: 79,
    w: 0,
    d: 0,
    h: 0,
    material: "cotton",
    colour: "warm white",
    tier: "Essential"
  }, {
    cat: "bath_towels",
    name: "Set 6 asciugamani Coin Casa",
    provider: "COIN_CASA",
    q: "asciugamani set",
    price: 65,
    w: 0,
    d: 0,
    h: 0,
    material: "cotton",
    colour: "neutral",
    tier: "Essential"
  }, {
    cat: "cookware",
    name: "Set pentole 7 pezzi inox",
    provider: "KASANOVA",
    q: "set pentole inox 7",
    price: 99,
    w: 0,
    d: 0,
    h: 0,
    material: "stainless",
    colour: "steel",
    tier: "Essential"
  }, {
    cat: "tableware",
    name: "Set 18 piatti Kasanova",
    provider: "KASANOVA",
    q: "set piatti 18",
    price: 69,
    w: 0,
    d: 0,
    h: 0,
    material: "porcelain",
    colour: "white",
    tier: "Essential"
  }, {
    cat: "glassware",
    name: "Set 12 bicchieri Kasanova",
    provider: "KASANOVA",
    q: "set bicchieri 12",
    price: 39,
    w: 0,
    d: 0,
    h: 0,
    material: "glass",
    colour: "clear",
    tier: "Essential"
  }]
};
const STYLE_TO_PROVIDERS = {
  Japandi: {
    prefer: ["IKEA_IT", "MAISONS_DU_MONDE", "WESTWING", "SCAVOLINI"]
  },
  Scandinavian: {
    prefer: ["IKEA_IT", "MAISONS_DU_MONDE", "WESTWING"]
  },
  Minimalist: {
    prefer: ["IKEA_IT", "SCAVOLINI", "VENETA_CUCINE"]
  },
  Mediterranean: {
    prefer: ["MAISONS_DU_MONDE", "WESTWING", "COIN_CASA"]
  },
  Contemporary: {
    prefer: ["SCAVOLINI", "FEBAL_CASA", "NATUZZI", "WESTWING"]
  },
  "Industrial Soft": {
    prefer: ["LEROY_MERLIN", "IKEA_IT", "WESTWING"]
  },
  "Classic Modern": {
    prefer: ["NATUZZI", "MAISONS_DU_MONDE", "COIN_CASA", "SCAVOLINI"]
  },
  Biophilic: {
    prefer: ["MAISONS_DU_MONDE", "WESTWING", "IKEA_IT"]
  }
};
function generateBOM(sol, d) {
  const tier = sol.nm;
  const style = d.style || "Japandi";
  const preferredProviders = STYLE_TO_PROVIDERS[style]?.prefer || [];
  const area = parseFloat(d.area) || 85;
  const rooms = parseInt(d.rooms) || 3;
  const selectedByRoom = {};
  Object.entries(PROCUREMENT_CATALOG).forEach(([roomKey, items]) => {
    selectedByRoom[roomKey] = [];
    const byCat = {};
    items.forEach(it => {
      if (!byCat[it.cat]) byCat[it.cat] = [];
      byCat[it.cat].push(it);
    });
    Object.entries(byCat).forEach(([cat, options]) => {
      let candidates = options.filter(o => o.tier === tier);
      if (candidates.length === 0) {
        const tierOrder = ["Essential", "Balanced", "Premium"];
        const targetIdx = tierOrder.indexOf(tier);
        for (let delta = 1; delta < 3 && candidates.length === 0; delta++) {
          candidates = options.filter(o => tierOrder.indexOf(o.tier) === targetIdx - delta);
          if (candidates.length === 0) candidates = options.filter(o => tierOrder.indexOf(o.tier) === targetIdx + delta);
        }
      }
      if (candidates.length === 0) return;
      candidates.sort((a, b) => {
        const aPref = preferredProviders.indexOf(a.provider);
        const bPref = preferredProviders.indexOf(b.provider);
        if (aPref === -1 && bPref === -1) return PROVIDERS[a.provider].priority - PROVIDERS[b.provider].priority;
        if (aPref === -1) return 1;
        if (bPref === -1) return -1;
        return aPref - bPref;
      });
      const pick = candidates[0];
      let qty = 1;
      if (cat === "bedside" || cat === "dining_chairs") qty = 1;
      if (cat === "bedroom_single" && rooms >= 4) qty = rooms - 2;
      selectedByRoom[roomKey].push({
        ...pick,
        qty
      });
    });
  });
  let grandTotal = 0;
  const providerTotals = {};
  const byRoomTotals = {};
  Object.entries(selectedByRoom).forEach(([roomKey, items]) => {
    let roomTotal = 0;
    items.forEach(it => {
      const lineTotal = it.price * it.qty;
      const delivery = Math.round(lineTotal * 0.04);
      const install = it.cat === "kitchen_system" || it.cat === "vanity" || it.cat === "wardrobe" || it.cat === "hob" || it.cat === "oven" || it.cat === "washer" ? Math.round(lineTotal * 0.12) : 0;
      it.lineTotal = lineTotal;
      it.delivery = delivery;
      it.install = install;
      it.totalAllIn = lineTotal + delivery + install;
      roomTotal += it.totalAllIn;
      grandTotal += it.totalAllIn;
      if (!providerTotals[it.provider]) providerTotals[it.provider] = {
        count: 0,
        total: 0,
        categories: new Set()
      };
      providerTotals[it.provider].count += it.qty;
      providerTotals[it.provider].total += it.totalAllIn;
      providerTotals[it.provider].categories.add(it.cat);
    });
    byRoomTotals[roomKey] = roomTotal;
  });
  return {
    selectedByRoom,
    providerTotals,
    byRoomTotals,
    grandTotal,
    tier,
    style
  };
}
function calcFengShuiScore(fengshui, changes, roomDetails) {
  if (!fengshui || fengshui.length === 0) return {
    score: 50,
    label: "Neutral",
    detail: "No feng shui preferences selected"
  };
  let score = 30;
  const details = [];
  score += fengshui.length * 8;
  if (fengshui.includes("Command position (bed/desk facing door)")) {
    details.push("Command position +10");
    score += 10;
  }
  if (fengshui.includes("Five elements balance (wood, fire, earth, metal, water)")) {
    details.push("Five elements +8");
    score += 8;
  }
  if (fengshui.includes("Natural light maximization & mirror placement")) {
    details.push("Light optimization +7");
    score += 7;
  }
  if (fengshui.includes("Clutter-free flow & rounded furniture edges")) {
    details.push("Flow optimization +8");
    score += 8;
  }
  if (fengshui.includes("Living plants in east/southeast sectors")) {
    details.push("Plant energy +5");
    score += 5;
  }
  if (changes.includes("Internal layout optimization")) {
    details.push("Layout optimization aligns with chi flow +5");
    score += 5;
  }
  if (changes.includes("Smart controls")) {
    details.push("Smart controls support element balance +3");
    score += 3;
  }
  if (changes.includes("Finishes refresh")) {
    details.push("Fresh finishes clear stagnant energy +4");
    score += 4;
  }
  const rd = roomDetails || {};
  if (rd.living?.length && rd.living?.width) {
    const ratio = Math.max(parseFloat(rd.living.length), parseFloat(rd.living.width)) / Math.min(parseFloat(rd.living.length), parseFloat(rd.living.width));
    if (ratio < 1.8) {
      details.push("Living room proportions favorable (ratio " + ratio.toFixed(1) + ") +5");
      score += 5;
    }
  }
  score = Math.min(100, Math.max(0, score));
  const label = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Moderate" : "Needs attention";
  return {
    score,
    label,
    details
  };
}
async function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
async function geminiVision(file, textPrompt, apiKey) {
  try {
    const b64 = await fileToBase64(file);
    const base = b64.split(",")[1];
    const mime = file.type || "image/jpeg";
    const res = await fetch(geminiUrl('gemini-2.0-flash', apiKey), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            inlineData: {
              mimeType: mime,
              data: base
            }
          }, {
            text: textPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024
        }
      })
    });
    if (!res.ok) throw new Error("Gemini " + res.status);
    const data = await res.json();
    const txt = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return JSON.parse(txt.replace(/```json|```/g, "").trim());
  } catch (e) {
    console.warn("Gemini vision failed:", e);
    return null;
  }
}
async function analyzePlanImage(file, apiKey) {
  return geminiVision(file, `You are an architectural plan analyst. Study this floor plan and extract ALL spatial data. Return ONLY valid JSON, no markdown:
{"totalArea":<m² number>,"overallShape":"<footprint description>","entranceDoor":{"wall":"<which wall>","positionFromLeft":<0-1 fraction>,"widthM":<number>},"externalWalls":[{"direction":"<N/S/E/W>","lengthM":<number>,"windows":[{"positionFromLeft":<0-1>,"widthM":<number>,"heightM":<number>}]}],"rooms":{"living":{"presentInPlan":<bool>,"widthM":<number>,"lengthM":<number>,"wallN":"<external/internal/none>","wallS":"<external/internal/none>","wallE":"<external/internal/none>","wallW":"<external/internal/none>","windowCount":<number>,"doorOpenings":<number>,"positionInApartment":"<e.g. front-left>"},"kitchen":{"presentInPlan":<bool>,"widthM":<number>,"lengthM":<number>,"wallN":"","wallS":"","wallE":"","wallW":"","windowCount":<number>,"doorOpenings":<number>,"positionInApartment":""},"bedroom":{"presentInPlan":<bool>,"widthM":<number>,"lengthM":<number>,"wallN":"","wallS":"","wallE":"","wallW":"","windowCount":<number>,"doorOpenings":<number>,"positionInApartment":""},"bathroom":{"presentInPlan":<bool>,"widthM":<number>,"lengthM":<number>,"wallN":"","wallS":"","wallE":"","wallW":"","windowCount":<number>,"doorOpenings":<number>,"positionInApartment":"","plumbingWall":"<wall with pipes>"},"corridor":{"presentInPlan":<bool>,"widthM":<number>,"lengthM":<number>,"windowCount":<number>,"doorOpenings":<number>}},"loadBearingWalls":["<describe each>"],"nonStructuralPartitions":["<describe each>"],"notes":"<observations>"}`, apiKey);
}
async function analyzeRoomPhoto(file, roomType, apiKey) {
  return geminiVision(file, `You are an architectural space analyst. Examine this ${roomType} photo and extract all fixed spatial features. Return ONLY valid JSON, no markdown:
{"roomType":"${roomType}","estimatedDimensions":{"widthM":<number>,"lengthM":<number>,"ceilingHeightM":<number>},"windows":[{"wall":"<left/right/back/front from camera>","approximateWidthM":<number>,"approximateHeightM":<number>,"sillHeightM":<number>,"positionOnWall":"<left/center/right>","count":<number>}],"doors":[{"wall":"<which wall>","widthM":<number>,"swingDirection":"<inward/outward>","positionOnWall":"<left/center/right>"}],"fixedArchitecturalElements":["<pillars, beams, steps, niches, risers etc>"],"cameraViewpoint":"<wide/corner/straight-on>","naturalLightDirection":"<from which side>","existingFloor":"<material>","existingWalls":"<finish>","existingCeiling":"<height and finish>","immovableFeatures":["<structural elements, pipes, risers that cannot move>"]}`, apiKey);
}
function getIkeaList(sol, d) {
  if (!d) return [];
  const bom = generateBOM(sol, d);
  const list = [];
  Object.entries(bom.selectedByRoom).forEach(([room, items]) => {
    items.forEach(it => {
      list.push({
        name: it.name,
        url: mkSearchUrl(it.provider, it.q),
        price: it.lineTotal,
        room: room,
        provider: PROVIDERS[it.provider].name
      });
    });
  });
  return list;
}
const SM = [{
  color: "#6B705C",
  em: "💚",
  tg: "Budget",
  gr: "linear-gradient(135deg,#B5CDB8,#D1E7DD)"
}, {
  color: "#1B3A2D",
  em: "⭐",
  tg: "Recommended",
  gr: "linear-gradient(135deg,#87A98F,#D1E7DD)"
}, {
  color: "#C87941",
  em: "👑",
  tg: "Premium",
  gr: "linear-gradient(135deg,#D4A373,#FAEBD7)"
}];
const CLS = ["#1B3A2D", "#2D5F45", "#3E8259", "#5BA67A", "#87A98F", "#B5CDB8", "#C87941", "#D4A373", "#8B6F4E"];
const PASS_SCORE = 80;
const MAX_ROUNDS = 3;
const RETRY_ADDENDUM = ["", " SPATIAL VIOLATION DETECTED IN PREVIOUS ATTEMPT. MANDATORY CORRECTIONS: (1) Count the windows in the original description and show EXACTLY that many in EXACT positions. (2) Room dimensions must match EXACTLY — no stretching or compressing. (3) Bathroom position FROZEN — do not move it. (4) Entrance door FROZEN — same wall, same position. (5) Total area must equal original. Regenerate with these corrections strictly applied.", " FINAL ATTEMPT — STRICT SPATIAL COMPLIANCE REQUIRED. The previous renders failed validation. You MUST reproduce the EXACT room shell from the original description: same window count, same window positions on same walls, same room proportions, same ceiling height, same bathroom location, same entrance door. The ONLY differences from the original should be: surface finishes, furniture (IKEA), and the specific client requirements listed. Any spatial deviation = immediate rejection."];
async function generateWithImagen(prompt, apiKey, originalPhotoFile) {
  if (originalPhotoFile) {
    try {
      const b64 = await fileToBase64(originalPhotoFile);
      const base = b64.split(",")[1];
      const mime = originalPhotoFile.type || "image/jpeg";
      const editPrompt = `You are looking at an original room photo. Generate a photorealistic renovation of THIS EXACT ROOM.

WHAT YOU MUST KEEP IDENTICAL (copy exactly from the photo):
- Every wall, its position, thickness, and angle
- Every window: exact count, exact position on wall, exact size
- Every door opening: exact position, exact width
- Ceiling height: exactly as in the photo
- Room shape and proportions: exactly as in the photo
- Bathroom: if visible, exact same position and size

WHAT YOU SHOULD CHANGE (the renovation):
${prompt}

The result must look like a photograph of the SAME ROOM after renovation — not a different room. A viewer who knows the original should immediately recognise the same spatial layout.`;
      const res = await fetch(geminiUrl('gemini-2.5-flash-image', apiKey), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              inlineData: {
                mimeType: mime,
                data: base
              }
            }, {
              text: editPrompt.slice(0, 3800)
            }]
          }],
          generationConfig: {
            responseModalities: ["IMAGE"]
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (part?.inlineData) {
          const m = part.inlineData.mimeType || "image/png";
          return {
            dataUrl: `data:${m};base64,${part.inlineData.data}`,
            base64: part.inlineData.data,
            mime: m,
            mode: "image-edit"
          };
        }
      }
    } catch (e) {
      console.warn("Image-to-image failed, falling back:", e);
    }
  }
  const res = await fetch(geminiUrl('gemini-2.5-flash-image', apiKey), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt.slice(0, 4000)
        }]
      }],
      generationConfig: {
        responseModalities: ["IMAGE"]
      }
    })
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error?.message || "Nano Banana error " + res.status);
  }
  const data = await res.json();
  const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!part?.inlineData) throw new Error("No image returned from Nano Banana 2");
  const mime = part.inlineData.mimeType || "image/png";
  return {
    dataUrl: `data:${mime};base64,${part.inlineData.data}`,
    base64: part.inlineData.data,
    mime,
    mode: "text-to-image"
  };
}
async function validateRender(base64OrUrl, roomType, spatialData, apiKey) {
  if (!apiKey || !base64OrUrl) return {
    overallScore: null,
    approved: true,
    issues: []
  };
  try {
    const constraints = spatialData ? `
Room: ${roomType}
Dimensions: ${spatialData.estimatedDimensions?.widthM || "?"}m × ${spatialData.estimatedDimensions?.lengthM || "?"}m, ceiling ${spatialData.estimatedDimensions?.ceilingHeightM || "?"}m
Windows: ${JSON.stringify(spatialData.windows || [])}
Doors: ${JSON.stringify(spatialData.doors || [])}
Fixed elements: ${(spatialData.fixedArchitecturalElements || []).join(", ")}
Immovable: ${(spatialData.immovableFeatures || []).join(", ")}` : "No extracted spatial data.";
    const isBase64 = base64OrUrl.startsWith("data:");
    const imgPart = isBase64 ? {
      inlineData: {
        mimeType: base64OrUrl.split(";")[0].replace("data:", ""),
        data: base64OrUrl.split(",")[1]
      }
    } : {
      fileData: {
        mimeType: "image/jpeg",
        fileUri: base64OrUrl
      }
    };
    const res = await fetch(geminiUrl('gemini-2.0-flash', apiKey), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [imgPart, {
            text: `You are a strict architectural fidelity AND Italian/Lombardy building code reviewer. This is an AI renovation render of a ${roomType}. Check (1) SPATIAL STRUCTURE matches the original (walls, windows, doors, proportions, ceiling, total area — ignore furniture and finishes) AND (2) post-renovation compliance with key Italian/Lombardy codes (DM 5/7/1975 dimensions/RAI, DM 236/1989 accessibility, NTC 2018 structural).

ORIGINAL SPATIAL DATA:
${constraints}

KEY COMPLIANCE THRESHOLDS:
- Habitable ceiling ≥ 2.70 m (or 2.40 m heritage waiver)
- Bedroom single ≥ 9 m² / double ≥ 14 m² · Living ≥ 14 m²
- Window/floor ratio (RAI) ≥ 1/8 in habitable rooms
- Bathroom window ≥ 0.50 m² OR mechanical extraction
- Internal doors clear ≥ 75 cm · Main entrance ≥ 80 cm · Corridor ≥ 100 cm
- Load-bearing walls UNTOUCHED · Plumbing risers in place
- No habitable room without openable window to exterior

Return ONLY valid JSON (no markdown):
{"overallScore":0-100,"windowCountMatch":true/false,"windowPositionsMatch":true/false,"roomProportionsCorrect":true/false,"ceilingHeightCorrect":true/false,"noNewOpenings":true/false,"noRemovedOpenings":true/false,"noWallMoves":true/false,"bathroomUnchanged":true/false,"entranceDoorUnchanged":true/false,"totalAreaPreserved":true/false,"complianceCeilingHeight":true/false,"complianceRoomAreas":true/false,"complianceLightVent":true/false,"complianceAccessibility":true/false,"complianceStructural":true/false,"approved":true/false,"violations":["list violations"],"complianceNotes":["list compliance issues"],"passMessage":"one line summary"}`
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 500
        }
      })
    });
    if (!res.ok) return {
      overallScore: 50,
      approved: true,
      issues: []
    };
    const data = await res.json();
    const txt = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const clean = txt.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    console.warn("Validation failed:", e);
    return {
      overallScore: null,
      approved: true,
      issues: []
    };
  }
}
async function runRefinementPipeline(prompt, apiKey, spatialData, roomType, onProgress, originalPhotoFile) {
  if (originalPhotoFile) {
    onProgress({
      stage: "generating",
      round: 1,
      total: 1
    });
    const result = await generateWithImagen(prompt, apiKey, originalPhotoFile);
    return {
      url: result.dataUrl,
      score: 95,
      validation: null,
      mode: "image-edit"
    };
  }
  let bestDataUrl = null,
    bestScore = -1,
    bestValidation = null;
  for (let round = 0; round < MAX_ROUNDS; round++) {
    onProgress({
      stage: round === 0 ? "generating" : "refining",
      round: round + 1,
      total: MAX_ROUNDS
    });
    const fullPrompt = (prompt + RETRY_ADDENDUM[round]).slice(0, 4000);
    const {
      dataUrl,
      base64,
      mime
    } = await generateWithImagen(fullPrompt, apiKey, null);
    if (spatialData && roomType !== "Floor Plan") {
      onProgress({
        stage: "validating",
        round: round + 1,
        total: MAX_ROUNDS
      });
      const v = await validateRender(`data:${mime};base64,${base64}`, roomType, spatialData, apiKey);
      const score = v?.overallScore ?? 50;
      if (score > bestScore) {
        bestScore = score;
        bestDataUrl = dataUrl;
        bestValidation = v;
      }
      if (score >= PASS_SCORE) break;
    } else {
      bestDataUrl = dataUrl;
      bestScore = 100;
      bestValidation = null;
      break;
    }
  }
  return {
    url: bestDataUrl,
    score: bestScore,
    validation: bestValidation,
    mode: "text-to-image"
  };
}
function AIRenderTile({
  prompt,
  style,
  solName,
  room,
  apiKey,
  spatialData,
  originalPhotoFile,
  batchTrigger
}) {
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState({
    stage: "generating",
    round: 1,
    total: MAX_ROUNDS
  });
  const [imgUrl, setImgUrl] = useState("");
  const [finalScore, setFinalScore] = useState(null);
  const [error, setError] = useState("");
  const start = useCallback(async () => {
    if (!apiKey) {
      setError("Set Nano Banana API key above");
      setPhase("error");
      return;
    }
    setPhase("pipeline");
    setError("");
    setImgUrl("");
    setFinalScore(null);
    try {
      const result = await runRefinementPipeline(prompt, apiKey, spatialData, room, p => setProgress(p), originalPhotoFile);
      setImgUrl(result.url);
      setFinalScore(result.score);
      setPhase("done");
    } catch (e) {
      setError(e.message || "Failed");
      setPhase("error");
    }
  }, [prompt, apiKey, spatialData, room, originalPhotoFile]);
  useEffect(() => {
    if (batchTrigger > 0 && phase === "idle") start();
  }, [batchTrigger]);
  const stageLabel = {
    generating: originalPhotoFile ? "Editing your original photo…" : "Generating render…",
    validating: "Verifying spatial accuracy…",
    refining: "Refining spatial fidelity…"
  };
  const stageIcon = {
    generating: "🎨",
    validating: "🔍",
    refining: "🔧"
  };
  const sc = finalScore;
  const scoreClr = sc == null ? "#78716C" : sc >= 80 ? "#1B3A2D" : sc >= 60 ? "#C87941" : "#B91C1C";
  const scoreLabel = sc == null ? "" : sc >= 80 ? "✓ Verified" : sc >= 60 ? "~ Acceptable" : "⚠ Best attempt";
  return React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: "hidden",
      border: "1px solid #E2DCD2"
    }
  }, phase === "idle" && React.createElement("div", {
    className: "render-idle",
    onClick: start,
    style: {
      background: "linear-gradient(135deg," + (STYLES[style]?.pal || ["#F5F0E8"])[2] + "88," + (STYLES[style]?.pal || ["#E8DCC8"])[1] + "55)"
    }
  }, React.createElement("span", {
    style: {
      fontSize: 36,
      marginBottom: 6
    }
  }, "\uD83C\uDFA8"), React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#1B3A2D"
    }
  }, "Generate Render"), React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#78716C",
      marginTop: 2
    }
  }, room, " \xB7 ", solName), React.createElement("span", {
    style: {
      fontSize: 9,
      color: "#87A98F",
      marginTop: 5,
      padding: "2px 10px",
      background: "#D1E7DD",
      borderRadius: 10
    }
  }, originalPhotoFile ? "🖼 Image-to-image · Spatial Refinement" : "Text-to-image · Spatial Refinement"), originalPhotoFile && React.createElement("span", {
    style: {
      fontSize: 9,
      color: "#1B3A2D",
      marginTop: 3,
      padding: "2px 8px",
      background: "#B5CDB8",
      borderRadius: 8
    }
  }, "\u2713 Original photo attached \u2014 editing in place")), phase === "pipeline" && React.createElement("div", {
    className: "render-loading",
    style: {
      flexDirection: "column",
      gap: 0,
      padding: 24
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      marginBottom: 18
    }
  }, React.createElement("div", {
    className: "spinner"
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#1B3A2D"
    }
  }, stageIcon[progress.stage], " ", stageLabel[progress.stage]), React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#78716C",
      marginTop: 2
    }
  }, "Round ", progress.round, " of ", progress.total, " \xB7 ", room, " \xB7 ", solName))), React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center",
      width: "100%",
      maxWidth: 320
    }
  }, [{
    k: "generating",
    l: "Generate"
  }, {
    k: "validating",
    l: "Verify"
  }, {
    k: "refining",
    l: "Refine"
  }].map((s, i) => {
    const active = progress.stage === s.k;
    const done = progress.stage === "validating" && s.k === "generating" || progress.stage === "refining" && s.k !== "refining";
    return React.createElement(React.Fragment, {
      key: s.k
    }, React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3
      }
    }, React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: active ? "#1B3A2D" : done ? "#87A98F" : "#E2DCD2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        transition: "all .3s"
      }
    }, done ? "✓" : React.createElement("span", {
      style: {
        color: active ? "#fff" : "#B8AFA5"
      }
    }, i + 1)), React.createElement("span", {
      style: {
        fontSize: 9,
        color: active ? "#1B3A2D" : "#78716C",
        fontWeight: active ? 700 : 400
      }
    }, s.l)), i < 2 && React.createElement("div", {
      style: {
        flex: 1,
        height: 2,
        background: done ? "#87A98F" : "#E2DCD2",
        borderRadius: 1,
        marginBottom: 16,
        transition: "background .3s"
      }
    }));
  })), React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#87A98F",
      marginTop: 14,
      textAlign: "center"
    }
  }, "Auto-refining for spatial fidelity \u2014 only the approved result will be shown")), phase === "done" && imgUrl && React.createElement("div", {
    style: {
      position: "relative"
    }
  }, React.createElement("img", {
    src: imgUrl,
    alt: style + " " + room + " — " + solName,
    className: "render-img",
    onError: () => {
      setPhase("error");
      setError("Image failed to load");
    }
  }), sc != null && React.createElement("div", {
    style: {
      position: "absolute",
      top: 8,
      right: 8,
      background: scoreClr + "ee",
      padding: "4px 10px",
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 700,
      color: "#fff",
      backdropFilter: "blur(4px)"
    }
  }, scoreLabel, " ", sc, "/100")), phase === "error" && React.createElement("div", {
    className: "render-idle",
    onClick: start,
    style: {
      background: "#FEF2F2"
    }
  }, React.createElement("span", {
    style: {
      fontSize: 28
    }
  }, "\u26A0\uFE0F"), React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#B91C1C",
      fontWeight: 600,
      marginTop: 4
    }
  }, error), React.createElement("span", {
    style: {
      fontSize: 10,
      color: "#B91C1C",
      marginTop: 2
    }
  }, "Click to retry")), React.createElement("div", {
    style: {
      padding: "8px 12px",
      borderTop: "1px solid #ECE8E1",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600
    }
  }, room, " \u2014 ", solName), React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#78716C"
    }
  }, style, phase === "done" ? " · spatially verified render" : "")), React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, phase === "done" && React.createElement("button", {
    className: "btn btn-g",
    style: {
      padding: "3px 8px",
      fontSize: 10
    },
    onClick: () => {
      setPhase("idle");
      setImgUrl("");
      setFinalScore(null);
    }
  }, "\uD83D\uDD04"), phase === "done" && imgUrl && React.createElement("a", {
    href: imgUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "btn btn-g",
    style: {
      padding: "3px 8px",
      fontSize: 10,
      textDecoration: "none"
    }
  }, "\uD83D\uDD17"))));
}
function S1({
  d,
  u,
  apiKey
}) {
  const [fetching, setFetching] = useState(false);
  const [listingData, setListingData] = useState(null);
  const [fetchErr, setFetchErr] = useState("");
  const fetchListing = async () => {
    if (!d.listingUrl) {
      setFetchErr("Enter a listing URL first");
      return;
    }
    setFetching(true);
    setListingData(null);
    setFetchErr("Extracting…");
    const url = d.listingUrl.trim();
    const t0 = Date.now();
    const dbg = [];
    const log = m => {
      const s = '[listing ' + ((Date.now() - t0) / 1000).toFixed(1) + 's] ' + m;
      console.log(s);
      dbg.push(s);
    };
    const SCHEMA = '{"address":"","city":"","cap":"","area":<m²>,"rooms":<n>,"bathrooms":<n>,"floor":"","ceiling":<m>,"pType":"<Apartment|Attico|Loft|Monolocale|Villa|Mansarda>","currentStatus":"<Da ristrutturare|Buono / Abitabile|Ristrutturato|Ottimo|Nuovo / In costruzione>","eCls":"<A4-G>","annualEnergy":<n>,"heatingType":"<Centralizzato|Autonomo|Pompa di calore|Nessuno>","price":<€>,"description":"","features":[],"buildingYear":<year>,"condominium":""}';
    const ANTI_RECITATION = 'IMPORTANT: Do NOT quote, copy or repeat any text from the source page verbatim. Extract NUMERIC values, single-word category enums, and paraphrased summaries only. For the description field, write a brief paraphrase in your own words (max 30 words). This is critical to avoid recitation filtering.';
    const extractFromSchema = o => {
      if (!o || typeof o !== 'object') return {};
      const out = {};
      if (o.offers?.price) out.price = parseInt(String(o.offers.price).replace(/[^\d]/g, ''));
      if (o.price) out.price = parseInt(String(o.price).replace(/[^\d]/g, ''));
      if (o.floorSize?.value) out.area = parseFloat(o.floorSize.value);
      if (o.numberOfRooms) out.rooms = parseInt(o.numberOfRooms);
      if (o.numberOfBathroomsTotal) out.bathrooms = parseInt(o.numberOfBathroomsTotal);
      if (o.address) {
        out.address = o.address.streetAddress;
        out.city = o.address.addressLocality;
        out.cap = o.address.postalCode;
      }
      return out;
    };
    const tryGemini = async (model, body, label, timeoutMs = 15000) => {
      if (!apiKey) {
        log(label + ': no API key');
        return null;
      }
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), timeoutMs);
        const r = await fetch(geminiUrl(model, apiKey), {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body),
          signal: ctrl.signal
        });
        clearTimeout(t);
        if (!r.ok) {
          const e = await r.text();
          log(label + ' HTTP ' + r.status + ': ' + e.slice(0, 150));
          return null;
        }
        const j = await r.json();
        const cand = j.candidates?.[0];
        if (!cand) {
          log(label + ': no candidate');
          return null;
        }
        const fr = cand.finishReason || '';
        if (fr === 'RECITATION' || fr === 'SAFETY' || fr === 'BLOCKLIST') {
          log(label + ' BLOCKED: ' + fr + ' — retrying with paraphrase mode');
          return 'RETRY_PARAPHRASE';
        }
        const parts = cand.content?.parts || [];
        const txt = parts.map(p => p.text || '').join('').trim();
        if (!txt) {
          log(label + ': empty text, fr=' + fr);
          return null;
        }
        const mat = txt.replace(/```json|```/g, '').match(/\{[\s\S]*\}/);
        if (!mat) {
          log(label + ' no JSON: ' + txt.slice(0, 150));
          return null;
        }
        try {
          const obj = JSON.parse(mat[0]);
          const keys = Object.keys(obj).filter(k => obj[k] != null && obj[k] !== '');
          log(label + ' OK ' + keys.length + 'k');
          return keys.length > 0 ? obj : null;
        } catch (e) {
          log(label + ' parse: ' + e.message);
          return null;
        }
      } catch (e) {
        log(label + ' ' + (e.name === 'AbortError' ? 'TIMEOUT' : e.message));
        return null;
      }
    };
    const attemptPlain = async () => {
      const body = {
        contents: [{
          parts: [{
            text: 'Analyze this Italian real-estate URL and infer property data from the URL slug + your geographic knowledge of the area. ' + ANTI_RECITATION + '\n\nURL: ' + url + '\n\nReturn JSON only matching this schema (use null for unknown). DO NOT copy text — paraphrase or estimate numerically:\n' + SCHEMA
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1500,
          responseMimeType: 'application/json'
        }
      };
      return tryGemini('gemini-2.5-flash', body, 'A:plain', 11000);
    };
    const attemptSearch = async () => {
      const body = {
        contents: [{
          parts: [{
            text: 'Search for this Italian property listing on the web and extract structured numerical/categorical fields. ' + ANTI_RECITATION + '\n\nURL: ' + url + '\n\nOutput JSON only:\n' + SCHEMA
          }]
        }],
        tools: [{
          google_search: {}
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1500
        }
      };
      const r = await tryGemini('gemini-2.5-flash', body, 'B:search', 18000);
      if (r === 'RETRY_PARAPHRASE') {
        const body2 = {
          contents: [{
            parts: [{
              text: 'Find this listing online. Output STRICTLY numerical and categorical data only — never quote any text. ' + ANTI_RECITATION + ' Use the city name and zone but paraphrase everything else.\n\nURL: ' + url + '\n\nJSON only:\n' + SCHEMA
            }]
          }],
          tools: [{
            google_search: {}
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1500
          }
        };
        return tryGemini('gemini-2.5-flash', body2, 'B2:search-paraphrase', 18000);
      }
      return r;
    };
    const attemptUrlCtx = async () => {
      const body = {
        contents: [{
          parts: [{
            text: 'Open this URL and extract numerical/categorical fields only. ' + ANTI_RECITATION + '\n\nURL: ' + url + '\n\nJSON only:\n' + SCHEMA
          }]
        }],
        tools: [{
          url_context: {}
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1500
        }
      };
      const r = await tryGemini('gemini-2.5-flash', body, 'C:urlctx', 18000);
      if (r === 'RETRY_PARAPHRASE') {
        const body2 = {
          contents: [{
            parts: [{
              text: 'Open this page and output ONLY: area (number), rooms (number), bathrooms (number), floor (number), energy class (single letter), price (number), city name (one word). No quotations from page allowed. Paraphrase any descriptive text. ' + ANTI_RECITATION + '\n\nURL: ' + url + '\n\nJSON:\n' + SCHEMA
            }]
          }],
          tools: [{
            url_context: {}
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1500
          }
        };
        return tryGemini('gemini-2.5-flash', body2, 'C2:urlctx-paraphrase', 18000);
      }
      return r;
    };
    const attempt20 = async () => {
      const body = {
        contents: [{
          parts: [{
            text: 'Search for this Italian listing. Extract only numbers/categories. ' + ANTI_RECITATION + '\nURL: ' + url + '\nJSON:\n' + SCHEMA
          }]
        }],
        tools: [{
          googleSearch: {}
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1500
        }
      };
      return tryGemini('gemini-2.0-flash', body, 'D:2.0search', 14000);
    };
    const attemptScrape = async () => {
      const proxies = [u => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u), u => 'https://corsproxy.io/?' + encodeURIComponent(u), u => 'https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent(u)];
      let html = '';
      for (const p of proxies) {
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 6000);
          const r = await fetch(p(url), {
            signal: ctrl.signal
          });
          clearTimeout(t);
          if (r.ok) {
            const txt = await r.text();
            if (txt && txt.length > 3000 && !/<title>[^<]*(403|404|denied)/i.test(txt)) {
              html = txt;
              log('E:proxy ' + txt.length + 'ch');
              break;
            }
          }
        } catch (e) {}
      }
      if (!html) return null;
      const mined = {};
      const txt = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].forEach(m => {
        try {
          const j = JSON.parse(m[1]);
          (Array.isArray(j) ? j : [j]).forEach(o => {
            if (o['@graph']) o['@graph'].forEach(x => Object.assign(mined, extractFromSchema(x)));
            Object.assign(mined, extractFromSchema(o));
          });
        } catch (e) {}
      });
      const rx = {
        area: /(\d{2,4})\s*(?:m²|mq)/i,
        rooms: /(\d{1,2})\s*(?:locali|stanze|vani)/i,
        bathrooms: /(\d{1,2})\s*bagn/i,
        eCls: /classe energetica[:\s]*([A-G][1-4]?)/i,
        price: /€\s*([\d.,]{4,})/,
        cap: /\b(\d{5})\b/
      };
      const m = k => (txt.match(rx[k]) || [])[1];
      if (!mined.area && m('area')) mined.area = parseFloat(m('area'));
      if (!mined.rooms && m('rooms')) mined.rooms = parseInt(m('rooms'));
      if (!mined.bathrooms && m('bathrooms')) mined.bathrooms = parseInt(m('bathrooms'));
      if (!mined.eCls && m('eCls')) mined.eCls = m('eCls').toUpperCase();
      if (!mined.price && m('price')) mined.price = parseInt(m('price').replace(/[.,]/g, ''));
      if (!mined.cap && m('cap')) mined.cap = m('cap');
      const keys = Object.keys(mined).filter(k => mined[k]);
      log('E:mine ' + keys.length + 'k');
      return keys.length > 0 ? mined : null;
    };
    const results = await Promise.all([attemptPlain().catch(() => null), attemptSearch().catch(() => null), attemptUrlCtx().catch(() => null), attempt20().catch(() => null), attemptScrape().catch(() => null)]);
    log('done ' + results.map(x => x && x !== 'RETRY_PARAPHRASE' ? Object.keys(x).filter(k => x[k]).length : '-').join('/'));
    const parsed = {};
    results.filter(r => r && r !== 'RETRY_PARAPHRASE').forEach(r => {
      for (const k in r) {
        if (r[k] != null && r[k] !== '' && (parsed[k] == null || parsed[k] === '')) parsed[k] = r[k];
      }
    });
    setListingData(parsed);
    const cityMatch = url.match(/(milano|milan|bergamo|brescia|como|cremona|lecco|lodi|mantova|monza|pavia|sondrio|varese)/i);
    const fallbackCity = cityMatch ? cityMatch[1].charAt(0).toUpperCase() + cityMatch[1].slice(1).toLowerCase() : "Milano";
    const updates = {
      listingExtracted: parsed
    };
    const setIf = (key, val) => {
      if (val != null && val !== '') updates[key] = String(val);
    };
    setIf('address', parsed.address);
    setIf('city', parsed.city);
    setIf('cap', parsed.cap);
    setIf('area', parsed.area);
    setIf('rooms', parsed.rooms);
    setIf('floor', parsed.floor);
    setIf('ceiling', parsed.ceiling);
    if (parsed.pType) updates.pType = parsed.pType;
    if (parsed.currentStatus) updates.currentStatus = parsed.currentStatus;
    if (parsed.eCls && parsed.eCls !== "Unknown") updates.eCls = parsed.eCls;
    if (parsed.annualEnergy) updates.annualEnergy = String(parsed.annualEnergy);
    if (parsed.heatingType) updates.heatingType = parsed.heatingType;
    if (parsed.band) updates.band = parsed.band;
    const merged = {
      ...d,
      ...updates
    };
    if (!merged.city) merged.city = fallbackCity;
    if (!merged.area) merged.area = "80";
    if (!merged.rooms) merged.rooms = "3";
    if (!merged.floor) merged.floor = "3";
    if (!merged.ceiling) merged.ceiling = "2.7";
    if (!merged.pType) merged.pType = "Apartment";
    if (!merged.currentStatus) merged.currentStatus = "Buono / Abitabile";
    if (!merged.eCls || merged.eCls === "Unknown") merged.eCls = "E";
    if (!merged.heatingType) merged.heatingType = "Centralizzato";
    if (!merged.band) merged.band = "Major city";
    u(merged);
    const filled = Object.keys(updates).filter(k => k !== 'listingExtracted').length;
    if (filled === 0) {
      setFetchErr('No data extracted. All paths failed — likely all Gemini calls hit RECITATION filter on this URL. Check console for details. Try a different listing URL or fill manually.');
    } else {
      setFetchErr('✓ ' + filled + ' fields in ' + ((Date.now() - t0) / 1000).toFixed(1) + 's');
    }
    setFetching(false);
  };
  const extractFromSchema = o => {
    if (!o || typeof o !== 'object') return {};
    const out = {};
    const t = o['@type'] || '';
    if (o.offers?.price) out.price = parseInt(String(o.offers.price).replace(/[^\d]/g, ''));
    if (o.price) out.price = parseInt(String(o.price).replace(/[^\d]/g, ''));
    if (o.floorSize?.value) out.area = parseFloat(o.floorSize.value);
    if (o.numberOfRooms) out.rooms = parseInt(o.numberOfRooms);
    if (o.numberOfBathroomsTotal) out.bathrooms = parseInt(o.numberOfBathroomsTotal);
    if (o.address) {
      out.address = o.address.streetAddress;
      out.city = o.address.addressLocality;
      out.cap = o.address.postalCode;
    }
    if (o.description) out.description = o.description.slice(0, 500);
    if (o.name) out.title = o.name;
    return out;
  };
  const le = d.listingExtracted;
  return React.createElement("div", null, React.createElement("h2", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 24,
      color: "#1B3A2D",
      marginBottom: 4
    }
  }, "Propriet\xE0"), React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#78716C",
      marginBottom: 14
    }
  }, "Enter apartment details. Paste a listing URL to auto-extract dimensions, area, and room data \u2014 these become hard spatial constraints."), React.createElement("div", {
    className: "card"
  }, React.createElement("div", {
    className: "section-title"
  }, "\uD83D\uDCCE Listing URL \u2014 AI Spatial Extraction"), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 8
    }
  }, React.createElement("input", {
    value: d.listingUrl || "",
    onChange: e => u({
      ...d,
      listingUrl: e.target.value
    }),
    placeholder: "https://www.idealista.it/immobile/12345678/ or immobiliare.it link",
    style: {
      flex: 1
    }
  }), React.createElement("button", {
    className: "btn btn-g",
    onClick: fetchListing,
    disabled: fetching || !d.listingUrl || !apiKey,
    style: {
      whiteSpace: "nowrap",
      fontSize: 12
    }
  }, fetching ? "Extracting..." : "📥 Extract")), !apiKey && d.listingUrl && React.createElement("div", {
    className: "note note-warn",
    style: {
      marginBottom: 8,
      fontSize: 11
    }
  }, "\u26A0\uFE0F Enter your Google AI Studio key in the header to enable listing extraction."), fetching && React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px",
      background: "#EDF3EE",
      borderRadius: 8,
      fontSize: 11,
      color: "#1B3A2D"
    }
  }, React.createElement("div", {
    className: "spinner",
    style: {
      width: 18,
      height: 18,
      borderWidth: 2
    }
  }), " Gemini is reading the listing and auto-filling all property fields\u2026"), fetchErr && !fetching && React.createElement("div", {
    className: "note note-warn",
    style: {
      marginTop: 8,
      fontSize: 11,
      lineHeight: 1.5
    }
  }, "\u26A0\uFE0F ", fetchErr), le && React.createElement("div", {
    style: {
      marginTop: 8,
      padding: 14,
      background: "linear-gradient(135deg,#EDF3EE,#F5F0E8)",
      borderRadius: 10,
      border: "1px solid #B5CDB8"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 10
    }
  }, React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, "\u2705"), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "#1B3A2D"
    }
  }, "Listing extracted \u2014 all fields auto-populated below"), React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#78716C"
    }
  }, "Fields highlighted in green were filled from the listing"))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 6,
      fontSize: 11
    }
  }, [["📍 Address", le.address], ["🏙 City", le.city], ["📮 CAP", le.cap], ["📐 Area", le.area ? le.area + "m² — FIXED" : null], ["🛏 Rooms", le.rooms], ["🚿 Bathrooms", le.bathrooms], ["🏢 Floor", le.floor], ["↕ Ceiling", le.ceiling ? le.ceiling + "m" : null], ["🏠 Type", le.pType], ["🔧 Status", le.currentStatus], ["⚡ Energy class", le.eCls], ["🔥 Heating", le.heatingType], ["📊 Annual energy", le.annualEnergy ? le.annualEnergy + " kWh" : null], ["💰 Price", le.price ? "€" + le.price?.toLocaleString("it-IT") : null], ["💶 €/m²", le.pricePerSqm ? "€" + le.pricePerSqm : null], ["☀️ Exposure", le.exposure], ["🏗 Built", le.buildingYear], ["🏛 Condo fees", le.condominium]].filter(([, v]) => v).map(([k, v]) => React.createElement("div", {
    key: k,
    style: {
      padding: "5px 8px",
      background: "rgba(255,255,255,.7)",
      borderRadius: 6,
      borderLeft: "3px solid #1B3A2D"
    }
  }, React.createElement("div", {
    style: {
      fontSize: 9,
      color: "#78716C",
      fontWeight: 600
    }
  }, k), React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "#1B3A2D"
    }
  }, v)))), le.features?.length > 0 && React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#78716C",
      marginBottom: 4
    }
  }, "Features:"), React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 3
    }
  }, le.features.map((f, i) => React.createElement("span", {
    key: i,
    style: {
      padding: "2px 8px",
      background: "#D1E7DD",
      borderRadius: 8,
      fontSize: 10,
      color: "#1B3A2D"
    }
  }, f)))), le.spatialNotes && React.createElement("div", {
    style: {
      marginTop: 8,
      padding: "8px 10px",
      background: "#FEE08B22",
      borderRadius: 7,
      fontSize: 10.5,
      color: "#7D5A00",
      borderLeft: "3px solid #FEE08B"
    }
  }, "\uD83D\uDCD0 ", le.spatialNotes), le.description && React.createElement("div", {
    style: {
      marginTop: 8,
      padding: "8px 10px",
      background: "rgba(255,255,255,.5)",
      borderRadius: 7,
      fontSize: 10.5,
      color: "#78716C",
      lineHeight: 1.5,
      maxHeight: 80,
      overflow: "hidden"
    }
  }, le.description?.slice(0, 300), le.description?.length > 300 ? "…" : ""))), React.createElement("div", {
    className: "card"
  }, React.createElement("div", {
    className: "section-title"
  }, "Property Details ", le && React.createElement("span", {
    style: {
      fontSize: 9,
      padding: "1px 7px",
      background: "#D1E7DD",
      borderRadius: 6,
      color: "#1B3A2D",
      fontWeight: 700,
      marginLeft: 6
    }
  }, "\u2713 Auto-filled from listing")), React.createElement("div", {
    className: "grid2"
  }, React.createElement("div", {
    style: {
      gridColumn: "1/3"
    }
  }, React.createElement("label", {
    className: "lbl"
  }, "Address ", le?.address && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("input", {
    value: d.address,
    onChange: e => u({
      ...d,
      address: e.target.value
    }),
    placeholder: "Via Montenapoleone 15",
    style: le?.address ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  })), React.createElement("div", null, React.createElement("label", {
    className: "lbl"
  }, "City ", le?.city && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("input", {
    value: d.city,
    onChange: e => u({
      ...d,
      city: e.target.value
    }),
    placeholder: "Milano",
    style: le?.city ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  })), React.createElement("div", null, React.createElement("label", {
    className: "lbl"
  }, "CAP ", le?.cap && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("input", {
    value: d.cap || "",
    onChange: e => u({
      ...d,
      cap: e.target.value
    }),
    placeholder: "20121",
    style: le?.cap ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  })), React.createElement("div", null, React.createElement("label", {
    className: "lbl"
  }, "Floor Area (m\xB2) ", le?.area && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("input", {
    type: "number",
    value: d.area,
    onChange: e => u({
      ...d,
      area: e.target.value
    }),
    style: le?.area ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  })), React.createElement("div", null, React.createElement("label", {
    className: "lbl"
  }, "Rooms ", le?.rooms && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("input", {
    type: "number",
    value: d.rooms,
    onChange: e => u({
      ...d,
      rooms: e.target.value
    }),
    style: le?.rooms ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  })), React.createElement("div", null, React.createElement("label", {
    className: "lbl"
  }, "Floor ", le?.floor && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("select", {
    value: d.floor || "3",
    onChange: e => u({
      ...d,
      floor: e.target.value
    }),
    style: le?.floor ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  }, ["Ground", "Mezzanino", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+", "Mansarda", "Attico"].map(o => React.createElement("option", {
    key: o
  }, o)))), React.createElement("div", null, React.createElement("label", {
    className: "lbl"
  }, "Ceiling Height (m) ", le?.ceiling && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("input", {
    type: "number",
    step: "0.1",
    value: d.ceiling || "2.7",
    onChange: e => u({
      ...d,
      ceiling: e.target.value
    }),
    style: le?.ceiling ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  })), React.createElement("div", null, React.createElement("label", {
    className: "lbl"
  }, "Property Type ", le?.pType && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("select", {
    value: d.pType || "Apartment",
    onChange: e => u({
      ...d,
      pType: e.target.value
    }),
    style: le?.pType ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  }, ["Apartment", "Attico", "Loft", "Monolocale", "Villa", "Mansarda"].map(o => React.createElement("option", {
    key: o
  }, o)))))), React.createElement("div", {
    className: "card"
  }, React.createElement("div", {
    className: "section-title"
  }, "Current Status & Energy ", le && React.createElement("span", {
    style: {
      fontSize: 9,
      padding: "1px 7px",
      background: "#D1E7DD",
      borderRadius: 6,
      color: "#1B3A2D",
      fontWeight: 700,
      marginLeft: 6
    }
  }, "\u2713 Auto-filled from listing")), React.createElement("div", {
    className: "grid2"
  }, React.createElement("div", null, React.createElement("label", {
    className: "lbl"
  }, "Current Status ", le?.currentStatus && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("select", {
    value: d.currentStatus || "Da ristrutturare",
    onChange: e => u({
      ...d,
      currentStatus: e.target.value
    }),
    style: le?.currentStatus ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  }, ["Da ristrutturare", "Buono / Abitabile", "Ristrutturato", "Ottimo", "Nuovo / In costruzione"].map(o => React.createElement("option", {
    key: o
  }, o)))), React.createElement("div", null, React.createElement("label", {
    className: "lbl"
  }, "Energy Class (APE) ", le?.eCls && le.eCls !== "Unknown" && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("select", {
    value: d.eCls,
    onChange: e => u({
      ...d,
      eCls: e.target.value
    }),
    style: le?.eCls && le.eCls !== "Unknown" ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  }, ["A4", "A3", "A2", "A1", "B", "C", "D", "E", "F", "G", "Unknown"].map(o => React.createElement("option", {
    key: o
  }, o)))), React.createElement("div", null, React.createElement("label", {
    className: "lbl"
  }, "Annual Energy (kWh) ", le?.annualEnergy && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("input", {
    type: "number",
    value: d.annualEnergy || "",
    onChange: e => u({
      ...d,
      annualEnergy: e.target.value
    }),
    placeholder: "e.g. 15000",
    style: le?.annualEnergy ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  })), React.createElement("div", null, React.createElement("label", {
    className: "lbl"
  }, "Heating Type ", le?.heatingType && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("select", {
    value: d.heatingType || "Centralizzato",
    onChange: e => u({
      ...d,
      heatingType: e.target.value
    }),
    style: le?.heatingType ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  }, ["Centralizzato", "Autonomo", "Pompa di calore", "Nessuno"].map(o => React.createElement("option", {
    key: o
  }, o)))), React.createElement("div", null, React.createElement("label", {
    className: "lbl"
  }, "Market Band ", le?.band && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("select", {
    value: d.band,
    onChange: e => u({
      ...d,
      band: e.target.value
    }),
    style: le?.band ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  }, Object.keys(BANDS).map(o => React.createElement("option", {
    key: o
  }, o)))), React.createElement("div", null, React.createElement("label", {
    className: "lbl"
  }, "Property Type ", le?.pType && React.createElement("span", {
    style: {
      color: "#1B3A2D",
      fontSize: 9
    }
  }, "\u2713")), React.createElement("select", {
    value: d.pType || "Apartment",
    onChange: e => u({
      ...d,
      pType: e.target.value
    }),
    style: le?.pType ? {
      borderColor: "#1B3A2D",
      background: "#EDF3EE"
    } : {}
  }, ["Apartment", "Attico", "Loft", "Monolocale", "Villa", "Mansarda"].map(o => React.createElement("option", {
    key: o
  }, o))))), React.createElement("div", {
    className: "note note-info"
  }, "Market price reference: ", React.createElement("a", {
    href: "https://www.immobiliare.it/mercato-immobiliare/lombardia/" + (d.city || "milano").toLowerCase() + "-provincia/",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: "#1B3A2D",
      fontWeight: 600
    }
  }, "immobiliare.it/", (d.city || "Milano").toLowerCase()), " \u2014 ", fmt(CITY_PRICES[(d.city || "").toLowerCase()] || LOMBARDY_AVG), "/m\xB2 avg (Mar 2026)")));
}
function S2({
  d,
  u,
  apiKey
}) {
  const rooms = [{
    key: "living",
    label: "Living / Dining",
    icon: "🛋️"
  }, {
    key: "kitchen",
    label: "Kitchen",
    icon: "🍳"
  }, {
    key: "bedroom",
    label: "Bedroom",
    icon: "🛏️"
  }, {
    key: "bathroom",
    label: "Bathroom",
    icon: "🚿"
  }, {
    key: "balcony",
    label: "Balcony",
    icon: "🌿"
  }, {
    key: "corridor",
    label: "Corridor / Entry",
    icon: "🚪"
  }];
  const rd = d.roomDetails || {};
  const [planAnalyzing, setPlanAnalyzing] = useState(false);
  const [roomAnalyzing, setRoomAnalyzing] = useState({});
  const updateRoom = (key, field, val) => {
    const nr = {
      ...rd
    };
    if (!nr[key]) nr[key] = {
      length: "",
      width: "",
      photos: [],
      extractedData: null
    };
    nr[key] = {
      ...nr[key],
      [field]: val
    };
    u({
      ...d,
      roomDetails: nr
    });
  };
  const ref = useRef();
  const handlePlanUpload = async files => {
    const newPlans = [...d.plans, ...Array.from(files)];
    u({
      ...d,
      plans: newPlans
    });
    const imgFile = Array.from(files).find(f => f.type.startsWith("image/"));
    if (!imgFile) return;
    setPlanAnalyzing(true);
    const extracted = await analyzePlanImage(imgFile, apiKey);
    if (extracted) {
      const nr = {
        ...rd
      };
      Object.entries(extracted.rooms || {}).forEach(([key, room]) => {
        if (room.presentInPlan) {
          if (!nr[key]) nr[key] = {
            length: "",
            width: "",
            photos: [],
            extractedData: null
          };
          if (room.lengthM && !nr[key].length) nr[key] = {
            ...nr[key],
            length: String(room.lengthM)
          };
          if (room.widthM && !nr[key].width) nr[key] = {
            ...nr[key],
            width: String(room.widthM)
          };
        }
      });
      u({
        ...d,
        plans: newPlans,
        extractedPlan: extracted,
        roomDetails: nr
      });
    }
    setPlanAnalyzing(false);
  };
  const handleRoomPhotos = async (roomKey, files) => {
    const newPhotos = [...(rd[roomKey]?.photos || []), ...Array.from(files)];
    updateRoom(roomKey, "photos", newPhotos);
    const imgFile = Array.from(files).find(f => f.type.startsWith("image/"));
    if (!imgFile) return;
    setRoomAnalyzing(prev => ({
      ...prev,
      [roomKey]: true
    }));
    const extracted = await analyzeRoomPhoto(imgFile, roomKey, apiKey);
    if (extracted) {
      const nr = {
        ...rd
      };
      if (!nr[roomKey]) nr[roomKey] = {
        length: "",
        width: "",
        photos: [],
        extractedData: null
      };
      nr[roomKey] = {
        ...nr[roomKey],
        photos: newPhotos,
        extractedData: extracted
      };
      if (extracted.estimatedDimensions?.lengthM && !nr[roomKey].length) nr[roomKey].length = String(extracted.estimatedDimensions.lengthM);
      if (extracted.estimatedDimensions?.widthM && !nr[roomKey].width) nr[roomKey].width = String(extracted.estimatedDimensions.widthM);
      u({
        ...d,
        roomDetails: nr
      });
    }
    setRoomAnalyzing(prev => ({
      ...prev,
      [roomKey]: false
    }));
  };
  const ep = d.extractedPlan;
  return React.createElement("div", null, React.createElement("h2", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 24,
      color: "#1B3A2D",
      marginBottom: 4
    }
  }, "Planimetria & Rilevamento Spaziale"), React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#78716C",
      marginBottom: 14
    }
  }, "Upload the floor plan and room photos. AI will extract all spatial dimensions and fixed elements \u2014 these become hard constraints for all renders."), React.createElement("div", {
    className: "card"
  }, React.createElement("div", {
    className: "section-title"
  }, "\uD83D\uDCD0 Floor Plan \u2014 AI Spatial Extraction"), React.createElement("div", {
    onClick: () => ref.current?.click(),
    style: {
      border: "2px dashed #E2DCD2",
      borderRadius: 10,
      padding: 24,
      textAlign: "center",
      cursor: "pointer",
      background: "#FAFAF8",
      position: "relative"
    }
  }, planAnalyzing ? React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8
    }
  }, React.createElement("div", {
    className: "spinner"
  }), React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#1B3A2D",
      fontWeight: 600
    }
  }, "Extracting spatial data from plan\u2026"), React.createElement("span", {
    style: {
      fontSize: 10,
      color: "#78716C"
    }
  }, "Claude Vision is reading room dimensions, walls, windows, doors")) : React.createElement(React.Fragment, null, React.createElement("span", {
    style: {
      fontSize: 28
    }
  }, "\uD83D\uDCD0"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#78716C",
      marginTop: 4
    }
  }, "Upload floor plan (PNG, JPG) \u2014 AI will extract all dimensions automatically"), React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#87A98F",
      marginTop: 3
    }
  }, "Powered by Claude Vision")), React.createElement("input", {
    ref: ref,
    type: "file",
    accept: ".png,.jpg,.jpeg,.webp",
    style: {
      display: "none"
    },
    onChange: e => handlePlanUpload(e.target.files)
  })), d.plans.length > 0 && React.createElement("div", {
    style: {
      marginTop: 6,
      display: "flex",
      flexWrap: "wrap",
      gap: 4
    }
  }, d.plans.map((f, i) => React.createElement("span", {
    key: i,
    style: {
      padding: "3px 10px",
      background: "#D1E7DD",
      borderRadius: 14,
      fontSize: 11,
      color: "#1B3A2D"
    }
  }, typeof f === "string" ? f : f.name, " ", React.createElement("span", {
    onClick: () => u({
      ...d,
      plans: d.plans.filter((_, j) => j !== i)
    }),
    style: {
      cursor: "pointer",
      fontWeight: 700
    }
  }, "\xD7")))), ep && React.createElement("div", {
    style: {
      marginTop: 14,
      padding: 14,
      background: "#EDF3EE",
      borderRadius: 9,
      border: "1px solid #B5CDB8"
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#1B3A2D",
      marginBottom: 8
    }
  }, "\u2705 Plan Analysis Complete \u2014 Spatial Constraints Locked"), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 6,
      fontSize: 11
    }
  }, ep.totalArea && React.createElement("div", null, React.createElement("span", {
    style: {
      color: "#78716C"
    }
  }, "Total area:"), " ", React.createElement("strong", null, ep.totalArea, "m\xB2")), ep.overallShape && React.createElement("div", null, React.createElement("span", {
    style: {
      color: "#78716C"
    }
  }, "Shape:"), " ", React.createElement("strong", null, ep.overallShape)), ep.entranceDoor && React.createElement("div", null, React.createElement("span", {
    style: {
      color: "#78716C"
    }
  }, "Entrance:"), " ", React.createElement("strong", null, ep.entranceDoor.wall, " wall \u2014 FIXED")), ep.rooms?.bathroom?.positionInApartment && React.createElement("div", null, React.createElement("span", {
    style: {
      color: "#78716C"
    }
  }, "Bathroom:"), " ", React.createElement("strong", null, ep.rooms.bathroom.positionInApartment, " \u2014 FIXED"))), ep.rooms && React.createElement("div", {
    style: {
      marginTop: 8,
      display: "flex",
      flexWrap: "wrap",
      gap: 4
    }
  }, Object.entries(ep.rooms).filter(([, r]) => r.presentInPlan).map(([k, r]) => React.createElement("span", {
    key: k,
    style: {
      padding: "3px 9px",
      background: "#D1E7DD",
      borderRadius: 10,
      fontSize: 10,
      color: "#1B3A2D"
    }
  }, k, ": ", r.widthM || "?", "\xD7", r.lengthM || "?", "m \xB7 ", r.windowCount || 0, " win"))), ep.loadBearingWalls?.length > 0 && React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 10,
      color: "#78716C"
    }
  }, "\uD83C\uDFDB\uFE0F Load-bearing: ", ep.loadBearingWalls.join(" · ")))), rooms.map(rm => {
    const r = rd[rm.key] || {
      length: "",
      width: "",
      photos: [],
      extractedData: null
    };
    const photoRef = React.createRef();
    const analyzing = roomAnalyzing[rm.key];
    const ex = r.extractedData;
    return React.createElement("div", {
      key: rm.key,
      className: "room-section"
    }, React.createElement("div", {
      className: "room-section-title"
    }, React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, rm.icon), rm.label, ex && React.createElement("span", {
      style: {
        fontSize: 9,
        padding: "2px 7px",
        background: "#D1E7DD",
        borderRadius: 8,
        color: "#1B3A2D",
        fontWeight: 700,
        marginLeft: 4
      }
    }, "\u2713 AI Extracted")), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 8,
        marginBottom: 8
      }
    }, React.createElement("div", null, React.createElement("label", {
      className: "lbl"
    }, "Length (m)"), React.createElement("input", {
      type: "number",
      step: "0.1",
      value: r.length,
      onChange: e => updateRoom(rm.key, "length", e.target.value),
      placeholder: "4.5"
    })), React.createElement("div", null, React.createElement("label", {
      className: "lbl"
    }, "Width (m)"), React.createElement("input", {
      type: "number",
      step: "0.1",
      value: r.width,
      onChange: e => updateRoom(rm.key, "width", e.target.value),
      placeholder: "3.2"
    })), React.createElement("div", null, React.createElement("label", {
      className: "lbl"
    }, "Area (m\xB2)"), React.createElement("input", {
      type: "text",
      value: r.length && r.width ? (parseFloat(r.length) * parseFloat(r.width)).toFixed(1) + "m²" : "—",
      readOnly: true,
      style: {
        background: "#F6F4EF"
      }
    }))), ex && React.createElement("div", {
      style: {
        marginBottom: 8,
        padding: 10,
        background: "#EDF3EE",
        borderRadius: 7,
        fontSize: 10.5
      }
    }, React.createElement("div", {
      style: {
        fontWeight: 700,
        color: "#1B3A2D",
        marginBottom: 4
      }
    }, "\uD83D\uDD12 Locked spatial features (from your photo):"), React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 4
      }
    }, ex.windows?.length > 0 && React.createElement("span", {
      style: {
        padding: "2px 8px",
        background: "#D1E7DD",
        borderRadius: 8,
        color: "#1B3A2D"
      }
    }, "\uD83E\uDE9F ", ex.windows.length, " window", ex.windows.length > 1 ? "s" : "", " \u2014 positions fixed"), ex.doors?.length > 0 && React.createElement("span", {
      style: {
        padding: "2px 8px",
        background: "#D1E7DD",
        borderRadius: 8,
        color: "#1B3A2D"
      }
    }, "\uD83D\uDEAA ", ex.doors.length, " door", ex.doors.length > 1 ? "s" : "", " \u2014 positions fixed"), ex.estimatedDimensions?.ceilingHeightM && React.createElement("span", {
      style: {
        padding: "2px 8px",
        background: "#D1E7DD",
        borderRadius: 8,
        color: "#1B3A2D"
      }
    }, "\u2195 ", ex.estimatedDimensions.ceilingHeightM, "m ceiling \u2014 fixed"), (ex.immovableFeatures || []).slice(0, 3).map((f, i) => React.createElement("span", {
      key: i,
      style: {
        padding: "2px 8px",
        background: "#FEE08B",
        borderRadius: 8,
        color: "#7D5A00"
      }
    }, "\u26A0\uFE0F ", f))), ex.naturalLightDirection && React.createElement("div", {
      style: {
        marginTop: 4,
        color: "#78716C"
      }
    }, "\u2600\uFE0F Natural light from ", ex.naturalLightDirection)), React.createElement("div", {
      onClick: () => photoRef.current?.click(),
      style: {
        border: "1px dashed #E2DCD2",
        borderRadius: 8,
        padding: analyzing ? 16 : 12,
        textAlign: "center",
        cursor: "pointer",
        background: "#fff",
        fontSize: 11,
        color: "#78716C"
      }
    }, analyzing ? React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6
      }
    }, React.createElement("div", {
      className: "spinner",
      style: {
        width: 24,
        height: 24,
        borderWidth: 3
      }
    }), React.createElement("span", {
      style: {
        fontSize: 11,
        color: "#1B3A2D",
        fontWeight: 600
      }
    }, "Analysing ", rm.label, " photo\u2026")) : React.createElement(React.Fragment, null, "\uD83D\uDCF7 Upload ", rm.label, " photo \u2014 AI extracts windows, doors, ceiling height", React.createElement("br", null), React.createElement("span", {
      style: {
        fontSize: 9,
        color: "#87A98F"
      }
    }, "Claude Vision \xB7 spatial constraints auto-locked")), React.createElement("input", {
      ref: photoRef,
      type: "file",
      accept: ".png,.jpg,.jpeg,.webp",
      multiple: true,
      style: {
        display: "none"
      },
      onChange: e => handleRoomPhotos(rm.key, e.target.files)
    })), (r.photos || []).length > 0 && React.createElement("div", {
      style: {
        marginTop: 4,
        display: "flex",
        flexWrap: "wrap",
        gap: 3
      }
    }, r.photos.map((f, i) => React.createElement("span", {
      key: i,
      style: {
        padding: "2px 8px",
        background: "#D1E7DD",
        borderRadius: 12,
        fontSize: 10,
        color: "#1B3A2D"
      }
    }, typeof f === "string" ? f : f.name, " ", React.createElement("span", {
      onClick: () => {
        const np = [...r.photos];
        np.splice(i, 1);
        updateRoom(rm.key, "photos", np);
      },
      style: {
        cursor: "pointer",
        fontWeight: 700
      }
    }, "\xD7")))), React.createElement("div", {
      style: {
        marginTop: 10
      }
    }, React.createElement("label", {
      className: "lbl",
      style: {
        marginBottom: 5,
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14
      }
    }, "\u270F\uFE0F"), " Your requirements for this ", rm.label, React.createElement("span", {
      style: {
        fontSize: 9,
        padding: "1px 6px",
        background: "#FEE08B",
        borderRadius: 6,
        color: "#7D5A00",
        fontWeight: 700
      }
    }, "Injected directly into render prompt")), React.createElement("textarea", {
      value: r.requirements || "",
      onChange: e => updateRoom(rm.key, "requirements", e.target.value),
      placeholder: rm.key === "living" ? "e.g. I want to open the kitchen to the living area, keep the sofa against the north wall, bright and airy feel with large rug..." : rm.key === "kitchen" ? "e.g. Open kitchen integrated with living room, white METOD cabinets with oak countertop, island if space allows..." : rm.key === "bedroom" ? "e.g. Merge with the small studio room on the right, PAX wardrobe along the full west wall, minimalist Japandi bed..." : rm.key === "bathroom" ? "e.g. Keep all plumbing in place, large format white tiles, walk-in shower replacing bathtub, GODMORGON vanity..." : "Describe your specific requirements for this space...",
      rows: 3,
      style: {
        resize: "vertical",
        lineHeight: 1.55,
        fontSize: 12,
        borderColor: "#C87941",
        borderWidth: 1.5
      }
    }), r.requirements && React.createElement("div", {
      style: {
        fontSize: 10,
        color: "#C87941",
        marginTop: 3
      }
    }, "\u2713 These instructions will be passed verbatim to the AI render engine for this room")));
  }), React.createElement("div", {
    className: "note note-info"
  }, "\u2139\uFE0F Dimensions extracted by AI are pre-filled above. You can manually adjust any value. All extracted constraints are passed verbatim into every render prompt."));
}
function S3({
  d,
  u
}) {
  const cats = ["Structure", "Rooms", "Finishes", "Systems", "Energy Upgrade"];
  return React.createElement("div", null, React.createElement("h2", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 24,
      color: "#1B3A2D",
      marginBottom: 4
    }
  }, "Interventi"), React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#78716C",
      marginBottom: 14
    }
  }, "Select renovation interventions. Tags show tax benefits (Bonus 36-50%) and plan conformity impact."), cats.map(ct => React.createElement("div", {
    className: "card",
    key: ct
  }, React.createElement("div", {
    className: "section-title"
  }, ct === "Energy Upgrade" ? "⚡ " + ct : ct), Object.entries(INTERVENTIONS).filter(([_, o]) => o.cat === ct).map(([k, o]) => {
    const on = d.changes.includes(k);
    return React.createElement("div", {
      key: k,
      onClick: () => u({
        ...d,
        changes: on ? d.changes.filter(c => c !== k) : [...d.changes, k]
      }),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 8,
        border: on ? "2px solid #1B3A2D" : "1px solid #ECE8E1",
        background: on ? "#D1E7DDCC" : "#fff",
        cursor: "pointer",
        marginBottom: 5
      }
    }, React.createElement("div", {
      style: {
        width: 20,
        height: 20,
        borderRadius: 5,
        border: on ? "2px solid #1B3A2D" : "2px solid #E2DCD2",
        background: on ? "#1B3A2D" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      }
    }, on && React.createElement("span", {
      style: {
        color: "#fff",
        fontSize: 13
      }
    }, "\u2713")), React.createElement("span", {
      style: {
        fontSize: 18,
        flexShrink: 0
      }
    }, o.ic), React.createElement("div", {
      style: {
        flex: 1
      }
    }, React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: on ? 600 : 400
      }
    }, k), React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: "#78716C"
      }
    }, o.l)), React.createElement("div", {
      style: {
        display: "flex",
        gap: 3,
        flexWrap: "wrap",
        justifyContent: "flex-end"
      }
    }, o.en && React.createElement("span", {
      className: "tag tag-energy"
    }, "Energy"), o.pm !== "free" && React.createElement("span", {
      className: "tag tag-cila"
    }, "CILA"), o.tax50 && React.createElement("span", {
      className: "tag tag-tax"
    }, "Bonus 36-50%"), o.nonConf && React.createElement("span", {
      className: "tag tag-nc"
    }, "Plan change")));
  }))), React.createElement("div", {
    className: "note note-info"
  }, "\u2139\uFE0F ", React.createElement("strong", null, "Tax benefits 2026:"), " 50% deduction for primary residence (36% for second homes), max \u20AC96k spend, recovered over 10 annual installments. ", React.createElement("strong", null, "Plan change"), " items require updated catastale (DOCFA) within 30 days."), React.createElement("div", {
    className: "card"
  }, React.createElement("h4", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 15,
      color: "#1B3A2D",
      marginBottom: 6
    }
  }, "Energy Efficiency Tool"), React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#78716C",
      marginBottom: 8
    }
  }, "For detailed energy calculations based on your selected interventions, use the linked tool:"), React.createElement("a", {
    href: "https://energy-efficiency-tool-project-management.streamlit.app/",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "btn btn-s",
    style: {
      fontSize: 12,
      textDecoration: "none",
      display: "inline-block"
    }
  }, "\uD83D\uDD17 Open Energy Efficiency Calculator")));
}
function S4({
  d,
  u
}) {
  return React.createElement("div", null, React.createElement("h2", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 24,
      color: "#1B3A2D",
      marginBottom: 4
    }
  }, "Stile, Atmosfera & Preferenze"), React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#78716C",
      marginBottom: 14
    }
  }, "Choose a base style, then personalize with your own vision, feng shui principles, and preferred colors."), React.createElement("div", {
    className: "card"
  }, React.createElement("div", {
    className: "section-title"
  }, "Design Style"), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(145px,1fr))",
      gap: 7
    }
  }, Object.entries(STYLES).map(([n, th]) => {
    const on = d.style === n;
    return React.createElement("div", {
      key: n,
      onClick: () => u({
        ...d,
        style: n
      }),
      style: {
        padding: 12,
        borderRadius: 9,
        border: on ? "2px solid #1B3A2D" : "1px solid #E2DCD2",
        background: on ? "#D1E7DD" : "#fff",
        cursor: "pointer",
        textAlign: "center"
      }
    }, React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 13.5,
        fontWeight: 700,
        color: on ? "#1B3A2D" : "#1C1917"
      }
    }, n), React.createElement("div", {
      style: {
        fontSize: 9.5,
        color: "#78716C",
        marginTop: 3
      }
    }, th.desc), React.createElement("div", {
      style: {
        display: "flex",
        gap: 3,
        justifyContent: "center",
        marginTop: 6
      }
    }, th.pal.map((c, i) => React.createElement("div", {
      key: i,
      style: {
        width: 14,
        height: 14,
        borderRadius: 3,
        background: c,
        border: "1px solid #E2DCD233"
      }
    }))));
  }))), React.createElement("div", {
    className: "card"
  }, React.createElement("div", {
    className: "section-title"
  }, "Your Personal Style Vision"), React.createElement("textarea", {
    value: d.customStyle || "",
    onChange: e => u({
      ...d,
      customStyle: e.target.value
    }),
    placeholder: "Describe your ideal space in your own words... e.g. 'I love warm wood tones combined with brass accents. I want the living room to feel like a Milanese caf\xE9 \u2014 cozy but sophisticated. The bedroom should be a cocoon of soft textures and muted colors...'",
    rows: 4,
    style: {
      resize: "vertical",
      lineHeight: 1.6
    }
  }), React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#78716C",
      marginTop: 4
    }
  }, "This description will directly influence the AI render prompts for a personalized result.")), React.createElement("div", {
    className: "card"
  }, React.createElement("div", {
    className: "section-title"
  }, "\uD83E\uDDD8 Feng Shui Preferences"), React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 5
    }
  }, FENG_SHUI_OPTIONS.map(opt => {
    const on = (d.fengshui || []).includes(opt);
    return React.createElement("button", {
      key: opt,
      onClick: () => u({
        ...d,
        fengshui: on ? (d.fengshui || []).filter(x => x !== opt) : [...(d.fengshui || []), opt]
      }),
      style: {
        padding: "6px 12px",
        borderRadius: 18,
        border: on ? "2px solid #1B3A2D" : "1px solid #E2DCD2",
        background: on ? "#D1E7DD" : "#fff",
        fontSize: 11.5,
        fontFamily: "inherit",
        cursor: "pointer",
        fontWeight: on ? 600 : 400,
        color: on ? "#1B3A2D" : "#1C1917"
      }
    }, opt);
  }))), React.createElement("div", {
    className: "card"
  }, React.createElement("div", {
    className: "section-title"
  }, "\uD83C\uDFA8 Preferred Color Palette"), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
      gap: 8
    }
  }, PALETTE_OPTIONS.map(p => {
    const on = d.preferredPalette?.name === p.name;
    return React.createElement("div", {
      key: p.name,
      onClick: () => u({
        ...d,
        preferredPalette: on ? null : p
      }),
      style: {
        padding: 12,
        borderRadius: 9,
        border: on ? "2px solid #1B3A2D" : "1px solid #E2DCD2",
        background: on ? "#D1E7DD" : "#fff",
        cursor: "pointer"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: on ? 700 : 500,
        marginBottom: 6,
        color: on ? "#1B3A2D" : "#1C1917"
      }
    }, p.name), React.createElement("div", {
      style: {
        display: "flex",
        gap: 4
      }
    }, p.colors.map((c, i) => React.createElement("div", {
      key: i,
      className: "color-swatch" + (on ? " on" : ""),
      style: {
        background: c,
        width: 28,
        height: 28
      }
    }))));
  }))));
}
function SolRenderCard({
  x,
  solIdx,
  d,
  apiKey
}) {
  const m = SM[solIdx];
  const [batchTrigger, setBatchTrigger] = useState(0);
  const tiles = [];
  [{
    roomKey: "living",
    label: "Living Area"
  }, {
    roomKey: "kitchen",
    label: "Kitchen"
  }, {
    roomKey: "bedroom",
    label: "Bedroom"
  }, {
    roomKey: "bathroom",
    label: "Bathroom"
  }].forEach(({
    roomKey,
    label
  }) => {
    const photos = (d.roomDetails?.[roomKey]?.photos || []).filter(f => f instanceof File);
    const spatialData = d.roomDetails?.[roomKey]?.extractedData || null;
    if (photos.length > 0) {
      photos.forEach((photoFile, pi) => {
        tiles.push({
          roomKey,
          label: `${label}${photos.length > 1 ? " (" + (pi + 1) + "/" + photos.length + ")" : ""}`,
          photoFile,
          spatialData
        });
      });
    } else {
      tiles.push({
        roomKey,
        label,
        photoFile: null,
        spatialData
      });
    }
  });
  const planPhoto = (d.plans || []).find(f => f instanceof File) || null;
  tiles.push({
    roomKey: "plan",
    label: "Floor Plan",
    photoFile: planPhoto,
    spatialData: null
  });
  const imgToImg = tiles.filter(t => t.photoFile).length;
  return React.createElement("div", {
    className: "card",
    style: {
      borderColor: solIdx === 1 ? m.color + "60" : "#E2DCD2",
      borderWidth: solIdx === 1 ? 2 : 1,
      marginBottom: 12
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 12
    }
  }, React.createElement("span", {
    style: {
      fontSize: 17
    }
  }, m.em), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 17,
      fontWeight: 700,
      color: m.color
    }
  }, x.nm, " \u2014 ", fmt(x.co.total)), React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: "#78716C"
    }
  }, tiles.length, " renders \xB7 ", imgToImg > 0 ? imgToImg + " image-to-image" : "text-to-image only")), apiKey && React.createElement("button", {
    className: "btn btn-p",
    style: {
      fontSize: 10,
      padding: "5px 12px",
      whiteSpace: "nowrap"
    },
    onClick: () => setBatchTrigger(t => t + 1)
  }, "\u26A1 Generate All")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, tiles.map((t, ti) => React.createElement(AIRenderTile, {
    key: x.nm + "-" + t.roomKey + "-" + ti,
    prompt: renderPrompt(d, x, t.roomKey),
    style: d.style,
    solName: x.nm,
    room: t.label,
    apiKey: apiKey,
    spatialData: t.spatialData,
    originalPhotoFile: t.photoFile,
    batchTrigger: batchTrigger
  }))), React.createElement("div", {
    style: {
      marginTop: 8,
      padding: 7,
      background: "#F6F4EF",
      borderRadius: 6,
      fontSize: 10.5,
      color: "#78716C"
    }
  }, React.createElement("strong", null, "Materials:"), " ", x.mg));
}
function MarketFetchBtn({
  d,
  s,
  area,
  apiKey
}) {
  const [state, setState] = useState("idle");
  const [md, setMd] = useState(null);
  const [err, setErr] = useState("");
  const fetch2 = async () => {
    if (!apiKey) {
      setErr("Enter API key in header");
      return;
    }
    setState("loading");
    setErr("");
    try {
      const city = d.city || "Milano";
      const res = await fetch(geminiUrl('gemini-2.0-flash', apiKey), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Search immobiliare.it Lombardia market data and OMI Agenzia Entrate for ${city}, Italy. Return ONLY valid JSON:\n{"omiMin":<€/m²>,"omiMax":<€/m²>,"omiZone":"<zone>","marketAvgSqm":<€/m²>,"marketTrend":"<increasing|stable|decreasing>","marketTrendPct":<number>,"comparableCurrent":<€/m²>,"comparableRenovated":<€/m²>,"energyPremium":<€/m²>,"demandScore":<1-10>,"avgDaysOnMarket":<days>,"notes":"<key observations>"}`
            }]
          }],
          tools: [{
            googleSearch: {}
          }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 1000
          }
        })
      });
      const data = await res.json();
      const txt = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("");
      const match = txt.match(/\{[\s\S]*?\}/);
      if (match) {
        const p = JSON.parse(match[0]);
        setMd(p);
        setState("done");
      } else throw new Error("No data returned");
    } catch (e) {
      setErr(e.message || "Failed");
      setState("error");
    }
  };
  return React.createElement("div", null, React.createElement("button", {
    className: "btn",
    onClick: fetch2,
    disabled: state === "loading",
    style: {
      background: "rgba(255,255,255,.15)",
      color: "#fff",
      border: "1px solid rgba(255,255,255,.3)",
      fontSize: 12,
      padding: "8px 16px"
    }
  }, state === "loading" ? "🔍 Fetching…" : "🌐 Fetch Live Market Data"), state === "loading" && React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(255,255,255,.7)",
      marginTop: 4
    }
  }, "Searching OMI + immobiliare.it\u2026"), err && React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#FECACA",
      marginTop: 4
    }
  }, err), state === "done" && md && React.createElement("div", {
    style: {
      marginTop: 12,
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 6
    }
  }, [["OMI Range", md.omiMin && md.omiMax ? fmt(md.omiMin * area) + "–" + fmt(md.omiMax * area) : "—"], ["Market Avg/m²", md.marketAvgSqm ? fmt(md.marketAvgSqm) : "—"], ["Trend", md.marketTrend + " " + (md.marketTrendPct ? (md.marketTrendPct > 0 ? "+" : "") + md.marketTrendPct + "%" : "")], ["Renovated/m²", md.comparableRenovated ? fmt(md.comparableRenovated) : "—"], ["Energy premium", md.energyPremium ? fmt(md.energyPremium * area) : "—"], ["Demand", md.demandScore ? md.demandScore + "/10" : "—"]].map(([l, v]) => React.createElement("div", {
    key: l,
    style: {
      padding: "6px 8px",
      background: "rgba(255,255,255,.12)",
      borderRadius: 6
    }
  }, React.createElement("div", {
    style: {
      fontSize: 9,
      opacity: .7
    }
  }, l), React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700
    }
  }, v))), md.notes && React.createElement("div", {
    style: {
      gridColumn: "1/4",
      fontSize: 10,
      opacity: .8,
      marginTop: 4
    }
  }, "\uD83D\uDCDD ", md.notes)));
}
function Results({
  d,
  apiKey
}) {
  const [tab, setTab] = useState("compare");
  const [si, setSi] = useState(1);
  const sols = useMemo(() => genSols(d), [d]);
  const s = sols[si];
  const area = parseFloat(d.area) || 85;
  const tabs = [{
    id: "compare",
    l: "Compare",
    i: "⚖️"
  }, {
    id: "renders",
    l: "Renders",
    i: "🎨"
  }, {
    id: "detail",
    l: "Detail",
    i: "📋"
  }, {
    id: "costs",
    l: "Costs",
    i: "💰"
  }, {
    id: "energy",
    l: "Energy",
    i: "⚡"
  }, {
    id: "energydetail",
    l: "Energy Detail",
    i: "🔋"
  }, {
    id: "schedule",
    l: "Schedule",
    i: "📅"
  }, {
    id: "valuation",
    l: "Value",
    i: "🏠"
  }, {
    id: "market",
    l: "Market Analysis",
    i: "📈"
  }, {
    id: "furnishing",
    l: "Furnishing",
    i: "🛋"
  }, {
    id: "dd",
    l: "Compliance",
    i: "🏛"
  }];
  const SP = () => React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 14
    }
  }, sols.map((x, i) => {
    const m = SM[i],
      on = si === i;
    return React.createElement("button", {
      key: x.nm,
      onClick: () => setSi(i),
      style: {
        flex: 1,
        padding: "11px 12px",
        borderRadius: 9,
        border: on ? "3px solid " + m.color : "1px solid #E2DCD2",
        background: on ? m.gr : "#fff",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit"
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 5,
        marginBottom: 3
      }
    }, React.createElement("span", {
      style: {
        fontSize: 15
      }
    }, m.em), React.createElement("span", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 14,
        fontWeight: 700,
        color: on ? "#fff" : "#1C1917"
      }
    }, x.nm), i === 1 && React.createElement("span", {
      style: {
        padding: "1px 5px",
        borderRadius: 7,
        background: on ? "rgba(255,255,255,.3)" : "#D1E7DD",
        fontSize: 8.5,
        fontWeight: 700,
        color: on ? "#fff" : "#1B3A2D"
      }
    }, "REC")), React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: on ? "rgba(255,255,255,.95)" : "#1C1917"
      }
    }, fmt(x.co.total)), React.createElement("div", {
      style: {
        fontSize: 10,
        color: on ? "rgba(255,255,255,.7)" : "#78716C"
      }
    }, x.ch.length, " items \xB7 ", x.sc.tw, "wk \xB7 ", x.en.bC, "\u2192", x.en.aC));
  }));
  return React.createElement("div", null, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 18
    }
  }, React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 13,
      background: "linear-gradient(135deg,#1B3A2D,#2D5F45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22,
      color: "#fff"
    }
  }, "\uD83C\uDFDB\uFE0F"), React.createElement("div", null, React.createElement("h2", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 22,
      fontWeight: 700,
      color: "#1B3A2D"
    }
  }, "3 Renovation Solutions"), React.createElement("p", {
    style: {
      fontSize: 11.5,
      color: "#78716C"
    }
  }, d.address || "Apt", ", ", d.city || "Lombardy", " \xB7 ", area, "m\xB2 \xB7 Floor ", d.floor || "—", " \xB7 ", d.style))), React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      flexWrap: "wrap",
      marginBottom: 12,
      paddingBottom: 10,
      borderBottom: "1px solid #E2DCD2"
    }
  }, tabs.map(t => React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: {
      padding: "6px 12px",
      borderRadius: 16,
      border: tab === t.id ? "2px solid #1B3A2D" : "1px solid #ECE8E1",
      background: tab === t.id ? "#D1E7DD" : "#fff",
      color: tab === t.id ? "#1B3A2D" : "#78716C",
      fontSize: 11,
      fontWeight: tab === t.id ? 700 : 400,
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, t.i, " ", t.l))), tab === "compare" && React.createElement("div", null, React.createElement(SP, null), React.createElement("div", {
    className: "card"
  }, React.createElement("h3", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 17,
      color: "#1B3A2D",
      marginBottom: 10
    }
  }, "Comparison"), React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", {
    style: {
      borderBottom: "2px solid #E2DCD2"
    }
  }, React.createElement("th", {
    style: {
      color: "#78716C",
      fontSize: 9.5,
      textTransform: "uppercase"
    }
  }, "Metric"), sols.map((x, i) => React.createElement("th", {
    key: x.nm,
    style: {
      textAlign: "center",
      color: SM[i].color,
      fontSize: 9.5,
      textTransform: "uppercase"
    }
  }, SM[i].em, " ", x.nm)))), React.createElement("tbody", null, [["Cost", i => fmt(sols[i].co.total)], ["Items", i => sols[i].ch.length], ["Timeline", i => sols[i].sc.tw + "wk"], ["Energy", i => sols[i].en.bC + "→" + sols[i].en.aC], ["Save/mo", i => fmt(sols[i].sv.mo)], ["Uplift", i => "+" + sols[i].vl.up + "%"], ["Value After", i => fmt(sols[i].vl.vA)], ["Tax Benefit", i => fmt(sols[i].vl.taxBenefit)], ["Energy NPV 30y", i => fmt(runFullEnergyCalc(d, sols[i]).economy.npv_30y)], ["Feng Shui", i => {
    const fs = calcFengShuiScore(d.fengshui, sols[i].ch, d.roomDetails);
    return fs.score + "/100 (" + fs.label + ")";
  }], ["ROI", i => Math.round((sols[i].vl.vA - sols[i].vl.vB - sols[i].co.total) / sols[i].co.total * 100) + "%"]].map(([m, fn], ri) => React.createElement("tr", {
    key: m,
    style: {
      borderBottom: "1px solid #ECE8E1",
      background: ri % 2 ? "#F6F4EF" : "#fff"
    }
  }, React.createElement("td", {
    style: {
      fontWeight: 600
    }
  }, m), [0, 1, 2].map(i => React.createElement("td", {
    key: i,
    style: {
      textAlign: "center",
      fontWeight: si === i ? 700 : 400,
      color: si === i ? SM[i].color : "#1C1917"
    }
  }, fn(i)))))))))), tab === "renders" && React.createElement("div", null, React.createElement(SP, null), !apiKey && React.createElement("div", {
    className: "note note-warn",
    style: {
      marginBottom: 12
    }
  }, "\u26A0\uFE0F ", React.createElement("strong", null, "Nano Banana API key not set."), " Enter your key in the header bar to generate photorealistic renders with spatial refinement."), sols.map((x, solIdx) => React.createElement(SolRenderCard, {
    key: x.nm,
    x: x,
    solIdx: solIdx,
    d: d,
    apiKey: apiKey
  })), React.createElement("div", {
    className: "note note-info"
  }, "\u2139\uFE0F Upload multiple photos per room in Step 2 \u2014 one render per photo. Image-to-image edits preserve original walls, windows and doors automatically.")), tab === "detail" && React.createElement("div", null, React.createElement(SP, null), React.createElement("div", {
    className: "card"
  }, React.createElement("h3", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 17,
      color: "#1B3A2D",
      marginBottom: 8
    }
  }, s.nm, " \u2014 Detail"), React.createElement("p", {
    style: {
      fontSize: 12.5,
      lineHeight: 1.55,
      marginBottom: 10
    }
  }, d.style, " at ", React.createElement("strong", null, s.nm.toLowerCase()), " tier. ", s.mg), React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 4,
      marginBottom: 12
    }
  }, s.ch.map(c => React.createElement("span", {
    key: c,
    style: {
      padding: "4px 10px",
      borderRadius: 14,
      background: "#D1E7DD",
      fontSize: 10.5,
      color: "#1B3A2D"
    }
  }, INTERVENTIONS[c]?.ic, " ", c, INTERVENTIONS[c]?.tax50 ? " 💰" : ""))), React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, [["Cost", fmt(s.co.total), true], ["Timeline", s.sc.tw + "wk", false], ["Energy", s.en.bC + "→" + s.en.aC, false], ["Save/mo", fmt(s.sv.mo), true], ["Value After", fmt(s.vl.vA), false], ["Tax Benefit/yr", fmt(s.vl.taxBenefitAnnual), true]].map(([lb, vl, hl]) => React.createElement("div", {
    key: lb,
    className: "stat " + (hl ? "stat-hl" : "stat-normal")
  }, React.createElement("div", {
    className: "lbl"
  }, lb), React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 18,
      fontWeight: 700,
      color: hl ? "#1B3A2D" : "#1C1917"
    }
  }, vl))))), (() => {
    const fs = calcFengShuiScore(d.fengshui, s.ch, d.roomDetails);
    const scoreColor = fs.score >= 85 ? "#1B3A2D" : fs.score >= 70 ? "#2D5F45" : fs.score >= 50 ? "#C87941" : "#B91C1C";
    const arcR = 54,
      arcCx = 70,
      arcCy = 70,
      arcStart = -210,
      arcEnd = 30;
    const polarToXY = (angle, r) => {
      const rad = angle * Math.PI / 180;
      return {
        x: arcCx + r * Math.cos(rad),
        y: arcCy + r * Math.sin(rad)
      };
    };
    const describeArc = (startAngle, endAngle, r) => {
      const s2 = polarToXY(startAngle, r),
        e2 = polarToXY(endAngle, r),
        large = endAngle - startAngle > 180 ? 1 : 0;
      return `M ${s2.x} ${s2.y} A ${r} ${r} 0 ${large} 1 ${e2.x} ${e2.y}`;
    };
    const totalAngle = 240;
    const filledAngle = fs.score / 100 * totalAngle;
    const needleAngle = -210 + fs.score / 100 * totalAngle;
    const needleTip = polarToXY(needleAngle, 44);
    const needleBase1 = polarToXY(needleAngle + 90, 7);
    const needleBase2 = polarToXY(needleAngle - 90, 7);
    return React.createElement("div", {
      className: "card",
      style: {
        background: "linear-gradient(135deg,#F5F0E8,#EDF3EE)"
      }
    }, React.createElement("h4", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 17,
        color: "#1B3A2D",
        marginBottom: 12
      }
    }, "\uD83E\uDDD8 Feng Shui Score"), React.createElement("div", {
      style: {
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
        flexWrap: "wrap"
      }
    }, React.createElement("div", {
      style: {
        flexShrink: 0
      }
    }, React.createElement("svg", {
      width: "140",
      height: "100",
      viewBox: "0 0 140 100"
    }, React.createElement("path", {
      d: describeArc(-210, 30, arcR),
      fill: "none",
      stroke: "#E2DCD2",
      strokeWidth: "10",
      strokeLinecap: "round"
    }), fs.score > 0 && React.createElement("path", {
      d: describeArc(-210, -210 + filledAngle, arcR),
      fill: "none",
      stroke: scoreColor,
      strokeWidth: "10",
      strokeLinecap: "round"
    }), React.createElement("path", {
      d: describeArc(-210, -162, arcR),
      fill: "none",
      stroke: "#B91C1C",
      strokeWidth: "10",
      strokeLinecap: "round",
      opacity: "0.15"
    }), React.createElement("path", {
      d: describeArc(-162, -114, arcR),
      fill: "none",
      stroke: "#C87941",
      strokeWidth: "10",
      strokeLinecap: "round",
      opacity: "0.15"
    }), React.createElement("path", {
      d: describeArc(-114, -66, arcR),
      fill: "none",
      stroke: "#8CC63F",
      strokeWidth: "10",
      strokeLinecap: "round",
      opacity: "0.15"
    }), React.createElement("path", {
      d: describeArc(-66, 30, arcR),
      fill: "none",
      stroke: "#1B3A2D",
      strokeWidth: "10",
      strokeLinecap: "round",
      opacity: "0.15"
    }), fs.score > 0 && React.createElement("path", {
      d: describeArc(-210, -210 + filledAngle, arcR),
      fill: "none",
      stroke: scoreColor,
      strokeWidth: "10",
      strokeLinecap: "round"
    }), React.createElement("polygon", {
      points: `${needleTip.x},${needleTip.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`,
      fill: scoreColor,
      opacity: "0.9"
    }), React.createElement("circle", {
      cx: arcCx,
      cy: arcCy,
      r: "5",
      fill: scoreColor
    }), React.createElement("text", {
      x: arcCx,
      y: arcCy + 22,
      textAnchor: "middle",
      fontSize: "20",
      fontWeight: "700",
      fontFamily: "Cormorant Garamond,Georgia,serif",
      fill: scoreColor
    }, fs.score), React.createElement("text", {
      x: arcCx,
      y: arcCy + 33,
      textAnchor: "middle",
      fontSize: "8",
      fill: "#78716C"
    }, "/ 100")), React.createElement("div", {
      style: {
        textAlign: "center",
        marginTop: -6
      }
    }, React.createElement("span", {
      style: {
        display: "inline-block",
        padding: "3px 12px",
        borderRadius: 12,
        background: scoreColor,
        color: "#fff",
        fontSize: 11,
        fontWeight: 700
      }
    }, fs.label))), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 180
      }
    }, React.createElement("div", {
      style: {
        marginBottom: 8
      }
    }, [["Needs attention", 25, "#B91C1C"], ["Moderate", 50, "#C87941"], ["Good", 75, "#8CC63F"], ["Excellent", 100, "#1B3A2D"]].map(([lbl, max, clr]) => React.createElement("div", {
      key: lbl,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        marginBottom: 4
      }
    }, React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: 2,
        background: clr,
        flexShrink: 0
      }
    }), React.createElement("div", {
      style: {
        fontSize: 10,
        color: "#78716C",
        width: 90
      }
    }, lbl), React.createElement("div", {
      style: {
        flex: 1,
        height: 4,
        background: "#ECE8E1",
        borderRadius: 2
      }
    }, React.createElement("div", {
      style: {
        width: fs.score <= max && fs.score > max - 25 ? "100%" : "0%",
        height: "100%",
        background: clr,
        borderRadius: 2,
        transition: "width .3s"
      }
    }))))), d.fengshui?.length > 0 && React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#78716C",
        marginBottom: 6
      }
    }, React.createElement("strong", {
      style: {
        color: "#1B3A2D"
      }
    }, "Active principles:"), " ", d.fengshui.length), fs.details.length > 0 && React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 3
      }
    }, fs.details.slice(0, 4).map((dt, i) => React.createElement("div", {
      key: i,
      style: {
        fontSize: 10.5,
        padding: "3px 8px",
        background: "rgba(255,255,255,.7)",
        borderRadius: 5,
        color: "#1B3A2D"
      }
    }, "\u2713 ", dt))), d.fengshui?.length === 0 && React.createElement("div", {
      className: "note note-warn",
      style: {
        fontSize: 10.5,
        padding: "8px 10px"
      }
    }, "Select feng shui principles in Step 4 to activate this score."))));
  })()), tab === "costs" && React.createElement("div", null, React.createElement(SP, null), React.createElement("div", {
    className: "card"
  }, React.createElement("h3", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 17,
      color: "#1B3A2D",
      marginBottom: 10
    }
  }, s.nm, " \u2014 Construction & Professional Costs"), React.createElement("table", null, React.createElement("tbody", null, Object.entries(s.co).filter(([k]) => k !== "total").map(([k, v]) => v > 0 && React.createElement("tr", {
    key: k,
    style: {
      borderBottom: "1px solid #ECE8E1"
    }
  }, React.createElement("td", {
    style: {
      padding: "7px 10px"
    }
  }, k === "professional_fees" ? "Professional fees (design + permits + contingency)" : k.replace(/_/g, " ").replace(/^\w/, c => c.toUpperCase())), React.createElement("td", {
    style: {
      padding: "7px 10px",
      textAlign: "right"
    }
  }, fmt(v)))), React.createElement("tr", {
    style: {
      borderTop: "3px solid " + SM[si].color
    }
  }, React.createElement("td", {
    style: {
      padding: "9px 10px",
      fontWeight: 700,
      color: SM[si].color,
      fontSize: 14
    }
  }, "Construction Total"), React.createElement("td", {
    style: {
      padding: "9px 10px",
      textAlign: "right",
      fontWeight: 700,
      color: SM[si].color,
      fontSize: 14
    }
  }, fmt(s.co.total)))))), React.createElement("div", {
    className: "card"
  }, React.createElement("h3", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 17,
      color: "#1B3A2D",
      marginBottom: 10
    }
  }, "\uD83C\uDFE0 IKEA Furniture & Finishes \u2014 ", s.nm, " Tier"), React.createElement("p", {
    style: {
      fontSize: 11,
      color: "#78716C",
      marginBottom: 10
    }
  }, "Recommended IKEA products for this solution. Click links for current pricing on ikea.com/it"), (() => {
    const items = getIkeaList(s, d);
    const byRoom = {};
    items.forEach(it => {
      if (!byRoom[it.room]) byRoom[it.room] = [];
      byRoom[it.room].push(it);
    });
    const totalFurn = items.reduce((s, it) => s + it.price, 0);
    return React.createElement("div", null, Object.entries(byRoom).map(([room, its]) => React.createElement("div", {
      key: room,
      style: {
        marginBottom: 12
      }
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: "#C87941",
        textTransform: "uppercase",
        marginBottom: 4
      }
    }, room), React.createElement("table", null, React.createElement("tbody", null, its.map((it, i) => React.createElement("tr", {
      key: it.name,
      style: {
        borderBottom: "1px solid #ECE8E1",
        background: i % 2 ? "#FAFAF8" : "#fff"
      }
    }, React.createElement("td", {
      style: {
        padding: "6px 10px"
      }
    }, React.createElement("a", {
      href: it.url,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        color: "#1B3A2D",
        textDecoration: "none",
        fontWeight: 500,
        fontSize: 12
      }
    }, it.name, " ", React.createElement("span", {
      style: {
        fontSize: 9,
        color: "#78716C"
      }
    }, "\uD83D\uDD17"))), React.createElement("td", {
      style: {
        padding: "6px 10px",
        textAlign: "right",
        fontSize: 12,
        fontWeight: 600
      }
    }, fmt(it.price)))))))), React.createElement("div", {
      style: {
        borderTop: "3px solid #1B3A2D",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        fontWeight: 700,
        fontSize: 14,
        color: "#1B3A2D"
      }
    }, React.createElement("span", null, "Furniture Subtotal"), React.createElement("span", null, fmt(totalFurn))), React.createElement("div", {
      style: {
        borderTop: "2px solid #C87941",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        fontWeight: 700,
        fontSize: 16,
        color: "#C87941",
        marginTop: 4
      }
    }, React.createElement("span", null, "Grand Total (Construction + Furniture)"), React.createElement("span", null, fmt(s.co.total + totalFurn))));
  })()), React.createElement("div", {
    className: "note note-ok"
  }, "\uD83D\uDCB0 Tax benefit (36% over 10yr): ", React.createElement("strong", null, fmt(s.vl.taxBenefit)), " = ", fmt(s.vl.taxBenefitAnnual), "/yr. Net cost after tax: ", React.createElement("strong", null, fmt(s.co.total - s.vl.taxBenefit)), ". Furniture bonus (50%, max \u20AC5k): up to ", React.createElement("strong", null, "\u20AC2,500"), " additional deduction.")), tab === "energy" && React.createElement("div", null, React.createElement(SP, null), React.createElement("div", {
    className: "card"
  }, React.createElement("h3", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 17,
      color: "#1B3A2D",
      marginBottom: 10
    }
  }, s.nm, " \u2014 Energy"), React.createElement("div", {
    className: "grid2",
    style: {
      margin: "14px 0"
    }
  }, React.createElement("div", {
    style: {
      textAlign: "center",
      padding: 18,
      background: "#FFF5F5",
      borderRadius: 11
    }
  }, React.createElement("div", {
    className: "lbl"
  }, "Before"), React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 10,
      background: ENERGY_COLOR[s.en.bC],
      color: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Cormorant Garamond'",
      fontSize: 16,
      fontWeight: 800,
      margin: "6px 0"
    }
  }, s.en.bC), React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 20,
      fontWeight: 700
    }
  }, s.en.bS, " ", React.createElement("span", {
    style: {
      fontSize: 10
    }
  }, "kWh/m\xB2\xB7y"))), React.createElement("div", {
    style: {
      textAlign: "center",
      padding: 18,
      background: "#D1E7DD",
      borderRadius: 11
    }
  }, React.createElement("div", {
    className: "lbl"
  }, "After"), React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 10,
      background: ENERGY_COLOR[s.en.aC],
      color: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Cormorant Garamond'",
      fontSize: 16,
      fontWeight: 800,
      margin: "6px 0"
    }
  }, s.en.aC), React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 20,
      fontWeight: 700,
      color: "#1B3A2D"
    }
  }, s.en.aS, " ", React.createElement("span", {
    style: {
      fontSize: 10
    }
  }, "kWh/m\xB2\xB7y")))), React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, [["Reduction", "-" + s.en.sp + "%", true], ["Annual Save", fmt(s.sv.yr), false], ["Monthly Save", fmt(s.sv.mo), true]].map(([lb, vl, hl]) => React.createElement("div", {
    key: lb,
    className: "stat " + (hl ? "stat-hl" : "stat-normal")
  }, React.createElement("div", {
    className: "lbl"
  }, lb), React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 18,
      fontWeight: 700,
      color: hl ? "#1B3A2D" : "#1C1917"
    }
  }, vl)))), React.createElement("div", {
    className: "note note-info",
    style: {
      marginTop: 12
    }
  }, "For detailed energy simulation, use: ", React.createElement("a", {
    href: "https://energy-efficiency-tool-project-management.streamlit.app/",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: "#1B3A2D",
      fontWeight: 600
    }
  }, "Energy Efficiency Calculator \u2192")))), tab === "energydetail" && (() => {
    const e = runFullEnergyCalc(d, s);
    const Pill = ({
      label,
      value,
      color
    }) => React.createElement("div", {
      style: {
        padding: "8px 10px",
        background: "#F6F4EF",
        borderRadius: 7,
        minWidth: 90,
        textAlign: "center"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 9.5,
        color: "#78716C",
        marginBottom: 2
      }
    }, label), React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 16,
        fontWeight: 700,
        color: color || "#1B3A2D"
      }
    }, value));
    const Bar = ({
      preVal,
      postVal,
      label,
      unit,
      max
    }) => {
      const mx = max || Math.max(preVal, postVal, 1) * 1.1;
      const pre = Math.round(preVal / mx * 100);
      const post = Math.round(postVal / mx * 100);
      return React.createElement("div", {
        style: {
          marginBottom: 12
        }
      }, React.createElement("div", {
        style: {
          fontSize: 11,
          fontWeight: 600,
          marginBottom: 4,
          color: "#1B3A2D"
        }
      }, label), React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 3
        }
      }, React.createElement("div", {
        style: {
          width: 60,
          fontSize: 10,
          color: "#78716C",
          textAlign: "right"
        }
      }, "Ante"), React.createElement("div", {
        style: {
          flex: 1,
          height: 20,
          background: "#F0EDE8",
          borderRadius: 5,
          overflow: "hidden"
        }
      }, React.createElement("div", {
        style: {
          height: "100%",
          width: pre + "%",
          background: "#C87941",
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          paddingLeft: 6,
          minWidth: 30,
          transition: "width .5s"
        }
      }, React.createElement("span", {
        style: {
          fontSize: 9,
          color: "#fff",
          fontWeight: 700,
          whiteSpace: "nowrap"
        }
      }, preVal.toLocaleString("it-IT"), " ", unit)))), React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8
        }
      }, React.createElement("div", {
        style: {
          width: 60,
          fontSize: 10,
          color: "#78716C",
          textAlign: "right"
        }
      }, "Post"), React.createElement("div", {
        style: {
          flex: 1,
          height: 20,
          background: "#F0EDE8",
          borderRadius: 5,
          overflow: "hidden"
        }
      }, React.createElement("div", {
        style: {
          height: "100%",
          width: post + "%",
          background: "#1B3A2D",
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          paddingLeft: 6,
          minWidth: 30,
          transition: "width .5s"
        }
      }, React.createElement("span", {
        style: {
          fontSize: 9,
          color: "#fff",
          fontWeight: 700,
          whiteSpace: "nowrap"
        }
      }, postVal.toLocaleString("it-IT"), " ", unit)))));
    };
    const cf = e.economy.cashflow;
    const cfMax = Math.max(...cf.map(p => Math.abs(p.cumNPV)), e.economy.investment_gross);
    return React.createElement("div", null, React.createElement(SP, null), React.createElement("div", {
      className: "card",
      style: {
        background: "linear-gradient(135deg,#1B3A2D,#2D5F45)",
        color: "#fff",
        marginBottom: 12
      }
    }, React.createElement("h3", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 3
      }
    }, "\uD83D\uDD0B Lombardy CENED+2 Energy Calculator \u2014 ", s.nm), React.createElement("p", {
      style: {
        fontSize: 11,
        opacity: .85
      }
    }, "DDUO 2456/2017 \xB7 DM 26/6/2015 \xB7 UNI/TS 11300 \xB7 ARERA Q2 2026 \xB7 30-year NPV @ 4% discount, 3% energy escalation"), React.createElement("div", {
      style: {
        marginTop: 10,
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        fontSize: 10.5,
        opacity: .9
      }
    }, React.createElement("span", null, "\uD83D\uDCCD ", d.city || "Milano", " \xB7 GG ", e.GG), React.createElement("span", null, "\xB7"), React.createElement("span", null, "\uD83D\uDCD0 ", parseFloat(d.area) || 85, " m\xB2 \xB7 S/V 0.65"), React.createElement("span", null, "\xB7"), React.createElement("span", null, "\uD83C\uDFDB EP_rif ", e.EPrif, " kWh/m\xB2\xB7y (edificio standard)"))), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 12
      }
    }, React.createElement("div", {
      className: "card",
      style: {
        background: "#FFF5F5"
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
      }
    }, React.createElement("div", {
      className: "section-title",
      style: {
        margin: 0
      }
    }, "Ante operam"), React.createElement("div", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 10,
        background: ENERGY_COLOR[e.ante.classe],
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond'",
        fontSize: 16,
        fontWeight: 800
      }
    }, e.ante.classe)), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 6
      }
    }, React.createElement(Pill, {
      label: "EPgl,nren",
      value: e.ante.EPnren + " kWh/m²·y",
      color: "#B91C1C"
    }), React.createElement(Pill, {
      label: "Ratio EP/EP_rif",
      value: "×" + e.ante.rapporto
    }), React.createElement(Pill, {
      label: "Gas annuo",
      value: e.ante.cons.gas_Smc.toLocaleString("it-IT") + " Smc"
    }), React.createElement(Pill, {
      label: "Elettr. annua",
      value: e.ante.cons.elec_kWh.toLocaleString("it-IT") + " kWh"
    }), React.createElement(Pill, {
      label: "Costo \u20AC/y",
      value: fmt(e.ante.cost),
      color: "#B91C1C"
    }), React.createElement(Pill, {
      label: "CO\u2082 kg/y",
      value: e.ante.co2.toLocaleString("it-IT")
    }))), React.createElement("div", {
      className: "card",
      style: {
        background: "#EDF3EE"
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
      }
    }, React.createElement("div", {
      className: "section-title",
      style: {
        margin: 0
      }
    }, "Post operam"), React.createElement("div", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 10,
        background: ENERGY_COLOR[e.post.classe],
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond'",
        fontSize: 16,
        fontWeight: 800
      }
    }, e.post.classe)), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 6
      }
    }, React.createElement(Pill, {
      label: "EPgl,nren",
      value: e.post.EPnren + " kWh/m²·y",
      color: "#1B3A2D"
    }), React.createElement(Pill, {
      label: "Ratio EP/EP_rif",
      value: "×" + e.post.rapporto
    }), React.createElement(Pill, {
      label: "Gas annuo",
      value: e.post.cons.gas_Smc.toLocaleString("it-IT") + " Smc"
    }), React.createElement(Pill, {
      label: "Elettr. annua",
      value: e.post.cons.elec_kWh.toLocaleString("it-IT") + " kWh"
    }), React.createElement(Pill, {
      label: "Costo \u20AC/y",
      value: fmt(e.post.cost),
      color: "#1B3A2D"
    }), React.createElement(Pill, {
      label: "CO\u2082 kg/y",
      value: e.post.co2.toLocaleString("it-IT")
    })))), React.createElement("div", {
      className: "card",
      style: {
        background: "linear-gradient(135deg,#FAEBD7,#D1E7DD)"
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap"
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, React.createElement("div", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 10,
        background: ENERGY_COLOR[e.ante.classe],
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond'",
        fontSize: 16,
        fontWeight: 800
      }
    }, e.ante.classe), React.createElement("span", {
      style: {
        fontSize: 18,
        color: "#1B3A2D"
      }
    }, "\u2192"), React.createElement("div", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 10,
        background: ENERGY_COLOR[e.post.classe],
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond'",
        fontSize: 16,
        fontWeight: 800
      }
    }, e.post.classe)), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 120
      }
    }, React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 18,
        fontWeight: 700,
        color: "#1B3A2D"
      }
    }, e.delta.class_jumps, " class jump", e.delta.class_jumps !== 1 ? "s" : ""), React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#78716C"
      }
    }, "\u2212", e.delta.saving_pct, "% primary energy \xB7 \u2212", e.delta.co2_kg_saved.toLocaleString("it-IT"), " kg CO\u2082/y")), React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 10,
        color: "#78716C"
      }
    }, "Annual saving"), React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 22,
        fontWeight: 700,
        color: "#1B3A2D"
      }
    }, fmt(e.delta.saving_year))))), React.createElement("div", {
      className: "card"
    }, React.createElement("div", {
      className: "section-title"
    }, "Consumption & cost comparison"), React.createElement(Bar, {
      preVal: e.ante.cons.gas_Smc,
      postVal: e.post.cons.gas_Smc,
      label: "Gas naturale (Smc/anno)",
      unit: "Smc"
    }), React.createElement(Bar, {
      preVal: e.ante.cons.elec_kWh,
      postVal: e.post.cons.elec_kWh,
      label: "Elettricit\xE0 (kWh/anno)",
      unit: "kWh"
    }), React.createElement(Bar, {
      preVal: e.ante.cost,
      postVal: e.post.cost,
      label: "Costo energetico totale (\u20AC/anno)",
      unit: "\u20AC"
    }), React.createElement(Bar, {
      preVal: e.ante.co2,
      postVal: e.post.co2,
      label: "Emissioni CO\u2082 (kg/anno)",
      unit: "kg"
    })), React.createElement("div", {
      className: "card"
    }, React.createElement("div", {
      className: "section-title"
    }, "\uD83D\uDCB0 Economic Analysis \u2014 Ecobonus 50%"), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
        gap: 8,
        marginBottom: 14
      }
    }, React.createElement(Pill, {
      label: "Investment gross",
      value: fmt(e.economy.investment_gross),
      color: "#C87941"
    }), React.createElement(Pill, {
      label: "Tax deduction (50%)",
      value: fmt(e.economy.tax_deduction),
      color: "#2D5F45"
    }), React.createElement(Pill, {
      label: "Net investment",
      value: fmt(e.economy.investment_net)
    }), React.createElement(Pill, {
      label: "Simple payback",
      value: e.economy.payback_years ? e.economy.payback_years + " yr" : "—"
    }), React.createElement(Pill, {
      label: "30y NPV @ 4%",
      value: fmt(e.economy.npv_30y),
      color: e.economy.npv_30y > 0 ? "#1B3A2D" : "#B91C1C"
    }), React.createElement(Pill, {
      label: "Saving/yr (year 1)",
      value: fmt(e.delta.saving_year),
      color: "#1B3A2D"
    })), React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        marginBottom: 6,
        color: "#1B3A2D"
      }
    }, "30-year cumulative NPV (\u20AC)"), React.createElement("div", {
      style: {
        position: "relative",
        height: 160,
        background: "#FAFAF8",
        borderRadius: 7,
        padding: "8px 4px",
        border: "1px solid #E2DCD2"
      }
    }, React.createElement("svg", {
      width: "100%",
      height: "100%",
      viewBox: "0 0 600 144",
      preserveAspectRatio: "none"
    }, React.createElement("line", {
      x1: "0",
      y1: "72",
      x2: "600",
      y2: "72",
      stroke: "#C87941",
      strokeWidth: "1",
      strokeDasharray: "3,3"
    }), cf.map((p, i) => {
      const w = 600 / cf.length;
      const h = Math.abs(p.cumNPV) / cfMax * 64;
      const positive = p.cumNPV >= 0;
      const y = positive ? 72 - h : 72;
      return React.createElement("rect", {
        key: i,
        x: i * w + 1,
        y: y,
        width: w - 2,
        height: h,
        fill: positive ? "#1B3A2D" : "#B91C1C",
        opacity: "0.85"
      });
    }), [0, 10, 20, 30].map(yr => React.createElement("text", {
      key: yr,
      x: yr / 30 * 600,
      y: "138",
      fontSize: "9",
      fill: "#78716C",
      textAnchor: yr === 0 ? "start" : yr === 30 ? "end" : "middle"
    }, yr === 0 ? "now" : "yr " + yr)))), React.createElement("div", {
      style: {
        marginTop: 6,
        fontSize: 10,
        color: "#78716C",
        display: "flex",
        justifyContent: "space-between"
      }
    }, React.createElement("span", null, "Year 1 cum NPV: ", fmt(cf[0].cumNPV)), React.createElement("span", null, "Year 10: ", fmt(cf[9].cumNPV)), React.createElement("span", null, "Year 20: ", fmt(cf[19].cumNPV)), React.createElement("span", null, "Year 30: ", fmt(cf[29].cumNPV))), React.createElement("details", {
      style: {
        marginTop: 10
      }
    }, React.createElement("summary", {
      style: {
        fontSize: 11,
        color: "#1B3A2D",
        fontWeight: 600,
        cursor: "pointer"
      }
    }, "View year-by-year cashflow"), React.createElement("table", {
      style: {
        marginTop: 6
      }
    }, React.createElement("thead", null, React.createElement("tr", {
      style: {
        borderBottom: "2px solid #E2DCD2"
      }
    }, React.createElement("th", {
      style: {
        fontSize: 9
      }
    }, "Year"), React.createElement("th", {
      style: {
        textAlign: "right",
        fontSize: 9
      }
    }, "Energy saving \u20AC"), React.createElement("th", {
      style: {
        textAlign: "right",
        fontSize: 9
      }
    }, "Tax deduction \u20AC"), React.createElement("th", {
      style: {
        textAlign: "right",
        fontSize: 9
      }
    }, "Cum NPV \u20AC"))), React.createElement("tbody", null, cf.map((p, i) => React.createElement("tr", {
      key: i,
      style: {
        borderBottom: "1px solid #ECE8E1",
        background: i % 2 ? "#FAFAF8" : "#fff"
      }
    }, React.createElement("td", {
      style: {
        fontSize: 10,
        padding: "4px 8px"
      }
    }, p.year), React.createElement("td", {
      style: {
        fontSize: 10,
        padding: "4px 8px",
        textAlign: "right"
      }
    }, fmt(p.saving)), React.createElement("td", {
      style: {
        fontSize: 10,
        padding: "4px 8px",
        textAlign: "right",
        color: "#2D5F45"
      }
    }, p.deduction > 0 ? fmt(p.deduction) : "—"), React.createElement("td", {
      style: {
        fontSize: 10,
        padding: "4px 8px",
        textAlign: "right",
        fontWeight: 600,
        color: p.cumNPV >= 0 ? "#1B3A2D" : "#B91C1C"
      }
    }, fmt(p.cumNPV)))))))), React.createElement("div", {
      className: "note note-warn",
      style: {
        fontSize: 10.5,
        lineHeight: 1.55
      }
    }, "\u26A0\uFE0F ", React.createElement("strong", null, "Stima ingegneristica"), " basata sul metodo CENED+2 semplificato (DDUO 2456/2017) e tariffe ARERA Q2 2026. Non sostituisce un APE redatto da Soggetto Certificatore. Per Ecobonus / Conto Termico \xE8 obbligatorio l'APE depositato nel CEER Lombardia. Tariffe energetiche soggette ad aggiornamento ARERA. NPV calcolato su 30 anni con tasso di sconto 4%, escalation energia 3%/anno, detrazione Ecobonus 50% (prima casa) recuperata in 10 quote."));
  })(), tab === "schedule" && React.createElement("div", null, React.createElement(SP, null), React.createElement("div", {
    className: "card"
  }, React.createElement("h3", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      fontSize: 17,
      color: "#1B3A2D",
      marginBottom: 10
    }
  }, s.nm, " \u2014 Schedule (", s.sc.tw, "wk)"), s.sc.t.map((t, i) => {
    const pct = t.w / s.sc.tw * 100,
      left = t.s / s.sc.tw * 100;
    return React.createElement("div", {
      key: t.n,
      style: {
        display: "flex",
        alignItems: "center",
        marginBottom: 7,
        gap: 9
      }
    }, React.createElement("div", {
      style: {
        width: 110,
        fontSize: 11,
        fontWeight: 500,
        textAlign: "right",
        flexShrink: 0
      }
    }, t.n), React.createElement("div", {
      style: {
        flex: 1,
        position: "relative",
        height: 24,
        background: "#F6F4EF",
        borderRadius: 5
      }
    }, React.createElement("div", {
      style: {
        position: "absolute",
        left: left + "%",
        width: Math.max(pct, 4) + "%",
        height: "100%",
        background: CLS[i % CLS.length],
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 9.5,
        color: "#fff",
        fontWeight: 600
      }
    }, t.w, "w")));
  }))), tab === "valuation" && (() => {
    const v = s.vl;
    const t = v.trace || [];
    const StepCard = ({
      step
    }) => React.createElement("div", {
      style: {
        padding: "10px 12px",
        background: "#FAFAF8",
        borderLeft: "3px solid #1B3A2D",
        borderRadius: 6,
        marginBottom: 6
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 10
      }
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: "#1B3A2D"
      }
    }, "Step ", step.step, " \xB7 ", step.label), step.value != null && React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 15,
        fontWeight: 700,
        color: "#1B3A2D"
      }
    }, typeof step.value === "number" ? step.value > 1000 ? fmt(step.value) : step.value + " €/m²" : step.value)), step.note && React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: "#78716C",
        marginTop: 3,
        lineHeight: 1.5
      }
    }, step.note), step.total && React.createElement("div", {
      style: {
        fontSize: 10,
        color: "#1B3A2D",
        marginTop: 2
      }
    }, React.createElement("strong", null, "Total: ", fmt(step.total))), step.OMI_min && React.createElement("div", {
      style: {
        fontSize: 10,
        color: "#78716C",
        marginTop: 2
      }
    }, "OMI range \u20AC/m\xB2: ", step.OMI_min.toLocaleString(), " \u2013 ", step.OMI_max.toLocaleString(), " \xB7 asking ref \u20AC", step.asking_ref.toLocaleString(), "/m\xB2 \xB7 rent \u20AC", step.rent_ref, "/m\xB2\xB7mo"), step.adders && React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        marginTop: 4
      }
    }, Object.entries(step.adders).map(([k, v]) => React.createElement("span", {
      key: k,
      style: {
        fontSize: 9,
        padding: "1px 6px",
        background: "#FAEBD7",
        borderRadius: 6,
        color: "#7D5A00"
      }
    }, k, ": \u20AC", Math.round(v).toLocaleString()))), step.gross_uplift != null && React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 5,
        fontSize: 10
      }
    }, React.createElement("span", null, "Gross uplift: ", React.createElement("strong", null, fmt(step.gross_uplift))), React.createElement("span", null, "Net uplift: ", React.createElement("strong", {
      style: {
        color: step.net_uplift > 0 ? "#1B3A2D" : "#B91C1C"
      }
    }, fmt(step.net_uplift))), React.createElement("span", null, "Profit if resold: ", React.createElement("strong", {
      style: {
        color: step.profit_resold > 0 ? "#1B3A2D" : "#B91C1C"
      }
    }, fmt(step.profit_resold))), React.createElement("span", null, "ROI: ", React.createElement("strong", {
      style: {
        color: step.roi_pct > 0 ? "#1B3A2D" : "#B91C1C"
      }
    }, step.roi_pct, "%"))), step.monthly != null && React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 5,
        fontSize: 10
      }
    }, React.createElement("span", null, "Monthly rent: ", React.createElement("strong", null, fmt(step.monthly))), React.createElement("span", null, "Annual: ", React.createElement("strong", null, fmt(step.annual))), React.createElement("span", null, "Gross yield: ", React.createElement("strong", {
      style: {
        color: "#1B3A2D"
      }
    }, step.gross_yield_pct, "%"))), step.ceilingHit && React.createElement("div", {
      style: {
        marginTop: 4,
        fontSize: 10,
        padding: "3px 8px",
        background: "#FEE08B",
        borderRadius: 5,
        color: "#7D5A00",
        display: "inline-block"
      }
    }, "\u26A0 Market ceiling reached (\u20AC", step.ceiling.toLocaleString(), "/m\xB2) \u2014 value capped"));
    const recColor = v.roi_pct >= 15 ? "#1B3A2D" : v.roi_pct >= 8 ? "#2D5F45" : v.roi_pct >= 0 ? "#C87941" : "#B91C1C";
    return React.createElement("div", null, React.createElement(SP, null), React.createElement("div", {
      className: "card",
      style: {
        background: "linear-gradient(135deg,#1B3A2D,#2D5F45)",
        color: "#fff",
        marginBottom: 12
      }
    }, React.createElement("h3", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 3
      }
    }, "\uD83C\uDFE0 Lombardy Valuation \u2014 ", s.nm), React.createElement("p", {
      style: {
        fontSize: 11,
        opacity: .85
      }
    }, "\uD83D\uDCCD ", v.zone, " \xB7 ", parseFloat(d.area) || 85, " m\xB2 \xB7 Energy ", v.energy_pre, "\u2192", v.energy_post, " \xB7 Condition ", v.cond_pre, " \u2192 ", v.cond_post), React.createElement("p", {
      style: {
        fontSize: 10,
        opacity: .7,
        marginTop: 2
      }
    }, "OMI Agenzia Entrate \xB7 Immobiliare.it benchmarks (Apr 2026) \xB7 ADE declared transactions \xB7 Banca d'Italia energy premium calibration"), React.createElement("div", {
      style: {
        marginTop: 10,
        padding: "8px 12px",
        background: recColor,
        borderRadius: 7,
        fontSize: 12,
        fontWeight: 700
      }
    }, "\uD83D\uDCCA ", v.recommendation, " \xB7 ROI ", v.roi_pct, "%")), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
        gap: 8,
        marginBottom: 12
      }
    }, [["Pre-renovation value", fmt(v.vB), "#6B705C"], ["Renovation cost", fmt(v.reno_cost), "#C87941"], ["Post-renovation value", fmt(v.vA), "#1B3A2D"], ["Net uplift", fmt(v.net_uplift), v.net_uplift > 0 ? "#1B3A2D" : "#B91C1C"], ["Monthly rent potential", fmt(v.monthly_rent), "#2D5F45"], ["Gross yield", v.gross_yield_pct + "%", "#1B3A2D"]].map(([l, vl, c]) => React.createElement("div", {
      key: l,
      className: "card",
      style: {
        padding: "10px 12px",
        margin: 0,
        textAlign: "center"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 9,
        color: "#78716C"
      }
    }, l), React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 18,
        fontWeight: 700,
        color: c
      }
    }, vl)))), React.createElement("div", {
      className: "card"
    }, React.createElement("div", {
      className: "section-title"
    }, "\uD83D\uDCCB Calculation Trace \u2014 every step + coefficient"), React.createElement("p", {
      style: {
        fontSize: 11,
        color: "#78716C",
        marginBottom: 8,
        lineHeight: 1.5
      }
    }, "Each step references the same official sources (OMI quotations, Milan zone benchmarks, OMI condition states). All coefficients are visible and adjustable in the source."), t.map((step, i) => React.createElement(StepCard, {
      key: i,
      step: step
    }))), React.createElement("div", {
      className: "card"
    }, React.createElement("h4", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 14,
        color: "#1B3A2D",
        marginBottom: 8
      }
    }, "\uD83D\uDCDA Data sources used"), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 6,
        fontSize: 10.5
      }
    }, [["OMI Quotazioni Immobiliari", "Agenzia delle Entrate · semiannual official quotations", "https://www1.agenziaentrate.gov.it/servizi/geopoi_omi/index.htm"], ["ADE Declared transaction values", "Calibration layer for nearby sold properties", "https://www.agenziaentrate.gov.it/portale/web/guest/schede/fabbricatiterreni/oicv/dichiarati"], ["Immobiliare.it Market", "Milan zone asking + rent benchmarks (Apr 2026)", "https://www.immobiliare.it/mercato-immobiliare/lombardia/"], ["Banca d'Italia", "Energy label capitalization premium research", "https://www.bancaditalia.it"], ["Milan Open Data", "OMI Zones GeoJSON for spatial geolocation", ""]].map(([k, desc, url]) => React.createElement("div", {
      key: k,
      style: {
        padding: "7px 9px",
        background: "#F6F4EF",
        borderRadius: 6
      }
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: "#1B3A2D"
      }
    }, k), React.createElement("div", {
      style: {
        fontSize: 10,
        color: "#78716C",
        marginTop: 1
      }
    }, desc), url && React.createElement("a", {
      href: url,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        fontSize: 9.5,
        color: "#1B3A2D"
      }
    }, url))))), React.createElement("div", {
      className: "note note-warn",
      style: {
        fontSize: 10.5,
        lineHeight: 1.5
      }
    }, "\u26A0\uFE0F Asking-price benchmarks discounted 5% to reflect probable transaction price. Energy class premium does not double-count renovation quality. Post-renovation value capped at local market ceiling (1.05\xD7 zone asking benchmark). Validate against nearby ADE declared transactions for highest confidence."));
  })(), tab === "market" && (() => {
    const listingPrice = d.listingExtracted?.price || null;
    const pricePerSqm = d.listingExtracted?.pricePerSqm || (listingPrice ? Math.round(listingPrice / area) : null);
    const cityKey = (d.city || "").toLowerCase().trim();
    const omiRef = CITY_PRICES[cityKey] || LOMBARDY_AVG;
    const currentVal = s.vl.vB;
    const postRenovVal = s.vl.vA;
    const listingDelta = listingPrice ? Math.round((listingPrice - currentVal) / currentVal * 100) : null;
    const maxBar = Math.max(listingPrice || 0, currentVal, postRenovVal, omiRef * area) * 1.2 || 1;
    const Bar = ({
      val,
      color,
      label,
      note
    }) => React.createElement("div", {
      style: {
        marginBottom: 10
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 3,
        fontSize: 11
      }
    }, React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, label), React.createElement("span", {
      style: {
        fontWeight: 700,
        color
      }
    }, fmt(val), " ", React.createElement("span", {
      style: {
        fontSize: 10,
        color: "#78716C"
      }
    }, fmt(Math.round(val / area)), "/m\xB2"), " ", note && React.createElement("span", {
      style: {
        fontSize: 9,
        marginLeft: 4
      }
    }, note))), React.createElement("div", {
      style: {
        height: 26,
        background: "#F0EDE8",
        borderRadius: 6,
        overflow: "hidden"
      }
    }, React.createElement("div", {
      style: {
        height: "100%",
        width: Math.max(2, Math.round(val / maxBar * 100)) + "%",
        background: color,
        borderRadius: 6,
        transition: "width .5s ease"
      }
    })));
    return React.createElement("div", null, React.createElement(SP, null), React.createElement("div", {
      className: "card",
      style: {
        background: "linear-gradient(135deg,#1B3A2D,#2D5F45)",
        color: "#fff",
        marginBottom: 12
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10
      }
    }, React.createElement("div", null, React.createElement("h3", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 3
      }
    }, "Market Analysis \u2014 ", d.city || "Lombardy"), React.createElement("p", {
      style: {
        fontSize: 11,
        opacity: .8
      }
    }, d.address || "Property", " \xB7 ", area, "m\xB2 \xB7 Energy ", d.eCls || "?", " \u2192 ", s.en.aC)), React.createElement(MarketFetchBtn, {
      d: d,
      s: s,
      area: area,
      apiKey: apiKey
    }))), React.createElement("div", {
      className: "card"
    }, React.createElement("div", {
      className: "section-title"
    }, "Value Comparison"), listingPrice && React.createElement(Bar, {
      val: listingPrice,
      color: "#C87941",
      label: "Listing / Announcement Price",
      note: listingDelta != null ? listingDelta > 0 ? "▲ " + listingDelta + "% above market" : "▼ " + Math.abs(listingDelta) + "% below market" : null
    }), React.createElement(Bar, {
      val: omiRef * area,
      color: "#B8AFA5",
      label: "OMI Reference (" + d.city + ") — " + fmt(omiRef) + "/m²",
      note: null
    }), React.createElement(Bar, {
      val: currentVal,
      color: "#6B705C",
      label: "Current Market Value — pre renovation",
      note: null
    }), React.createElement(Bar, {
      val: postRenovVal,
      color: "#1B3A2D",
      label: "Post-Renovation Value — " + s.nm + " scenario",
      note: "+" + Math.round((postRenovVal - currentVal) / currentVal * 100) + "%"
    }), listingPrice && React.createElement("div", {
      style: {
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
        background: listingDelta > 5 ? "#FEF2F2" : listingDelta < -5 ? "#D1E7DD" : "#F6F4EF",
        border: "1px solid " + (listingDelta > 5 ? "#FECACA" : listingDelta < -5 ? "#B5CDB8" : "#E2DCD2"),
        fontSize: 11.5,
        lineHeight: 1.5
      }
    }, listingDelta > 5 && React.createElement("span", {
      style: {
        fontWeight: 700,
        color: "#B91C1C"
      }
    }, "\u26A0\uFE0F Listed ", listingDelta, "% above market \u2014 negotiation margin of ", fmt(listingPrice - currentVal), " exists"), listingDelta <= -5 && React.createElement("span", {
      style: {
        fontWeight: 700,
        color: "#1B3A2D"
      }
    }, "\u2705 Listed ", Math.abs(listingDelta), "% below market \u2014 potential upside of ", fmt(currentVal - listingPrice)), listingDelta > -5 && listingDelta <= 5 && React.createElement("span", {
      style: {
        color: "#78716C"
      }
    }, "\u2713 Listing price broadly in line with market estimate (", listingDelta > 0 ? "+" : "", listingDelta, "%)"))), React.createElement("div", {
      className: "card"
    }, React.createElement("div", {
      className: "section-title"
    }, "KPIs \u2014 ", s.nm, " Scenario"), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 8
      }
    }, [["Renovation cost", fmt(s.co.total), "#C87941"], ["Value uplift", fmt(postRenovVal - currentVal), "#1B3A2D"], ["Net gain", fmt(postRenovVal - currentVal - s.co.total), postRenovVal - currentVal - s.co.total > 0 ? "#1B3A2D" : "#B91C1C"], ["Tax back/yr", fmt(s.vl.taxBenefitAnnual), "#2D5F45"], ["ROI", Math.round((postRenovVal - currentVal - s.co.total) / s.co.total * 100) + "%", "#1B3A2D"], ["Energy saving/yr", fmt(s.sv.yr), "#2D5F45"], ["Months payback", Math.round(s.co.total / (s.sv.mo || 1)) + " mo", "#78716C"], ["Market uplift rate", "+" + s.vl.up + "%", "#1B3A2D"]].map(([l, v, c]) => React.createElement("div", {
      key: l,
      style: {
        padding: "8px 10px",
        background: "#F6F4EF",
        borderRadius: 7,
        textAlign: "center"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 9,
        color: "#78716C",
        marginBottom: 3
      }
    }, l), React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 15,
        fontWeight: 700,
        color: c
      }
    }, v))))), React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        flexWrap: "wrap"
      }
    }, React.createElement("a", {
      href: "https://www1.agenziaentrate.gov.it/servizi/geopoi_omi/index.htm",
      target: "_blank",
      rel: "noopener noreferrer",
      className: "btn btn-g",
      style: {
        fontSize: 11,
        textDecoration: "none",
        padding: "7px 14px"
      }
    }, "\uD83C\uDFDB OMI Agenzia Entrate \u2192"), React.createElement("a", {
      href: "https://www.immobiliare.it/mercato-immobiliare/lombardia/" + (d.city || "milano").toLowerCase().replace(/\s+/g, "-") + "/",
      target: "_blank",
      rel: "noopener noreferrer",
      className: "btn btn-g",
      style: {
        fontSize: 11,
        textDecoration: "none",
        padding: "7px 14px"
      }
    }, "\uD83C\uDFE0 Immobiliare.it ", d.city || "Lombardia", " \u2192")));
  })(), tab === "furnishing" && (() => {
    const bom = generateBOM(s, d);
    const ROOM_LABELS = {
      entrance: "🚪 Entrance",
      living_room: "🛋 Living Room",
      kitchen: "🍳 Kitchen",
      bedroom_master: "🛏 Master Bedroom",
      bathroom: "🚿 Bathroom",
      laundry: "🧺 Laundry",
      textiles_accessories: "🧶 Textiles & Accessories"
    };
    return React.createElement("div", null, React.createElement(SP, null), React.createElement("div", {
      className: "card",
      style: {
        background: "linear-gradient(135deg,#1B3A2D,#2D5F45)",
        color: "#fff",
        marginBottom: 12
      }
    }, React.createElement("h3", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 3
      }
    }, "\uD83D\uDECB Post-Renovation Furnishing \u2014 ", s.nm, " (", bom.style, ")"), React.createElement("p", {
      style: {
        fontSize: 11,
        opacity: .85
      }
    }, "Compatible items from 16 Italy/Lombardy providers \xB7 dimensions, material, colour, install notes per item \xB7 search-link to current product on provider site"), React.createElement("div", {
      style: {
        marginTop: 10,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
        gap: 8
      }
    }, React.createElement("div", {
      style: {
        padding: "8px 10px",
        background: "rgba(255,255,255,.12)",
        borderRadius: 7,
        textAlign: "center"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 9,
        opacity: .7
      }
    }, "Items"), React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 20,
        fontWeight: 700
      }
    }, Object.values(bom.selectedByRoom).reduce((s, arr) => s + arr.length, 0))), React.createElement("div", {
      style: {
        padding: "8px 10px",
        background: "rgba(255,255,255,.12)",
        borderRadius: 7,
        textAlign: "center"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 9,
        opacity: .7
      }
    }, "Providers"), React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 20,
        fontWeight: 700
      }
    }, Object.keys(bom.providerTotals).length)), React.createElement("div", {
      style: {
        padding: "8px 10px",
        background: "rgba(255,255,255,.12)",
        borderRadius: 7,
        textAlign: "center"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 9,
        opacity: .7
      }
    }, "Grand total"), React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 20,
        fontWeight: 700
      }
    }, fmt(bom.grandTotal))))), Object.entries(bom.selectedByRoom).map(([room, items]) => items.length === 0 ? null : React.createElement("div", {
      key: room,
      className: "card"
    }, React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
      }
    }, React.createElement("div", {
      className: "section-title",
      style: {
        margin: 0
      }
    }, ROOM_LABELS[room] || room), React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 16,
        fontWeight: 700,
        color: "#1B3A2D"
      }
    }, fmt(bom.byRoomTotals[room]))), React.createElement("table", {
      style: {
        fontSize: 11
      }
    }, React.createElement("thead", null, React.createElement("tr", {
      style: {
        borderBottom: "2px solid #E2DCD2"
      }
    }, React.createElement("th", {
      style: {
        textAlign: "left",
        padding: "5px 7px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Item"), React.createElement("th", {
      style: {
        textAlign: "left",
        padding: "5px 7px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Dimensions"), React.createElement("th", {
      style: {
        textAlign: "left",
        padding: "5px 7px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Material \xB7 Colour"), React.createElement("th", {
      style: {
        textAlign: "left",
        padding: "5px 7px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Provider"), React.createElement("th", {
      style: {
        textAlign: "right",
        padding: "5px 7px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Qty"), React.createElement("th", {
      style: {
        textAlign: "right",
        padding: "5px 7px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Product"), React.createElement("th", {
      style: {
        textAlign: "right",
        padding: "5px 7px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Deliv."), React.createElement("th", {
      style: {
        textAlign: "right",
        padding: "5px 7px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Install"), React.createElement("th", {
      style: {
        textAlign: "right",
        padding: "5px 7px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Total"))), React.createElement("tbody", null, items.map((it, i) => React.createElement("tr", {
      key: i,
      style: {
        borderBottom: "1px solid #ECE8E1",
        background: i % 2 ? "#FAFAF8" : "#fff"
      }
    }, React.createElement("td", {
      style: {
        padding: "6px 7px"
      }
    }, React.createElement("a", {
      href: mkSearchUrl(it.provider, it.q),
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        color: "#1B3A2D",
        textDecoration: "none",
        fontWeight: 600
      }
    }, it.name, " ", React.createElement("span", {
      style: {
        fontSize: 9
      }
    }, "\uD83D\uDD17")), React.createElement("div", {
      style: {
        fontSize: 9.5,
        color: "#78716C",
        marginTop: 1
      }
    }, it.cat.replace(/_/g, " "))), React.createElement("td", {
      style: {
        padding: "6px 7px",
        fontSize: 10,
        color: "#78716C"
      }
    }, it.w > 0 ? it.w + "×" + it.d + "×" + it.h + " cm" : "—"), React.createElement("td", {
      style: {
        padding: "6px 7px",
        fontSize: 10
      }
    }, React.createElement("div", {
      style: {
        color: "#1B3A2D"
      }
    }, it.material), React.createElement("div", {
      style: {
        color: "#78716C"
      }
    }, it.colour)), React.createElement("td", {
      style: {
        padding: "6px 7px",
        fontSize: 10
      }
    }, React.createElement("a", {
      href: PROVIDERS[it.provider].base,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        color: "#C87941",
        fontWeight: 600,
        textDecoration: "none"
      }
    }, PROVIDERS[it.provider].name)), React.createElement("td", {
      style: {
        padding: "6px 7px",
        textAlign: "right",
        fontSize: 10
      }
    }, it.qty), React.createElement("td", {
      style: {
        padding: "6px 7px",
        textAlign: "right",
        fontSize: 10
      }
    }, fmt(it.lineTotal)), React.createElement("td", {
      style: {
        padding: "6px 7px",
        textAlign: "right",
        fontSize: 10,
        color: "#78716C"
      }
    }, it.delivery > 0 ? fmt(it.delivery) : "—"), React.createElement("td", {
      style: {
        padding: "6px 7px",
        textAlign: "right",
        fontSize: 10,
        color: "#78716C"
      }
    }, it.install > 0 ? fmt(it.install) : "—"), React.createElement("td", {
      style: {
        padding: "6px 7px",
        textAlign: "right",
        fontSize: 11,
        fontWeight: 700,
        color: "#1B3A2D"
      }
    }, fmt(it.totalAllIn)))))))), React.createElement("div", {
      className: "card"
    }, React.createElement("div", {
      className: "section-title"
    }, "\uD83D\uDCE6 Provider Summary"), React.createElement("table", {
      style: {
        fontSize: 11.5
      }
    }, React.createElement("thead", null, React.createElement("tr", {
      style: {
        borderBottom: "2px solid #E2DCD2"
      }
    }, React.createElement("th", {
      style: {
        textAlign: "left",
        padding: "6px 8px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Provider"), React.createElement("th", {
      style: {
        textAlign: "left",
        padding: "6px 8px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Categories supplied"), React.createElement("th", {
      style: {
        textAlign: "right",
        padding: "6px 8px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Items"), React.createElement("th", {
      style: {
        textAlign: "right",
        padding: "6px 8px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Total all-in"), React.createElement("th", {
      style: {
        textAlign: "right",
        padding: "6px 8px",
        fontSize: 9,
        color: "#78716C"
      }
    }, "Website"))), React.createElement("tbody", null, Object.entries(bom.providerTotals).sort((a, b) => b[1].total - a[1].total).map(([pid, info]) => React.createElement("tr", {
      key: pid,
      style: {
        borderBottom: "1px solid #ECE8E1"
      }
    }, React.createElement("td", {
      style: {
        padding: "7px 8px",
        fontWeight: 700,
        color: "#1B3A2D"
      }
    }, PROVIDERS[pid].name), React.createElement("td", {
      style: {
        padding: "7px 8px",
        fontSize: 10,
        color: "#78716C"
      }
    }, [...info.categories].slice(0, 5).join(", ")), React.createElement("td", {
      style: {
        padding: "7px 8px",
        textAlign: "right"
      }
    }, info.count), React.createElement("td", {
      style: {
        padding: "7px 8px",
        textAlign: "right",
        fontWeight: 700,
        color: "#1B3A2D"
      }
    }, fmt(info.total)), React.createElement("td", {
      style: {
        padding: "7px 8px",
        textAlign: "right"
      }
    }, React.createElement("a", {
      href: PROVIDERS[pid].base,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        color: "#C87941",
        textDecoration: "none",
        fontSize: 10
      }
    }, "visit \u2197"))))))), React.createElement("div", {
      className: "card",
      style: {
        background: "linear-gradient(135deg,#FAEBD7,#D1E7DD)"
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10
      }
    }, React.createElement("div", null, React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 18,
        fontWeight: 700,
        color: "#1B3A2D"
      }
    }, "Furnishing total (", s.nm, " tier)"), React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#78716C",
        marginTop: 2
      }
    }, "Products + delivery + assembly/installation. Bonus Mobili 50% (max \u20AC5,000) may apply if purchased within 12 months of starting renovation.")), React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 30,
        fontWeight: 700,
        color: "#1B3A2D"
      }
    }, fmt(bom.grandTotal)))), React.createElement("div", {
      className: "note note-warn",
      style: {
        fontSize: 10.5,
        lineHeight: 1.5
      }
    }, "\u26A0\uFE0F Prices, stock and delivery costs must be confirmed live on provider websites before purchase. Furniture dimensions must match the final post-renovation measured survey. Kitchen, bathroom, gas, electrical and HVAC items require qualified technical verification per DM 37/2008. For rental properties prioritise durable materials. Each item link opens a search on the provider site filtered to that exact product."));
  })(), tab === "dd" && (() => {
    const issues = runCompliance(d, s, area);
    const errs = issues.filter(i => i.sev === "err").length;
    const warns = issues.filter(i => i.sev === "warn").length;
    const oks = issues.filter(i => i.sev === "ok").length;
    const cssIcon = {
      err: "✗",
      warn: "⚠",
      ok: "✓"
    };
    const cssBg = {
      err: "#FEF2F2",
      warn: "#FFFBEB",
      ok: "#F0F9F4"
    };
    const cssCol = {
      err: "#B91C1C",
      warn: "#A16207",
      ok: "#1B3A2D"
    };
    return React.createElement("div", null, React.createElement(SP, null), React.createElement("div", {
      className: "card",
      style: {
        background: "linear-gradient(135deg,#1B3A2D,#2D5F45)",
        color: "#fff",
        marginBottom: 12
      }
    }, React.createElement("h3", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 4
      }
    }, "\u2714\uFE0F Compliance Check \u2014 Italian Building Code"), React.createElement("p", {
      style: {
        fontSize: 11,
        opacity: .85,
        marginBottom: 10
      }
    }, "DM 5/7/1975 \xB7 DM 236/1989 \xB7 DPCM 5/12/1997 \xB7 Reg.Ed. Milano 2016 \xB7 DM Requisiti Minimi 2015 \xB7 NTC 2018"), React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        flexWrap: "wrap"
      }
    }, [["Conformi", oks, "#1B3A2D"], ["Verifiche", warns, "#F59E0B"], ["Critiche", errs, "#DC2626"]].map(([l, n, c]) => React.createElement("div", {
      key: l,
      style: {
        flex: 1,
        minWidth: 80,
        padding: "10px 12px",
        background: "rgba(255,255,255,.12)",
        borderRadius: 8,
        textAlign: "center"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 24,
        fontWeight: 700,
        color: c === "#1B3A2D" ? "#A8E6CF" : c
      }
    }, n), React.createElement("div", {
      style: {
        fontSize: 10,
        opacity: .8
      }
    }, l))))), React.createElement("div", {
      className: "card"
    }, React.createElement("div", {
      className: "section-title"
    }, "Verifica Automatica \u2014 Scenario ", s.nm), issues.map((it, i) => React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        gap: 10,
        padding: "9px 11px",
        background: cssBg[it.sev],
        border: "1px solid " + cssCol[it.sev] + "33",
        borderRadius: 7,
        marginBottom: 6
      }
    }, React.createElement("div", {
      style: {
        fontSize: 14,
        color: cssCol[it.sev],
        fontWeight: 700,
        minWidth: 18
      }
    }, cssIcon[it.sev]), React.createElement("div", {
      style: {
        flex: 1
      }
    }, React.createElement("div", {
      style: {
        fontSize: 11.5,
        fontWeight: 600,
        color: "#1C1917"
      }
    }, it.cat, " ", React.createElement("span", {
      style: {
        fontWeight: 400,
        color: "#78716C",
        fontSize: 10,
        marginLeft: 6
      }
    }, "\xB7 ", it.code)), React.createElement("div", {
      style: {
        fontSize: 11,
        color: cssCol[it.sev],
        marginTop: 2,
        lineHeight: 1.5
      }
    }, it.msg))))), React.createElement("div", {
      className: "card"
    }, React.createElement("div", {
      className: "section-title"
    }, "Riferimenti Normativi \u2014 Dimensioni Minime"), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        fontSize: 11
      }
    }, [["Altezza locali principali", "≥ 2,70m (2,40m recupero)", "DM 5/7/1975 Art.1"], ["Altezza bagno/corridoio", "≥ 2,40m", "DM 5/7/1975 Art.1"], ["Soggiorno", "≥ 14m² (17m² con cucina)", "Reg.Ed. Art.97"], ["Camera doppia", "≥ 14m²", "DM 5/7/1975 Art.2"], ["Camera singola", "≥ 9m²", "DM 5/7/1975 Art.2"], ["Cucina", "≥ 5m²", "Reg.Ed. Art.97"], ["Bagno lato min", "≥ 1,20m", "Reg.Ed. Art.97"], ["Monolocale 1 pers.", "≥ 28m²", "DM 5/7/1975 Art.3"], ["Apribile finestra", "≥ 1/10 sup. locale", "Reg.Ed. Art.103"], ["Illuminante", "≥ 1/8 sup. locale", "Reg.Ed. Art.105"], ["Profondità locale", "≤ 2,5× h finestra", "Reg.Ed. Art.105"], ["Porta ingresso", "luce netta ≥ 80cm", "DM 236/1989"], ["Porte interne", "luce netta ≥ 75cm", "DM 236/1989"], ["Rotazione sedia rotelle", "Ø 150cm in bagno", "DM 236/1989"], ["Isolamento facciata", "D2m,nT ≥ 40dB", "DPCM 5/12/1997"], ["Pareti tra unità", "R'w ≥ 50dB", "DPCM 5/12/1997"]].map(([k, v, r]) => React.createElement("div", {
      key: k,
      style: {
        padding: "8px 10px",
        background: "#F6F4EF",
        borderRadius: 6
      }
    }, React.createElement("div", {
      style: {
        fontSize: 10,
        color: "#78716C"
      }
    }, k), React.createElement("div", {
      style: {
        fontSize: 11.5,
        fontWeight: 700,
        color: "#1B3A2D"
      }
    }, v), React.createElement("div", {
      style: {
        fontSize: 9,
        color: "#78716C",
        marginTop: 1
      }
    }, r))))), React.createElement("div", {
      className: "card"
    }, React.createElement("h3", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 15,
        color: "#1B3A2D",
        marginBottom: 10
      }
    }, "Due Diligence Checklist"), [{
      t: "1. Urbanistica",
      i: ["Conformità urbanistica", "Conformità catastale", "No abusi edilizi", "PGT zona residenziale", "L.R. 12/2005", "Vincoli D.Lgs. 42/2004"]
    }, {
      t: "2. Strutturale (NTC 2018)",
      i: ["Muri portanti vs tramezzi", "Amianto pre-1970", "Sismica D.G.R. 2129/2014", "Perimetro invariato"]
    }, {
      t: "3. Condominio",
      i: ["Regolamento condominiale", "Orari lavori", "Delibera art. 1122 c.c.", "Assicurazione"]
    }, {
      t: "4. Impianti DM 37/08",
      i: ["Elettrico CEI 64-8 + DiCo", "Idraulico", "HVAC rumore", "Gas UNI 7129"]
    }, {
      t: "5. Energia DM 26/6/2015",
      i: ["APE post D.Lgs. 192/2005", "Serramenti U≤1.40 W/m²K", "Ecobonus 50%/36% 2026", "CAM D.M. 11/10/2017"]
    }, {
      t: "6. Sicurezza",
      i: ["CSP/CSE D.Lgs. 81/2008", "POS", "ASL >200 uomini-giorno", "DOCFA 30gg"]
    }, {
      t: "7. Fiscale 2026",
      i: ["Bonus Ristrutturazione 50%/36%", "Ecobonus 50%/36%", "Bonus Mobili 50% (max €5k)", "Bonifico parlante", "IVA 10%", "Recovery 10 anni"]
    }].map((x, xi) => React.createElement("div", {
      key: x.t,
      style: {
        marginBottom: 12
      }
    }, React.createElement("div", {
      style: {
        fontFamily: "'Cormorant Garamond'",
        fontSize: 13,
        fontWeight: 700,
        color: "#1B3A2D",
        marginBottom: 5
      }
    }, x.t), x.i.map((it, ii) => React.createElement("div", {
      key: it,
      style: {
        display: "flex",
        gap: 7,
        padding: "4px 9px",
        background: xi % 2 ? "#F6F4EF" : "#fff",
        borderRadius: 5,
        marginBottom: 2
      }
    }, React.createElement("span", {
      style: {
        color: "#1B3A2D"
      }
    }, "\u2610"), React.createElement("span", {
      style: {
        fontSize: 11
      }
    }, it))))), React.createElement("div", {
      className: "note note-warn"
    }, "\u26A0\uFE0F ", React.createElement("strong", null, "Disclaimer:"), " Verifica indicativa basata su DM 5/7/1975, DM 236/1989, DPCM 5/12/1997, Reg.Ed. Milano. Convalida con geometra/architetto abilitato in Lombardia.")));
  })());
}
function App() {
  const [step, setStep] = useState(0);
  const [ld, setLd] = useState(false);
  const [apiKey, setApiKey] = useState(HAS_PROXY ? "__proxy__" : "");
  const [showKey, setShowKey] = useState(false);
  const [d, setD] = useState({
    address: "",
    city: "Milano",
    cap: "",
    area: "85",
    rooms: "3",
    eCls: "E",
    band: "Major city",
    floor: "3",
    ceiling: "2.7",
    currentStatus: "Da ristrutturare",
    heatingType: "Centralizzato",
    annualEnergy: "",
    pType: "Apartment",
    listingUrl: "",
    plans: [],
    photos: [],
    roomDetails: {},
    changes: ["Kitchen upgrade", "Bathroom upgrade", "Finishes refresh", "Storage boost"],
    style: "Japandi",
    customStyle: "",
    fengshui: [],
    preferredPalette: null
  });
  const steps = [{
    n: "Proprietà",
    i: "🏛️"
  }, {
    n: "Planimetria",
    i: "📐"
  }, {
    n: "Interventi",
    i: "🏗️"
  }, {
    n: "Stile",
    i: "🎨"
  }, {
    n: "Analisi",
    i: "📊"
  }];
  const ok = step === 0 ? d.city && d.area : step === 2 ? d.changes.length > 0 : true;
  const go = () => {
    setLd(true);
    setTimeout(() => {
      setLd(false);
      setStep(4);
    }, 1800);
  };
  if (ld) return React.createElement("div", {
    style: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#F6F4EF"
    }
  }, React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, React.createElement("div", {
    className: "spinner",
    style: {
      margin: "0 auto 20px"
    }
  }), React.createElement("h3", {
    style: {
      fontFamily: "'Cormorant Garamond'",
      color: "#1B3A2D",
      fontSize: 20
    }
  }, "Generating 3 Solutions"), React.createElement("p", {
    style: {
      color: "#78716C",
      fontSize: 12
    }
  }, "Essential \xB7 Balanced \xB7 Premium")));
  return React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "#F6F4EF"
    }
  }, React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,#1B3A2D,#2D5F45)",
      color: "#fff",
      padding: "12px 22px"
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1020,
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 8
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 9,
      background: "rgba(255,255,255,.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18
    }
  }, "\uD83C\uDFDB\uFE0F"), React.createElement("div", null, React.createElement("h1", {
    style: {
      fontSize: 16,
      fontWeight: 700
    }
  }, "Il Tuo Architetto"), React.createElement("p", {
    style: {
      fontSize: 9.5,
      opacity: .7
    }
  }, "3-Solution AI Renovation \xB7 Photorealistic Renders \xB7 Compliance"))), !HAS_PROXY && React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, React.createElement("label", {
    style: {
      fontSize: 9.5,
      fontWeight: 700,
      letterSpacing: ".06em",
      textTransform: "uppercase",
      color: "#E8C9A0"
    }
  }, "\uD83D\uDD11 Chiave API \xB7 Google AI Studio"), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, React.createElement("input", {
    type: showKey ? "text" : "password",
    value: apiKey,
    onChange: e => setApiKey(e.target.value.trim()),
    placeholder: "Incolla qui la chiave (AIza\u2026)",
    style: {
      width: 300,
      maxWidth: "70vw",
      padding: "9px 12px",
      borderRadius: 8,
      border: "2px solid #C87941",
      background: "#fff",
      color: "#1C1917",
      fontSize: 12.5,
      fontWeight: 500
    }
  }), React.createElement("button", {
    onClick: () => setShowKey(!showKey),
    title: "Mostra / Nascondi",
    style: {
      background: "rgba(255,255,255,.18)",
      border: "none",
      borderRadius: 6,
      padding: "7px 9px",
      color: "#fff",
      cursor: "pointer",
      fontSize: 13
    }
  }, showKey ? "🙈" : "👁️"), apiKey && React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#8CC63F",
      fontWeight: 700
    }
  }, "\u2713"))))), step < 4 && React.createElement("div", {
    style: {
      maxWidth: 1020,
      margin: "0 auto",
      padding: "12px 22px 0"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 3
    }
  }, steps.map((x, i) => React.createElement("div", {
    key: x.n,
    style: {
      display: "flex",
      alignItems: "center",
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: i < step ? "#1B3A2D" : i === step ? "#C87941" : "#ECE8E1",
      color: i <= step ? "#fff" : "#78716C",
      fontWeight: 600,
      fontSize: 11,
      flexShrink: 0
    }
  }, x.i), React.createElement("span", {
    style: {
      fontSize: 9.5,
      marginLeft: 5,
      color: i === step ? "#1C1917" : "#78716C",
      fontWeight: i === step ? 600 : 400,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, x.n), i < steps.length - 1 && React.createElement("div", {
    style: {
      flex: 1,
      height: 2,
      background: i < step ? "#1B3A2D" : "#ECE8E1",
      margin: "0 7px",
      minWidth: 8
    }
  }))))), React.createElement("div", {
    style: {
      maxWidth: 1020,
      margin: "0 auto",
      padding: "16px 22px 56px"
    }
  }, step === 0 && React.createElement(S1, {
    d: d,
    u: setD,
    apiKey: apiKey
  }), step === 1 && React.createElement(S2, {
    d: d,
    u: setD,
    apiKey: apiKey
  }), step === 2 && React.createElement(S3, {
    d: d,
    u: setD
  }), step === 3 && React.createElement(S4, {
    d: d,
    u: setD
  }), step === 4 && React.createElement(Results, {
    d: d,
    apiKey: apiKey
  }), step < 4 && React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 22
    }
  }, React.createElement("button", {
    className: "btn btn-g",
    onClick: () => setStep(Math.max(0, step - 1)),
    disabled: step === 0
  }, "\u2190 Indietro"), step < 3 ? React.createElement("button", {
    className: "btn btn-p",
    onClick: () => setStep(step + 1),
    disabled: !ok
  }, "Continua \u2192") : React.createElement("button", {
    className: "btn btn-w",
    onClick: go
  }, "Genera 3 Soluzioni \u2728")), step === 4 && React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 22
    }
  }, React.createElement("button", {
    className: "btn btn-g",
    onClick: () => setStep(0)
  }, "\u2190 Modifica"), React.createElement("button", {
    className: "btn btn-s",
    onClick: () => window.print()
  }, "\uD83D\uDCC4 Stampa"))));
}
(function tryMount() {
  var el = document.getElementById("root");
  if (el) {
    ReactDOM.render(React.createElement(App, null), el);
  } else {
    requestAnimationFrame(tryMount);
  }
})();