'use strict';

/**
 * Parandur Land & Resettlement Control Room — API facade.
 *
 * All application data lives in Zoho Projects. This function holds the OAuth
 * credentials so the browser never sees a Zoho token, and normalises the
 * quirks documented in NOTES below.
 *
 * NOTES on Zoho Projects v3 that this file works around:
 *  - `Numeric` custom fields come back as strings ("615"); `Double` as numbers.
 *  - Currency fields cache their currency_code at field-creation time. Ours
 *    report USD regardless of portal currency, so we read `.amount` and format
 *    INR ourselves. Never trust `formatted_amount`.
 *  - Organisation-scope custom modules cannot be associated with a project,
 *    so `village` is a denormalised picklist on each record.
 *  - List endpoints default to per_page=20. Always pass per_page explicitly.
 */

const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json({ limit: '256kb' }));

// ---------------------------------------------------------------- config

const ACCOUNTS_HOST = process.env.ZOHO_ACCOUNTS_HOST || 'https://accounts.zoho.in';
const PROJECTS_HOST = process.env.ZOHO_PROJECTS_HOST || 'https://projectsapi.zoho.in';
const PORTAL_ID = process.env.ZOHO_PORTAL_ID || '60083137722';
const PROGRAMME_PROJECT_ID = process.env.ZOHO_PROGRAMME_PROJECT_ID || '472541000000081067';

const CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

/**
 * Application sign-in.
 *
 * Deliberately simple: a shared credential checked against environment
 * variables, exchanged for a short-lived HMAC-signed token. There is no user
 * store and no password hashing, because there is one shared demo account.
 * If this ever carried real land records it would need per-user accounts,
 * hashed credentials and an audit trail — see README.
 */
const APP_USERS = [
  {
    username: process.env.APP_USERNAME || 'collector',
    password: process.env.APP_PASSWORD || 'parandur2026',
    name: process.env.APP_USER_NAME || 'District Collector, Kancheepuram',
    role: 'collector'
  },
  {
    username: process.env.APP_RR_USERNAME || 'rrofficer',
    password: process.env.APP_RR_PASSWORD || 'parandur2026',
    name: 'Rehabilitation Officer',
    role: 'rr'
  }
];

const SESSION_SECRET = process.env.APP_SESSION_SECRET || 'parandur-dev-secret-change-me';
const SESSION_HOURS = 12;

/**
 * CORS. The UI is served from Slate (*.onslate.in) while this function lives on
 * *.catalystserverless.in, so every call is cross-origin. Auth travels as a
 * bearer token rather than a cookie, so credentials are not needed and the
 * allow-list can stay strict.
 */
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(?:[a-z0-9-]+\.)+onslate\.in$/i,
  /^https:\/\/(?:[a-z0-9-]+\.)+catalystserverless\.in$/i,
  /^https:\/\/(?:[a-z0-9-]+\.)+catalystserverless\.com$/i,
  /^http:\/\/localhost(:\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/i
];

const EXTRA_ORIGINS = (process.env.APP_ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function originAllowed(origin) {
  if (!origin) return false;
  if (EXTRA_ORIGINS.indexOf(origin) > -1) return true;
  return ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin));
}

app.use((req, res, next) => {
  const origin = req.get('origin');
  if (originAllowed(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
    res.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-App-Token');
    res.set('Access-Control-Max-Age', '86400');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

/** Canonical acquisition stage order. Ids are portal-specific. */
const STAGES = [
  { id: '472541000000081007', name: 'Not Notified', short: 'Not notified' },
  { id: '472541000000081008', name: 'Notified', short: 'Notified' },
  { id: '472541000000081009', name: 'Survey and Measurement', short: 'Survey' },
  { id: '472541000000081010', name: 'Objections Filed', short: 'Obj. filed' },
  { id: '472541000000081011', name: 'Objections Heard', short: 'Obj. heard' },
  { id: '472541000000081012', name: 'Award Passed', short: 'Award' },
  { id: '472541000000081013', name: 'Compensation Disbursed', short: 'Disbursed' },
  { id: '472541000000081014', name: 'Possession Taken', short: 'Possession' },
  { id: '472541000000081015', name: 'Mutation Complete', short: 'Mutation' }
];

/** Stages at or beyond which the state actually controls the land. */
const SECURED_FROM_INDEX = 7; // Possession Taken

const VILLAGE_ORDER = ['Parandur', 'Ekanapuram', 'Nelvoy', 'Valathoor', 'Podavur', 'Thandalam'];

// ---------------------------------------------------------------- oauth

let tokenCache = { value: null, expiresAt: 0 };

async function accessToken() {
  const now = Date.now();
  if (tokenCache.value && now < tokenCache.expiresAt) return tokenCache.value;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    const err = new Error(
      'Zoho credentials are not configured. Set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET ' +
      'and ZOHO_REFRESH_TOKEN in the Catalyst environment variables.'
    );
    err.status = 503;
    throw err;
  }

  const body = new URLSearchParams({
    refresh_token: REFRESH_TOKEN,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'refresh_token'
  });

  const res = await fetch(`${ACCOUNTS_HOST}/oauth/v2/token`, { method: 'POST', body });
  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json.access_token) {
    const err = new Error(`Could not refresh the Zoho access token: ${json.error || res.status}`);
    err.status = 502;
    throw err;
  }

  // Refresh a minute early so an in-flight request never straddles expiry.
  const ttl = ((json.expires_in || 3600) - 60) * 1000;
  tokenCache = { value: json.access_token, expiresAt: now + ttl };
  return tokenCache.value;
}

async function zoho(path, { method = 'GET', body, retry = true } = {}) {
  const token = await accessToken();
  const res = await fetch(`${PROJECTS_HOST}/api/v3/portal/${PORTAL_ID}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  if (res.status === 401 && retry) {
    tokenCache = { value: null, expiresAt: 0 };
    return zoho(path, { method, body, retry: false });
  }

  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text }; }

  if (!res.ok) {
    const detail = json?.error?.details?.[0]?.message || json?.error?.title || res.status;
    const err = new Error(`Zoho Projects rejected ${method} ${path}: ${detail}`);
    err.status = res.status === 429 ? 429 : 502;
    err.upstream = json;
    throw err;
  }
  return json;
}

// ---------------------------------------------------------------- helpers

const num = (v) => (v === null || v === undefined || v === '' ? 0 : Number(v));
const money = (field) => (field && typeof field.amount === 'number' ? field.amount : 0);

function daysSince(isoDate) {
  if (!isoDate) return null;
  const then = Date.parse(`${String(isoDate).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(then)) return null;
  return Math.max(0, Math.floor((Date.now() - then) / 86400000));
}

function stageIndex(statusId) {
  return STAGES.findIndex((s) => s.id === statusId);
}

function shapeParcel(r) {
  const idx = stageIndex(r.status?.id);
  const age = daysSince(r.stage_entry_date);
  return {
    id: r.id,
    label: r.name,
    surveyNumber: r.survey_number || '',
    village: r.village || 'Unassigned',
    extent: num(r.extent),
    landClass: r.land_class || '',
    ownership: r.ownership_type || '',
    structures: num(r.structures_on_parcel),
    stage: r.status?.name || 'Unknown',
    stageId: r.status?.id || null,
    stageIndex: idx,
    stageEntryDate: r.stage_entry_date || null,
    daysInStage: age,
    blocking: r.blocking_reason && r.blocking_reason !== 'None' ? r.blocking_reason : null,
    awardAmount: money(r.award_amount),
    totalCompensation: money(r.total_compensation),
    disbursementDate: r.disbursement_date || null,
    caseNumber: r.case_number || null,
    court: r.court && r.court !== 'None' ? r.court : null,
    nextHearingDate: r.next_hearing_date || null,
    objectionSummary: r.objection_summary || '',
    secured: idx >= SECURED_FROM_INDEX
  };
}

function shapeFamily(r) {
  return {
    id: r.id,
    householdId: r.name,
    head: r.head_of_household || '',
    village: r.village || 'Unassigned',
    category: r.category || '',
    members: num(r.family_members),
    linkedSurveyNumbers: r.linked_survey_numbers || '',
    relocation: r.status?.name || 'Unknown',
    entitlements: {
      compensationPaid: !!r.compensation_paid,
      houseSiteAllotted: !!r.house_site_allotted,
      houseHandedOver: !!r.replacement_house_handed_over,
      employmentProvided: !!r.employment_provided,
      livelihoodGrantPaid: !!r.livelihood_grant_paid
    },
    grievanceStatus: r.grievance_status && r.grievance_status !== 'None' ? r.grievance_status : null,
    grievanceNotes: r.grievance_notes || ''
  };
}

function shapeVillage(p) {
  return {
    id: p.id,
    key: p.key,
    name: p.name,
    taluk: p.taluk || '',
    totalExtent: num(p.total_extent_required),
    governmentExtent: num(p.government_land_extent),
    privateExtent: num(p.private_land_extent),
    households: num(p.households_affected),
    villageStatus: p.village_status || '',
    description: p.description || ''
  };
}

async function listRecords(module) {
  const out = [];
  for (let page = 1; page <= 5; page += 1) {
    const res = await zoho(`/module/${module}/entities?per_page=200&page=${page}`);
    const rows = Array.isArray(res) ? res : res?.entities || res?.[module] || [];
    out.push(...rows);
    if (rows.length < 200) break;
  }
  return out;
}

// ---------------------------------------------------------------- session

const b64 = (s) => Buffer.from(s, 'utf8').toString('base64url');
const unb64 = (s) => Buffer.from(s, 'base64url').toString('utf8');

function sign(payload) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
}

function issueToken(user) {
  const expires = Date.now() + SESSION_HOURS * 3600 * 1000;
  const payload = b64(JSON.stringify({ u: user.username, r: user.role, n: user.name, exp: expires }));
  return `${payload}.${sign(payload)}`;
}

function readToken(token) {
  if (!token || token.indexOf('.') < 0) return null;
  const [payload, mac] = token.split('.');
  const expected = sign(payload);
  // Constant-time compare; lengths must match first or timingSafeEqual throws.
  if (mac.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
  let claims;
  try { claims = JSON.parse(unb64(payload)); } catch { return null; }
  if (!claims.exp || Date.now() > claims.exp) return null;
  return claims;
}

function requireAuth(req, res, next) {
  // Catalyst intercepts the `Authorization` header and validates it as its own
  // OAuth token before the request reaches this function, so our session token
  // travels in a custom header. `Authorization` stays as a fallback for local
  // dev, where there is no Catalyst layer in front.
  const token =
    req.get('x-app-token') ||
    (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const claims = readToken(token);
  if (!claims) {
    return res.status(401).json({ error: 'Your session has expired. Sign in again.' });
  }
  req.user = claims;
  next();
}

app.post(['/api/login', '/login'], (req, res) => {
  const { username, password } = req.body || {};
  const user = APP_USERS.find(
    (u) => u.username === String(username || '').trim().toLowerCase() && u.password === password
  );
  if (!user) {
    return res.status(401).json({ error: 'That username and password do not match.' });
  }
  res.json({
    token: issueToken(user),
    user: { username: user.username, name: user.name, role: user.role },
    expiresInHours: SESSION_HOURS
  });
});

app.get(['/api/session', '/session'], requireAuth, (req, res) => {
  res.json({ user: { username: req.user.u, name: req.user.n, role: req.user.r } });
});

// ---------------------------------------------------------------- routes

app.get(['/api/health', '/health'], (_req, res) => {
  res.json({
    ok: true,
    portal: PORTAL_ID,
    credentialsConfigured: Boolean(CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN),
    triage: ANTHROPIC_API_KEY ? 'model' : 'rules'
  });
});

app.get(['/api/bootstrap', '/bootstrap'], requireAuth, async (_req, res, next) => {
  try {
    const [projects, parcelRows, familyRows] = await Promise.all([
      zoho('/projects?per_page=100'),
      listRecords('land_parcel'),
      listRecords('affected_family')
    ]);

    const allProjects = Array.isArray(projects) ? projects : projects?.projects || [];
    const programme = allProjects.find((p) => p.id === PROGRAMME_PROJECT_ID);
    const villages = allProjects
      .filter((p) => p.id !== PROGRAMME_PROJECT_ID)
      .map(shapeVillage)
      .sort((a, b) => VILLAGE_ORDER.indexOf(a.name) - VILLAGE_ORDER.indexOf(b.name));

    const parcels = parcelRows.map(shapeParcel);
    const families = familyRows.map(shapeFamily);

    const securedPrivate = parcels
      .filter((p) => p.secured)
      .reduce((sum, p) => sum + p.extent, 0);
    const governmentExtent = programme
      ? num(programme.government_land_extent)
      : villages.reduce((s, v) => s + v.governmentExtent, 0);
    const totalExtent = programme
      ? num(programme.total_extent_required)
      : villages.reduce((s, v) => s + v.totalExtent, 0);

    const entitlementKeys = [
      'compensationPaid',
      'houseSiteAllotted',
      'houseHandedOver',
      'employmentProvided',
      'livelihoodGrantPaid'
    ];
    const entitlementTotals = {};
    entitlementKeys.forEach((k) => {
      entitlementTotals[k] = families.filter((f) => f.entitlements[k]).length;
    });

    res.json({
      generatedAt: new Date().toISOString(),
      programme: {
        name: programme?.name || 'ParandurAirportPlanner',
        totalExtent,
        governmentExtent,
        privateExtent: programme ? num(programme.private_land_extent) : totalExtent - governmentExtent,
        householdsAffected: programme ? num(programme.households_affected) : 0,
        securedPrivate,
        securedTotal: governmentExtent + securedPrivate
      },
      stages: STAGES,
      villages,
      parcels,
      families,
      entitlementTotals,
      familiesSurveyed: families.length
    });
  } catch (e) { next(e); }
});

/** Advance or correct a parcel's acquisition stage. */
app.patch(['/api/parcels/:id/stage', '/parcels/:id/stage'], requireAuth, async (req, res, next) => {
  try {
    const { stageId, stageEntryDate } = req.body || {};
    if (!STAGES.some((s) => s.id === stageId)) {
      return res.status(400).json({ error: 'Pick one of the nine acquisition stages.' });
    }
    const body = {
      status: { id: stageId },
      stage_entry_date: stageEntryDate || new Date().toISOString().slice(0, 10)
    };
    const updated = await zoho(`/module/land_parcel/entities/${req.params.id}`, {
      method: 'PATCH',
      body
    });
    res.json(shapeParcel(updated));
  } catch (e) { next(e); }
});

// ------------------------------------------------- objection triage

const OBJECTION_TYPES = [
  'Water Body Impact',
  'Compensation Inadequate',
  'Livelihood Loss',
  'Title or Heirship Dispute',
  'Consent Refusal',
  'Rehabilitation Shortfall'
];

const BLOCKING_BY_TYPE = {
  'Water Body Impact': 'Objection Pending',
  'Compensation Inadequate': 'Valuation Disputed',
  'Livelihood Loss': 'Objection Pending',
  'Title or Heirship Dispute': 'Title Dispute',
  'Consent Refusal': 'Consent Refused',
  'Rehabilitation Shortfall': 'Objection Pending'
};

/** Keyword fallback so a demo never dies because a key is missing or the model is slow. */
function triageByRules(text) {
  const t = (text || '').toLowerCase();
  const hits = [
    ['Water Body Impact', /tank|water|kanmai|eri|irrigation|ayacut|flood|drain|channel|lake|hydro/],
    ['Compensation Inadequate', /compensation|guideline value|rate|market value|solatium|amount|under.?valu|price/],
    ['Livelihood Loss', /livelihood|labour|labourer|coolie|tenant|cultivat|graz|shop|trade|income|employment/],
    ['Title or Heirship Dispute', /title|heir|legal heir|partition|patta|succession|co.?sharer|dispute over own/],
    ['Consent Refusal', /refus|will not|not willing|decline|reject|oppose|surrender.{0,12}no|boycott/],
    ['Rehabilitation Shortfall', /rehabilit|house site|resettle|relocat|layout|alternate site|r&r|dwelling/]
  ].filter(([, re]) => re.test(t));

  const type = hits.length ? hits[0][0] : 'Compensation Inadequate';
  const first = (text || '').trim().split(/(?<=[.!?])\s+/)[0] || '';
  return {
    objectionType: type,
    blockingReason: BLOCKING_BY_TYPE[type],
    summary: first.slice(0, 400) || 'Objection recorded; no substantive ground identified from the text.',
    recommendedAction: 'Place before the enquiry officer for hearing under the objection procedure.',
    severity: type === 'Consent Refusal' || type === 'Title or Heirship Dispute' ? 'High' : 'Medium',
    classifier: 'rules'
  };
}

async function triageByModel(text) {
  const system =
    'You triage land acquisition objection petitions for a revenue department in Tamil Nadu. ' +
    'Input may be in English or Tamil. Respond with a single JSON object and nothing else — ' +
    'no preamble, no markdown fences. Schema: ' +
    '{"objectionType": one of ' + JSON.stringify(OBJECTION_TYPES) + ', ' +
    '"blockingReason": one of ["Objection Pending","Title Dispute","Heirship Unresolved",' +
    '"Writ Pending","Valuation Disputed","Consent Refused"], ' +
    '"summary": "neutral 1-2 sentence summary in English, under 400 characters", ' +
    '"recommendedAction": "the next administrative step, one sentence", ' +
    '"severity": one of ["Low","Medium","High"]}. ' +
    'Summarise what the petitioner asserts without endorsing or dismissing it.';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1000,
      system,
      messages: [{ role: 'user', content: text }]
    })
  });

  if (!res.ok) throw new Error(`Triage model returned ${res.status}`);
  const data = await res.json();
  const raw = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .replace(/```json|```/g, '')
    .trim();

  const parsed = JSON.parse(raw);
  if (!OBJECTION_TYPES.includes(parsed.objectionType)) {
    throw new Error('Triage model returned an unknown objection type');
  }
  return { ...parsed, classifier: 'model' };
}

app.post(['/api/triage', '/triage'], requireAuth, async (req, res, next) => {
  try {
    const { text, parcelId, familyId, commit } = req.body || {};
    if (!text || String(text).trim().length < 20) {
      return res.status(400).json({ error: 'Paste the objection or grievance text — at least a sentence or two.' });
    }

    let result;
    if (ANTHROPIC_API_KEY) {
      try {
        result = await triageByModel(String(text));
      } catch (modelError) {
        result = { ...triageByRules(text), degradedFrom: modelError.message };
      }
    } else {
      result = triageByRules(text);
    }

    if (commit && parcelId) {
      const updated = await zoho(`/module/land_parcel/entities/${parcelId}`, {
        method: 'PATCH',
        body: {
          blocking_reason: result.blockingReason,
          objection_summary: `[${result.objectionType}] ${result.summary}`.slice(0, 1000)
        }
      });
      result.parcel = shapeParcel(updated);
    }

    if (commit && familyId) {
      const updated = await zoho(`/module/affected_family/entities/${familyId}`, {
        method: 'PATCH',
        body: {
          grievance_status: result.severity === 'High' ? 'Escalated' : 'Under Review',
          grievance_notes: `[${result.objectionType}] ${result.summary}`.slice(0, 1000)
        }
      });
      result.family = shapeFamily(updated);
    }

    res.json(result);
  } catch (e) { next(e); }
});

// ---------------------------------------------------------------- errors

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: err.message || 'Something went wrong reading from Zoho Projects.',
    ...(err.upstream ? { upstream: err.upstream } : {})
  });
});

module.exports = app;
