'use strict';

/**
 * Sitewise — Construction Operations. API facade over Zoho Projects.
 *
 * All application data lives in Zoho Projects custom modules; this function
 * holds the OAuth credentials so the browser never sees a Zoho token, reads the
 * four Sitewise modules and shapes them for the UI.
 *
 * Modules (portal shyamdotganeshtestzohotestdotcom):
 *   building_project  contract_value, amount_spent, build_status, progress, client, site_location, site_manager, project_code
 *   vendor            category, outstanding, rating, payment_terms
 *   material          unit, on_hand, reorder_level, site
 *   site_job          project_name, crew, site_job_cf_0001 (due date), job_status
 *
 * Zoho v3 quirks handled: `Numeric` returns strings, `Double` returns numbers —
 * every number is coerced with Number().
 */

const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json({ limit: '256kb' }));

// ---------------------------------------------------------------- config
const ACCOUNTS_HOST = process.env.ZOHO_ACCOUNTS_HOST || 'https://accounts.zoho.in';
const PROJECTS_HOST = process.env.ZOHO_PROJECTS_HOST || 'https://projectsapi.zoho.in';
const PORTAL_ID = process.env.ZOHO_PORTAL_ID || '60083137722';

const CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;

/**
 * Application sign-in. A shared credential per role checked against env vars and
 * exchanged for a short-lived HMAC-signed token — deliberately simple, because
 * this is a shared demo account, not a real user store.
 */
const APP_USERS = [
  { username: process.env.APP_USERNAME || 'manager', password: process.env.APP_PASSWORD || 'sitewise2026', name: 'Operations Manager', role: 'manager' },
  { username: process.env.APP_FOREMAN_USERNAME || 'foreman', password: process.env.APP_FOREMAN_PASSWORD || 'sitewise2026', name: 'Site Foreman', role: 'foreman' }
];
const SESSION_SECRET = process.env.APP_SESSION_SECRET || 'sitewise-dev-secret-change-me';
const SESSION_HOURS = 12;

// CORS is handled by Catalyst's platform (add the UI origin under the project's
// CORS domains). The function must NOT also set Access-Control-Allow-Origin, or
// the browser sees a duplicated header and blocks the response. The session token
// travels in X-App-Token because Catalyst reserves Authorization for its own OAuth.

// ---------------------------------------------------------------- oauth
let tokenCache = { value: null, expiresAt: 0 };
async function accessToken() {
  const now = Date.now();
  if (tokenCache.value && now < tokenCache.expiresAt) return tokenCache.value;
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    const err = new Error('Zoho credentials are not configured. Set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET and ZOHO_REFRESH_TOKEN in the Catalyst environment variables.');
    err.status = 503; throw err;
  }
  const body = new URLSearchParams({ refresh_token: REFRESH_TOKEN, client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'refresh_token' });
  const res = await fetch(`${ACCOUNTS_HOST}/oauth/v2/token`, { method: 'POST', body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) { const err = new Error(`Could not refresh the Zoho access token: ${json.error || res.status}`); err.status = 502; throw err; }
  tokenCache = { value: json.access_token, expiresAt: now + ((json.expires_in || 3600) - 60) * 1000 };
  return tokenCache.value;
}
async function zoho(path, { method = 'GET', body, retry = true } = {}) {
  const token = await accessToken();
  const res = await fetch(`${PROJECTS_HOST}/api/v3/portal/${PORTAL_ID}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  if (res.status === 401 && retry) { tokenCache = { value: null, expiresAt: 0 }; return zoho(path, { method, body, retry: false }); }
  const text = await res.text();
  let json; try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text }; }
  if (!res.ok) {
    const detail = json?.error?.details?.[0]?.message || json?.error?.title || res.status;
    const err = new Error(`Zoho Projects rejected ${method} ${path}: ${detail}`);
    err.status = res.status === 429 ? 429 : (res.status === 403 ? 403 : 502);
    err.upstream = json; throw err;
  }
  return json;
}
/** Records come back under data.result (or a few older shapes); normalise. */
function rows(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  return res.data?.result || res.result || res.entities || [];
}
async function listRecords(module) { return rows(await zoho(`/module/${module}/entities?per_page=200`)); }

// ---------------------------------------------------------------- shaping
const num = (v) => (v === null || v === undefined || v === '' ? 0 : Number(v) || 0);
function shapeProject(r) {
  return { name: r.name, code: r.project_code || '', site: r.site_location || '', client: r.client || '',
    budget: num(r.contract_value), spent: num(r.amount_spent), status: r.build_status || 'On Track',
    progress: num(r.progress), mgr: r.site_manager || '' };
}
function shapeVendor(r) { return { name: r.name, category: r.category || '', outstanding: num(r.outstanding), rating: num(r.rating), terms: r.payment_terms || '' }; }
function shapeMaterial(r) { return { name: r.name, unit: r.unit || '', onHand: num(r.on_hand), reorder: num(r.reorder_level), project: r.site || '' }; }
function shapeJob(r) { return { id: r.id, title: r.name, project: r.project_name || '', crew: r.crew || '', due: r.site_job_cf_0001 || '', status: r.job_status || 'Open' }; }
function shapeEquipment(r) { return { name: r.name, type: r.machine_type || '', availability: r.availability || '', location: r.location || '', operator: r.operator || '' }; }
function shapeCrew(r) { return { name: r.name, trade: r.trade || '', headcount: num(r.headcount), present: num(r.present_today), package: r.package || '' }; }
function shapePR(r) { return { name: r.name, package: r.package || '', quantity: r.quantity || '', vendor: r.vendor || '', status: r.request_status || '', value: num(r.order_value) }; }
function shapeBill(r) { return { name: r.name, package: r.package || '', client: r.client || '', amount: num(r.bill_amount), status: r.client_bill_cf_0001 || '' }; }
function shapeInspection(r) { return { name: r.name, type: r.inspection_type || '', package: r.package || '', result: r.result || '', inspector: r.inspector || '' }; }

// ---------------------------------------------------------------- session
const b64 = (s) => Buffer.from(s, 'utf8').toString('base64url');
const unb64 = (s) => Buffer.from(s, 'base64url').toString('utf8');
const sign = (p) => crypto.createHmac('sha256', SESSION_SECRET).update(p).digest('base64url');
function issueToken(u) { const exp = Date.now() + SESSION_HOURS * 3600 * 1000; const p = b64(JSON.stringify({ u: u.username, r: u.role, n: u.name, exp })); return `${p}.${sign(p)}`; }
function readToken(t) {
  if (!t || t.indexOf('.') < 0) return null;
  const [p, mac] = t.split('.'); const exp = sign(p);
  if (mac.length !== exp.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(exp))) return null;
  let c; try { c = JSON.parse(unb64(p)); } catch { return null; }
  return (!c.exp || Date.now() > c.exp) ? null : c;
}
function requireAuth(req, res, next) {
  const token = req.get('x-app-token') || (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const claims = readToken(token);
  if (!claims) return res.status(401).json({ error: 'Your session has expired. Sign in again.' });
  req.user = claims; next();
}

// ---------------------------------------------------------------- routes
app.get(['/api/health', '/health'], (_req, res) => res.json({ ok: true, portal: PORTAL_ID, credentialsConfigured: Boolean(CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN) }));

app.post(['/api/login', '/login'], (req, res) => {
  const { username, password } = req.body || {};
  const u = APP_USERS.find((x) => x.username === String(username || '').trim().toLowerCase() && x.password === password);
  if (!u) return res.status(401).json({ error: 'That username and password do not match.' });
  res.json({ token: issueToken(u), user: { username: u.username, name: u.name, role: u.role }, expiresInHours: SESSION_HOURS });
});

app.get(['/api/session', '/session'], requireAuth, (req, res) => res.json({ user: { username: req.user.u, name: req.user.n, role: req.user.r } }));

app.get(['/api/bootstrap', '/bootstrap'], requireAuth, async (_req, res, next) => {
  try {
    const [projects, vendors, materials, jobs, equipment, crews, purchases, bills, inspections] = await Promise.all([
      listRecords('building_project'), listRecords('vendor'), listRecords('material'), listRecords('site_job'),
      listRecords('equipment'), listRecords('labour_crew'), listRecords('purchase_request'),
      listRecords('client_bill'), listRecords('site_inspection')
    ]);
    res.json({
      source: 'Zoho Projects (live)',
      generatedAt: new Date().toISOString(),
      projects: projects.map(shapeProject),
      vendors: vendors.map(shapeVendor),
      materials: materials.map(shapeMaterial),
      jobs: jobs.map(shapeJob),
      equipment: equipment.map(shapeEquipment),
      crews: crews.map(shapeCrew),
      purchases: purchases.map(shapePR),
      bills: bills.map(shapeBill),
      inspections: inspections.map(shapeInspection)
    });
  } catch (e) { next(e); }
});

/** Write-back: advance or correct a job's status straight into Zoho Projects. */
const JOB_STATUSES = ['Open', 'Overdue', 'Completed'];
app.patch(['/api/jobs/:id/status', '/jobs/:id/status'], requireAuth, async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (JOB_STATUSES.indexOf(status) < 0) return res.status(400).json({ error: 'Pick Open, Overdue, or Completed.' });
    await zoho(`/module/site_job/entities/${req.params.id}`, { method: 'PATCH', body: { job_status: status } });
    res.json({ ok: true, id: req.params.id, status });
  } catch (e) { next(e); }
});

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: err.message || 'Something went wrong reading from Zoho Projects.', ...(err.upstream ? { upstream: err.upstream } : {}) });
});

module.exports = app;
