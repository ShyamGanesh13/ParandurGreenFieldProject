/* Parandur — Land & Resettlement Control Room (client) */

(function () {
  'use strict';

  /**
   * The UI is served from Slate; the function lives on the Catalyst domain.
   * Same-origin only works when both are served from Catalyst, so default to
   * the absolute function URL and allow an override without a rebuild:
   *   window.PARANDUR_API = 'https://.../server/parandur_api/api'
   * or  ?api=... in the query string.
   */
  var DEFAULT_API =
    'https://parandurairportplanner-60083086752.development.catalystserverless.in/server/parandur_api/api';

  var API = (function () {
    var q = new URLSearchParams(window.location.search).get('api');
    if (q) return q.replace(/\/$/, '');
    if (window.PARANDUR_API) return String(window.PARANDUR_API).replace(/\/$/, '');
    // Served from Catalyst itself? Then a relative path is fine.
    if (/catalystserverless\.(in|com)$/i.test(window.location.hostname)) {
      return '/server/parandur_api/api';
    }
    return DEFAULT_API;
  })();
  var TOKEN_KEY = 'parandur.session';
  var state = { data: null, selection: null, user: null };

  function token()      { try { return sessionStorage.getItem(TOKEN_KEY); } catch (e) { return state._t || null; } }
  function setToken(t)  { state._t = t; try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY); } catch (e) {} }

  /** fetch with the session token attached; bounces to the gate on 401. */
  function api(path, opts) {
    opts = opts || {};
    var headers = opts.headers || {};
    headers.Authorization = 'Bearer ' + (token() || '');
    if (opts.body) headers['Content-Type'] = 'application/json';
    return fetch(API + path, { method: opts.method || 'GET', headers: headers, body: opts.body })
      .then(function (r) {
        if (r.status === 401) { setToken(null); showGate('Your session expired. Sign in again.'); throw new Error('Session expired'); }
        return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Request failed'); return j; });
      });
  }

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  var acres = function (n) {
    return (Math.round(n * 100) / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  /** Format from the raw amount — Zoho reports the wrong currency_code on these fields. */
  function rupees(n) {
    if (!n) return '\u2014';
    if (n >= 1e7) return '\u20b9 ' + (n / 1e7).toFixed(2) + ' cr';
    if (n >= 1e5) return '\u20b9 ' + (n / 1e5).toFixed(2) + ' lakh';
    return '\u20b9 ' + n.toLocaleString('en-IN');
  }

  function ddmmm(iso) {
    if (!iso) return '\u2014';
    var d = new Date(String(iso).slice(0, 10) + 'T00:00:00Z');
    if (isNaN(d)) return '\u2014';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
  }

  function toast(msg, bad) {
    var t = $('toast');
    t.textContent = msg;
    t.className = 'toast' + (bad ? ' toast--bad' : '');
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.hidden = true; }, 4200);
  }

  function banner(msg) {
    var b = $('banner');
    if (!msg) { b.hidden = true; return; }
    b.textContent = msg;
    b.hidden = false;
  }

  // ------------------------------------------------------------ auth gate

  function showApp() {
    $('gate').hidden = true;
    $('app').hidden = false;
    if (state.user) $('whoami').textContent = state.user.name;
    load();
  }

  function showGate(message) {
    $('app').hidden = true;
    $('gate').hidden = false;
    var err = $('login-error');
    if (message) { err.textContent = message; err.hidden = false; } else { err.hidden = true; }
    setTimeout(function () { $('u').focus(); }, 40);
  }

  function signIn() {
    var btn = $('signin');
    var username = $('u').value.trim();
    var password = $('p').value;
    if (!username || !password) { showGate('Enter both a username and a password.'); return; }

    btn.disabled = true; btn.textContent = 'Signing in\u2026';
    fetch(API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.toLowerCase(), password: password })
    })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error); return j; }); })
      .then(function (j) {
        setToken(j.token);
        state.user = j.user;
        $('p').value = '';
        showApp();
      })
      .catch(function (e) { showGate(e.message || 'Sign-in failed.'); })
      .then(function () { btn.disabled = false; btn.textContent = 'Sign in'; });
  }

  function signOut() {
    setToken(null);
    state.user = null;
    state.data = null;
    closeDrawer();
    showGate();
  }

  function boot() {
    if (!token()) { showGate(); return; }
    api('/session')
      .then(function (j) { state.user = j.user; showApp(); })
      .catch(function () { showGate(); });
  }

  // ------------------------------------------------------------ data

  function load() {
    $('sheet').innerHTML = '<p class="skeleton">Reading the register from Zoho Projects\u2026</p>';
    api('/bootstrap')
      .then(function (data) {
        state.data = data;
        banner(null);
        renderAll();
      })
      .catch(function (e) {
        $('sheet').innerHTML = '<p class="skeleton">' + esc(e.message) + '</p>';
        banner(e.message);
      });
  }

  // ------------------------------------------------------------ render

  function renderAll() {
    renderAcquisition();
    renderSheet();
    renderCascade();
    renderBlocked();
    $('foot-portal').textContent = '60083137722';
    $('foot-time').textContent = 'Read ' + new Date(state.data.generatedAt)
      .toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }

  function renderAcquisition() {
    var p = state.data.programme;
    var total = p.totalExtent || 1;
    var gov = p.governmentExtent;
    var priv = p.securedPrivate;
    var remaining = Math.max(0, total - gov - priv);

    $('bar-gov').style.width = (gov / total * 100).toFixed(2) + '%';
    $('bar-priv').style.width = (priv / total * 100).toFixed(2) + '%';
    $('bar-gov').firstChild.textContent = acres(gov);
    $('bar-priv').firstChild.textContent = acres(priv);

    $('v-gov').textContent = acres(gov) + ' ac';
    $('v-priv').textContent = acres(priv) + ' ac';
    $('v-rem').textContent = acres(remaining) + ' ac';

    $('acq-caption').innerHTML =
      '<b class="mono">' + acres(gov + priv) + '</b> of <b class="mono">' + acres(total) +
      '</b> acres are in government hands. Everything else needs a landowner to part with it.';
  }

  /** Age band for a group of parcels sharing a cell. */
  function band(parcels) {
    if (!parcels.length) return 'empty';
    if (parcels.every(function (p) { return p.secured; })) return 'done';
    var worst = 0, blocked = false;
    parcels.forEach(function (p) {
      if (p.daysInStage != null && p.daysInStage > worst) worst = p.daysInStage;
      if (p.blocking) blocked = true;
    });
    if (blocked || worst > 60) return 'hot';
    if (worst > 30) return 'warm';
    return 'fresh';
  }

  function renderSheet() {
    var d = state.data;
    var byCell = {};
    d.parcels.forEach(function (p) {
      var k = p.village + '||' + p.stageId;
      (byCell[k] = byCell[k] || []).push(p);
    });

    var html = '<table class="reg"><thead><tr>' +
      '<th class="reg__corner">Village</th>';
    d.stages.forEach(function (s) { html += '<th>' + esc(s.short) + '</th>'; });
    html += '<th class="reg__total">Total</th></tr></thead><tbody>';

    var colTotals = d.stages.map(function () { return 0; });
    var grand = 0;

    d.villages.forEach(function (v) {
      var rowParcels = d.parcels.filter(function (p) { return p.village === v.name; });
      var blockedCount = rowParcels.filter(function (p) { return p.blocking; }).length;
      var rowTotal = rowParcels.reduce(function (s, p) { return s + p.extent; }, 0);
      grand += rowTotal;

      html += '<tr' + (blockedCount ? ' class="is-blocked"' : '') + '>';
      html += '<th class="reg__village" scope="row">' + esc(v.name) +
        '<small>' + (blockedCount
          ? blockedCount + ' blocked'
          : esc(v.villageStatus || '\u2014')) + '</small></th>';

      d.stages.forEach(function (s, i) {
        var group = byCell[v.name + '||' + s.id] || [];
        var sum = group.reduce(function (a, p) { return a + p.extent; }, 0);
        colTotals[i] += sum;
        var b = band(group);
        if (!group.length) {
          html += '<td class="cell is-empty"></td>';
        } else {
          html += '<td class="cell cell--' + b + '">' +
            '<button type="button" data-village="' + esc(v.name) + '" data-stage="' + esc(s.id) + '" ' +
            'aria-label="' + esc(v.name + ', ' + s.name + ', ' + acres(sum) + ' acres') + '">' +
            '<b>' + acres(sum) + '</b><i>' + group.length + (group.length === 1 ? ' parcel' : ' parcels') + '</i>' +
            '</button></td>';
        }
      });

      html += '<td class="reg__total">' + acres(rowTotal) + '</td></tr>';
    });

    html += '</tbody><tfoot><tr><th scope="row">All villages</th>';
    colTotals.forEach(function (t) { html += '<td>' + (t ? acres(t) : '\u2014') + '</td>'; });
    html += '<td class="reg__total">' + acres(grand) + '</td></tr></tfoot></table>';

    $('sheet').innerHTML = html;

    Array.prototype.forEach.call($('sheet').querySelectorAll('button[data-village]'), function (btn) {
      btn.addEventListener('click', function () {
        openCell(btn.getAttribute('data-village'), btn.getAttribute('data-stage'));
      });
    });
  }

  var RUNGS = [
    ['compensationPaid', 'Compensation paid', 'money in hand'],
    ['houseSiteAllotted', 'House site allotted', 'a plot on paper'],
    ['houseHandedOver', 'Replacement house handed over', 'somewhere to actually live'],
    ['livelihoodGrantPaid', 'Livelihood grant paid', 'transition support'],
    ['employmentProvided', 'Employment provided', 'one job per family, as promised']
  ];

  function renderCascade() {
    var d = state.data;
    var n = d.familiesSurveyed || 1;
    var fills = ['#2a9d8f', '#5ba98c', '#c99b3e', '#b9762c', '#c2410c'];

    $('promise-caption').innerHTML =
      'Across <b class="mono">' + n + '</b> households on the register, of <b class="mono">' +
      d.programme.householdsAffected.toLocaleString('en-IN') +
      '</b> affected across the alignment.';

    $('cascade').innerHTML = RUNGS.map(function (r, i) {
      var count = d.entitlementTotals[r[0]] || 0;
      var pct = Math.round(count / n * 100);
      return '<div class="rung">' +
        '<div class="rung__label">' + esc(r[1]) + '<small>' + esc(r[2]) + '</small></div>' +
        '<div class="rung__track"><div class="rung__fill" data-pct="' + pct +
        '" style="background:' + fills[i] + '"></div></div>' +
        '<div class="rung__num">' + count + ' <small>/ ' + n + ' \u00b7 ' + pct + '%</small></div>' +
        '</div>';
    }).join('');

    // Animate after paint so the cascade reads as a collapse.
    requestAnimationFrame(function () {
      Array.prototype.forEach.call($('cascade').querySelectorAll('.rung__fill'), function (el, i) {
        setTimeout(function () { el.style.width = el.getAttribute('data-pct') + '%'; }, i * 110);
      });
    });
  }

  function renderBlocked() {
    var rows = state.data.parcels
      .filter(function (p) { return p.blocking && !p.secured; })
      .sort(function (a, b) { return (b.daysInStage || 0) - (a.daysInStage || 0); });

    if (!rows.length) {
      $('blocked-list').innerHTML = '<p class="skeleton" style="padding:16px">Nothing is blocked. Every parcel can advance.</p>';
      return;
    }

    $('blocked-list').innerHTML = rows.map(function (p) {
      var hot = (p.daysInStage || 0) > 60;
      return '<button class="brow" type="button" data-parcel="' + esc(p.id) + '">' +
        '<span class="brow__id">' + esc(p.label) + '<small>' + esc(p.village) + '</small></span>' +
        '<span class="brow__why">' + esc(p.blocking) +
          '<small>' + acres(p.extent) + ' ac' +
          (p.structures ? ' \u00b7 ' + p.structures + ' structures' : '') +
          (p.caseNumber ? ' \u00b7 ' + esc(p.caseNumber) : '') + '</small></span>' +
        '<span class="brow__stage">' + esc(p.stage) + '</span>' +
        '<span class="brow__age' + (hot ? ' is-hot' : '') + '">' +
          (p.daysInStage == null ? '\u2014' : p.daysInStage + 'd') + '</span>' +
        '</button>';
    }).join('');

    Array.prototype.forEach.call($('blocked-list').querySelectorAll('button[data-parcel]'), function (btn) {
      btn.addEventListener('click', function () { openParcel(btn.getAttribute('data-parcel')); });
    });
  }

  // ------------------------------------------------------------ drawer

  function openDrawer(html) {
    $('drawer-body').innerHTML = html;
    $('drawer').hidden = false;
    $('scrim').hidden = false;
    $('drawer').scrollTop = 0;
  }

  function closeDrawer() {
    $('drawer').hidden = true;
    $('scrim').hidden = true;
    state.selection = null;
  }

  function openCell(village, stageId) {
    var d = state.data;
    var stage = d.stages.filter(function (s) { return s.id === stageId; })[0];
    var list = d.parcels
      .filter(function (p) { return p.village === village && p.stageId === stageId; })
      .sort(function (a, b) { return b.extent - a.extent; });
    var sum = list.reduce(function (a, p) { return a + p.extent; }, 0);

    var html = '<div class="dhead"><p class="eyebrow">' + esc(stage.name) + '</p>' +
      '<h3>' + esc(village) + '</h3>' +
      '<p>' + list.length + (list.length === 1 ? ' parcel' : ' parcels') +
      ' \u00b7 ' + acres(sum) + ' acres in this stage</p></div>';

    html += '<div class="plist">' + list.map(function (p) {
      return '<button class="pitem" type="button" data-parcel="' + esc(p.id) + '">' +
        '<span><b>' + esc(p.label) + '</b><small>' +
        esc(p.landClass || '\u2014') + ' \u00b7 ' + esc(p.ownership || '\u2014') +
        (p.blocking ? ' \u00b7 ' + esc(p.blocking) : '') + '</small></span>' +
        '<span>' + acres(p.extent) + ' ac</span></button>';
    }).join('') + '</div>';

    openDrawer(html);
    Array.prototype.forEach.call($('drawer-body').querySelectorAll('button[data-parcel]'), function (btn) {
      btn.addEventListener('click', function () { openParcel(btn.getAttribute('data-parcel')); });
    });
  }

  function openParcel(id) {
    var d = state.data;
    var p = d.parcels.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    state.selection = p;

    var families = d.families.filter(function (f) {
      return f.village === p.village && f.linkedSurveyNumbers &&
        f.linkedSurveyNumbers.split(',').map(function (s) { return s.trim(); }).indexOf(p.surveyNumber) > -1;
    });

    var html = '<div class="dhead"><p class="eyebrow">' + esc(p.village) + ' \u00b7 survey no ' + esc(p.surveyNumber) + '</p>' +
      '<h3>' + esc(p.label) + '</h3>' +
      '<p>' + esc(p.stage) + ' since ' + ddmmm(p.stageEntryDate) +
      (p.daysInStage != null ? ' \u2014 <b>' + p.daysInStage + ' days</b>' : '') + '</p></div>';

    html += '<dl class="kv">' +
      '<dt>Extent</dt><dd>' + acres(p.extent) + ' acres</dd>' +
      '<dt>Land class</dt><dd>' + esc(p.landClass || '\u2014') + '</dd>' +
      '<dt>Ownership</dt><dd>' + esc(p.ownership || '\u2014') + '</dd>' +
      '<dt>Structures</dt><dd>' + p.structures + '</dd>' +
      '<dt>Blocked by</dt><dd>' + (p.blocking
        ? '<span class="tag tag--red">' + esc(p.blocking) + '</span>'
        : '<span class="tag tag--teal">Nothing</span>') + '</dd>' +
      '<dt>Award</dt><dd>' + rupees(p.awardAmount) + '</dd>' +
      '<dt>Total payable</dt><dd>' + rupees(p.totalCompensation) + '</dd>' +
      '<dt>Disbursed</dt><dd>' + ddmmm(p.disbursementDate) + '</dd>' +
      (p.caseNumber
        ? '<dt>Litigation</dt><dd>' + esc(p.caseNumber) + '<br>' + esc(p.court || '') +
          '<br>next hearing ' + ddmmm(p.nextHearingDate) + '</dd>'
        : '') +
      '</dl>';

    if (p.objectionSummary) {
      html += '<div class="dsec"><h4>Objection on record</h4>' +
        '<p class="quote">' + esc(p.objectionSummary) + '</p></div>';
    }

    if (families.length) {
      html += '<div class="dsec"><h4>Households on this parcel</h4><div class="plist">' +
        families.map(function (f) {
          var done = Object.keys(f.entitlements).filter(function (k) { return f.entitlements[k]; }).length;
          return '<button class="pitem" type="button" data-family="' + esc(f.id) + '">' +
            '<span><b>' + esc(f.householdId) + '</b><small>' + esc(f.head) + ' \u00b7 ' + esc(f.category) + '</small></span>' +
            '<span>' + done + '/5</span></button>';
        }).join('') + '</div></div>';
    }

    // Stage advance
    html += '<div class="dsec"><h4>Move this parcel</h4><div class="field">' +
      '<label for="stage-pick">Acquisition stage</label><select id="stage-pick">' +
      d.stages.map(function (s) {
        return '<option value="' + esc(s.id) + '"' + (s.id === p.stageId ? ' selected' : '') + '>' +
          esc(s.name) + '</option>';
      }).join('') + '</select></div>' +
      '<div class="drow"><button class="btn btn--solid" id="do-stage" type="button">Record stage change</button>' +
      '<span class="section-caption" style="margin:0;font-size:11.5px">Writes to Zoho Projects and resets the ageing clock.</span></div></div>';

    // Triage
    html += '<div class="dsec"><h4>Triage an objection petition</h4>' +
      '<div class="field"><label for="triage-text">Paste the petition or grievance letter, English or Tamil</label>' +
      '<textarea id="triage-text" placeholder="e.g. The said land adjoins the village tank and its acquisition will obstruct the channel feeding the ayacut\u2026"></textarea></div>' +
      '<div class="drow"><button class="btn btn--solid" id="do-triage" type="button">Classify</button>' +
      '<button class="btn" id="do-triage-commit" type="button">Classify and file against this parcel</button></div>' +
      '<div id="triage-out"></div></div>';

    openDrawer(html);

    $('do-stage').addEventListener('click', function () { advanceStage(p.id); });
    $('do-triage').addEventListener('click', function () { runTriage(p.id, false); });
    $('do-triage-commit').addEventListener('click', function () { runTriage(p.id, true); });
    Array.prototype.forEach.call($('drawer-body').querySelectorAll('button[data-family]'), function (btn) {
      btn.addEventListener('click', function () { openFamily(btn.getAttribute('data-family')); });
    });
  }

  function openFamily(id) {
    var f = state.data.families.filter(function (x) { return x.id === id; })[0];
    if (!f) return;

    var labels = {
      compensationPaid: 'Compensation paid',
      houseSiteAllotted: 'House site allotted',
      houseHandedOver: 'Replacement house handed over',
      livelihoodGrantPaid: 'Livelihood grant paid',
      employmentProvided: 'Employment provided'
    };

    var html = '<div class="dhead"><p class="eyebrow">' + esc(f.village) + ' \u00b7 household</p>' +
      '<h3>' + esc(f.householdId) + '</h3><p>' + esc(f.head) + ' \u00b7 ' + esc(f.category) +
      ' \u00b7 ' + f.members + ' members</p></div>';

    html += '<dl class="kv">' +
      '<dt>Relocation</dt><dd>' + esc(f.relocation) + '</dd>' +
      '<dt>Survey numbers</dt><dd>' + esc(f.linkedSurveyNumbers || '\u2014') + '</dd>' +
      '<dt>Grievance</dt><dd>' + (f.grievanceStatus
        ? '<span class="tag tag--amber">' + esc(f.grievanceStatus) + '</span>' : '\u2014') + '</dd></dl>';

    html += '<div class="dsec"><h4>Entitlements delivered</h4><div class="ent">' +
      Object.keys(labels).map(function (k) {
        var yes = f.entitlements[k];
        return '<div class="ent__row' + (yes ? '' : ' no') + '">' +
          '<span class="ent__mark ' + (yes ? 'yes">\u2713' : 'no">\u2715') + '</span>' +
          '<span>' + esc(labels[k]) + '</span></div>';
      }).join('') + '</div></div>';

    if (f.grievanceNotes) {
      html += '<div class="dsec"><h4>Grievance on record</h4><p class="quote">' +
        esc(f.grievanceNotes) + '</p></div>';
    }

    html += '<div class="dsec"><h4>Triage a grievance</h4>' +
      '<div class="field"><label for="triage-text">Paste the grievance letter</label>' +
      '<textarea id="triage-text"></textarea></div>' +
      '<div class="drow"><button class="btn btn--solid" id="do-triage" type="button">Classify</button>' +
      '<button class="btn" id="do-triage-commit" type="button">Classify and file against this household</button></div>' +
      '<div id="triage-out"></div></div>';

    openDrawer(html);
    $('do-triage').addEventListener('click', function () { runTriage(null, false, f.id); });
    $('do-triage-commit').addEventListener('click', function () { runTriage(null, true, f.id); });
  }

  // ------------------------------------------------------------ writes

  function advanceStage(parcelId) {
    var stageId = $('stage-pick').value;
    var btn = $('do-stage');
    btn.disabled = true; btn.textContent = 'Recording\u2026';
    api('/parcels/' + parcelId + '/stage', {
      method: 'PATCH',
      body: JSON.stringify({ stageId: stageId })
    })
      .then(function () {
        toast('Stage recorded in Zoho Projects.');
        closeDrawer();
        load();
      })
      .catch(function (e) {
        toast(e.message, true);
        btn.disabled = false; btn.textContent = 'Record stage change';
      });
  }

  function runTriage(parcelId, commit, familyId) {
    var text = $('triage-text').value.trim();
    var out = $('triage-out');
    if (text.length < 20) { toast('Paste at least a sentence or two.', true); return; }
    out.innerHTML = '<p class="skeleton">Reading the petition\u2026</p>';

    api('/triage', {
      method: 'POST',
      body: JSON.stringify({ text: text, parcelId: parcelId, familyId: familyId, commit: !!commit })
    })
      .then(function (v) {
        out.innerHTML = '<div class="verdict' + (v.severity === 'High' ? ' verdict--high' : '') + '">' +
          '<h5>' + esc(v.objectionType) + '</h5><dl>' +
          '<dt>Severity</dt><dd>' + esc(v.severity) + '</dd>' +
          '<dt>Sets blocker</dt><dd>' + esc(v.blockingReason) + '</dd>' +
          '<dt>Summary</dt><dd>' + esc(v.summary) + '</dd>' +
          '<dt>Next step</dt><dd>' + esc(v.recommendedAction) + '</dd>' +
          '<dt>Classified by</dt><dd>' + (v.classifier === 'model' ? 'model' : 'keyword rules') + '</dd>' +
          '</dl></div>';
        if (commit) { toast('Filed against the record in Zoho Projects.'); load(); }
      })
      .catch(function (e) { out.innerHTML = '<p class="skeleton">' + esc(e.message) + '</p>'; });
  }

  // ------------------------------------------------------------ wiring

  $('drawer-close').addEventListener('click', closeDrawer);
  $('scrim').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
  $('refresh').addEventListener('click', load);
  $('signout').addEventListener('click', signOut);
  $('signin').addEventListener('click', signIn);
  ['u', 'p'].forEach(function (id) {
    $(id).addEventListener('keydown', function (e) { if (e.key === 'Enter') signIn(); });
  });

  boot();
})();
