/* AQUAVAULTS REDESIGN MOCK CONTROLS — all-site local-only selector. */
(function(){
'use strict';
const key='av-design-preview-v1';
const defaults={wallet:'connected',account:'setup',community_type:'founding',partner:'active',
  role:'owner',connector:'listing_approved',points:320,coop_state:'mining',coop_droplets:3,
  dashboard_view:'dashboard',campaign_state:'idle',loyalty:'selected',data_density:'populated',
  floor_upgrade:'none',community_connector:'visible',scan_credits:0,coop_participation:'closed',
  coop_executor:'paused',rewards_cycle:'published',preview_profile:'demo'};
const fields={
 wallet:['connected','disconnected'],account:['setup','not_setup'],
 role:['visitor','member','owner','admin'],community_type:['standard','early_growth','founding'],
 partner:['inactive','active'],connector:['not_linked','linked','listing_pending','listing_approved'],
 coop_state:['idle','mining','cooldown'],dashboard_view:['dashboard','tour'],
 campaign_state:['idle','active','completed','withdrawn'],loyalty:['selected','not_selected'],
 floor_upgrade:['none','purchased_pending','active'],community_connector:['visible','hidden'],
 coop_participation:['closed','open'],coop_executor:['paused','running'],
 rewards_cycle:['published','draft','finalized'],
 data_density:['populated','empty']
};
const labels={wallet:'Wallet connection',account:'Account session',role:'Role / dashboard login',
 community_type:'Listing type',partner:'Partner',connector:'Connector',
 coop_state:'Co-Op Rig',dashboard_view:'Command Center',
 campaign_state:'Community campaign',loyalty:'Loyalty selection',
 data_density:'Data density',points:'Rewards points',coop_droplets:'Co-Op droplets',
 floor_upgrade:'Community floor purchase',community_connector:'Community Connector panel',
 coop_participation:'Co-Op participation session',coop_executor:'Rig executor loop',
 rewards_cycle:'Rewards admin cycle',scan_credits:'Holder scan credits'};
const presets={
 'New visitor':{wallet:'disconnected',account:'not_setup',role:'visitor',connector:'not_linked',points:0,coop_state:'idle',coop_droplets:0},
 'Wallet only':{wallet:'connected',account:'not_setup',role:'visitor',connector:'not_linked',points:0,coop_state:'idle',coop_droplets:0},
 'Registered member':{wallet:'connected',account:'setup',role:'member',community_type:'standard',partner:'inactive',connector:'not_linked',points:85},
 'Standard owner':{wallet:'connected',account:'setup',role:'owner',community_type:'standard',partner:'inactive',connector:'not_linked',points:130},
 'Early Growth owner':{wallet:'connected',account:'setup',role:'owner',community_type:'early_growth',partner:'inactive',connector:'linked',points:250},
 'Founding owner':{wallet:'connected',account:'setup',role:'owner',community_type:'founding',partner:'inactive',connector:'listing_approved',points:350},
 'Partner owner':{wallet:'connected',account:'setup',role:'owner',community_type:'standard',partner:'active',connector:'listing_approved',points:680},
 'Connector pending':{wallet:'connected',account:'setup',role:'owner',connector:'listing_pending',points:120},
 'Administrator':{wallet:'connected',account:'setup',role:'admin',partner:'active',community_type:'founding',dashboard_view:'tour'},
 'Empty dashboards':{wallet:'connected',account:'setup',role:'owner',community_type:'standard',partner:'inactive',connector:'not_linked',points:0,coop_droplets:0,data_density:'empty'},
 'Community owner - Account signed out':{wallet:'disconnected',account:'not_setup',role:'owner',community_type:'founding',partner:'active',connector:'not_linked',points:0},
 'avtest01 owner · Nov 18 snapshot':{wallet:'disconnected',account:'not_setup',role:'owner',
  community_type:'standard',partner:'inactive',connector:'not_linked',points:0,
  floor_upgrade:'purchased_pending',community_connector:'hidden',scan_credits:0,
  preview_profile:'avtest01',dashboard_view:'dashboard',coop_state:'idle',coop_droplets:0},
 'Pond0x Partner owner · public Account signed out':{wallet:'disconnected',account:'not_setup',role:'owner',
  community_type:'standard',partner:'active',connector:'listing_approved',points:0,
  floor_upgrade:'none',community_connector:'visible',scan_credits:0,
  preview_profile:'pond0x',dashboard_view:'dashboard',coop_state:'idle',coop_droplets:0},
 'Standard owner · one paid scan credit':{wallet:'connected',account:'setup',role:'owner',
  community_type:'standard',partner:'inactive',floor_upgrade:'none',scan_credits:1,coop_droplets:3},
 'Community member · read only':{wallet:'disconnected',account:'not_setup',role:'member',
  community_type:'standard',partner:'inactive',scan_credits:0,coop_droplets:0},
 'All populated':defaults
};
function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(key)||'{}')};}catch(_){return {...defaults};}}
let state=load();
function save(next){state={...state,...next};localStorage.setItem(key,JSON.stringify(state));
 window.dispatchEvent(new CustomEvent('av-design-state-change',{detail:{...state}}));}
window.AquaVaultsDesignPreview={getState:()=>({...state}),setState:save,reset:()=>save(defaults)};
function addControl(body,name,choices){
 const lab=document.createElement('label');lab.textContent=labels[name];
 const sel=document.createElement('select');sel.dataset.avdp=name;
 for(const value of choices){const o=document.createElement('option');o.value=value;o.textContent=name==='account'?(value==='setup'?'Signed in':'Signed out'):value.replaceAll('_',' ');sel.appendChild(o);}
 sel.value=state[name];sel.addEventListener('change',()=>save({[name]:sel.value}));
 lab.appendChild(sel);body.appendChild(lab);
}
function init(){
 if(document.getElementById('avdp-panel'))return;
 const holder=document.createElement('aside');holder.id='avdp-panel';holder.setAttribute('aria-label','Design-only scenarios');
 const details=document.createElement('details');const sum=document.createElement('summary');
 sum.textContent='DESIGN PREVIEW · MOCK';details.appendChild(sum);
 const body=document.createElement('div');body.className='avdp-body';
 const warning=document.createElement('p');warning.textContent='SYNTHETIC ONLY. Wallet and Account session are independent. A signed-in Account with a disconnected wallet shows a session mismatch. No live operations.';body.appendChild(warning);
 const presetLabel=document.createElement('label');presetLabel.textContent='Quick scenario';
 const preset=document.createElement('select');preset.innerHTML='<option value="">Choose a preset…</option>';
 Object.keys(presets).forEach(name=>{const o=document.createElement('option');o.textContent=name;o.value=name;preset.appendChild(o);});
 preset.addEventListener('change',()=>{if(preset.value)save({...defaults,...presets[preset.value]});});
 presetLabel.appendChild(preset);body.appendChild(presetLabel);
 for(const [name,values] of Object.entries(fields))addControl(body,name,values);
 for(const name of ['points','coop_droplets','scan_credits']){
  const label=document.createElement('label');label.textContent=labels[name];
  const input=document.createElement('input');input.type='number';input.min='0';input.max=name==='coop_droplets'?'6':name==='scan_credits'?'5':'1000000';input.step='1';
  input.value=state[name];input.dataset.avdp=name;
  input.addEventListener('change',()=>save({[name]:Math.min(name==='coop_droplets'?6:name==='scan_credits'?5:1000000,Math.max(0,Math.round(Number(input.value)||0)))}));
  label.appendChild(input);body.appendChild(label);
 }
 const reset=document.createElement('button');reset.type='button';reset.textContent='Reset all';reset.addEventListener('click',()=>save(defaults));body.appendChild(reset);
 const nav=document.createElement('p');nav.innerHTML='<a href="/design-preview/">All pages</a> · <a href="/design-preview/coverage.html">Route check</a> · <a href="/admin/#/home">Admin</a> · <a href="/portal/dashboard/">Command Center</a>';
 body.appendChild(nav);
 const note=document.createElement('p');note.id='avdp-mock-status';note.textContent='API requests are local mock-only. Unsupported endpoints return 501.';
 body.appendChild(note);
 const issues=new Set(); const jsErrors=[];
 window.addEventListener('av-design-unmocked-api',e=>{issues.add(e.detail.method+' '+e.detail.path);
  note.textContent=issues.size+' unsupported endpoint(s): '+Array.from(issues).slice(0,5).join(', ');});
 window.addEventListener('av-design-external-blocked',()=>{note.textContent='External link blocked for safety.';});
 window.addEventListener('error',e=>{if(jsErrors.length<50)jsErrors.push(String(e.message||'Unknown JS error'));});
 window.addEventListener('unhandledrejection',e=>{if(jsErrors.length<50)jsErrors.push('Promise: '+String(e.reason?.message||e.reason||'Unknown'));});
 const copy=document.createElement('button');copy.type='button';copy.textContent='Copy QA diagnostics';
 copy.addEventListener('click',()=>{
  const report='AquaVaults local design QA\nRoute: '+location.pathname+location.hash+'\nScenario: '+JSON.stringify(state)+
    '\nUnmocked API: '+(Array.from(issues).join('; ')||'none')+'\nJavaScript errors: '+(jsErrors.join('; ')||'none')+
    '\nOnly local synthetic state; not verified against production.';
  if(navigator.clipboard?.writeText){navigator.clipboard.writeText(report).then(()=>{copy.textContent='Copied QA report';})
    .catch(()=>window.prompt('Copy QA report',report));}
  else window.prompt('Copy QA report',report);
 });body.appendChild(copy);
 details.appendChild(body);holder.appendChild(details);document.body.appendChild(holder);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
