/* AquaVaults activity feed: read-only frontend, no fabricated transactions.
 Adapter: window.AquaVaultsActivityAdapter.list({wallet,type,limit}) -> {items:[{id,type,title,description,occurredAt,status,txUrl,community,amount}]}.
 No adapter means a clear integration empty state, never fake history. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
let filter='all',request=0;
const supported=new Set(['swap','community','rewards','coop']);
function wallet(){return ($('accountProfileWallet')?.textContent||'').trim()}
function text(tag,value,cls){const e=document.createElement(tag);if(cls)e.className=cls;e.textContent=value;return e}
function safeLink(raw){try{const u=new URL(raw);return u.protocol==='https:'?u.href:null}catch{return null}}
function show(active){
 const dashboard=$('accountDashboard'),feed=$('avActivitySection');
 if(!dashboard||!feed)return;
 dashboard.classList.toggle('av-activity-active',active);
 if(active){dashboard.classList.remove('av-communities-active');const c=$('avCommunitiesSection');if(c)c.hidden=true;document.querySelectorAll('[data-my-communities-open]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});}
 feed.hidden=!active;
 document.querySelectorAll('[data-profile-section="overview"]').forEach(b=>b.classList.toggle('active',!active));
 document.querySelectorAll('[data-activity-open]').forEach(b=>{b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 if(active){load();feed.scrollIntoView({behavior:'smooth',block:'start'})}
}
function render(items){
 const list=$('avActivityList');list.replaceChildren();
 if(!items.length){list.append(text('p','No verified activity was returned for this view. Once connected, your history will appear here.','av-activity-empty'));return}
 for(const item of items){
  if(!item||!supported.has(item.type))continue;
  const card=text('article','','av-activity-item');
  const meta=text('div','','av-activity-meta');
  meta.append(text('span',item.type.toUpperCase(),'av-activity-type'));
  const when=item.occurredAt?new Date(item.occurredAt):null;
  if(when&&!Number.isNaN(when.getTime()))meta.append(text('time',when.toLocaleString(),'av-activity-date'));
  card.append(meta,text('h3',item.title||'Verified activity'));
  if(item.description)card.append(text('p',item.description));
  const bottom=text('div','','av-activity-bottom');
  if(item.community)bottom.append(text('span',item.community));
  if(item.amount)bottom.append(text('span',String(item.amount)));
  if(item.status)bottom.append(text('span',item.status));
  const link=safeLink(item.txUrl);
  if(link){const a=text('a','View transaction ↗');a.href=link;a.target='_blank';a.rel='noopener noreferrer';bottom.append(a)}
  if(bottom.children.length)card.append(bottom);
  list.append(card);
 }
 if(!list.children.length)list.append(text('p','No supported activity records found.','av-activity-empty'));
}
async function load(){
 const token=++request,status=$('avActivityStatus'),adapter=window.AquaVaultsActivityAdapter;
 const list=$('avActivityList');list.replaceChildren();
 if(!adapter||typeof adapter.list!=='function'){
  status.textContent='Backend connection needed';
  list.append(text('p','Your activity feed is ready to connect. Verified swaps, community support, Rewards and Co-Op events will appear here once the activity endpoint is wired. No sample transactions are being presented as real.','av-activity-empty'));
  return;
 }
 status.textContent='Loading verified activity…';
 try{
  const data=await adapter.list({wallet:wallet(),type:filter,limit:30});
  if(token!==request)return;
  if(!data||!Array.isArray(data.items))throw Error('Invalid activity response');
  render(data.items.filter(x=>filter==='all'||x.type===filter));
  status.textContent=data.items.length?'Activity loaded':'No activity recorded';
 }catch(err){
  if(token!==request)return;
  status.textContent='Activity unavailable';
  list.append(text('p','We could not load verified activity. Please retry.','av-activity-empty'));
 }
}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-activity-open]').forEach(b=>b.addEventListener('click',()=>show(true)));
 $('avActivityBack')?.addEventListener('click',()=>show(false));
 document.querySelectorAll('[data-profile-section="overview"]').forEach(b=>b.addEventListener('click',()=>show(false)));
 document.querySelectorAll('[data-activity-filter]').forEach(b=>b.addEventListener('click',()=>{
  filter=b.dataset.activityFilter;
  document.querySelectorAll('[data-activity-filter]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active))});
  load();
 }));
 $('avActivityRefresh')?.addEventListener('click',load);
 document.querySelectorAll('[data-hub-jump], [data-hub-tab], [data-my-communities-open], .account-profile-tabs a').forEach(el=>el.addEventListener('click',()=>show(false)));
});
})();