# Parandur AeroBuild — Airport Construction Control Room

A custom project-management application for a **greenfield airport build**, running on
**Zoho Projects** as the sole source of truth and deployed on **Zoho Catalyst**. Built
for the Zoho Projects 20th-anniversary "Build With AI" challenge.

Modelled on the publicly reported Parandur greenfield airport in Kancheepuram district,
Tamil Nadu — a planning tool, not a position on the project.

| | |
|---|---|
| **Live app** | https://greenfield-ssg.onslate.in |
| **Demo login** | `manager` / `sitewise2026` (Operations Manager) · `foreman` / `sitewise2026` (Site Foreman) |
| **Stack** | Zoho Projects (data) · Catalyst Slate (UI) · Catalyst serverless function (API) |
| **App code** | [`sitewise/`](sitewise/) |

---

## The problem

A greenfield airport isn't one project — it's six running at once: the **runway**, the
**passenger terminal**, the **ATC tower**, the **apron & taxiways**, the **access road**,
and the **site earthworks**. Each has its own budget, crew and contractor, spread across
six villages. The information that decides whether it lands on time — how much of each
package is spent, which jobs are overdue, which materials are about to run out, how much
is owed to which vendor — lives in a dozen spreadsheets and three WhatsApp groups. Nobody
has a single view, so the project office finds out a runway paving panel slipped, or that
terminal cement hit zero, only after it has already cost a day.

**Parandur AeroBuild** is the single control room for that build. Every figure on screen
is read live from Zoho Projects; nothing is created, changed or reported outside it.

## Users and roles

| Role | Login | Lands on | Sees |
|---|---|---|---|
| **Operations Manager** | `manager` | Dashboard | Everything — operations, inventory, **finance**, compliance, **reports** |
| **Site Foreman** | `foreman` | Jobs | Operations, inventory, compliance — **no finance, no reports** |

Roles are gated in the UI **and enforced in the function** (a foreman token cannot create
a bill or a material — `403`, not merely hidden).

## Workflows

- **Portfolio dashboard** — work packages, budget consumed, open/overdue jobs, low-stock
  materials, vendor payables; budget-by-package, job-status and receivables-vs-payables charts.
- **Read** every module — Projects, Jobs, Labour & Attendance, Materials, Purchase Requests,
  Equipment, Vendors, Client Billing, Expenses, Quality, Safety — each with **search + status
  filters + live result counts**.
- **Create** records live in Zoho — raise a purchase request, log a quality/safety inspection,
  schedule a job (with a calendar date picker), raise a client bill (manager only), add
  materials/equipment/crews (manager only).
- **Edit** — advance a job's status straight from the table; it writes back to Zoho.
- **Reports** — Package Budget, Overdue Jobs, Vendor Outstanding, Inventory — all derived
  from the live modules, exportable to CSV / print to PDF.

---

## Architecture

The UI is served from **Catalyst Slate** (`*.onslate.in`) and the API is a **Catalyst
AdvancedIO serverless function** on `*.catalystserverless.in` — different origins, so every
call is cross-origin.

```
Browser (Slate, vanilla JS)                greenfield-ssg.onslate.in
   │  shared-credential sign-in → HMAC-signed token in X-App-Token
   ▼
/server/sitewise_api  (Catalyst AdvancedIO function, Node 20)
   │  holds the Zoho OAuth refresh token; the browser never sees a Zoho token
   ▼
Zoho Projects v3 API  (projectsapi.zoho.in)  — 9 custom modules
```

No external database. The client resolves its API base at runtime (`?api=…` →
`window.SITEWISE_API` → relative path when served from Catalyst → hardcoded default), so
the two halves can move without a rebuild.

### Data model — 9 Zoho Projects custom modules

All created through the **Zoho Projects MCP server** (modules, fields, options, records):

| Module | Rows | Purpose |
|---|---|---|
| `building_project` | 6 | The airport work packages (budget, spent, status, progress, client, site manager) |
| `site_job` | 7 | Scheduled work items (project, crew, due date, status) |
| `vendor` | 6 | Suppliers & subcontractors (category, outstanding, rating, terms) |
| `material` | 5 | Stock on hand vs reorder level, by package |
| `equipment` | 6 | Plant & machinery (type, availability, location, operator) |
| `labour_crew` | 6 | Crews on site (trade, headcount, present today, package) |
| `purchase_request` | 6+ | Material/hire requests → vendors (status, value) |
| `client_bill` | 6 | Running-account bills to the airport authorities (amount, status) |
| `site_inspection` | 8 | Quality & Safety inspections (type, result, inspector) |

---

## Repository layout

```
sitewise/
├── catalyst.json                     project + deploy config (functions.targets, client)
├── client/                           the Slate app (set as the Slate root)
│   ├── index.html                    login gate + app shell + drawer
│   ├── app.css                       design system (light + dark)
│   └── app.js                        SPA: router, views, filters, create/edit, date picker
└── functions/sitewise_api/           the Catalyst function
    ├── index.js                      OAuth, HMAC auth, Zoho reads/writes for all modules
    ├── catalyst-config.json          advancedio, node20
    └── package.json                  express
```

## Deploy

Prerequisites: `npm i -g zcatalyst-cli`, `catalyst login`, and a Zoho Projects portal with
the modules above.

**Function** — via the CLI (Slate does not host functions), from `sitewise/`:

```bash
cd sitewise
catalyst deploy --only functions
```

**UI** — via Slate, from this GitHub repo. In the Catalyst console → **Slate**, connect this
repository, branch `main`, framework **Static**, and set **Root directory = `sitewise/client`**
(otherwise `/` serves a 404). Whitelist the Slate origin under the project's **CORS domains**.

Smoke-test the function before debugging the UI:

```bash
curl https://<project>.development.catalystserverless.in/server/sitewise_api/api/health
# {"ok":true,"portal":"…","credentialsConfigured":true}
```

### Environment variables

Set on the `sitewise_api` function (Catalyst console → Development → Environment Variables).
Never commit them.

| Key | Purpose |
|---|---|
| `ZOHO_CLIENT_ID` / `ZOHO_CLIENT_SECRET` | Self Client credentials (`api-console.zoho.in`) |
| `ZOHO_REFRESH_TOKEN` | Refresh token — **needs write scope** (see below) |
| `ZOHO_PORTAL_ID` | Projects portal id |
| `APP_SESSION_SECRET` | HMAC key for session tokens (any long random string) |
| `APP_USERNAME` / `APP_PASSWORD`, `APP_FOREMAN_USERNAME` / `APP_FOREMAN_PASSWORD` | Optional — override the demo logins |

Reads need only READ scope, but **create/edit needs `.ALL`**:

```
ZohoProjects.projects.ALL,ZohoProjects.tasks.ALL,ZohoProjects.portals.ALL,ZohoProjects.timesheets.ALL,ZohoProjects.bugs.ALL,ZohoProjects.milestones.ALL,ZohoProjects.tags.ALL,ZohoProjects.users.ALL,ZohoProjects.search.READ
```

### Sign-in

`POST /api/login` checks the credentials against env vars and returns an HMAC-SHA256 signed
token (username, role, 12-hour expiry). The browser keeps it in `sessionStorage` and sends it
in **`X-App-Token`** (not `Authorization` — see below); every data route is behind a
`requireAuth` guard with a constant-time signature check. Deliberately modest — one shared
credential per role, no user store — the right amount of auth for a demo, and the README says so.

---

## What broke

The things that cost the most time. Most only surface *after* deploy, which is what makes
them worth writing down.

**1. Catalyst reserves the `Authorization` header.** Any request carrying
`Authorization: Bearer …` to an AdvancedIO function is validated by Catalyst as *its own*
OAuth token and returns `401 INVALID_TOKEN` **before reaching your code** — even on an open
route. Our HMAC session token collided with it. Fix: carry the session token in a custom
**`X-App-Token`** header.

**2. Slate ↔ function CORS is a two-part fix, and part two is a trap.** (a) Catalyst
intercepts `OPTIONS` at the platform level, so an Express CORS handler never runs — you must
whitelist the Slate origin under the project's **CORS domains**. (b) Once you do, if the
function **also** sets `Access-Control-Allow-Origin`, the browser sees the header twice
(`"contains multiple values"`) and blocks it. Whitelist in Catalyst **and remove CORS from the
function.**

**3. Cold-start 502 from concurrent token refreshes.** `/bootstrap` fires nine module reads in
parallel; on a cold instance they each called `accessToken()` with an empty cache and POSTed to
Zoho's token endpoint simultaneously — Zoho rejects the burst and the whole dashboard 502s. Fix:
coalesce into a **single in-flight refresh** promise.

**4. Custom-module writes need `.ALL`, not `.READ`.** Reads work with a read scope, but
`PATCH`/`POST` to a custom module returns `401 INVALID_OAUTHSCOPE`. The write-back and create
forms need `ZohoProjects.projects.ALL`.

**5. A CSS class silently beats the `hidden` attribute.** `.gate { display: grid }` and
`.shell { display: grid }` outrank the UA `[hidden] { display:none }` (equal specificity, author
wins), so toggling `hidden` never hid them — the login screen stayed layered over the app. Fix:
`.gate[hidden], .shell[hidden] { display: none }`.

**6. Zoho Projects v3 returns inconsistent JS types.** `Numeric` fields come back as **strings**
(`"70"`), `Double` as numbers, checkboxes as booleans. Coerce every number with `Number()` or
sums silently concatenate.

**7. Deploy plumbing.** `catalyst.json` needs an explicit `functions.targets` array (not just
`source`); the web-client `name` in `client-package.json` cannot be renamed once the project has
one; a subfolder deploy needs the `.catalystrc` project-link file present; and creating a module
named "Construction Project" 500'd while "Building Project" succeeded — module names appear to
collide with something server-side.

**8. Static-asset caching.** Catalyst caches the client assets, so after a redeploy the browser
serves the old `app.js` until you **hard-refresh** (Cmd/Ctrl-Shift-R). The API sends
`Cache-Control: no-store` so data never goes stale, but the JS bundle can.

---

## Built with AI

The schema, custom modules, fields and demo data were created through the **Zoho Projects MCP
server**; the UI, the Catalyst function and this README were generated and iterated with
**Claude**. The build owns the ideation, code and debugging end to end.
