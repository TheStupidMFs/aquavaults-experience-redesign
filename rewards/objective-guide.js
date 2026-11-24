/* Rewards interaction layer: preserves canonical rules and verified progress.
   Adds navigation guidance only; never awards points or alters task status. */
(function(){
'use strict';
const routes={
 swap:{href:'../swapper/swap/swap-card.html',label:'Open Swap',detail:'Use the Swap tool. Only eligible, verified activity can count toward Rewards.'},
 autoswap:{href:'../swapper/autoswap/',label:'Explore AutoSwap',detail:'Review the AutoSwap setup and eligibility rules before creating an automation.'},
 coop:{href:'../coop-rig/',label:'Explore Co-Op',detail:'Review Co-Op participation and cycle requirements. Participation does not automatically guarantee points.'},
 communities:{href:'../community-affiliates/',label:'Explore Communities',detail:'Discover communities and review which actions qualify under the published Rewards rules.'},
 account:{href:'../account/',label:'Open Account',detail:'Check account connection and participation status. Backend verification determines eligibility.'}
};
function classify(label){
 const t=(label||'').toLowerCase();
 if(/auto.?swap/.test(t))return 'autoswap';
 if(/co.?op|rig|mining/.test(t))return 'coop';
 if(/manual swap|\bswap\b|trade/.test(t))return 'swap';
 if(/community|loyalty/.test(t))return 'communities';
 if(/connect|sign.?in|account|wallet/.test(t))return 'account';
 return null;
}
function enhance(container){
 if(!container)return;
 const cards=container.querySelectorAll('.rewards-task,.rewards-quest-step,.rewards-catalog-task');
 for(const card of cards){
  if(card.dataset.avGuided)return;
  card.dataset.avGuided='true';
  const label=card.querySelector('strong')?.textContent?.trim()||'';
  if(!label)continue;
  const key=classify(label),details=document.createElement('details');
  details.className='av-reward-guidance';
  const summary=document.createElement('summary');summary.textContent='How to participate';details.append(summary);
  const content=document.createElement('div');content.className='av-reward-guidance-body';
  const p=document.createElement('p');
  p.textContent=key?routes[key].detail:'Check the published task requirements above. Only verified activity that meets the current cycle rules can earn points.';
  content.append(p);
  if(key){
   const a=document.createElement('a');a.href=routes[key].href;a.textContent=routes[key].label+' ↗';a.className='av-reward-guidance-link';content.append(a);
  }
  const note=document.createElement('small');note.textContent='This shortcut does not complete the objective. Qualification and awards are verified by AquaVaults.';content.append(note);
  details.append(content);card.append(details);
 }
}
function run(){['dailyTasks','bonusTasks','questTasks','taskCatalogGroups'].forEach(id=>enhance(document.getElementById(id)))}
document.addEventListener('DOMContentLoaded',()=>{
 run();
 const targets=['dailyTasks','bonusTasks','questTasks','taskCatalogGroups'].map(id=>document.getElementById(id)).filter(Boolean);
 const observer=new MutationObserver(mutations=>{
  if(mutations.every(m=>m.target.closest?.('.av-reward-guidance')))return;
  run();
 });
 targets.forEach(t=>observer.observe(t,{childList:true,subtree:false}));
});
})();