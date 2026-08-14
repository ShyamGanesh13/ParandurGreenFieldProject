/* Sitewise — Construction Operations. Client SPA. Seed data now; Zoho Projects API later. */
(function () {
  'use strict';

  // ------------------------------------------------------------ icons (Lucide-style)
  var I = {
    grid:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    building:'M3 21h18M6 21V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v17M18 21V9a1 1 0 0 1 1-1h1M9 7h2M9 11h2M9 15h2',
    hammer:'M14 6l6 6M4 20l8-8M12 8l4-4 4 4-4 4M14 10l-9 9',
    clipboard:'M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1zM8 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2',
    users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11',
    clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
    box:'M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8',
    layers:'M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5',
    cart:'M6 6h15l-1.5 9h-12zM6 6L5 3H2M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2M18 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2',
    truck:'M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 18.5a2 2 0 1 0 0-.01M18.5 18.5a2 2 0 1 0 0-.01',
    handshake:'M20 12l-8 8-4-4M4 12l4-4 4 4 4-4 4 4M2 12h4M18 12h4',
    receipt:'M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM8 8h8M8 12h8M8 16h5',
    wallet:'M3 6h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM17 12h.01M3 6l14-3v3',
    ruler:'M3 8l5-5 13 13-5 5zM8 6l2 2M11 9l2 2M14 12l2 2',
    image:'M3 3h18v18H3zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4M21 15l-5-5-11 11',
    shield:'M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z',
    hardhat:'M4 15a8 8 0 0 1 16 0M2 15h20v3H2zM9 11V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5',
    check:'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    chart:'M3 3v18h18M7 15l4-4 3 3 5-6',
    target:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
    sun:'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
    moon:'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
    download:'M12 3v12M7 10l5 5 5-5M5 21h14',
    printer:'M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M6 14h12v7H6z',
    inbox:'M22 12h-6l-2 3h-4l-2-3H2M5 5h14l3 7v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-6z'
  };
  function icon(name){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="'+(I[name]||I.grid)+'"/></svg>'; }

  // ------------------------------------------------------------ nav
  var NAV = [
    { group:'Overview', items:[ {id:'dashboard', label:'Dashboard', icon:'grid'} ] },
    { group:'Operations', items:[
      {id:'projects', label:'Projects', icon:'building'},
      {id:'jobs', label:'Jobs', icon:'hammer'},
      {id:'daily-report', label:'Daily Site Report', icon:'clipboard'},
      {id:'labour', label:'Labour & Attendance', icon:'users'},
      {id:'timesheets', label:'Timesheets', icon:'clock'} ] },
    { group:'Inventory', items:[
      {id:'materials', label:'Materials', icon:'box'},
      {id:'site-stock', label:'Site Stock', icon:'layers'},
      {id:'purchase', label:'Purchase Requests', icon:'cart'},
      {id:'equipment', label:'Equipment', icon:'truck'} ] },
    { group:'Finance', items:[
      {id:'vendors', label:'Vendors', icon:'handshake'},
      {id:'billing', label:'Client Billing', icon:'receipt'},
      {id:'expenses', label:'Expenses', icon:'wallet'} ] },
    { group:'Documents', items:[
      {id:'drawings', label:'Drawings', icon:'ruler'},
      {id:'photos', label:'Photos', icon:'image'} ] },
    { group:'Compliance', items:[
      {id:'quality', label:'Quality', icon:'shield'},
      {id:'safety', label:'Safety', icon:'hardhat'},
      {id:'approvals', label:'Approvals', icon:'check'} ] },
    { group:'Insights', items:[
      {id:'reports', label:'Reports', icon:'chart'},
      {id:'targets', label:'Targets', icon:'target'} ] }
  ];
  var LABELS = {}; NAV.forEach(function(g){ g.items.forEach(function(it){ LABELS[it.id]=it.label; }); });

  // ------------------------------------------------------------ seed data
  var DB = {
    company: { sites: 6, workers: 48, present: 41, lowStock: 3, overdue: 2 },
    projects: [
      { name:'Metro Business Park', code:'MBP-01', site:'Guindy, Chennai', client:'Marg Estates', budget:48000000, spent:33600000, status:'On Track', progress:70, mgr:'R. Anand' },
      { name:'Heritage Mall Retrofit', code:'HMR-04', site:'T. Nagar, Chennai', client:'Prestige Retail', budget:32000000, spent:29800000, status:'At Risk', progress:88, mgr:'S. Kavya' },
      { name:'Lakeview Apartments', code:'LVA-07', site:'OMR, Chennai', client:'Casagrand', budget:61000000, spent:24400000, status:'On Track', progress:40, mgr:'M. Farhan' },
      { name:'Coastal Tech Campus', code:'CTC-02', site:'Mahabalipuram', client:'Zoho Corp', budget:95000000, spent:14250000, status:'On Track', progress:15, mgr:'R. Anand' },
      { name:'Green Valley Villas', code:'GVV-11', site:'Sriperumbudur', client:'Alliance Group', budget:27000000, spent:26400000, status:'Delayed', progress:96, mgr:'S. Kavya' },
      { name:'Skyline Residency', code:'SKR-09', site:'Porur, Chennai', client:'Radiance Realty', budget:54000000, spent:37800000, status:'On Track', progress:66, mgr:'M. Farhan' }
    ],
    jobs: { open:9, overdue:2, completed:14, list:[
      { title:'Level 4 slab pour', project:'Metro Business Park', due:'2026-08-18', status:'Open', crew:'Concrete A' },
      { title:'Facade glazing — east', project:'Heritage Mall Retrofit', due:'2026-08-12', status:'Overdue', crew:'Facade' },
      { title:'Basement waterproofing', project:'Lakeview Apartments', due:'2026-08-22', status:'Open', crew:'Waterproof' },
      { title:'MEP first-fix — Block C', project:'Skyline Residency', due:'2026-08-25', status:'Open', crew:'MEP' },
      { title:'Handover snagging', project:'Green Valley Villas', due:'2026-08-10', status:'Overdue', crew:'Finishing' },
      { title:'Site clearing & levelling', project:'Coastal Tech Campus', due:'2026-08-30', status:'Open', crew:'Earthworks' },
      { title:'Lift shaft inspection', project:'Metro Business Park', due:'2026-08-05', status:'Completed', crew:'QA' }
    ]},
    vendors: [
      { name:'Ultratech Cement', category:'Materials', outstanding:1830000, rating:4.6, terms:'30 days' },
      { name:'Tata Steel Rebar', category:'Materials', outstanding:2450000, rating:4.4, terms:'45 days' },
      { name:'Sundaram Scaffolding', category:'Equipment', outstanding:410000, rating:4.1, terms:'15 days' },
      { name:'Coromandel Ready-Mix', category:'Materials', outstanding:975000, rating:4.7, terms:'On delivery' },
      { name:'Sri Balaji Labour Co.', category:'Labour', outstanding:1280000, rating:4.0, terms:'Weekly' },
      { name:'Voltas HVAC', category:'MEP', outstanding:0, rating:4.5, terms:'60 days' }
    ],
    materials: [
      { name:'OPC 53 Cement', unit:'bags', onHand:120, reorder:200, project:'Metro Business Park' },
      { name:'TMT Bar 16mm', unit:'tonnes', onHand:4, reorder:10, project:'Lakeview Apartments' },
      { name:'Ready-Mix M30', unit:'m³', onHand:0, reorder:20, project:'Heritage Mall Retrofit' },
      { name:'River Sand', unit:'m³', onHand:85, reorder:40, project:'Skyline Residency' },
      { name:'AAC Blocks', unit:'nos', onHand:3200, reorder:2000, project:'Green Valley Villas' }
    ],
    finance: { receivable: 45359200, payable: 6945000, pendingPayments: 6945000 },
    expensesByCategory: [
      { category:'Materials', total:8460000 }, { category:'Labour', total:5120000 },
      { category:'Equipment Hire', total:1875000 }, { category:'Fuel & Transport', total:642000 },
      { category:'Site Overheads', total:498000 }, { category:'Safety & PPE', total:214000 }
    ],
    inspections: 2, deliveries: 4
  };

  // ------------------------------------------------------------ helpers
  var $ = function (s, r) { return (r||document).querySelector(s); };
  var el = function (h) { var d=document.createElement('div'); d.innerHTML=h.trim(); return d.firstElementChild; };
  function inr(n){
    if (n>=1e7) return '₹' + (n/1e7).toFixed(2) + ' Cr';
    if (n>=1e5) return '₹' + (n/1e5).toFixed(2) + ' L';
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }
  function inrFull(n){ return '₹' + Math.round(n).toLocaleString('en-IN'); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function statusPill(s){
    var m={'On Track':'green','At Risk':'amber','Delayed':'red','Open':'blue','Overdue':'red','Completed':'green'};
    return '<span class="pill pill--'+(m[s]||'gray')+'">'+esc(s)+'</span>';
  }
  function toast(msg){ var t=$('#toast'); t.textContent=msg; t.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(function(){t.hidden=true;},2600); }

  // ------------------------------------------------------------ charts (inline SVG / DOM)
  function donut(segments, centerVal, centerLabel){
    var total = segments.reduce(function(s,x){return s+x.value;},0) || 1;
    var r=54, c=2*Math.PI*r, off=0, gap=2;
    var rings = segments.map(function(seg){
      var frac=seg.value/total, len=Math.max(0, frac*c - gap);
      var dash='<circle r="'+r+'" cx="70" cy="70" fill="none" stroke="'+seg.color+'" stroke-width="18" '+
        'stroke-dasharray="'+len+' '+(c-len)+'" stroke-dashoffset="'+(-off)+'" stroke-linecap="butt" transform="rotate(-90 70 70)"/>';
      off += frac*c; return dash;
    }).join('');
    return '<div class="donut-wrap"><div style="position:relative;width:140px;height:140px">'+
      '<svg width="140" height="140" viewBox="0 0 140 140">'+
      '<circle r="54" cx="70" cy="70" fill="none" stroke="var(--border-2)" stroke-width="18"/>'+rings+'</svg>'+
      '<div style="position:absolute;inset:0;display:grid;place-items:center"><div class="donut-center"><b>'+centerVal+'</b><span>'+centerLabel+'</span></div></div>'+
      '</div></div>';
  }
  function legend(items){ return '<ul class="chart-legend">'+items.map(function(i){return '<li><i class="dot" style="background:'+i.color+'"></i>'+esc(i.label)+'</li>';}).join('')+'</ul>'; }

  function vbars(items){ // items: {label, segs:[{value,color}], top}
    var max = Math.max.apply(null, items.map(function(i){ return i.segs.reduce(function(s,x){return s+x.value;},0); })) || 1;
    return '<div class="vbars">'+items.map(function(it){
      var stackTotal = it.segs.reduce(function(s,x){return s+x.value;},0);
      var cols = it.segs.map(function(sg){ return '<div class="vbar__seg" data-h="'+(sg.value/max*100)+'" style="background:'+sg.color+'"></div>'; }).join('');
      return '<div class="vbar"><span class="vbar__val">'+it.top+'</span>'+
        '<div class="vbar__col" style="height:100%">'+cols+'</div>'+
        '<span class="vbar__label" title="'+esc(it.label)+'">'+esc(it.label)+'</span></div>';
    }).join('')+'</div>';
  }
  function hbars(items){ // {label, value, sub, color, pct}
    return '<div class="hbars">'+items.map(function(it){
      return '<div class="hbar"><div class="hbar__top"><span>'+esc(it.label)+'</span><b>'+esc(it.sub)+'</b></div>'+
        '<div class="hbar__track"><div class="hbar__fill" data-w="'+it.pct+'" style="background:'+it.color+'"></div></div></div>';
    }).join('')+'</div>';
  }
  function animateBars(root){
    requestAnimationFrame(function(){
      (root||document).querySelectorAll('.hbar__fill').forEach(function(e){ e.style.width=e.getAttribute('data-w')+'%'; });
      (root||document).querySelectorAll('.vbar__seg').forEach(function(e){ e.style.height=e.getAttribute('data-h')+'%'; });
    });
  }

  // ------------------------------------------------------------ views
  var V = {};

  V.dashboard = function(){
    var p=DB.projects;
    var totalBudget=p.reduce(function(s,x){return s+x.budget;},0);
    var totalSpent=p.reduce(function(s,x){return s+x.spent;},0);
    var openJobs=DB.jobs.open, comp=DB.jobs.completed;
    var kpis=[
      {k:'var(--blue)', label:'Total Projects', val:p.length, sub:DB.company.sites+' active sites'},
      {k:'var(--accent)', label:'Under Contract', val:inr(totalBudget), sub:'portfolio value'},
      {k:'var(--steel)', label:'Open Jobs', val:openJobs, sub:'across all sites'},
      {k:'var(--amber)', label:'Materials Low', val:DB.company.lowStock, sub:'need reordering', cls:'warn'},
      {k:'var(--red)', label:'Overdue Jobs', val:DB.jobs.overdue, sub:'past their due date', cls:DB.jobs.overdue?'bad':''},
      {k:'var(--accent)', label:'Pending Payments', val:inr(DB.finance.payable), sub:'vendor payables'},
      {k:'var(--green)', label:'Jobs Completed', val:comp, sub:'this cycle'},
      {k:'var(--steel)', label:'Vendors', val:DB.vendors.length, sub:'active suppliers'}
    ];
    var budgetBars = p.slice().sort(function(a,b){return b.budget-a.budget;}).map(function(x){
      return { label:x.code, top:inr(x.spent), segs:[ {value:x.spent, color:'var(--accent)'}, {value:Math.max(0,x.budget-x.spent), color:'var(--border)'} ] };
    });
    var jobSegs=[ {label:'Open — '+DB.jobs.open, value:DB.jobs.open, color:'var(--blue)'},
      {label:'Overdue — '+DB.jobs.overdue, value:DB.jobs.overdue, color:'var(--red)'},
      {label:'Completed — '+DB.jobs.completed, value:DB.jobs.completed, color:'var(--green)'} ];
    var finBars=[ {label:'Receivable', top:inr(DB.finance.receivable), segs:[{value:DB.finance.receivable,color:'var(--green)'}]},
      {label:'Payable', top:inr(DB.finance.payable), segs:[{value:DB.finance.payable,color:'var(--red)'}]} ];

    return '<div class="page-head"><h1>Company Overview</h1><p>Good morning — here’s where every site stands today.</p></div>'+
      '<section class="hero"><div class="hero__eyebrow">Source · '+esc(window.__src||'sample data')+'</div>'+
      '<h2>'+DB.projects.length+' active projects · '+inr(totalBudget)+' under contract</h2>'+
      '<p class="hero__sub">'+DB.jobs.open+' jobs open · '+DB.company.lowStock+' materials need reordering · '+DB.jobs.overdue+' jobs overdue.</p>'+
      '<div class="hero__meta">'+
        '<div class="hero__stat"><b class="mono">'+inr(totalBudget)+'</b><span>Portfolio budget</span></div>'+
        '<div class="hero__stat"><b class="mono">'+inr(totalSpent)+'</b><span>Spent to date</span></div>'+
        '<div class="hero__stat"><b class="mono">'+Math.round(totalSpent/totalBudget*100)+'%</b><span>Budget consumed</span></div>'+
      '</div></section>'+
      '<div class="kpis">'+kpis.map(function(k){
        return '<div class="kpi" style="--k:'+k.k+'"><div class="kpi__label">'+k.label+'</div>'+
          '<div class="kpi__val">'+k.val+'</div><div class="kpi__sub '+(k.cls||'')+'">'+k.sub+'</div></div>';
      }).join('')+'</div>'+
      '<div class="grid grid--3">'+
        '<div class="card"><div class="card__head"><h3>Budget by Project</h3><span class="muted">spent vs budget</span></div>'+
          '<div class="card__body">'+hbars(budgetBars.map(function(b){ var proj=p.filter(function(x){return x.code===b.label;})[0]; return {label:proj.name, sub:inr(proj.spent)+' / '+inr(proj.budget), pct:Math.round(proj.spent/proj.budget*100), color:'var(--accent)'}; }))+'</div></div>'+
        '<div class="card"><div class="card__head"><h3>Job Status</h3><span class="muted">'+(DB.jobs.open+DB.jobs.overdue+DB.jobs.completed)+' total</span></div>'+
          '<div class="card__body">'+donut(jobSegs, (DB.jobs.open+DB.jobs.overdue+DB.jobs.completed), 'jobs')+legend(jobSegs)+'</div></div>'+
        '<div class="card"><div class="card__head"><h3>Receivables vs Payables</h3><span class="muted">outstanding</span></div>'+
          '<div class="card__body">'+vbars(finBars)+legend([{label:'Receivable',color:'var(--green)'},{label:'Payable',color:'var(--red)'}])+'</div></div>'+
      '</div>';
  };

  V.projects = function(){
    var rows=DB.projects.map(function(p){
      return '<tr><td><span class="cell-strong">'+esc(p.name)+'</span><span class="cell-sub">'+esc(p.code)+' · '+esc(p.site)+'</span></td>'+
        '<td>'+esc(p.client)+'</td><td>'+statusPill(p.status)+'</td>'+
        '<td><div class="mini"><div class="mini__track"><div class="mini__fill" style="width:'+p.progress+'%"></div></div><span class="mini__pct">'+p.progress+'%</span></div></td>'+
        '<td class="num">'+inr(p.budget)+'</td><td class="num">'+inr(p.spent)+'</td><td>'+esc(p.mgr)+'</td></tr>';
    }).join('');
    return head('Projects','Every active build across the portfolio, with budget burn and progress.')+
      card('<div class="tablewrap"><table class="data"><thead><tr><th>Project</th><th>Client</th><th>Status</th><th>Progress</th><th class="num">Budget</th><th class="num">Spent</th><th>Site Manager</th></tr></thead><tbody>'+rows+'</tbody></table></div>');
  };

  V.jobs = function(){
    var rows=DB.jobs.list.map(function(j){
      var statusCell = j.id
        ? '<select class="jobsel" data-id="'+esc(j.id)+'" data-prev="'+esc(j.status)+'">'+
            ['Open','Overdue','Completed'].map(function(s){ return '<option'+(s===j.status?' selected':'')+'>'+s+'</option>'; }).join('')+'</select>'
        : statusPill(j.status);
      return '<tr><td class="cell-strong">'+esc(j.title)+'</td><td>'+esc(j.project)+'</td><td>'+esc(j.crew)+'</td>'+
        '<td class="mono">'+esc(j.due)+'</td><td>'+statusCell+'</td></tr>';
    }).join('');
    var seg=[{label:'Open',value:DB.jobs.open,color:'var(--blue)'},{label:'Overdue',value:DB.jobs.overdue,color:'var(--red)'},{label:'Completed',value:DB.jobs.completed,color:'var(--green)'}];
    return head('Jobs','Work items scheduled across all sites.')+
      '<div class="grid grid--2" style="margin-bottom:16px">'+
        card('<div class="tablewrap"><table class="data"><thead><tr><th>Job</th><th>Project</th><th>Crew</th><th>Due</th><th>Status</th></tr></thead><tbody>'+rows+'</tbody></table></div>')+
        '<div class="card"><div class="card__head"><h3>By status</h3></div><div class="card__body">'+donut(seg,(DB.jobs.open+DB.jobs.overdue+DB.jobs.completed),'jobs')+legend(seg)+'</div></div>'+
      '</div>';
  };

  V.vendors = function(){
    var rows=DB.vendors.map(function(v){
      return '<tr><td class="cell-strong">'+esc(v.name)+'</td><td><span class="pill pill--gray">'+esc(v.category)+'</span></td>'+
        '<td class="mono">★ '+v.rating.toFixed(1)+'</td><td>'+esc(v.terms)+'</td>'+
        '<td class="num">'+(v.outstanding?inrFull(v.outstanding):'—')+'</td></tr>';
    }).join('');
    var total=DB.vendors.reduce(function(s,v){return s+v.outstanding;},0);
    return head('Vendors','Suppliers and subcontractors, with outstanding payables.')+
      card('<div class="tablewrap"><table class="data"><thead><tr><th>Vendor</th><th>Category</th><th>Rating</th><th>Terms</th><th class="num">Outstanding</th></tr></thead><tbody>'+rows+
        '<tr><td colspan="4" class="cell-strong">Total payable</td><td class="num cell-strong">'+inrFull(total)+'</td></tr></tbody></table></div>');
  };

  V.expenses = function(){
    var rows=DB.expensesByCategory.map(function(e){ return '<tr><td class="cell-strong">'+esc(e.category)+'</td><td class="num">'+inrFull(e.total)+'</td></tr>'; }).join('');
    var total=DB.expensesByCategory.reduce(function(s,e){return s+e.total;},0);
    return head('Expenses','Spend by category across the portfolio this month.')+
      '<div class="grid grid--2">'+
        card('<div class="tablewrap"><table class="data"><thead><tr><th>Category</th><th class="num">Total (₹)</th></tr></thead><tbody>'+rows+
          '<tr><td class="cell-strong">Total</td><td class="num cell-strong">'+inrFull(total)+'</td></tr></tbody></table></div>')+
        '<div class="card"><div class="card__head"><h3>Share of spend</h3></div><div class="card__body">'+
          hbars(DB.expensesByCategory.map(function(e){ return {label:e.category, sub:inr(e.total), pct:Math.round(e.total/total*100), color:'var(--accent)'}; }))+'</div></div>'+
      '</div>';
  };

  // Reports with tabs + export
  var REPORTS = {
    'material': { label:'Material Consumption', cols:['Material','Project','Consumed','Value (₹)'], rows:[
      ['OPC 53 Cement','Metro Business Park','1,240 bags','5,58,000'],['TMT Bar 16mm','Lakeview Apartments','32 t','21,44,000'],
      ['Ready-Mix M30','Heritage Mall Retrofit','410 m³','24,60,000'],['AAC Blocks','Green Valley Villas','9,800 nos','4,90,000'] ]},
    'labour': { label:'Labour Cost', cols:['Trade','Headcount','Man-days','Cost (₹)'], rows:[
      ['Mason','18','412','12,36,000'],['Steel Fixer','9','208','7,28,000'],['Carpenter','7','160','4,80,000'],['Helper','14','336','6,72,000'] ]},
    'profit': { label:'Project Profit', cols:['Project','Billed (₹)','Cost (₹)','Margin'], rows:[
      ['Metro Business Park','3,80,00,000','3,36,00,000','11.6%'],['Skyline Residency','4,10,00,000','3,78,00,000','7.8%'],
      ['Heritage Mall Retrofit','3,10,00,000','2,98,00,000','3.9%'] ]},
    'delayed': { label:'Delayed Activities', cols:['Activity','Project','Days Late','Owner'], rows:[
      ['Facade glazing — east','Heritage Mall Retrofit','2','Facade crew'],['Handover snagging','Green Valley Villas','4','Finishing crew'] ]},
    'expense': { label:'Monthly Expense', cols:['Category','Total (₹)'], rows: DB.expensesByCategory.map(function(e){ return [e.category, Math.round(e.total).toLocaleString('en-IN')]; }) },
    'outstanding': { label:'Vendor Outstanding', cols:['Vendor','Category','Outstanding (₹)'], rows: DB.vendors.filter(function(v){return v.outstanding;}).map(function(v){ return [v.name,v.category,v.outstanding.toLocaleString('en-IN')]; }) },
    'salary': { label:'Worker Salary', cols:['Worker','Trade','Days','Payable (₹)'], rows:[
      ['A. Murugan','Mason','24','21,600'],['K. Raja','Steel Fixer','22','19,800'],['S. Devi','Helper','25','15,000'] ]},
    'inventory': { label:'Inventory', cols:['Material','On Hand','Reorder At','Status'], rows: DB.materials.map(function(m){ return [m.name, m.onHand+' '+m.unit, m.reorder+' '+m.unit, m.onHand<=m.reorder?'Low':'OK']; }) }
  };
  var reportTab='expense';
  V.reports = function(){
    var tabs=Object.keys(REPORTS).map(function(k){ return '<button class="tab'+(k===reportTab?' is-active':'')+'" data-tab="'+k+'">'+esc(REPORTS[k].label)+'</button>'; }).join('');
    var r=REPORTS[reportTab];
    var thead='<tr>'+r.cols.map(function(c,i){ return '<th'+(i>0&&/₹|Days|Man|Headcount|Margin/.test(c)?' class="num"':'')+'>'+esc(c)+'</th>'; }).join('')+'</tr>';
    var tbody=r.rows.map(function(row){ return '<tr>'+row.map(function(c,i){ return '<td'+(i>0?' class="num"':'')+'>'+(i===0?'<span class="cell-strong">'+esc(c)+'</span>':esc(c))+'</td>'; }).join('')+'</tr>'; }).join('');
    return head('Reports','Generate a report, then export to Excel (CSV) or PDF.')+
      '<div class="tabs">'+tabs+'</div>'+
      '<div class="card"><div class="card__head"><h3>'+esc(r.label)+'</h3><div class="topbar__actions">'+
        '<button class="btn" id="exp-csv">'+icon('download')+'Excel (CSV)</button>'+
        '<button class="btn" id="exp-pdf">'+icon('printer')+'PDF / Print</button></div></div>'+
      '<div class="tablewrap"><table class="data"><thead>'+thead+'</thead><tbody>'+tbody+'</tbody></table></div></div>';
  };

  // Generic placeholder for not-yet-built modules
  function placeholder(id){
    return head(LABELS[id], 'This module is part of the roadmap.')+
      '<div class="card"><div class="empty">'+icon('inbox')+'<h3>'+esc(LABELS[id])+' is coming next</h3>'+
      '<p>The shell, data layer and design system are in place — this screen wires into the same Zoho Projects backend as the rest.</p></div></div>';
  }

  function head(t,s){ return '<div class="page-head"><div class="page-head__row"><div><h1>'+esc(t)+'</h1><p>'+esc(s)+'</p></div></div></div>'; }
  function card(inner){ return '<div class="card">'+inner+'</div>'; }

  // ------------------------------------------------------------ export
  function exportCSV(){
    var r=REPORTS[reportTab];
    var lines=[r.cols.join(',')].concat(r.rows.map(function(row){ return row.map(function(c){ return '"'+String(c).replace(/"/g,'""')+'"'; }).join(','); }));
    var blob=new Blob([lines.join('\n')],{type:'text/csv'});
    var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='sitewise-'+reportTab+'.csv'; a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);},1000);
    toast('Exported '+r.label+' to CSV');
  }

  // ------------------------------------------------------------ chrome render
  function renderSidebar(active){
    var html='<div class="brand"><div class="brand__mark">'+icon('ruler')+'</div><div class="brand__name">Site<b>wise</b></div></div>';
    var role = state.user && state.user.role;
    NAV.forEach(function(g){
      if (role === 'foreman' && (g.group === 'Finance' || g.group === 'Insights')) return; // foreman: no financials/reports
      html+='<div class="navgroup"><div class="navgroup__label">'+g.group+'</div>';
      g.items.forEach(function(it){
        var badge='';
        if(it.id==='jobs') badge='<span class="navitem__badge">'+(DB.jobs.open+DB.jobs.overdue)+'</span>';
        if(it.id==='approvals') badge='<span class="navitem__badge">3</span>';
        html+='<a class="navitem'+(it.id===active?' is-active':'')+'" href="#'+it.id+'">'+icon(it.icon)+'<span>'+it.label+'</span>'+badge+'</a>';
      });
      html+='</div>';
    });
    $('#sidebar').innerHTML=html;
  }
  function renderCrumbs(active){
    $('#crumbs').innerHTML='<span>Sitewise</span><span class="sep">/</span><b>'+esc(LABELS[active]||'Dashboard')+'</b>';
  }

  // ------------------------------------------------------------ router
  function route(){
    var id=(location.hash||'#dashboard').slice(1);
    if(!LABELS[id]) id='dashboard';
    renderSidebar(id); renderCrumbs(id);
    var view=$('#view');
    var fn = V[id] || function(){ return placeholder(id); };
    view.innerHTML=fn();
    view.focus();
    window.scrollTo(0,0);
    animateBars(view);
    if(id==='jobs'){
      view.querySelectorAll('.jobsel').forEach(function(sel){
        sel.addEventListener('change', function(){
          var jid=sel.getAttribute('data-id'), prev=sel.getAttribute('data-prev'), val=sel.value;
          sel.disabled=true;
          api('/jobs/'+jid+'/status', { method:'PATCH', body: JSON.stringify({ status: val }) })
            .then(function(){ toast('Job set to “'+val+'” in Zoho Projects.'); return loadData().then(function(){ route(); }); })
            .catch(function(e){ toast(e.message || 'Could not update the job.'); sel.value=prev; sel.disabled=false; });
        });
      });
    }
    if(id==='reports'){
      view.querySelectorAll('.tab').forEach(function(t){ t.addEventListener('click',function(){ reportTab=t.getAttribute('data-tab'); route(); }); });
      var c=$('#exp-csv'); if(c) c.addEventListener('click',exportCSV);
      var p=$('#exp-pdf'); if(p) p.addEventListener('click',function(){ toast('Opening print dialog…'); setTimeout(function(){window.print();},300); });
    }
  }

  // ------------------------------------------------------------ theme
  function setTheme(t){
    document.documentElement.setAttribute('data-theme',t);
    try{ localStorage.setItem('sitewise.theme',t); }catch(e){}
    $('#theme').innerHTML=icon(t==='dark'?'sun':'moon');
  }

  // ------------------------------------------------------------ data loading
  var DATA_SOURCE = 'sample data';
  function hydrate(d){
    if (d.projects) DB.projects = d.projects;
    if (d.jobs) DB.jobs.list = d.jobs;
    if (d.vendors) DB.vendors = d.vendors;
    if (d.materials) DB.materials = d.materials;
    var jl = DB.jobs.list;
    DB.jobs.open = jl.filter(function(j){return j.status==='Open';}).length;
    DB.jobs.overdue = jl.filter(function(j){return j.status==='Overdue';}).length;
    DB.jobs.completed = jl.filter(function(j){return j.status==='Completed';}).length;
    DB.finance.payable = DB.vendors.reduce(function(s,v){return s+(v.outstanding||0);},0);
    DB.finance.pendingPayments = DB.finance.payable;
    var totB = DB.projects.reduce(function(s,p){return s+p.budget;},0);
    var totS = DB.projects.reduce(function(s,p){return s+p.spent;},0);
    DB.finance.receivable = Math.max(0, totB - totS);
    DB.company.sites = DB.projects.length;
    DB.company.lowStock = DB.materials.filter(function(m){return m.onHand<=m.reorder;}).length;
    DB.company.overdue = DB.jobs.overdue;
  }
  function loadData(){
    // Live function first (Zoho Projects); on auth failure bounce to the gate;
    // otherwise fall back to the bundled Zoho snapshot so the demo never dead-ends.
    return fetch(API + '/bootstrap', { headers: { 'X-App-Token': token() || '' } })
      .then(function(r){ if (r.status === 401) throw { auth: true }; if (!r.ok) throw new Error('no live'); return r.json(); })
      .then(function(j){ hydrate(j); DATA_SOURCE = 'Zoho Projects (live)'; })
      .catch(function(e){
        if (e && e.auth) throw e;
        return fetch('data.json').then(function(r){ if(!r.ok) throw new Error('no snapshot'); return r.json(); })
          .then(function(j){ hydrate(j); DATA_SOURCE = 'Zoho Projects'; })
          .catch(function(){ /* keep sample data */ });
      });
  }

  // ------------------------------------------------------------ auth gate
  /* The UI may be served from Slate (*.onslate.in) while the function lives on
     *.catalystserverless.in — a different origin. Default to the absolute function
     URL, but use a relative path when the UI is itself served from Catalyst, and
     allow an override (?api=… or window.SITEWISE_API) without a rebuild. */
  var DEFAULT_API = 'https://parandurairportplanner-60083086752.development.catalystserverless.in/server/sitewise_api/api';
  var API = (function(){
    var q = new URLSearchParams(location.search).get('api');
    if (q) return q.replace(/\/$/,'');
    if (window.SITEWISE_API) return String(window.SITEWISE_API).replace(/\/$/,'');
    if (/catalystserverless\.(in|com)$/i.test(location.hostname)) return '/server/sitewise_api/api';
    return DEFAULT_API;
  })();
  var state = { user: null, _t: null };
  var TOKEN_KEY = 'sitewise.session';
  var isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  function token(){ try { return sessionStorage.getItem(TOKEN_KEY); } catch(e){ return state._t || null; } }
  function setToken(t){ state._t = t; try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY); } catch(e){} }
  function api(path, opts){
    opts = opts || {};
    var headers = opts.headers || {};
    headers['X-App-Token'] = token() || '';
    if (opts.body) headers['Content-Type'] = 'application/json';
    return fetch(API + path, { method: opts.method || 'GET', headers: headers, body: opts.body })
      .then(function(r){ return r.json().then(function(j){ if(!r.ok) throw new Error(j.error || 'Request failed'); return j; }); });
  }

  function showApp(){ $('#gate').hidden = true; $('#shell').hidden = false; window.__src = DATA_SOURCE;
    var w = document.getElementById('whoami'); if (w && state.user) w.textContent = (state.user.name || state.user.username || '') + (state.user.role ? ' · ' + state.user.role : ''); }
  function showGate(msg){ $('#shell').hidden = true; $('#gate').hidden = false; var e=$('#login-error'); if(msg){ e.textContent=msg; e.hidden=false; } else { e.hidden=true; } setTimeout(function(){ var u=$('#u'); if(u) u.focus(); }, 40); }

  function enter(){
    return loadData().then(function(){
      showApp();
      // Role-based landing: the foreman works from Jobs, the manager from the portfolio dashboard.
      if (state.user && state.user.role === 'foreman' && (!location.hash || location.hash === '#dashboard' || location.hash === '#')) { location.hash = '#jobs'; }
      route();
    }).catch(function(e){ if (e && e.auth){ setToken(null); showGate('Your session expired. Sign in again.'); } });
  }

  function signIn(){
    var btn=$('#signin'), un=$('#u').value.trim().toLowerCase(), pw=$('#p').value;
    if (!un || !pw){ showGate('Enter both a username and a password.'); return; }
    btn.disabled=true; btn.textContent='Signing in…';
    fetch(API + '/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username: un, password: pw }) })
      .then(function(r){ return r.json().then(function(j){ if(!r.ok) throw new Error(j.error || 'Sign-in failed'); return j; }); })
      .then(function(j){ setToken(j.token); state.user=j.user; $('#p').value=''; return enter(); })
      .catch(function(e){
        // Local preview with no function attached: accept the demo credential so the UI is testable offline.
        if (isLocal && (un==='manager'||un==='foreman') && pw==='sitewise2026'){ setToken('local.preview'); state.user={name: un==='manager'?'Operations Manager':'Site Foreman'}; $('#p').value=''; return enter(); }
        showGate((e && e.message) || 'Sign-in failed.');
      })
      .then(function(){ btn.disabled=false; btn.textContent='Sign in'; });
  }
  function signOut(){ setToken(null); state.user=null; showGate(); }
  function boot(){
    if (!token()){ showGate(); return; }
    fetch(API + '/session', { headers:{'X-App-Token': token()} }).then(function(r){ if(!r.ok) throw 0; return r.json(); })
      .then(function(j){ state.user=j.user; return enter(); })
      .catch(function(){ if (isLocal && token()==='local.preview') return enter(); setToken(null); showGate(); });
  }

  // ------------------------------------------------------------ init
  var saved; try{ saved=localStorage.getItem('sitewise.theme'); }catch(e){}
  setTheme(saved||'dark');
  $('#theme').addEventListener('click',function(){ setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'); });
  $('#signout').addEventListener('click',signOut);
  $('#signin').addEventListener('click',signIn);
  ['u','p'].forEach(function(id){ var e=$('#'+id); if(e) e.addEventListener('keydown',function(ev){ if(ev.key==='Enter') signIn(); }); });
  window.addEventListener('hashchange',route);
  boot();
})();
