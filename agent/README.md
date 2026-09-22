# Receipt-to-access mail agent

Watches the studio inbox. When a client emails a payment receipt, the agent
reads it, emails **you** a summary with an approve link, and — only once you
click — mints a 3-report access link and replies in the client's own thread.

```
  client emails a receipt
          │
          ▼
  ┌───────────────────┐   every 5 min
  │  Gmail inbox      │
  └────────┬──────────┘
           │  text + attachments
           ▼
  ┌───────────────────┐   no API key here — the Worker adds it
  │ Cloudflare Worker │──────────────► Gemini
  └────────┬──────────┘
           │  {isPaymentReceipt, amount, payer, concerns…}
           ▼
  ┌───────────────────┐
  │ email to YOU      │   [Approve]  [Reject]
  └────────┬──────────┘
           │  you click approve
           ▼
  ┌───────────────────┐
  │ POST /admin/token │──► 3-report link ──► reply to the client's thread
  └───────────────────┘
```

**Why a human click.** A model reading a receipt image can be fooled by a
forgery, and what is being handed out is paid access. The agent does all the
work and leaves you one decision. Everything it noticed that a careful person
would check is listed in the approval email under *Check these before
approving*.

**The Gemini API key is never in this script.** It calls your Cloudflare
Worker exactly as the website does, and the Worker adds the key server-side.
The only secret stored here is `ADMIN_SECRET`, which is what lets it mint
links at all — so treat the script project as you would the admin page.

## Before you start

The Worker must already be working, because the agent depends on it:

- current `worker/gemini-proxy.js` deployed (it contains the admin bypass the
  agent needs — an older copy will reject every call with 401)
- `GEMINI_API_KEY` and `ADMIN_SECRET` set
- the `ITA_QUOTA` KV namespace bound as `QUOTA` — **without this the Worker
  cannot mint links at all** and the agent has nothing to send

## Setup

### 1. Create the project

1. Go to https://script.google.com → **New project**
2. Sign in as the account that receives the mail (`info@iltuoarchitetto.it`)
3. Rename it something like `Il Tuo Architetto — mail agent`
4. Delete the sample code, paste all of `agent/Code.gs`, save

### 2. Configure it

**Project Settings** (gear, left) → **Script Properties** → add these:

| Property | Value |
|---|---|
| `WORKER_URL` | `https://iltuoarchitetto-proxy.<account>.workers.dev` |
| `ADMIN_SECRET` | the same string set on the Worker |
| `SITE_URL` | `https://iltuoarchitetto2dto5d.netlify.app` |
| `OWNER_EMAIL` | where approval requests go — your own address |

Optional, each with a sensible default:

| Property | Default | What it does |
|---|---|---|
| `REPORTS_PER_LINK` | `3` | reports per client link |
| `EXPECTED_AMOUNT_EUR` | *(unset)* | set it and any mismatched amount is flagged |
| `CLIENT_LANG` | `it` | `it` or `en` — language of the client's email |
| `SEARCH_QUERY` | `in:inbox is:unread -label:ITA-Agent` | narrow this if the inbox is busy |
| `MAX_THREADS_PER_RUN` | `8` | threads per five-minute run |
| `MAX_ATTACHMENT_MB` | `7` | larger attachments are skipped, not sent |
| `APPROVAL_TTL_DAYS` | `14` | unclicked requests expire after this |
| `STUDIO_NAME` | `Il Tuo Architetto` | sender name on the client email |

### 3. Deploy as a web app

This is what makes the approve links work.

1. **Deploy** → **New deployment** → gear → **Web app**
2. **Execute as:** Me
3. **Who has access:** **Anyone** ← required; the link itself is the credential
4. **Deploy**, then grant the permissions it asks for

"Anyone" sounds alarming and isn't: each approve URL carries a 32-character
random key, is single-use, and is only ever sent to `OWNER_EMAIL`. A URL
without a valid key gets the same answer as an expired one.

Google will warn that the app is unverified — it's your own script in your own
account. **Advanced** → **Go to … (unsafe)** → **Allow**.

### 4. Turn it on

In the editor, run **`installTriggers`** once. It checks the configuration,
creates the labels and installs a five-minute trigger.

Then run **`selfTest`**. It checks every moving part without touching the
inbox, and prints something like:

```
ok    properties set
ok    web app deployed
ok    Gemini reachable through the Worker (gemini-3.1-flash-lite)
ok    Worker admin API reachable, quota storage bound
```

Any `FAIL` line names what to fix. Fix it before sending a real client here.

### 5. Try it

Email the studio address from another account with the subject *Bonifico
effettuato*, attaching any image. Within five minutes you should get an
approval email. Approve it, check the reply arrives with a working link, then
revoke that test token in `admin.html`.

## Running it

Threads get labelled as they move, so the inbox shows the state at a glance:

| Label | Meaning |
|---|---|
| `ITA-Agent/Awaiting approval` | waiting on your click |
| `ITA-Agent/Link sent` | client has their link |
| `ITA-Agent/Rejected` | you declined it |
| `ITA-Agent/Not a receipt` | ordinary mail, no action |

Useful functions to run by hand from the editor:

- **`listPending`** — everything awaiting a click, with fresh approve links,
  for when an approval email gets lost
- **`purgeExpired`** — clears unclicked requests past their TTL. Worth adding
  as a daily trigger: **Triggers** → add → `purgeExpired`, day timer.
- **`selfTest`** — re-run it whenever something stops working

### What it will not do

- **Issue twice for one payment.** A thread is marked done before the
  approval is sent, the approve request is consumed before the link is
  minted, and both are keyed independently. A double click, a refresh, or a
  mail client prefetching the URL all mint nothing the second time.
- **Send a broken email.** If the Worker refuses to mint, nothing goes to the
  client, you get told why, and clicking approve again retries.
- **Act on its own mail.** Mail from `OWNER_EMAIL` or the account itself is
  labelled and skipped, so the approval emails cannot start a loop.
- **Guess.** An answer it cannot parse is left alone for the next run rather
  than acted on.

### Costs

Apps Script is free at this volume. Each receipt is one small Gemini call
through your Worker — cents per hundred. The agent's calls carry the admin
secret, so they are **not** metered against any customer's three reports.

### If something goes wrong

| Symptom | Cause |
|---|---|
| `401 Unauthorized` in the logs | `ADMIN_SECRET` differs from the Worker's, or the Worker predates the admin bypass — redeploy `worker/gemini-proxy.js` |
| `KV namespace 'QUOTA' is not bound` | the Worker cannot mint links; bind the KV namespace |
| Approval emails arrive, approve link says "Already handled" | you clicked twice, or the request expired |
| No approval emails at all | check **Executions** in the editor for errors; check the `SEARCH_QUERY` still matches |
| Client says the link does not work | check the token in `admin.html` — it may be spent or revoked |

**Executions** in the left sidebar is the log of every run, with errors. It is
the first place to look.
