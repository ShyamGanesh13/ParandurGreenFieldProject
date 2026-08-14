# Parandur — Land & Resettlement Control Room

A custom project-management application for **public infrastructure land acquisition
and rehabilitation**, built on Zoho Projects as the sole source of truth and deployed
on Zoho Catalyst.

Modelled on the publicly reported Parandur greenfield airport project in Kancheepuram
district, Tamil Nadu. This is a planning tool, not a position on the project.

---

## The problem

Roughly 3,000 of 5,746 acres have been acquired and compensation has been paid out at
scale. But acquisition and *resettlement* are tracked as if they were the same thing,
and they are not. A district administration can tell you how many acres it controls.
It cannot readily tell you how many of the 1,024 displaced households have actually
received all five things they were promised — compensation, a house site, a built
house, a livelihood grant, and one government job per family.

This application makes that gap the headline number.

## The users

- **Revenue officers** working parcel by parcel through notification, survey,
  objections, award, disbursement, possession and mutation.
- **R&R officers** responsible for entitlement delivery per household.
- **The district collector**, who needs to know which villages are stuck and why.

## The workflows

1. **Acquisition register** — a village × stage matrix in acres, the unit the
   business actually uses. Cells redden as parcels sit longer in one stage, so
   invisible stalling becomes visible.
2. **Entitlement cascade** — the five promises, in delivery order, showing the
   collapse from money paid to jobs provided.
3. **Blocked and ageing** — every parcel that cannot advance, longest-stuck first,
   with the legal reason and any pending case.
4. **Stage transitions** — recorded back into Zoho Projects, resetting the clock.
5. **Objection triage** — paste a petition in English or Tamil; it is classified,
   summarised, assigned a blocking reason, and filed against the parcel or household.

---

## Architecture

```
Browser (Catalyst Slate, vanilla JS)
   │  Catalyst Authentication gates the UI
   ▼
/server/parandur_api  (Catalyst AdvancedIO function, Node 20)
   │  holds the OAuth refresh token; the browser never sees a Zoho token
   ▼
Zoho Projects v3 API  (projectsapi.zoho.in)
   ├── projects              → 1 programme + 6 revenue villages
   ├── land_parcel  (org)    → 31 parcels, 9 stages as native statuses
   └── affected_family (org) → 21 households, 5 entitlement checkboxes
```

No external database. Every figure on screen is read live from Zoho Projects.

### Why the acquisition stage is a *status*, not a picklist

Both custom modules use the module's built-in `status` field for their lifecycle —
the nine acquisition stages, and the five relocation states. That buys the status
timeline, `all_open`/`all_closed` filtering, and closed-type semantics for free,
rather than reimplementing them in a custom picklist.

---

## Deploy

Prerequisites: `npm i -g zcatalyst-cli`, and a Zoho Projects portal with the schema
below.

```bash
# 1. authenticate the CLI against the same account as the portal
catalyst login

# 2. from the repo root
catalyst deploy
```

If `catalyst deploy` complains about the project configuration, run `catalyst init`
in a scratch directory, choose *Functions (AdvancedIO, Node)* and *Web Client*, then
copy `functions/parandur_api/index.js`, `client/index.html`, `client/app.css` and
`client/app.js` into the generated scaffold. The generated config always wins over
the hand-written one in this repo.

### Environment variables

Set these in the Catalyst console under **Settings → Environment Variables**. Never
commit them.

| Key | Purpose |
|---|---|
| `ZOHO_CLIENT_ID` | Self Client id from the Zoho Developer Console |
| `ZOHO_CLIENT_SECRET` | Self Client secret |
| `ZOHO_REFRESH_TOKEN` | Refresh token generated from the self-client grant |
| `ZOHO_PORTAL_ID` | Projects portal id |
| `ZOHO_PROGRAMME_PROJECT_ID` | The `ParandurAirportPlanner` project id |
| `ANTHROPIC_API_KEY` | Optional. Without it, triage falls back to keyword rules |
| `APP_USERNAME` / `APP_PASSWORD` | Optional. Overrides the built-in demo login |
| `APP_SESSION_SECRET` | Optional but recommended. HMAC key for session tokens |

Required OAuth scopes:

```
ZohoProjects.portals.READ,ZohoProjects.projects.ALL,
ZohoProjects.tasks.ALL,ZohoProjects.custom_fields.READ
```

Add the Slate origin under **CORS domains** in the Catalyst console. Catalyst
Authentication is *not* used — the app carries its own sign-in.

### Sign-in

| Username | Password | Role |
|---|---|---|
| `collector` | `parandur2026` | District Collector |
| `rrofficer` | `parandur2026` | Rehabilitation Officer |

`POST /api/login` checks the credentials against environment variables and returns
an HMAC-signed token carrying the username, role and a 12-hour expiry. The browser
keeps it in `sessionStorage` and sends it as a bearer token; every data route is
behind a `requireAuth` guard that verifies the signature with a constant-time
compare and rejects anything expired or tampered with.

This is deliberately modest: one shared credential per role, no user store, no
password hashing, no refresh. It is the right amount of authentication for a demo
and the wrong amount for real land records — that would need per-officer accounts,
hashed credentials, and an audit trail of who moved which parcel.

---

## What broke

The five things that cost the most time. All are Zoho Projects v3 behaviours that
are either undocumented or documented somewhere other than where you need them.

**1. Organisation-scope custom modules cannot be associated with a project.**
Sending `project: {id}` on a record create returns `403 PROJECT_CHECK / "Invalid
project"`. This is the central modelling trade-off and nothing warns you about it:
*project-scoped* modules get the native parent link but force one API read per
project for any cross-project view; *organisation-scoped* modules give you the whole
set in one read but you must denormalise the parent as a picklist. The village ×
stage matrix needs every parcel at once, so organisation scope won — at the cost of
a redundant `village` field on every record. I built it the other way first and had
to reverse.

**2. Currency fields cache their currency code at field-creation time.** The field
was created with `currency_value: INR` and every write sends
`currency_code: "INR"`, yet every read returns `"currency_code": "USD"` and
`"formatted_amount": "$ 2,024,000,000.00"`. Because `currencylist_type` resolves to
`project_currency` and an org-scope record has no project, it falls back to the
portal base currency. Changing the portal currency to INR afterwards does **not**
retrofit existing fields. The `amount` is always correct, so the fix is to ignore
`formatted_amount` entirely and format from the raw number client-side. Rupee figures
still render as dollars inside the Zoho Projects UI.

**3. Field metadata misreports precision.** `extent` was created with
`precision_value: 3`; `GET /settings/fields` reports `precision_value: 0`. Values
like `12.345` store and return perfectly intact. Don't trust the metadata — write one
record and read it back.

**4. Numeric and Double return different JavaScript types.** `Numeric` fields come
back as **strings** (`"615"`, `"34"`), `Double` as numbers (`986.0`), checkboxes as
real booleans. Summing acres worked; summing household counts silently produced
string concatenation until every read went through a `Number()` coercion.

**5. Blueprints are Task-only.** The plan was to drive parcel stage transitions
through a Blueprint so legal transitions were enforced by Zoho rather than by our
code. But `GET /automation/blueprints` accepts exactly one value for `module_name`,
and it is `Task` — there is no blueprint support for custom modules, and there is no
create-blueprint API at all, only read and execute. Stage transitions are therefore
validated in the serverless function.

Two smaller ones worth knowing: list endpoints default to **`per_page=20`**, so a
31-record module silently returns 20 unless you pass it explicitly; and picklist
options must be created as a **separate `create_bulk_options` call** after the field,
because inline options on field creation are accepted and then dropped.

Also: the MCP server exposes no project-group endpoints and Catalyst's MCP has no
create-project endpoint, so those two steps were done by hand in the respective
consoles.
