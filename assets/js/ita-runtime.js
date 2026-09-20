/* Il Tuo Architetto — client runtime
 * ------------------------------------
 * Bridges the dashboard to the Cloudflare Worker:
 *   1. Routes Gemini calls through the proxy (so visitors need no API key).
 *   2. Carries the access token + generation id on every proxied request.
 *   3. Exposes the 3-generation quota to the UI.
 *
 * Loaded AFTER assets/js/config.js and BEFORE the dashboard app script.
 */
(function () {
  var PROXY = (typeof window !== "undefined" && window.GEMINI_PROXY)
    ? String(window.GEMINI_PROXY).replace(/\/+$/, "")
    : "";

  var TOKEN_KEY = "ita_access_token";

  function readToken() {
    var t = "";
    try {
      var qs = new URLSearchParams(window.location.search);
      t = (qs.get("token") || qs.get("t") || "").trim();
      if (t) {
        // Persist so in-app navigation / refresh keeps working.
        try { localStorage.setItem(TOKEN_KEY, t); } catch (e) {}
      } else {
        try { t = localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { t = ""; }
      }
    } catch (e) {}
    return t;
  }

  var ITA = {
    proxy: PROXY,
    hasProxy: !!PROXY,
    token: readToken(),
    generationId: null,
    remaining: null,
    max: null,
    enforced: false,      // set true once the server confirms quota is active
    lastError: "",
    _listeners: [],

    /* --- URL builders ------------------------------------------------- */
    geminiUrl: function (model, apiKey) {
      return PROXY
        ? PROXY + "/v1beta/models/" + model + ":generateContent"
        : "https://generativelanguage.googleapis.com/v1beta/models/" + model +
          ":generateContent?key=" + (apiKey || "");
    },
    modelsUrl: function (apiKey) {
      return PROXY
        ? PROXY + "/v1beta/models?pageSize=200"
        : "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=" + (apiKey || "");
    },

    /* --- Quota -------------------------------------------------------- */
    onChange: function (fn) { this._listeners.push(fn); },
    _emit: function () {
      var self = this;
      this._listeners.forEach(function (fn) { try { fn(self); } catch (e) {} });
    },

    // Ask the server how many generations are left (does NOT consume one).
    status: function () {
      var self = this;
      if (!PROXY) return Promise.resolve({ ok: true, enforced: false });
      return fetch(PROXY + "/quota", {
        headers: this.token ? { "X-Access-Token": this.token } : {}
      })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && typeof j.remaining === "number") {
            self.remaining = j.remaining;
            self.max = j.max;
            self.enforced = !!j.enforced;
            self._emit();
          } else if (j && j.enforced === false) {
            self.enforced = false;
            self._emit();
          }
          return j;
        })
        .catch(function (e) { return { ok: false, error: String(e) }; });
    },

    // Burn one generation slot. Returns {ok, remaining, generationId, error}.
    consume: function () {
      var self = this;
      if (!PROXY) {
        // No proxy configured -> nothing to enforce, allow.
        return Promise.resolve({ ok: true, enforced: false });
      }
      return fetch(PROXY + "/consume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": this.token || ""
        },
        body: "{}"
      })
        .then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); })
        .then(function (res) {
          var j = res.j || {};
          if (j.enforced === false) {           // quota not configured server-side
            self.enforced = false;
            self.generationId = j.generationId || "open";
            self._emit();
            return { ok: true, enforced: false };
          }
          if (res.s === 200 && j.ok) {
            self.enforced = true;
            self.generationId = j.generationId;
            self.remaining = j.remaining;
            self.max = j.max;
            self.lastError = "";
            self._emit();
            return { ok: true, remaining: j.remaining, generationId: j.generationId };
          }
          self.enforced = true;
          self.remaining = typeof j.remaining === "number" ? j.remaining : 0;
          self.max = j.max;
          self.lastError = j.error || ("HTTP " + res.s);
          self._emit();
          return { ok: false, error: self.lastError, remaining: self.remaining, code: j.code };
        })
        .catch(function (e) {
          self.lastError = String(e && e.message || e);
          return { ok: false, error: self.lastError };
        });
    }
  };

  /* --- Attach token + generation id to every proxied request ---------- */
  if (PROXY && typeof window.fetch === "function") {
    var nativeFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      var url = "";
      try { url = typeof input === "string" ? input : (input && input.url) || ""; } catch (e) {}
      if (url.indexOf(PROXY) === 0) {
        init = init || {};
        var h = new Headers(init.headers || (typeof input !== "string" && input.headers) || {});
        if (ITA.token) h.set("X-Access-Token", ITA.token);
        if (ITA.generationId) h.set("X-Generation-Id", ITA.generationId);
        init.headers = h;
      }
      return nativeFetch(input, init);
    };
  }

  /* --- Quota UI: badge + blocked dialog ------------------------------- */
  var T = {
    it: {
      title: "Report inclusi",
      left: function (n, m) { return n + " di " + m + " rimanenti"; },
      rule: "Dopo il terzo report il link si chiude.",
      lastOne: "È il tuo ultimo report.",
      noneLeft: "Nessun report rimasto.",
      open: "Demo · accesso libero",
      openRule: "Nessun limite attivo su questo link.",
      blockedTitle: "Report esauriti",
      blockedBody: "Questo link include %MAX% report e li hai usati tutti. " +
                   "Per riattivarlo scrivi a info@iltuoarchitetto.it.",
      noTokenTitle: "Accesso richiesto",
      noTokenBody: "Per generare il report serve un link di accesso valido. " +
                   "Contatta info@iltuoarchitetto.it per riceverne uno.",
      close: "Chiudi",
      contact: "Contattaci"
    },
    en: {
      title: "Reports included",
      left: function (n, m) { return n + " of " + m + " remaining"; },
      rule: "After the third report the link closes.",
      lastOne: "This is your last report.",
      noneLeft: "No reports left.",
      open: "Demo · open access",
      openRule: "No limit active on this link.",
      blockedTitle: "No reports left",
      blockedBody: "This link includes %MAX% reports and you have used them all. " +
                   "To reactivate it, email info@iltuoarchitetto.it.",
      noTokenTitle: "Access required",
      noTokenBody: "A valid access link is required to generate the report. " +
                   "Contact info@iltuoarchitetto.it to get one.",
      close: "Close",
      contact: "Contact us"
    }
  };
  function lang() {
    try {
      var s = localStorage.getItem("ita_lang");
      if (s && T[s]) return s;
    } catch (e) {}
    var n = (navigator.language || "it").slice(0, 2);
    return T[n] ? n : "it";
  }

  /* A small always-visible panel: how many reports are left, and the rule. */
  ITA.mountBadge = function () {
    if (!PROXY || document.getElementById("ita-quota-badge")) return;

    var el = document.createElement("div");
    el.id = "ita-quota-badge";
    el.style.cssText =
      "position:fixed;right:14px;bottom:14px;z-index:99998;padding:12px 16px;border-radius:12px;" +
      "background:#fff;border:1px solid #E2E8EF;color:#2C3E50;" +
      "font-family:'Source Sans 3','Segoe UI',sans-serif;" +
      "box-shadow:0 4px 18px rgba(35,90,133,.18);max-width:250px;line-height:1.45";
    document.body.appendChild(el);

    var dots = function (used, max, color) {
      var out = '<span style="display:inline-flex;gap:4px;margin-left:2px">';
      for (var i = 0; i < max; i++) {
        out += '<span style="width:9px;height:9px;border-radius:50%;background:' +
               (i < used ? "#E2E8EF" : color) + '"></span>';
      }
      return out + "</span>";
    };

    var render = function () {
      var t = T[lang()];

      // No metering configured server-side -> show a quiet "open demo" note.
      if (!ITA.enforced || ITA.remaining == null) {
        el.innerHTML =
          '<div style="font-size:12px;font-weight:700;color:#7B8B96">' + t.open + '</div>' +
          '<div style="font-size:11.5px;color:#7B8B96;margin-top:2px">' + t.openRule + '</div>';
        return;
      }

      var n = ITA.remaining, m = ITA.max || 3;
      var color = n > 1 ? "#3479A8" : (n === 1 ? "#E0BC30" : "#C0392B");
      var note = n === 0 ? t.noneLeft : (n === 1 ? t.lastOne : t.rule);

      el.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px">' +
          '<span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#7B8B96">' +
            t.title + '</span>' + dots(m - n, m, color) +
        '</div>' +
        '<div style="font-size:15px;font-weight:800;color:' + color + ';margin-top:5px">' +
          t.left(n, m) + '</div>' +
        '<div style="font-size:11.5px;color:#7B8B96;margin-top:3px">' + note + '</div>';
    };

    ITA.onChange(render);
    render();
  };

  ITA.showBlocked = function (res) {
    var t = T[lang()];
    var noToken = res && (res.code === "no_token" || res.code === "invalid_token");
    var title = noToken ? t.noTokenTitle : t.blockedTitle;
    var body = (noToken ? t.noTokenBody : t.blockedBody).replace("%MAX%", ITA.max || 3);
    var prev = document.getElementById("ita-block-overlay");
    if (prev) prev.remove();
    var ov = document.createElement("div");
    ov.id = "ita-block-overlay";
    ov.style.cssText =
      "position:fixed;inset:0;z-index:99999;background:rgba(20,35,50,.55);display:flex;" +
      "align-items:center;justify-content:center;padding:20px";
    ov.innerHTML =
      '<div style="background:#fff;border-radius:14px;max-width:440px;width:100%;padding:30px 28px;' +
      'box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:\'Source Sans 3\',sans-serif;text-align:center">' +
      '<div style="font-size:34px;margin-bottom:10px">🔒</div>' +
      '<h3 style="font-size:21px;font-weight:700;color:#3479A8;margin:0 0 10px">' + title + '</h3>' +
      '<p style="font-size:14.5px;line-height:1.6;color:#44556A;margin:0 0 20px">' + body + '</p>' +
      '<div style="display:flex;gap:10px;justify-content:center">' +
      '<a href="mailto:info@iltuoarchitetto.it" style="padding:11px 20px;border-radius:7px;background:#3479A8;' +
      'color:#fff;font-weight:700;font-size:14px;text-decoration:none">' + t.contact + '</a>' +
      '<button id="ita-block-close" style="padding:11px 20px;border-radius:7px;background:transparent;' +
      'border:2px solid #E2E8EF;color:#2C3E50;font-weight:700;font-size:14px;cursor:pointer;' +
      'font-family:inherit">' + t.close + '</button>' +
      '</div></div>';
    document.body.appendChild(ov);
    var close = function () { ov.remove(); };
    ov.querySelector("#ita-block-close").addEventListener("click", close);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
  };

  /* Convenience used by the dashboard's unlock button. */
  ITA.requestGeneration = function (onAllowed) {
    return ITA.consume().then(function (r) {
      if (r.ok) { if (typeof onAllowed === "function") onAllowed(); return true; }
      ITA.showBlocked(r);
      return false;
    });
  };

  /* Page-level tweaks that only apply when the proxy serves the key. */
  ITA.injectStyles = function () {
    if (document.getElementById("ita-runtime-style")) return;
    var css = ".gate-trials{font-size:12.5px;color:#7B8B96;border-left:3px solid #F5D04A;" +
              "padding:6px 0 6px 10px;margin-top:8px}";
    if (PROXY) {
      // With the proxy in place visitors never need their own key.
      css += ".settings-section:has(#owner-api-key){display:none!important}";
    }
    var s = document.createElement("style");
    s.id = "ita-runtime-style";
    s.textContent = css;
    document.head.appendChild(s);
  };

  window.ITA = ITA;

  // Kick off a status check early so the UI can show "x / 3 left".
  if (PROXY) { try { ITA.status(); } catch (e) {} }
  try { ITA.injectStyles(); } catch (e) {}
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { ITA.mountBadge(); });
  } else {
    ITA.mountBadge();
  }
})();
