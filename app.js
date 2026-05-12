import { projects, tasks, invoices, subs, team, activity, nextId } from './data.js';

const $ = id => document.getElementById(id);

let selProj   = 1;
let budgetProj = 1;
let cpProj     = 1;
let subFilter  = 'all';

// ── Formatters ────────────────────────────────────────────────────────────────
function fmt(n){return '$'+Math.round(n).toLocaleString()}
function pct(a,b){return b>0?Math.min(100,Math.round(a/b*100)):0}

function statusPill(s){
  const lbl={planning:'Planning',active:'Active',review:'In Review',hold:'On Hold'};
  return `<span class="pill pill-${s}">${lbl[s]||s}</span>`;
}
function catBadge(c){
  const lbl={mat:'Materials',lab:'Labor',sub:'Subcontractor',fee:'Fees/Permits',oth:'Other'};
  return `<span class="cat-badge cat-${c}">${lbl[c]||c}</span>`;
}
function invStatus(s){
  const lbl={paid:'Paid',pend:'Pending',draft:'Draft'};
  const cls={paid:'inv-paid',pend:'inv-pend',draft:'inv-draft'};
  return `<span class="inv-status ${cls[s]}">${lbl[s]}</span>`;
}
function stars(n){return '★'.repeat(n)+'☆'.repeat(5-n)}
function spentForProj(pid){
  return invoices.filter(i=>i.projId===pid&&i.status==='paid').reduce((a,i)=>a+i.amount,0);
}
function pendingCount(){return invoices.filter(i=>i.status==='pend').length}
function pendingAmt(){return invoices.filter(i=>i.status==='pend').reduce((a,i)=>a+i.amount*(1+i.markup/100),0)}

// ── Renderers ─────────────────────────────────────────────────────────────────
function renderProjects(){
  $('projList').innerHTML = projects.map(p=>`
    <div class="proj-card ${p.id===selProj?'sel':''}" onclick="selectProj(${p.id})">
      <div class="proj-row">
        <div class="proj-name">${p.name}</div>
        ${statusPill(p.status)}
        <span style="font-size:9px;padding:2px 6px;border-radius:10px;background:${p.ctype==='costplus'?'#F9EDD0':p.ctype==='gmp'?'#E6F1FB':'#F1EFE8'};color:${p.ctype==='costplus'?'#7A5A0A':p.ctype==='gmp'?'#0C447C':'#444441'};font-weight:600;letter-spacing:.03em;text-transform:uppercase">${p.ctype==='costplus'?'Cost+':p.ctype==='gmp'?'GMP':'Fixed'}</span>
      </div>
      <div class="proj-meta">
        <span class="mi"><i class="ti ti-user"></i> ${p.client}</span>
        <span class="mi"><i class="ti ti-briefcase"></i> ${p.pm}</span>
        <span class="mi"><i class="ti ti-report-money"></i> ${fmt(p.budget)}</span>
      </div>
      <div class="proj-meta" style="margin-top:3px">
        <span class="mi"><i class="ti ti-layers"></i> ${p.phase}</span>
        <span class="mi" style="margin-left:auto"><i class="ti ti-percentage"></i> ${p.progress}%</span>
      </div>
      <div class="pbar"><div class="pfill ${p.progress>=80?'g':p.progress>=40?'b':''}" style="width:${p.progress}%"></div></div>
    </div>
  `).join('');
}

function renderKanban(){
  const statuses=['planning','active','review','hold'];
  const labels={planning:'Planning',active:'Active',review:'In Review',hold:'On Hold'};
  $('kanbanView').innerHTML=statuses.map(s=>{
    const cols=projects.filter(p=>p.status===s);
    return `<div class="kb-col">
      <div class="kb-col-hdr"><div class="kb-lbl">${labels[s]}</div><div class="kb-cnt">${cols.length}</div></div>
      ${cols.map(p=>`<div class="kb-card" onclick="selectProj(${p.id});switchView('list')">
        <div class="kb-card-name">${p.name}</div>
        <div class="kb-card-meta">${p.phase}</div>
        <div class="kb-card-meta" style="margin-top:3px"><i class="ti ti-briefcase"></i> ${p.pm} · ${fmt(p.budget)}</div>
        <div class="pbar" style="margin-top:7px"><div class="pfill ${p.progress>=80?'g':p.progress>=40?'b':''}" style="width:${p.progress}%"></div></div>
      </div>`).join('')}
    </div>`;
  }).join('');
}

function renderTasks(pid){
  const p=projects.find(x=>x.id===pid);
  const list=tasks[pid]||[];
  $('tp-title').textContent='Tasks — '+p.name;
  $('tp-proj').textContent=p.name;
  const today=new Date();today.setHours(0,0,0,0);
  $('taskList').innerHTML=list.length?list.map(t=>{
    const due=t.due?new Date(t.due):null;
    const ov=due&&due<today&&!t.done;
    const sn=due&&!ov&&(due-today)/86400000<=2&&!t.done;
    const ds=t.due?new Date(t.due).toLocaleDateString('en-US',{month:'short',day:'numeric'}):'';
    return `<div class="task-it">
      <div class="pdot p-${t.priority}"></div>
      <div class="tcheck ${t.done?'done':''}" onclick="toggleTask(${pid},${t.id})"></div>
      <div class="tc">
        <div class="ttl ${t.done?'done':''}">${t.title}</div>
        <div class="tmr">
          <span class="tass"><i class="ti ti-user"></i> ${t.assignee}</span>
          ${ds?`<span class="tdue ${ov?'ov':sn?'sn':''}">${ds}</span>`:''}
        </div>
      </div>
    </div>`;
  }).join(''):'<div class="empty-state"><i class="ti ti-clipboard-list"></i>No tasks yet. Add the first task.</div>';
}

function renderActivity(){
  $('actFeed').innerHTML=activity.map(a=>`
    <div class="act-it">
      <div class="adot ${a.cls}"><i class="ti ${a.icon}" aria-hidden="true"></i></div>
      <div class="at">${a.text}</div>
      <div class="atm">${a.time}</div>
    </div>`).join('');
}

function renderBudget(){
  $('budgetProjBar').innerHTML=projects.map(p=>`<button class="psel ${p.id===budgetProj?'active':''}" onclick="selectBudgetProj(${p.id})">${p.name.split(' ').slice(0,2).join(' ')}</button>`).join('');
  const p=projects.find(x=>x.id===budgetProj);
  const spent=spentForProj(p.id);
  const remaining=Math.max(0,p.budget-spent);
  const pctVal=pct(spent,p.budget);
  $('budgetCards').innerHTML=`
    <div class="bsc contract"><div class="bsc-lbl">Contract Budget</div><div class="bsc-val">${fmt(p.budget)}</div><div class="bsc-sub" style="color:var(--blue)">${p.ctype==='costplus'?'Cost-Plus +'+p.markup+'%':p.ctype==='gmp'?'GMP Contract':'Fixed Price'}</div></div>
    <div class="bsc spent"><div class="bsc-lbl">Total Spent (Paid)</div><div class="bsc-val">${fmt(spent)}</div><div class="bsc-sub" style="color:var(--gold)">${pctVal}% of budget used</div></div>
    <div class="bsc remaining"><div class="bsc-lbl">Remaining</div><div class="bsc-val">${fmt(remaining)}</div><div class="bsc-sub" style="color:var(--green)">${100-pctVal}% budget left</div></div>`;
  $('budgetPct').textContent=pctVal+'%';
  const fill=$('budgetFill');
  fill.style.width=pctVal+'%';
  fill.className='budget-fill'+(pctVal>=90?' ov':'');
  const cats=p.cats;
  const catTotals={mat:0,lab:0,sub:0,fee:0,oth:0};
  invoices.filter(i=>i.projId===p.id&&i.status==='paid').forEach(i=>{catTotals[i.cat]=(catTotals[i.cat]||0)+i.amount});
  const catNames={mat:'Materials',lab:'Labor',sub:'Subcontractor',fee:'Fees / Permits',oth:'Other'};
  $('budgetCatTable').innerHTML=Object.keys(cats).map(c=>{
    const alloc=cats[c];const sp=catTotals[c]||0;const rem=Math.max(0,alloc-sp);const p2=pct(sp,alloc);
    return `<tr>
      <td>${catBadge(c)} ${catNames[c]}</td>
      <td>${fmt(alloc)}</td>
      <td>${fmt(sp)}</td>
      <td style="color:${rem<alloc*0.1?'var(--red)':'var(--green)'};">${fmt(rem)}</td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <div style="width:60px;height:4px;background:var(--bg);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${p2}%;background:${p2>=90?'var(--red)':'var(--gold)'};border-radius:2px"></div>
          </div>
          <span>${p2}%</span>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function renderCostPlus(){
  $('cpProjBar').innerHTML=projects.map(p=>`<button class="psel ${p.id===cpProj?'active':''}" onclick="selectCPProj(${p.id})">${p.name.split(' ').slice(0,2).join(' ')}</button>`).join('');
  const list=invoices.filter(i=>i.projId===cpProj);
  const totalAmt=list.reduce((a,i)=>a+i.amount,0);
  const totalBilled=list.reduce((a,i)=>a+i.amount*(1+i.markup/100),0);
  const totalPaid=list.filter(i=>i.status==='paid').reduce((a,i)=>a+i.amount*(1+i.markup/100),0);
  $('cpCards').innerHTML=`
    <div class="bsc contract"><div class="bsc-lbl">Total Invoiced</div><div class="bsc-val">${fmt(totalAmt)}</div><div class="bsc-sub" style="color:var(--muted)">${list.length} line items</div></div>
    <div class="bsc spent"><div class="bsc-lbl">Markup Earned</div><div class="bsc-val">${fmt(totalBilled-totalAmt)}</div><div class="bsc-sub" style="color:var(--gold)">Client billed: ${fmt(totalBilled)}</div></div>
    <div class="bsc remaining"><div class="bsc-lbl">Collected (Paid)</div><div class="bsc-val">${fmt(totalPaid)}</div><div class="bsc-sub" style="color:var(--green)">${fmt(totalBilled-totalPaid)} pending</div></div>`;
  $('cpTable').innerHTML=list.length?list.map(i=>{
    const total=i.amount*(1+i.markup/100);
    return `<tr>
      <td title="${i.desc}">${i.desc.length>28?i.desc.slice(0,26)+'…':i.desc}</td>
      <td>${catBadge(i.cat)}</td>
      <td style="color:var(--muted);font-size:10px">${i.vendor}</td>
      <td style="color:var(--muted)">${i.date}</td>
      <td>${fmt(i.amount)}</td>
      <td style="color:var(--gold-dk)">${i.markup}%</td>
      <td style="font-weight:500">${fmt(total)}</td>
      <td>${invStatus(i.status)}</td>
      <td><button class="btn btn-red" style="padding:2px 6px;font-size:10px" onclick="deleteInvoice(${i.id})"><i class="ti ti-trash"></i></button></td>
    </tr>`;
  }).join(''):`<tr><td colspan="9"><div class="empty-state"><i class="ti ti-receipt"></i>No invoices for this project yet.</div></td></tr>`;
}

function renderSubs(){
  const list=subFilter==='all'?subs:subs.filter(s=>s.trade===subFilter);
  const grid=$('subGrid');
  if(!list.length){grid.innerHTML='<div class="empty-state"><i class="ti ti-hard-hat"></i>No subcontractors match this filter.</div>';return}
  grid.innerHTML=list.map(s=>{
    const initials=s.name.split(' ').map(w=>w[0]).join('').slice(0,2);
    const projNames=s.projs.map(pid=>{const p=projects.find(x=>x.id===pid);return p?p.name.split(' ')[0]:''}).filter(Boolean);
    const dotCls=s.status==='active'?'dot-active':s.status==='idle'?'dot-idle':'dot-inactive';
    const dotLbl=s.status==='active'?'Active':s.status==='idle'?'Available':'Inactive';
    const insDate=s.insExp?new Date(s.insExp):null;
    const insExpired=insDate&&insDate<new Date();
    return `<div class="sub-card">
      <div class="sub-top">
        <div class="sub-av">${initials}</div>
        <div style="flex:1">
          <div class="sub-name">${s.name}</div>
          <div class="sub-trade"><i class="ti ti-tools" style="font-size:11px"></i> ${s.trade}</div>
        </div>
        <div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--muted)">
          <div class="sub-status-dot ${dotCls}"></div>${dotLbl}
        </div>
      </div>
      <div class="sub-meta">
        <div class="sub-meta-it"><i class="ti ti-user"></i> ${s.contact}</div>
        <div class="sub-meta-it"><i class="ti ti-phone"></i> ${s.phone}</div>
        <div class="sub-meta-it"><i class="ti ti-mail"></i> ${s.email}</div>
        <div class="sub-meta-it"><i class="ti ti-id"></i> ${s.lic}</div>
        <div class="sub-meta-it"><i class="ti ti-currency-dollar"></i> ${s.rate}</div>
        <div class="sub-meta-it" style="color:${insExpired?'var(--red)':'var(--muted)'}">
          <i class="ti ti-shield-check" style="color:${insExpired?'var(--red)':'var(--green)'}"></i>
          Insurance exp: ${s.insExp||'N/A'}${insExpired?' ⚠ EXPIRED':''}
        </div>
      </div>
      ${projNames.length?`<div class="sub-projs">${projNames.map(n=>`<span class="sub-proj-tag"><i class="ti ti-building" style="font-size:10px"></i> ${n}</span>`).join('')}</div>`:''}
      <div class="sub-footer">
        <div class="sub-rating" title="${s.rating}/5 stars">${stars(s.rating)}</div>
        <div style="display:flex;gap:5px">
          <button class="btn btn-ghost" style="font-size:10px;padding:3px 8px" onclick="editSub(${s.id})"><i class="ti ti-edit"></i> Edit</button>
          <button class="btn btn-red" style="font-size:10px;padding:3px 8px" onclick="deleteSub(${s.id})"><i class="ti ti-trash"></i></button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderTeam(){
  $('teamGrid').innerHTML=team.map(m=>{
    const initials=m.name.split(' ').map(w=>w[0]).join('').slice(0,2);
    const assigned=projects.filter(p=>p.pm===m.name);
    return `<div class="sub-card">
      <div class="sub-top">
        <div class="sub-av" style="background:var(--navy-mid)">${initials}</div>
        <div style="flex:1"><div class="sub-name">${m.name}</div><div class="sub-trade">${m.role}</div></div>
      </div>
      <div class="sub-meta">
        <div class="sub-meta-it"><i class="ti ti-phone"></i> ${m.phone}</div>
        <div class="sub-meta-it"><i class="ti ti-mail"></i> ${m.email}</div>
      </div>
      ${assigned.length?`<div class="sub-projs">${assigned.map(p=>`<span class="sub-proj-tag">${p.name.split(' ')[0]}</span>`).join('')}</div>`:'<div style="font-size:10px;color:var(--muted);margin-bottom:10px">No projects assigned</div>'}
      <div class="sub-footer">
        <span style="font-size:10px;color:var(--muted)">${assigned.length} project${assigned.length!==1?'s':''}</span>
        <button class="btn btn-red" style="font-size:10px;padding:3px 8px" onclick="deleteTeamMember(${m.id})"><i class="ti ti-trash"></i></button>
      </div>
    </div>`;
  }).join('');
}

function updateStats(){
  $('ov-proj').textContent=projects.filter(p=>p.status==='active').length;
  const allT=Object.values(tasks).flat();
  $('ov-tasks').textContent=allT.length;
  $('ov-tasks-sub').textContent=(allT.length-allT.filter(t=>t.done).length)+' pending · '+allT.filter(t=>t.done).length+' done';
  $('nb-proj').textContent=projects.length;
  $('nb-tasks').textContent=allT.length;
  const totalBudget=projects.reduce((a,p)=>a+p.budget,0);
  const totalSpent=projects.reduce((a,p)=>a+spentForProj(p.id),0);
  $('ov-budget').textContent='$'+(totalBudget/1000000).toFixed(1)+'M';
  $('ov-spent').textContent='$'+(totalSpent/1000).toFixed(0)+'K spent so far';
  const pc=pendingCount();const pa=pendingAmt();
  $('ov-inv').textContent=pc;
  $('ov-inv-sub').textContent='$'+(pa/1000).toFixed(0)+'K pending approval';
}

// ── Navigation ─────────────────────────────────────────────────────────────────
window.goTab = function(name, el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-it').forEach(n=>n.classList.remove('active'));
  $('page-'+name).classList.add('active');
  el.classList.add('active');
  const titles={overview:'Project Overview',budget:'Budget Tracker',costplus:'Cost-Plus Invoices',subs:'Subcontractor Panel',team:'Team',schedule:'Schedule',projects:'Projects',tasks:'All Tasks',settings:'Settings'};
  $('topbar-title').textContent=titles[name]||'Dashboard';
  if(name==='budget')renderBudget();
  if(name==='costplus')renderCostPlus();
  if(name==='subs')renderSubs();
  if(name==='team')renderTeam();
};

window.selectProj = function(id){selProj=id;renderProjects();renderTasks(id)};
window.selectBudgetProj = function(id){budgetProj=id;renderBudget()};
window.selectCPProj = function(id){cpProj=id;renderCostPlus()};

window.filterSubs = function(trade, el){
  subFilter=trade;
  document.querySelectorAll('#page-subs .btn-ghost').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderSubs();
};

window.switchView = function(v){
  $('listView').style.display=v==='list'?'':'none';
  $('vList').className='vb'+(v==='list'?' active':'');
  $('vKanban').className='vb'+(v==='kanban'?' active':'');
  $('kanbanView').className='kb-board'+(v==='kanban'?' active':'');
  if(v==='kanban')renderKanban();
};

window.toggleTask = function(pid, tid){
  const t=(tasks[pid]||[]).find(x=>x.id===tid);
  if(t){t.done=!t.done;renderTasks(pid);updateStats()}
};

// ── Modals ─────────────────────────────────────────────────────────────────────
window.openM = function(id){
  if(id==='taskModal'){const s=$('nt-proj');s.innerHTML=projects.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');s.value=selProj}
  if(id==='invoiceModal'){
    const s=$('ni-proj');s.innerHTML=projects.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');s.value=cpProj;
    const p=projects.find(x=>x.id===cpProj);if(p)$('ni-markup').value=p.markup||15;
    $('ni-date').value=new Date().toISOString().split('T')[0];
  }
  $(id).classList.add('open');
};
window.closeM = function(id){$(id).classList.remove('open')};
window.closeOuter = function(e,id){if(e.target.id===id)window.closeM(id)};
window.toggleChip = function(el){el.classList.toggle('sel')};

// ── Add / Delete actions ───────────────────────────────────────────────────────
window.addProject = function(){
  const name=$('np-name').value.trim();if(!name)return;
  const p={
    id:nextId.proj++,name,client:$('np-client').value.trim()||'TBD',
    status:$('np-status').value,phase:$('np-phase').value.trim()||'Pre-Construction',
    progress:0,pm:[...$('pmChips').querySelectorAll('.tchip.sel')].map(c=>c.textContent.trim())[0]||'Unassigned',
    addr:$('np-addr').value.trim()||'Sanford, FL',end:$('np-end').value||'',
    ctype:$('np-ctype').value,budget:parseFloat($('np-budget').value)||0,markup:parseFloat($('np-markup').value)||15,
    cats:{mat:0,lab:0,sub:0,fee:0,oth:0}
  };
  const b=p.budget;if(b>0){p.cats={mat:Math.round(b*.35),lab:Math.round(b*.28),sub:Math.round(b*.22),fee:Math.round(b*.07),oth:Math.round(b*.08)}}
  projects.unshift(p);tasks[p.id]=[];
  renderProjects();updateStats();window.closeM('projModal');
  ['np-name','np-client','np-budget','np-addr','np-phase'].forEach(i=>$(i).value='');
};

window.addTask = function(){
  const title=$('nt-title').value.trim();if(!title)return;
  const pid=parseInt($('nt-proj').value);
  if(!tasks[pid])tasks[pid]=[];
  tasks[pid].unshift({id:nextId.task++,title,assignee:$('nt-ass').value,due:$('nt-due').value,priority:$('nt-pri').value,done:false});
  if(pid===selProj)renderTasks(pid);
  updateStats();window.closeM('taskModal');$('nt-title').value='';
};

window.addInvoice = function(){
  const desc=$('ni-desc').value.trim();if(!desc)return;
  const pid=parseInt($('ni-proj').value);
  invoices.push({
    id:nextId.inv++,projId:pid,desc,cat:$('ni-cat').value,
    vendor:$('ni-vendor').value.trim()||'—',date:$('ni-date').value,
    num:$('ni-num').value.trim()||'INV-'+String(nextId.inv).padStart(4,'0'),
    amount:parseFloat($('ni-amt').value)||0,markup:parseFloat($('ni-markup').value)||0,
    status:$('ni-status').value
  });
  updateStats();renderCostPlus();renderBudget();window.closeM('invoiceModal');
  ['ni-desc','ni-vendor','ni-num','ni-amt','ni-notes'].forEach(i=>$(i).value='');
};

window.deleteInvoice = function(id){
  const idx=invoices.findIndex(i=>i.id===id);
  if(idx!==-1)invoices.splice(idx,1);
  renderCostPlus();renderBudget();updateStats();
};

window.addSub = function(){
  const name=$('ns-name').value.trim();if(!name)return;
  subs.push({
    id:nextId.sub++,name,trade:$('ns-trade').value,contact:$('ns-contact').value.trim(),
    phone:$('ns-phone').value.trim(),email:$('ns-email').value.trim(),lic:$('ns-lic').value.trim()||'N/A',
    rate:$('ns-rate').value.trim(),insExp:$('ns-ins').value,rating:4,status:'idle',projs:[],notes:$('ns-notes').value.trim()
  });
  renderSubs();window.closeM('subModal');
  ['ns-name','ns-contact','ns-phone','ns-email','ns-lic','ns-rate','ns-notes'].forEach(i=>$(i).value='');
};

window.editSub = function(id){alert('Edit sub #'+id+' — full edit modal coming soon!')};
window.deleteSub = function(id){
  if(confirm('Remove this subcontractor?')){
    const idx=subs.findIndex(s=>s.id===id);
    if(idx!==-1)subs.splice(idx,1);
    renderSubs();
  }
};

window.addTeamMember = function(){
  const name=$('ntm-name').value.trim();if(!name)return;
  team.push({id:nextId.team++,name,role:$('ntm-role').value.trim()||'Team Member',phone:$('ntm-phone').value.trim(),email:$('ntm-email').value.trim()});
  renderTeam();window.closeM('teamModal');
  ['ntm-name','ntm-role','ntm-phone','ntm-email'].forEach(i=>$(i).value='');
};

window.deleteTeamMember = function(id){
  if(confirm('Remove team member?')){
    const idx=team.findIndex(m=>m.id===id);
    if(idx!==-1)team.splice(idx,1);
    renderTeam();
  }
};

// ── Init ───────────────────────────────────────────────────────────────────────
renderProjects();
renderTasks(selProj);
renderActivity();
updateStats();
