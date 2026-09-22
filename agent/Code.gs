/**
 * Il Tuo Architetto — receipt-to-access mail agent
 * ================================================
 *
 * Watches the studio inbox. When a client emails a payment receipt, it reads
 * the receipt with Gemini, emails YOU a summary with an approve link, and —
 * only once you click — mints a 3-report access link and replies to the
 * client in their own thread.
 *
 * The loop is: perceive (inbox) -> reason (Gemini) -> propose (you) -> act.
 * The human checkpoint is deliberate. An AI reading a receipt image can be
 * fooled by a forgery, and what is being handed out is paid access.
 *
 * WHAT NEVER LIVES HERE
 *   The Gemini API key. This script calls your Cloudflare Worker, which adds
 *   the key server-side, exactly as the website does. The only secret stored
 *   here is ADMIN_SECRET, which is what lets it mint links at all.
 *
 * SETUP: see agent/README.md. Short version — set the Script Properties,
 * deploy as a web app, run installTriggers() once.
 */

/* ── Configuration ───────────────────────────────────────────────────────
   All of it lives in Script Properties, never in this file, so the script
   can be shared or committed without carrying secrets. */
var REQUIRED_PROPS = ['WORKER_URL', 'ADMIN_SECRET', 'SITE_URL', 'OWNER_EMAIL'];

var DEFAULTS = {
  REPORTS_PER_LINK: '3',
  /* Unread mail not already handled. Narrow this if the inbox is busy. */
  SEARCH_QUERY: 'in:inbox is:unread -label:ITA-Agent',
  MAX_THREADS_PER_RUN: '8',
  /* Attachments above this are skipped rather than sent to the model. */
  MAX_ATTACHMENT_MB: '7',
  /* Optional. Set it and the agent flags receipts that do not match. */
  EXPECTED_AMOUNT_EUR: '',
  APPROVAL_TTL_DAYS: '14',
  STUDIO_NAME: 'Il Tuo Architetto',
  /* 'it' or 'en' — the language of the mail sent to the client. */
  CLIENT_LANG: 'it'
};

/* A name that answers can change under you; try in order. */
var TEXT_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3-flash-preview',
  'gemini-2.5-flash'
];

var LABEL_SEEN     = 'ITA-Agent';
var LABEL_PENDING  = 'ITA-Agent/Awaiting approval';
var LABEL_ISSUED   = 'ITA-Agent/Link sent';
var LABEL_REJECTED = 'ITA-Agent/Rejected';
var LABEL_NOTPAY   = 'ITA-Agent/Not a receipt';

function props() { return PropertiesService.getScriptProperties(); }
function cfg(key) {
  var v = props().getProperty(key);
  if (v === null || v === '') v = DEFAULTS[key] === undefined ? '' : DEFAULTS[key];
  return v;
}
function cfgNum(key) { return Number(cfg(key)); }

/* ── One-time setup ──────────────────────────────────────────────────────── */

/**
 * Run this once from the editor. It checks the configuration, creates the
 * labels and installs the five-minute trigger.
 */
function installTriggers() {
  var missing = REQUIRED_PROPS.filter(function (k) { return !props().getProperty(k); });
  if (missing.length) {
    throw new Error('Missing Script Properties: ' + missing.join(', ') +
      '. Set them under Project Settings before running this.');
  }
  [LABEL_SEEN, LABEL_PENDING, LABEL_ISSUED, LABEL_REJECTED, LABEL_NOTPAY].forEach(ensureLabel);

  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'checkInbox') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('checkInbox').timeBased().everyMinutes(5).create();

  var url = webAppUrl();
  Logger.log('Trigger installed. Web app: ' + (url || 'NOT DEPLOYED YET — deploy as a web app, then re-run this'));
  return 'ok';
}

/** Verifies every moving part without touching the inbox. Run it after setup. */
function selfTest() {
  var out = [];
  var miss = REQUIRED_PROPS.filter(function (k) { return !props().getProperty(k); });
  out.push(miss.length ? 'FAIL  properties missing: ' + miss.join(', ') : 'ok    properties set');

  out.push(webAppUrl() ? 'ok    web app deployed' : 'FAIL  web app not deployed — approve links cannot work');

  try {
    var r = askGemini([{ text: 'Reply with the single word: ready' }]);
    out.push(/ready/i.test(r.text) ? 'ok    Gemini reachable through the Worker (' + r.model + ')'
                                   : 'FAIL  Gemini answered oddly: ' + r.text.slice(0, 80));
  } catch (e) { out.push('FAIL  Gemini: ' + e.message); }

  try {
    var probe = adminCall('GET', '/admin/tokens', null);
    out.push(probe.ok ? 'ok    Worker admin API reachable, quota storage bound'
                      : 'FAIL  Worker admin: ' + JSON.stringify(probe.body).slice(0, 160));
  } catch (e) { out.push('FAIL  Worker admin: ' + e.message); }

  var msg = out.join('\n');
  Logger.log(msg);
  return msg;
}

/* ── The loop ────────────────────────────────────────────────────────────── */

/** Runs every five minutes. Safe to run by hand. */
function checkInbox() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;          /* a previous run is still going */
  try {
    var threads = GmailApp.search(cfg('SEARCH_QUERY'), 0, cfgNum('MAX_THREADS_PER_RUN'));
    for (var i = 0; i < threads.length; i++) {
      try { handleThread(threads[i]); }
      catch (e) { Logger.log('thread ' + threads[i].getId() + ' failed: ' + e.message); }
    }
  } finally {
    lock.releaseLock();
  }
}

function handleThread(thread) {
  var id = thread.getId();
  /* Belt and braces: a label the search excludes, and a property. A double
     issue would hand out two paid links for one payment. */
  if (props().getProperty('done:' + id)) return;

  var msgs = thread.getMessages();
  var msg = msgs[msgs.length - 1];
  var from = parseAddress(msg.getFrom());

  /* Never act on our own mail, or on the approval mail we sent ourselves. */
  if (sameAddress(from.email, cfg('OWNER_EMAIL')) ||
      sameAddress(from.email, Session.getActiveUser().getEmail())) {
    markSeen(thread, LABEL_NOTPAY); return;
  }

  var parts = buildPrompt(thread, msg);
  var answer = askGemini(parts);
  var verdict = parseJson(answer.text);

  if (!verdict) {
    Logger.log('unparseable model answer for ' + id + ': ' + answer.text.slice(0, 200));
    return;                                   /* leave it for the next run */
  }

  if (!verdict.isPaymentReceipt) {
    markSeen(thread, LABEL_NOTPAY);
    props().setProperty('done:' + id, 'not-a-receipt');
    return;
  }

  var pending = {
    id: randomId(),
    key: randomId() + randomId(),             /* the approve-link secret */
    threadId: id,
    clientEmail: from.email,
    clientName: verdict.payerName || from.name || from.email,
    subject: msg.getSubject(),
    verdict: verdict,
    model: answer.model,
    createdAt: new Date().toISOString()
  };
  props().setProperty('pending:' + pending.id, JSON.stringify(pending));
  props().setProperty('done:' + id, 'pending:' + pending.id);
  markSeen(thread, LABEL_PENDING);

  sendApprovalRequest(pending);
}

/** Builds the multimodal prompt: the email text plus every usable attachment. */
function buildPrompt(thread, msg) {
  var expected = cfg('EXPECTED_AMOUNT_EUR');
  var instruction =
    'You are reviewing an email sent to an architecture studio in Lombardy, Italy. ' +
    'Decide whether it contains a PAYMENT RECEIPT or proof of a completed bank ' +
    'transfer for the studio\'s renovation-report service. The mail may be in ' +
    'Italian or English.\n\n' +
    'Judge only what is actually present. Do not infer a payment from a promise ' +
    'to pay, a request for an invoice, a quote, or a general enquiry. A screenshot ' +
    'of a completed bank transfer, a bank PDF receipt, a PayPal or Satispay ' +
    'confirmation and a credit-card receipt all count. A pending or scheduled ' +
    'transfer does NOT count as completed.\n\n' +
    (expected ? 'The expected amount is EUR ' + expected + '. Flag any mismatch in "concerns".\n\n' : '') +
    'Return ONLY a JSON object, no prose and no code fence:\n' +
    '{"isPaymentReceipt":true|false,' +
    '"confidence":0-100,' +
    '"payerName":null,' +
    '"amount":null,' +
    '"currency":null,' +
    '"paymentDate":null,' +
    '"method":null,' +
    '"reference":null,' +
    '"evidence":"the exact text or image detail you relied on",' +
    '"concerns":["anything that would make a careful person check before granting paid access"],' +
    '"summary":"one sentence for the studio owner"}\n\n' +
    'Put every doubt in "concerns" — a blurry or cropped image, a mismatched ' +
    'amount, a missing date, a sender whose name differs from the payer, signs ' +
    'of editing. An empty "concerns" means you found nothing to question.';

  var parts = [{ text: instruction }];
  parts.push({ text: '\n--- EMAIL ---\nFrom: ' + msg.getFrom() +
                     '\nSubject: ' + msg.getSubject() +
                     '\nDate: ' + msg.getDate() +
                     '\n\n' + msg.getPlainBody().slice(0, 6000) });

  var budget = cfgNum('MAX_ATTACHMENT_MB') * 1024 * 1024;
  var atts = msg.getAttachments({ includeInlineImages: true, includeAttachments: true });
  var used = 0, included = 0;
  for (var i = 0; i < atts.length; i++) {
    var a = atts[i];
    var type = (a.getContentType() || '').split(';')[0];
    if (!/^image\/(png|jpe?g|webp|gif)$|^application\/pdf$/.test(type)) continue;
    var size = a.getSize();
    if (size > budget - used) continue;
    used += size; included++;
    parts.push({ inline_data: { mime_type: type, data: Utilities.base64Encode(a.getBytes()) } });
  }
  parts.push({ text: '\n(' + included + ' attachment(s) supplied' +
    (included < atts.length ? '; ' + (atts.length - included) + ' skipped as too large or an unsupported type' : '') + ')' });
  return parts;
}

/* ── Approval ────────────────────────────────────────────────────────────── */

function sendApprovalRequest(p) {
  var v = p.verdict;
  var base = webAppUrl();
  if (!base) {
    GmailApp.sendEmail(cfg('OWNER_EMAIL'),
      '[Agent] Web app not deployed — cannot approve',
      'A receipt arrived from ' + p.clientEmail + ' but the script is not deployed as a web app, ' +
      'so there is no approve link. Deploy it and re-run installTriggers().');
    return;
  }
  var approve = base + '?action=approve&id=' + p.id + '&k=' + p.key;
  var reject  = base + '?action=reject&id='  + p.id + '&k=' + p.key;

  var concerns = (v.concerns || []).filter(function (c) { return c && String(c).trim(); });
  var flagged = concerns.length > 0;

  var rows = [
    ['Client',        p.clientName + ' <' + p.clientEmail + '>'],
    ['Payer on receipt', v.payerName || '—'],
    ['Amount',        (v.amount != null ? v.amount : '—') + ' ' + (v.currency || '')],
    ['Date',          v.paymentDate || '—'],
    ['Method',        v.method || '—'],
    ['Reference',     v.reference || '—'],
    ['Model confidence', (v.confidence != null ? v.confidence + '%' : '—')],
    ['Evidence used', v.evidence || '—']
  ];

  var html =
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:640px">' +
    '<p style="font-size:15px;margin:0 0 4px"><strong>' + esc(v.summary || 'Possible payment receipt') + '</strong></p>' +
    '<p style="color:#666;font-size:13px;margin:0 0 14px">Subject: ' + esc(p.subject) + '</p>' +
    (flagged
      ? '<div style="border-left:4px solid #B4541E;background:#FDF6F2;padding:10px 12px;margin:0 0 14px">' +
        '<strong style="color:#B4541E">Check these before approving</strong><ul style="margin:6px 0 0 18px;padding:0">' +
        concerns.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div>'
      : '<div style="border-left:4px solid #2E7D5B;background:#F2F9F5;padding:10px 12px;margin:0 0 14px">' +
        'The model raised no concerns. It can still be wrong — the receipt is attached to the original thread.</div>') +
    '<table cellpadding="6" style="border-collapse:collapse;font-size:13.5px;width:100%">' +
    rows.map(function (r, i) {
      return '<tr style="background:' + (i % 2 ? '#fff' : '#F7FAFD') + '">' +
             '<td style="color:#667;white-space:nowrap">' + esc(r[0]) + '</td>' +
             '<td><strong>' + esc(String(r[1])) + '</strong></td></tr>';
    }).join('') +
    '</table>' +
    '<p style="margin:20px 0 8px;font-size:13px;color:#667">Approving mints a ' + cfg('REPORTS_PER_LINK') +
    '-report link and replies in the client\'s own thread.</p>' +
    '<p><a href="' + approve + '" style="background:#2E7D5B;color:#fff;text-decoration:none;' +
    'padding:11px 18px;border-radius:6px;font-weight:700;display:inline-block">Approve and send the link</a>' +
    '&nbsp;&nbsp;<a href="' + reject + '" style="color:#B4541E;padding:11px 4px">Reject</a></p>' +
    '<p style="color:#888;font-size:12px;margin-top:16px">This request expires in ' +
    cfg('APPROVAL_TTL_DAYS') + ' days. Read by ' + esc(p.model) + '.</p></div>';

  GmailApp.sendEmail(cfg('OWNER_EMAIL'),
    (flagged ? '[Check] ' : '[Approve] ') + 'Receipt from ' + p.clientName,
    'Approve: ' + approve + '\nReject: ' + reject,
    { htmlBody: html, name: cfg('STUDIO_NAME') + ' agent' });
}

/** The approve / reject endpoint. Deployed as a web app, executed as you. */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';
  var id = (e && e.parameter && e.parameter.id) || '';
  var key = (e && e.parameter && e.parameter.k) || '';

  if (action === 'status') return page('Agent running', 'The mail agent is deployed and reachable.');
  if (!id || !key) return page('Nothing to do', 'This link is incomplete.');

  var raw = props().getProperty('pending:' + id);
  if (!raw) return page('Already handled', 'This request has already been approved, rejected or has expired. Nothing was sent.');

  var p = JSON.parse(raw);
  /* The link is the credential, so a wrong key must not reveal that the id
     exists any differently from one that does not. */
  if (key !== p.key) return page('Already handled', 'This request has already been approved, rejected or has expired. Nothing was sent.');

  if (action === 'reject') {
    props().deleteProperty('pending:' + id);
    props().setProperty('done:' + p.threadId, 'rejected');
    relabel(p.threadId, LABEL_PENDING, LABEL_REJECTED);
    return page('Rejected', 'No link was sent to ' + esc(p.clientEmail) + '. The thread is labelled Rejected.');
  }

  if (action !== 'approve') return page('Nothing to do', 'Unknown action.');

  /* Single use: consume the request BEFORE doing the work, so a double click
     or a mail client prefetching the link cannot mint two links. */
  props().deleteProperty('pending:' + id);

  try {
    var issued = issueAccess(p);
    props().setProperty('done:' + p.threadId, 'issued:' + issued.token);
    relabel(p.threadId, LABEL_PENDING, LABEL_ISSUED);
    return page('Link sent',
      'A ' + cfg('REPORTS_PER_LINK') + '-report link went to <strong>' + esc(p.clientEmail) +
      '</strong> in their own thread.<br><br><code style="font-size:12px">' + esc(issued.link) + '</code>');
  } catch (err) {
    /* Put it back so the click can be retried once the cause is fixed. */
    props().setProperty('pending:' + id, JSON.stringify(p));
    return page('Could not send', 'Nothing reached the client. ' + esc(err.message) +
      '<br><br>Fix the cause and click the approve link again.');
  }
}

/* ── Acting: mint the link, reply to the client ──────────────────────────── */

function issueAccess(p) {
  var max = cfgNum('REPORTS_PER_LINK');
  var note = p.clientName + ' <' + p.clientEmail + '>' +
             (p.verdict.amount != null ? ' · ' + p.verdict.amount + ' ' + (p.verdict.currency || '') : '');
  var res = adminCall('POST', '/admin/token', { max: max, note: note.slice(0, 120) });
  if (!res.ok || !res.body || !res.body.token) {
    throw new Error('the Worker refused to mint a link: ' + JSON.stringify(res.body).slice(0, 200));
  }
  var link = cfg('SITE_URL').replace(/\/+$/, '') + '/standalone.html?token=' + res.body.token;

  var mail = clientEmailBody(p, link, max);
  var thread = GmailApp.getThreadById(p.threadId);
  if (thread) thread.reply(mail.text, { htmlBody: mail.html, name: cfg('STUDIO_NAME') });
  else GmailApp.sendEmail(p.clientEmail, mail.subject, mail.text,
                          { htmlBody: mail.html, name: cfg('STUDIO_NAME') });

  return { token: res.body.token, link: link };
}

function clientEmailBody(p, link, max) {
  var it = cfg('CLIENT_LANG') !== 'en';
  var name = (p.clientName || '').split(/[\s<]/)[0];
  var studio = cfg('STUDIO_NAME');

  var t = it ? {
    subject: 'Il tuo accesso a ' + studio,
    hi: 'Ciao ' + name + ',',
    body: 'grazie, abbiamo ricevuto il pagamento. Ecco il tuo accesso personale:',
    cta: 'Apri il pianificatore',
    uses: 'Il link vale ' + max + ' report completi ed è personale. Il conteggio è sul server, ' +
          'quindi funziona da qualsiasi dispositivo — ma non si azzera cambiando browser.',
    how: 'Cosa serve: il link dell\'annuncio immobiliare, la planimetria se ce l\'hai, e qualche foto delle stanze. ' +
         'Il resto lo ricava il sistema.',
    help: 'Se qualcosa non funziona, rispondi a questa email.',
    bye: 'A presto,'
  } : {
    subject: 'Your access to ' + studio,
    hi: 'Hi ' + name + ',',
    body: 'thank you — we have received your payment. Here is your personal access:',
    cta: 'Open the planner',
    uses: 'The link is good for ' + max + ' complete reports and is personal to you. The count is kept ' +
          'on the server, so it works from any device — but it does not reset by changing browser.',
    how: 'What to have ready: the property listing link, the floor plan if you have one, and a few photos ' +
         'of the rooms. The system works the rest out.',
    help: 'If anything does not work, just reply to this email.',
    bye: 'Speak soon,'
  };

  var html =
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.55;max-width:560px">' +
    '<p>' + esc(t.hi) + '</p><p>' + esc(t.body) + '</p>' +
    '<p style="margin:22px 0"><a href="' + link + '" style="background:#3479A8;color:#fff;text-decoration:none;' +
    'padding:13px 22px;border-radius:6px;font-weight:700;display:inline-block">' + esc(t.cta) + '</a></p>' +
    '<p style="color:#555;font-size:13.5px">' + esc(t.uses) + '</p>' +
    '<p style="color:#555;font-size:13.5px">' + esc(t.how) + '</p>' +
    '<p style="color:#555;font-size:13.5px">' + esc(t.help) + '</p>' +
    '<p>' + esc(t.bye) + '<br>' + esc(studio) + '</p></div>';

  var text = t.hi + '\n\n' + t.body + '\n\n' + link + '\n\n' + t.uses + '\n\n' + t.how + '\n\n' + t.help +
             '\n\n' + t.bye + '\n' + studio;
  return { subject: t.subject, html: html, text: text };
}

/* ── Talking to the Worker ───────────────────────────────────────────────── */

function askGemini(parts) {
  var base = cfg('WORKER_URL').replace(/\/+$/, '');
  var last = '';
  for (var i = 0; i < TEXT_MODELS.length; i++) {
    var res = UrlFetchApp.fetch(base + '/v1beta/models/' + TEXT_MODELS[i] + ':generateContent', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'X-Admin-Secret': cfg('ADMIN_SECRET') },
      muteHttpExceptions: true,
      payload: JSON.stringify({
        contents: [{ parts: parts }],
        generationConfig: { temperature: 0, maxOutputTokens: 1400, responseMimeType: 'application/json' }
      })
    });
    var code = res.getResponseCode();
    var body = res.getContentText();
    if (code === 200) {
      var data = JSON.parse(body);
      var out = (((data.candidates || [])[0] || {}).content || {}).parts || [];
      return { text: out.map(function (x) { return x.text || ''; }).join('').trim(), model: TEXT_MODELS[i] };
    }
    last = code + ' ' + body.slice(0, 200);
    if (code !== 404) break;        /* a real failure, not a retired model */
  }
  throw new Error('Gemini call failed: ' + last);
}

function adminCall(method, path, payload) {
  var opts = {
    method: method.toLowerCase(),
    headers: { 'X-Admin-Secret': cfg('ADMIN_SECRET') },
    muteHttpExceptions: true
  };
  if (payload) { opts.contentType = 'application/json'; opts.payload = JSON.stringify(payload); }
  var res = UrlFetchApp.fetch(cfg('WORKER_URL').replace(/\/+$/, '') + path, opts);
  var body;
  try { body = JSON.parse(res.getContentText()); } catch (e) { body = { raw: res.getContentText().slice(0, 200) }; }
  return { ok: res.getResponseCode() === 200, status: res.getResponseCode(), body: body };
}

/* ── Housekeeping ────────────────────────────────────────────────────────── */

/** Clears approval requests nobody ever clicked. Installed as a daily trigger. */
function purgeExpired() {
  var ttl = cfgNum('APPROVAL_TTL_DAYS') * 86400000;
  var now = Date.now();
  var all = props().getProperties();
  Object.keys(all).forEach(function (k) {
    if (k.indexOf('pending:') !== 0) return;
    try {
      var p = JSON.parse(all[k]);
      if (now - new Date(p.createdAt).getTime() > ttl) {
        props().deleteProperty(k);
        props().deleteProperty('done:' + p.threadId);
      }
    } catch (e) { props().deleteProperty(k); }
  });
}

/** Everything awaiting your click, for when an approval mail gets lost. */
function listPending() {
  var all = props().getProperties(), out = [], base = webAppUrl();
  Object.keys(all).forEach(function (k) {
    if (k.indexOf('pending:') !== 0) return;
    var p = JSON.parse(all[k]);
    out.push(p.createdAt + '  ' + p.clientEmail + '  ' +
             (p.verdict.amount != null ? p.verdict.amount + ' ' + (p.verdict.currency || '') : '?') +
             '\n    approve: ' + base + '?action=approve&id=' + p.id + '&k=' + p.key);
  });
  var msg = out.length ? out.join('\n') : 'Nothing awaiting approval.';
  Logger.log(msg);
  return msg;
}

/* ── Small helpers ───────────────────────────────────────────────────────── */

function ensureLabel(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}
function markSeen(thread, extraLabel) {
  ensureLabel(LABEL_SEEN).addToThread(thread);
  if (extraLabel) ensureLabel(extraLabel).addToThread(thread);
}
function relabel(threadId, from, to) {
  var t = GmailApp.getThreadById(threadId);
  if (!t) return;
  var f = GmailApp.getUserLabelByName(from);
  if (f) f.removeFromThread(t);
  ensureLabel(to).addToThread(t);
}
function parseAddress(raw) {
  var m = String(raw).match(/^\s*"?([^"<]*)"?\s*<([^>]+)>\s*$/);
  if (m) return { name: m[1].trim(), email: m[2].trim().toLowerCase() };
  return { name: '', email: String(raw).trim().toLowerCase() };
}
function sameAddress(a, b) {
  return !!a && !!b && String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
}
function parseJson(text) {
  if (!text) return null;
  var clean = String(text).replace(/^\s*```(?:json)?/i, '').replace(/```\s*$/, '').trim();
  try { return JSON.parse(clean); } catch (e) {}
  var a = clean.indexOf('{'), b = clean.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(clean.slice(a, b + 1)); } catch (e2) {} }
  return null;
}
function randomId() {
  return Utilities.getUuid().replace(/-/g, '').slice(0, 16);
}
function webAppUrl() {
  try {
    var u = ScriptApp.getService().getUrl();
    return u && /^https/.test(u) ? u : '';
  } catch (e) { return ''; }
}
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function page(title, bodyHtml) {
  return HtmlService.createHtmlOutput(
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:520px;margin:60px auto;padding:0 20px">' +
    '<h2 style="margin:0 0 10px">' + esc(title) + '</h2>' +
    '<p style="font-size:15px;line-height:1.55;color:#333">' + bodyHtml + '</p></div>'
  ).setTitle(title);
}
