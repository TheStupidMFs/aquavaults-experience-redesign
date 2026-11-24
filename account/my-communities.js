/* My Communities: preview favorites from Communities, production adapter optional.
   Adapter: window.AquaVaultsFavoritesAdapter {list({wallet}),remove({wallet,id})}.
   Without adapter, localStorage is explicitly preview-only and not wallet-synced. */
(function(){
'use strict';
const $=id=>document.getElementById(id),KEY='av-preview-community-favorites';
let request=0;
function wallet(){return ($('accountProfileWallet')?.textContent||'').trim()}
function el(tag,cls,label){const n=document.createElement(tag);if(cls)n.className=cls;if(label!=null)n.textContent=label;return n}
function ids(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a.filter(x=>typeof x==='string').slice(0,10):[]}catch{return []}}
function getRegistry(){try{return window.CommunityRegistry?.getAll?.()||[]}catch{return []}}
function show(active){
 const shell=$('accountDashboard'),section=$('avCommunitiesSection');if(!shell||!section)return;
 shell.classList.toggle('av-communities-active',active);section.hidden=!active;
 if(active){shell.classList.remove('av-activity-active');const a=$('avActivitySection');if(a)a.hidden=true;document.querySelectorAll('[data-activity-open]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});}
 document.querySelectorAll('[data-my-communities-open]').forEach(b=>{b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 document.querySelectorAll('[data-profile-section="overview"]').forEach(b=>b.classList.toggle('active',!active));
 if(active){refresh();section.scrollIntoView({behavior:'smooth',block:'start'})}
}
function message(value){$('avCommunitiesStatus').textContent=value}
function render(items,isPreview){
 const host=$('avCommunitiesGrid');host.replaceChildren();
 $('avCommunitiesCount').textContent=items.length+' / 10';
 if(!items.length){
  const empty=el('div','av-my-communities-empty');
  empty.append(el('h3',null,'Your collection starts here.'),el('p',null,'Explore the communities building on AquaVaults and save the ones you want close.'));
  const a=el('a','av-my-communities-primary','Explore Communities ↗');a.href='../community-affiliates/';empty.append(a);host.append(empty);return;
 }
 const registry=getRegistry();
 items.forEach(item=>{
  const id=typeof item==='string'?item:item?.id;
  if(!id)return;
  const info=registry.find(c=>c.id===id)||{};
  const name=(typeof item==='object'&&item.name)||info.name||id;
  const card=el('article','av-my-community');
  const top=el('div','av-my-community-top');
  const identity=el('div','av-my-community-identity');
  const src=info.logo||info.image||info.icon;
  if(src&&typeof src==='string'&&!src.startsWith('data:')){
   const img=el('img');img.src=src.startsWith('http')?src:'../'+src.replace(/^\/+/, '');img.alt='';img.loading='lazy';img.onerror=()=>img.remove();identity.append(img);
  }
  identity.append(el('div','av-my-community-name',name));
  top.append(identity,el('span','av-my-community-saved','♡ SAVED'));
  card.append(top);
  if(info.description)card.append(el('p','av-my-community-description',info.description.slice(0,150)));
  const actions=el('div','av-my-community-actions');
  const support=el('a','av-my-community-primary','Support in Swap ↗');support.href='../swapper/swap/swap-card.html';actions.append(support);
  const view=el('a',null,'Explore ↗');view.href='../community-affiliates/';actions.append(view);
  const remove=el('button',null,'Remove');remove.type='button';remove.setAttribute('aria-label','Remove '+name+' from favorites');
  remove.addEventListener('click',async()=>{
   const adapter=window.AquaVaultsFavoritesAdapter;
   remove.disabled=true;
   try{
    if(adapter&&typeof adapter.remove==='function')await adapter.remove({wallet:wallet(),id});
    else localStorage.setItem(KEY,JSON.stringify(ids().filter(x=>x!==id)));
    await refresh();
   }catch{message('Could not remove this community. Please retry.');remove.disabled=false}
  });actions.append(remove);card.append(actions);host.append(card);
 });
 if(isPreview)message('Preview favorites are stored only in this browser, not in your wallet or AquaVaults account.');
}
async function refresh(){
 const token=++request,adapter=window.AquaVaultsFavoritesAdapter;
 message('Loading your communities…');
 if(adapter&&typeof adapter.list==='function'){
  try{const data=await adapter.list({wallet:wallet()});if(token!==request)return;if(!data||!Array.isArray(data.items))throw Error('Invalid favorites response');render(data.items.slice(0,10),false);message('Your saved communities');}
  catch{if(token!==request)return;message('Could not load your communities. Please retry.');$('avCommunitiesGrid').replaceChildren()}
 }else{render(ids(),true)}
}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-my-communities-open]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();show(true)}));
 $('avCommunitiesBack')?.addEventListener('click',()=>show(false));
 $('avCommunitiesRefresh')?.addEventListener('click',refresh);
 document.querySelectorAll('[data-profile-section="overview"]').forEach(b=>b.addEventListener('click',()=>show(false)));
 document.querySelectorAll('[data-hub-jump], [data-hub-tab], [data-activity-open]').forEach(b=>b.addEventListener('click',()=>show(false)));
 window.addEventListener('storage',e=>{if(e.key===KEY&&!$('avCommunitiesSection')?.hidden)refresh()});
});
})();