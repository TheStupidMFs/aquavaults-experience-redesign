/* Informational AutoSwap setup summary. Does not modify or submit trading instructions. */
(function(){
'use strict';
function setup(){
 const target=document.getElementById('panelAuto');if(!target||document.getElementById('avAutoGuide'))return;
 const guide=document.createElement('section');guide.id='avAutoGuide';guide.className='av-auto-guide';guide.setAttribute('aria-label','AutoSwap setup overview');
 guide.innerHTML='<div class="av-auto-steps"><span><b>01</b> Select community</span><span><b>02</b> Configure swaps</span><span><b>03</b> Review settings</span><span><b>04</b> Start when ready</span></div><details class="av-auto-review"><summary>Review my current setup <span aria-hidden="true">⌄</span></summary><div class="av-auto-review-body"><p id="avAutoReviewSummary" role="status" aria-live="polite"></p><p class="av-auto-disclaimer">This is a setup summary, not a transaction quote or confirmation. Actual execution, fees, token availability and wallet approval are governed by the existing AutoSwap controls.</p><button type="button" id="avAutoReviewSettings">Go to Swap Settings</button></div></details>';
 target.insertAdjacentElement('afterbegin',guide);
 const get=id=>document.getElementById(id);
 function update(){
  const token=id=>{const e=get(id);return e?.selectedOptions?.[0]?.textContent?.trim()||'Not selected'};
  const count=Number(get('swapCount')?.value),wait=Number(get('waitTime')?.value),amount=Number(get('pair1Amount')?.value);
  const community=get('communitySelected')?.textContent?.trim()||'Not selected';
  const fee=get('feeInput')?.value;
  const valid=Number.isFinite(count)&&count>=1&&Number.isFinite(wait)&&wait>=0&&Number.isFinite(amount)&&amount>0;
  const lines=['Community: '+community,'Pair: '+token('pair1From')+' → '+token('pair1To'),'Amount per swap: '+(amount>0?amount:'Not set'),'Planned swaps: '+(count>=1?count:'Not set'),'Delay after swap: '+(wait>=0?wait+' sec':'Not set'),'Selected platform fee: '+(fee!==undefined?fee+'%':'Check settings')];
  const options=['flipFlopToggle','randomWaitToggle','randomAmountToggle','randomPairsToggle'].filter(id=>get(id)?.checked).map(id=>({flipFlopToggle:'Flip-Flop',randomWaitToggle:'Random wait',randomAmountToggle:'Random amount',randomPairsToggle:'Random pairs'})[id]);
  if(options.length)lines.push('Enabled options: '+options.join(', '));
  lines.push(valid?'Review all settings and wallet prompts before starting.':'Some required inputs are missing or invalid. Check the form before starting.');
  const p=get('avAutoReviewSummary');if(p)p.textContent=lines.join('\n');
 }
 guide.addEventListener('click',e=>{if(e.target.closest('#avAutoReviewSettings')){const settings=get('constraintsContainer');if(settings)settings.scrollIntoView({behavior:'smooth',block:'center'});}});
 document.addEventListener('input',update);
 document.addEventListener('change',update);
 const community=get('communitySelected');if(community)new MutationObserver(update).observe(community,{childList:true,subtree:true,characterData:true});
 update();
}
document.addEventListener('DOMContentLoaded',setup);
})();