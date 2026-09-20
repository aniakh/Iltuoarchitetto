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
      left: function (n, m) { return n + " di " + m + " report rimanenti"; },
      open: "Accesso libero (demo)",
      blockedTitle: "Report esauriti",
      blockedBody: "Questo link consente " + "%MAX%" + " generazioni del report e le hai utilizzate tutte. " +
                   "Per ottenere un nuovo accesso scrivi a info@iltuoarchitetto.it.",
      noTokenTitle: "Accesso richiesto",
      noTokenBody: "Per generare il report serve un link di accesso valido. " +
                   "Contatta info@iltuoarchitetto.it per riceverne uno.",
      close: "Chiudi",
      contact: "Contattaci"
    },
    en: {
      left: function (n, m) { return n + " of " + m + " reports remaining"; },
      open: "Open access (demo)",
      blockedTitle: "No reports left",
      blockedBody: "This link allows " + "%MAX%" + " report generations and you have used them all. " +
                   "To get renewed access, email info@iltuoarchitetto.it.",
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

  ITA.mountBadge = function () {
    if (!PROXY || document.getElementById("ita-quota-badge")) return;
    var el = document.createElement("div");
    el.id = "ita-quota-badge";
    el.style.cssText =
      "position:fixed;right:14px;bottom:14px;z-index:99998;padding:8px 14px;border-radius:999px;" +
      "background:#fff;border:1px solid #E2E8EF;color:#2C3E50;font:600 12px/1 'Source Sans 3',sans-serif;" +
      "box-shadow:0 2px 12px rgba(35,90,133,.16);display:none;align-items:center;gap:7px";
    document.body.appendChild(el);
    var render = function () {
      var t = T[lang()];
      if (!ITA.enforced || ITA.remaining == null) { el.style.display = "none"; return; }
      el.style.display = "inline-flex";
      var dotColor = ITA.remaining > 1 ? "#3479A8" : (ITA.remaining === 1 ? "#E0BC30" : "#C0392B");
      el.innerHTML = '<span style="width:8px;height:8px;border-radius:50%;background:' + dotColor + '"></span>' +
                     '<span>' + t.left(ITA.remaining, ITA.max) + '</span>';
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

  window.ITA = ITA;

  // Kick off a status check early so the UI can show "x / 3 left".
  if (PROXY) { try { ITA.status(); } catch (e) {} }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { ITA.mountBadge(); });
  } else {
    ITA.mountBadge();
  }
})();
