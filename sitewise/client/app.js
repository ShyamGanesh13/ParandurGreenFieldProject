/* Sitewise — Construction Operations. Client SPA. Seed data now; Zoho Projects API later. */
(function () {
  'use strict';

  // ------------------------------------------------------------ icons (Lucide-style)
  var I = {
    grid:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    plane:'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
    search:'M17 17l4 4M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
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
      {id:'labour', label:'Labour & Attendance', icon:'users'} ] },
    { group:'Inventory', items:[
      {id:'materials', label:'Materials', icon:'box'},
      {id:'purchase', label:'Purchase Requests', icon:'cart'},
      {id:'equipment', label:'Equipment', icon:'truck'} ] },
    { group:'Finance', items:[
      {id:'vendors', label:'Vendors', icon:'handshake'},
      {id:'billing', label:'Client Billing', icon:'receipt'},
      {id:'expenses', label:'Expenses', icon:'wallet'} ] },
    { group:'Compliance', items:[
      {id:'quality', label:'Quality', icon:'shield'},
      {id:'safety', label:'Safety', icon:'hardhat'} ] },
    { group:'Insights', items:[
      {id:'reports', label:'Reports', icon:'chart'} ] }
  ];
  var LABELS = {}; NAV.forEach(function(g){ g.items.forEach(function(it){ LABELS[it.id]=it.label; }); });

  // ------------------------------------------------------------ data
  // Empty until Zoho Projects fills it. Nothing here is hardcoded demo data —
  // every value comes from the four Zoho custom modules via /bootstrap.
  var DB = {
    company: { sites: 0, lowStock: 0, overdue: 0 },
    projects: [],
    jobs: { open: 0, overdue: 0, completed: 0, list: [] },
    vendors: [],
    materials: [],
    equipment: [], crews: [], purchases: [], bills: [], inspections: [],
    finance: { receivable: 0, payable: 0, pendingPayments: 0 }
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
      {k:'var(--blue)', label:'Work Packages', val:p.length, sub:'across the airport site'},
      {k:'var(--accent)', label:'Under Contract', val:inr(totalBudget), sub:'total package value'},
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

    return '<div class="page-head"><h1>Airport Build Overview</h1><p>Where the Parandur greenfield airport build stands today.</p></div>'+
      '<section class="hero"><div class="hero__eyebrow">Source · '+esc(window.__src||'sample data')+'</div>'+
      '<h2>'+DB.projects.length+' work packages · '+inr(totalBudget)+' under contract</h2>'+
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
    var cols=[{label:'Package'},{label:'Client'},{label:'Status'},{label:'Progress'},{label:'Budget',num:true},{label:'Spent',num:true},{label:'Site Manager'}];
    var rows=DB.projects.map(function(p){
      return { search:[p.name,p.code,p.site,p.client,p.mgr].join(' '), filter:p.status, cells:[
        '<span class="cell-strong">'+esc(p.name)+'</span><span class="cell-sub">'+esc(p.code)+' · '+esc(p.site)+'</span>',
        esc(p.client), statusPill(p.status),
        '<div class="mini"><div class="mini__track"><div class="mini__fill" style="width:'+p.progress+'%"></div></div><span class="mini__pct">'+p.progress+'%</span></div>',
        inr(p.budget), inr(p.spent), esc(p.mgr)
      ] };
    });
    var filters=[{label:'On Track',val:'On Track'},{label:'At Risk',val:'At Risk'},{label:'Delayed',val:'Delayed'},{label:'Completed',val:'Completed'}];
    return head('Projects','Every airport work package, with budget burn and progress.')+ftable(cols,rows,filters);
  };

  V.jobs = function(){
    var cols=[{label:'Job'},{label:'Project'},{label:'Crew'},{label:'Due'},{label:'Status'}];
    var rows=DB.jobs.list.map(function(j){
      var statusCell = j.id
        ? '<select class="jobsel" data-id="'+esc(j.id)+'" data-prev="'+esc(j.status)+'">'+['Open','Overdue','Completed'].map(function(s){ return '<option'+(s===j.status?' selected':'')+'>'+s+'</option>'; }).join('')+'</select>'
        : statusPill(j.status);
      return { search:[j.title,j.project,j.crew].join(' '), filter:j.status, cells:[
        '<span class="cell-strong">'+esc(j.title)+'</span>', esc(j.project), esc(j.crew), '<span class="mono">'+esc(j.due)+'</span>', statusCell
      ] };
    });
    var filters=[{label:'Open',val:'Open'},{label:'Overdue',val:'Overdue'},{label:'Completed',val:'Completed'}];
    var total=DB.jobs.open+DB.jobs.overdue+DB.jobs.completed;
    var seg=[{label:'Open',value:DB.jobs.open,color:'var(--blue)'},{label:'Overdue',value:DB.jobs.overdue,color:'var(--red)'},{label:'Completed',value:DB.jobs.completed,color:'var(--green)'}];
    var breakdown='<ul class="statlist">'+seg.map(function(s){
      var pct=total?Math.round(s.value/total*100):0;
      return '<li><i class="dot" style="background:'+s.color+'"></i><span>'+s.label+'</span><b class="mono">'+s.value+'</b><small>'+pct+'%</small></li>';
    }).join('')+'</ul>';
    return head('Jobs','Work items scheduled across all sites.')+
      '<div class="split">'+ftable(cols,rows,filters)+
        '<div class="card split__aside"><div class="card__head"><h3>By status</h3><span class="muted">'+total+' jobs</span></div><div class="card__body">'+donut(seg,total,'jobs')+breakdown+'</div></div>'+
      '</div>';
  };

  V.vendors = function(){
    var cols=[{label:'Vendor'},{label:'Category'},{label:'Rating'},{label:'Terms'},{label:'Outstanding',num:true}];
    var rows=DB.vendors.map(function(v){
      return { search:[v.name,v.category,v.terms].join(' '), filter:v.category, cells:[
        '<span class="cell-strong">'+esc(v.name)+'</span>', '<span class="pill pill--gray">'+esc(v.category)+'</span>',
        '<span class="mono">★ '+v.rating.toFixed(1)+'</span>', esc(v.terms), (v.outstanding?inrFull(v.outstanding):'—')
      ] };
    });
    var total=DB.vendors.reduce(function(s,v){return s+v.outstanding;},0);
    var foot='<tr><td colspan="4" class="cell-strong">Total payable</td><td class="num cell-strong">'+inrFull(total)+'</td></tr>';
    var filters=[{label:'Materials',val:'Materials'},{label:'Equipment',val:'Equipment'},{label:'Labour',val:'Labour'},{label:'MEP',val:'MEP'}];
    return head('Vendors','Suppliers and subcontractors, with outstanding payables.')+ftable(cols,rows,filters,foot);
  };

  V.expenses = function(){
    var list=DB.projects.slice().sort(function(a,b){return b.spent-a.spent;});
    var total=list.reduce(function(s,p){return s+p.spent;},0) || 1;
    var cols=[{label:'Package'},{label:'Spent (₹)',num:true},{label:'Budget (₹)',num:true}];
    var rows=list.map(function(p){ return { search:[p.name,p.code].join(' '), cells:[
      '<span class="cell-strong">'+esc(p.name)+'</span><span class="cell-sub">'+esc(p.code)+'</span>', inrFull(p.spent), inrFull(p.budget)
    ] }; });
    var foot='<tr><td class="cell-strong">Total spent</td><td class="num cell-strong">'+inrFull(total)+'</td><td></td></tr>';
    return head('Expenses','Spend to date on each airport work package.')+
      '<div class="grid grid--2">'+ftable(cols,rows,null,foot)+
        '<div class="card"><div class="card__head"><h3>Share of spend</h3></div><div class="card__body">'+
          hbars(list.map(function(p){ return {label:p.name, sub:inr(p.spent), pct:Math.round(p.spent/total*100), color:'var(--accent)'}; }))+'</div></div>'+
      '</div>';
  };

  // Reports with tabs + export
  V.materials = function(){
    var cols=[{label:'Material'},{label:'Package'},{label:'On Hand',num:true},{label:'Reorder At',num:true},{label:'Status'}];
    var rows=DB.materials.map(function(m){
      var low=m.onHand<=m.reorder;
      return { search:[m.name,m.project].join(' '), filter:(low?'Low':'OK'), cells:[
        '<span class="cell-strong">'+esc(m.name)+'</span>', esc(m.project),
        esc(m.onHand)+' '+esc(m.unit), esc(m.reorder)+' '+esc(m.unit),
        (low?'<span class="pill pill--red">Low</span>':'<span class="pill pill--green">OK</span>')
      ] };
    });
    var filters=[{label:'Low stock',val:'Low'},{label:'OK',val:'OK'}];
    return head('Materials','Stock on hand against reorder levels, by package.')+ftable(cols,rows,filters);
  };

  V.equipment = function(){
    var pillFor=function(a){ return a==='On Site'?'green':(a==='Maintenance'?'red':'amber'); };
    var cols=[{label:'Asset'},{label:'Type'},{label:'Availability'},{label:'Location'},{label:'Operator'}];
    var rows=DB.equipment.map(function(e){
      return { search:[e.name,e.type,e.location,e.operator].join(' '), filter:e.availability, cells:[
        '<span class="cell-strong">'+esc(e.name)+'</span>', esc(e.type),
        '<span class="pill pill--'+pillFor(e.availability)+'">'+esc(e.availability)+'</span>', esc(e.location), esc(e.operator)
      ] };
    });
    var filters=[{label:'On Site',val:'On Site'},{label:'Idle',val:'Idle'},{label:'Maintenance',val:'Maintenance'}];
    return head('Equipment','Plant and machinery deployed across the airport site.')+ftable(cols,rows,filters);
  };

  V.labour = function(){
    var totH=DB.crews.reduce(function(s,c){return s+c.headcount;},0);
    var totP=DB.crews.reduce(function(s,c){return s+c.present;},0);
    var cols=[{label:'Crew'},{label:'Trade'},{label:'Package'},{label:'Headcount',num:true},{label:'Present',num:true},{label:'Attendance'}];
    var rows=DB.crews.map(function(c){
      var pct=c.headcount?Math.round(c.present/c.headcount*100):0;
      return { search:[c.name,c.trade,c.package].join(' '), cells:[
        '<span class="cell-strong">'+esc(c.name)+'</span>', esc(c.trade), esc(c.package), String(c.headcount), String(c.present),
        '<div class="mini"><div class="mini__track"><div class="mini__fill" style="width:'+pct+'%"></div></div><span class="mini__pct">'+pct+'%</span></div>'
      ] };
    });
    return head('Labour & Attendance','Crews on site today — headcount and attendance by package.')+
      '<div class="kpis" style="grid-template-columns:repeat(3,1fr)">'+
        '<div class="kpi" style="--k:var(--blue)"><div class="kpi__label">Crews</div><div class="kpi__val">'+DB.crews.length+'</div><div class="kpi__sub">on the airport site</div></div>'+
        '<div class="kpi" style="--k:var(--steel)"><div class="kpi__label">On the books</div><div class="kpi__val">'+totH+'</div><div class="kpi__sub">total headcount</div></div>'+
        '<div class="kpi" style="--k:var(--green)"><div class="kpi__label">Present today</div><div class="kpi__val">'+totP+'</div><div class="kpi__sub">'+(totH?Math.round(totP/totH*100):0)+'% attendance</div></div>'+
      '</div>'+ftable(cols,rows,null);
  };

  V.purchase = function(){
    var pillFor=function(s){ return {Requested:'amber',Approved:'blue',Ordered:'blue',Delivered:'green'}[s]||'gray'; };
    var cols=[{label:'Request'},{label:'Package'},{label:'Quantity'},{label:'Vendor'},{label:'Status'},{label:'Value (₹)',num:true}];
    var rows=DB.purchases.map(function(p){
      return { search:[p.name,p.package,p.vendor].join(' '), filter:p.status, cells:[
        '<span class="cell-strong">'+esc(p.name)+'</span>', esc(p.package), esc(p.quantity), esc(p.vendor),
        '<span class="pill pill--'+pillFor(p.status)+'">'+esc(p.status)+'</span>', inrFull(p.value)
      ] };
    });
    var total=DB.purchases.reduce(function(s,p){return s+p.value;},0);
    var foot='<tr><td class="cell-strong" colspan="5">Total requested</td><td class="num cell-strong">'+inrFull(total)+'</td></tr>';
    var filters=[{label:'Requested',val:'Requested'},{label:'Approved',val:'Approved'},{label:'Ordered',val:'Ordered'},{label:'Delivered',val:'Delivered'}];
    return head('Purchase Requests','Material and hire requests raised against packages.')+ftable(cols,rows,filters,foot);
  };

  V.billing = function(){
    var pillFor=function(s){ return {Submitted:'amber',Certified:'blue',Paid:'green'}[s]||'gray'; };
    var cols=[{label:'Bill'},{label:'Package'},{label:'Client'},{label:'Amount (₹)',num:true},{label:'Status'}];
    var rows=DB.bills.map(function(b){
      return { search:[b.name,b.package,b.client].join(' '), filter:b.status, cells:[
        '<span class="cell-strong">'+esc(b.name)+'</span>', esc(b.package), esc(b.client), inrFull(b.amount),
        '<span class="pill pill--'+pillFor(b.status)+'">'+esc(b.status)+'</span>'
      ] };
    });
    var total=DB.bills.reduce(function(s,b){return s+b.amount;},0);
    var paid=DB.bills.filter(function(b){return b.status==='Paid';}).reduce(function(s,b){return s+b.amount;},0);
    var filters=[{label:'Submitted',val:'Submitted'},{label:'Certified',val:'Certified'},{label:'Paid',val:'Paid'}];
    return head('Client Billing','Running-account bills raised to the airport authorities.')+
      '<div class="kpis" style="grid-template-columns:repeat(3,1fr)">'+
        '<div class="kpi" style="--k:var(--accent)"><div class="kpi__label">Billed to date</div><div class="kpi__val">'+inr(total)+'</div><div class="kpi__sub">across all packages</div></div>'+
        '<div class="kpi" style="--k:var(--green)"><div class="kpi__label">Received</div><div class="kpi__val">'+inr(paid)+'</div><div class="kpi__sub">bills marked paid</div></div>'+
        '<div class="kpi" style="--k:var(--amber)"><div class="kpi__label">Outstanding</div><div class="kpi__val">'+inr(total-paid)+'</div><div class="kpi__sub">submitted or certified</div></div>'+
      '</div>'+ftable(cols,rows,filters);
  };

  function inspectionView(kind){
    var pillFor=function(r){ return {Pass:'green',Fail:'red',Open:'amber'}[r]||'gray'; };
    var list=DB.inspections.filter(function(i){return i.type===kind;});
    var cols=[{label:'Inspection'},{label:'Package'},{label:'Result'},{label:'Inspector'}];
    var rows=list.map(function(i){
      return { search:[i.name,i.package,i.inspector].join(' '), filter:i.result, cells:[
        '<span class="cell-strong">'+esc(i.name)+'</span>', esc(i.package),
        '<span class="pill pill--'+pillFor(i.result)+'">'+esc(i.result)+'</span>', esc(i.inspector)
      ] };
    });
    var filters=[{label:'Pass',val:'Pass'},{label:'Open',val:'Open'},{label:'Fail',val:'Fail'}];
    return head(kind, kind+' inspections logged across the airport packages.')+ftable(cols,rows,filters);
  }
  V.quality = function(){ return inspectionView('Quality'); };
  V.safety = function(){ return inspectionView('Safety'); };

  // Reports derive entirely from the four Zoho modules — no hardcoded rows.
  function reportSet(){
    return {
      'budget': { label:'Package Budget', cols:['Package','Client','Budget (₹)','Spent (₹)','Consumed'], numCols:[2,3,4],
        rows: DB.projects.map(function(p){ return [p.name, p.client, inrFull(p.budget), inrFull(p.spent), Math.round(p.spent/(p.budget||1)*100)+'%']; }) },
      'delayed': { label:'Overdue Jobs', cols:['Job','Package','Due','Status'], numCols:[],
        rows: DB.jobs.list.filter(function(j){ return j.status==='Overdue'; }).map(function(j){ return [j.title, j.project, j.due, j.status]; }) },
      'outstanding': { label:'Vendor Outstanding', cols:['Vendor','Category','Outstanding (₹)'], numCols:[2],
        rows: DB.vendors.filter(function(v){ return v.outstanding; }).map(function(v){ return [v.name, v.category, inrFull(v.outstanding)]; }) },
      'inventory': { label:'Inventory & Low Stock', cols:['Material','On Hand','Reorder At','Status'], numCols:[],
        rows: DB.materials.map(function(m){ return [m.name, m.onHand+' '+m.unit, m.reorder+' '+m.unit, m.onHand<=m.reorder?'Low':'OK']; }) }
    };
  }
  var reportTab='budget';
  V.reports = function(){
    var R = reportSet();
    if (!R[reportTab]) reportTab = 'budget';
    var r = R[reportTab];
    var tabs=Object.keys(R).map(function(k){ return '<button class="tab'+(k===reportTab?' is-active':'')+'" data-tab="'+k+'">'+esc(R[k].label)+'</button>'; }).join('');
    var isNum=function(i){ return r.numCols.indexOf(i)>-1; };
    var thead='<tr>'+r.cols.map(function(c,i){ return '<th'+(isNum(i)?' class="num"':'')+'>'+esc(c)+'</th>'; }).join('')+'</tr>';
    var tbody=r.rows.length
      ? r.rows.map(function(row){ return '<tr>'+row.map(function(c,i){ return '<td'+(isNum(i)?' class="num"':'')+'>'+(i===0?'<span class="cell-strong">'+esc(c)+'</span>':esc(c))+'</td>'; }).join('')+'</tr>'; }).join('')
      : '<tr><td colspan="'+r.cols.length+'" class="cell-sub" style="padding:22px">Nothing to report.</td></tr>';
    return head('Reports','Generated live from Zoho Projects. Export to Excel (CSV) or print to PDF.')+
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

  // ------------------------------------------------------------ filterable tables
  function toolbar(filters){
    var chips = filters && filters.length
      ? '<div class="chips">'+[{label:'All',val:''}].concat(filters).map(function(f){ return '<button class="chip'+(f.val===''?' is-active':'')+'" data-val="'+esc(f.val)+'">'+esc(f.label)+'</button>'; }).join('')+'</div>'
      : '';
    return '<div class="tbl-toolbar"><label class="tbl-search">'+icon('search')+'<input type="search" placeholder="Search…" aria-label="Search this table"></label>'+chips+'<span class="tbl-count"></span></div>';
  }
  /** A filterable table card. cols:[{label,num?}], rows:[{cells:[html], search, filter}], filters?, foot?html */
  function ftable(cols, rows, filters, foot){
    var thead='<tr>'+cols.map(function(c){ return '<th'+(c.num?' class="num"':'')+'>'+esc(c.label)+'</th>'; }).join('')+'</tr>';
    var body=rows.map(function(r){
      return '<tr data-search="'+esc(String(r.search||'').toLowerCase())+'" data-filter="'+esc(r.filter==null?'':r.filter)+'">'+
        r.cells.map(function(cell,i){ return '<td'+(cols[i]&&cols[i].num?' class="num"':'')+'>'+cell+'</td>'; }).join('')+'</tr>';
    }).join('');
    return '<div class="card filterable" data-cols="'+cols.length+'">'+toolbar(filters)+
      '<div class="tablewrap"><table class="data"><thead>'+thead+'</thead><tbody>'+body+'</tbody>'+(foot?'<tfoot>'+foot+'</tfoot>':'')+'</table></div></div>';
  }
  function wireFilters(root){
    Array.prototype.forEach.call(root.querySelectorAll('.filterable'), function(dv){
      var input=dv.querySelector('.tbl-search input');
      var chips=Array.prototype.slice.call(dv.querySelectorAll('.chip'));
      var rows=Array.prototype.slice.call(dv.querySelectorAll('tbody tr'));
      var count=dv.querySelector('.tbl-count');
      var cols=parseInt(dv.getAttribute('data-cols'),10)||1;
      var tbody=dv.querySelector('tbody');
      var q='', f='', emptyRow=null;
      function apply(){
        var shown=0;
        rows.forEach(function(tr){
          var okQ=!q || (tr.getAttribute('data-search')||'').indexOf(q)>-1;
          var okF=!f || (tr.getAttribute('data-filter')||'')===f;
          var show=okQ&&okF; tr.style.display=show?'':'none'; if(show) shown++;
        });
        if(count) count.textContent=shown+' of '+rows.length;
        if(!shown){ if(!emptyRow){ emptyRow=document.createElement('tr'); emptyRow.className='is-empty-row'; emptyRow.innerHTML='<td colspan="'+cols+'" class="tbl-empty">No matching records.</td>'; tbody.appendChild(emptyRow); } }
        else if(emptyRow){ emptyRow.remove(); emptyRow=null; }
      }
      if(input) input.addEventListener('input', function(){ q=input.value.trim().toLowerCase(); apply(); });
      chips.forEach(function(c){ c.addEventListener('click', function(){ chips.forEach(function(x){x.classList.remove('is-active');}); c.classList.add('is-active'); f=c.getAttribute('data-val'); apply(); }); });
      apply();
    });
  }

  // ------------------------------------------------------------ export
  function exportCSV(){
    var r=reportSet()[reportTab];
    var lines=[r.cols.join(',')].concat(r.rows.map(function(row){ return row.map(function(c){ return '"'+String(c).replace(/"/g,'""')+'"'; }).join(','); }));
    var blob=new Blob([lines.join('\n')],{type:'text/csv'});
    var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='parandur-aerobuild-'+reportTab+'.csv'; a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);},1000);
    toast('Exported '+r.label+' to CSV');
  }

  // ------------------------------------------------------------ chrome render
  function renderSidebar(active){
    var html='<div class="brand"><div class="brand__mark">'+icon('plane')+'</div><div class="brand__name">Parandur <b>AeroBuild</b></div></div>';
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
    $('#crumbs').innerHTML='<span>Parandur AeroBuild</span><span class="sep">/</span><b>'+esc(LABELS[active]||'Dashboard')+'</b>';
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
    wireFilters(view);
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
    if (d.equipment) DB.equipment = d.equipment;
    if (d.crews) DB.crews = d.crews;
    if (d.purchases) DB.purchases = d.purchases;
    if (d.bills) DB.bills = d.bills;
    if (d.inspections) DB.inspections = d.inspections;
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
    // Zoho Projects is the only source of truth — no snapshot, no seed fallback.
    // If the read fails we surface it rather than show anything that isn't live.
    return fetch(API + '/bootstrap', { headers: { 'X-App-Token': token() || '' } })
      .then(function(r){
        if (r.status === 401) throw { auth: true };
        return r.json().then(function(j){ if (!r.ok) throw new Error(j.error || 'Could not read from Zoho Projects.'); return j; });
      })
      .then(function(j){ hydrate(j); DATA_SOURCE = 'Zoho Projects'; });
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
    }).catch(function(e){
      if (e && e.auth){ setToken(null); showGate('Your session expired. Sign in again.'); return; }
      showApp();
      $('#view').innerHTML = '<div class="card"><div class="empty">'+icon('inbox')+'<h3>Couldn’t reach Zoho Projects</h3><p>'+esc((e && e.message) || 'Please try again in a moment.')+'</p></div></div>';
    });
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
