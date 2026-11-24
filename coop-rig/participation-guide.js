/* Co-Op explainer and navigation layer. Never changes mining, credit, eligibility or wallet actions. */
(function(){
'use strict';
function node(tag,cls,content){const e=document.createElement(tag);if(cls)e.className=cls;if(content)e.textContent=content;return e}
const concepts=[
 {title:'What are Droplets?',body:'Droplets are the daily participation units used by the Co-Op interface. Check the live balance and current rules before submitting a contribution. A displayed amount is not a guaranteed reward.'},
 {title:'What is cycle weight?',body:'Cycle weight represents eligible participation recorded for the active Co-Op cycle. It is not a wallet balance or a promise of payment. Confirmed and credited activity may update at different times.'},
 {title:'How do I verify a contribution?',body:'Open Activity, then My Contributions. Verify your wallet to see the records returned by AquaVaults. An on-chain transaction can require a separate credit step; use the existing retry flow if a confirmed contribution is awaiting credit.'}
];
function guide(){
 const stage=document.querySelector('.coop-rig-stage');if(!stage||document.getElementById('avCoopGuide'))return;
 const section=node('section','av-coop-guide');section.id='avCoopGuide';section.setAttribute('aria-label','Co-Op participation guide');
 const heading=node('div','av-coop-guide-heading');
 const left=node('div');left.append(node('span','av-coop-guide-eyebrow','UNDERSTAND YOUR PARTICIPATION'),node('h2',null,'Know what powers the rig.'),node('p',null,'Three quick explanations before you contribute.'));
 heading.append(left);
 const activity=node('button','av-coop-guide-activity','View my contributions ↗');activity.type='button';
 activity.addEventListener('click',()=>{const b=document.querySelector('[data-coop-view="activity"]');if(b)b.click();const history=document.getElementById('historyList');if(history)history.scrollIntoView({behavior:'smooth',block:'center'});});
 heading.append(activity);section.append(heading);
 const grid=node('div','av-coop-guide-grid');
 concepts.forEach((c,i)=>{
  const details=node('details','av-coop-guide-item');
  const summary=node('summary');summary.append(node('span','av-coop-guide-number','0'+(i+1)),node('strong',null,c.title));
  details.append(summary,node('p',null,c.body));grid.append(details);
 });
 section.append(grid);
 stage.insertAdjacentElement('afterend',section);
}
document.addEventListener('DOMContentLoaded',guide);
})();