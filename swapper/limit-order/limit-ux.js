/* Presentation-only enhancements; trading and wallet logic remain in the original bundle. */
(function(){
 function ready(){
  const advanced=document.getElementById('advancedHeader');
  if(advanced){
   advanced.addEventListener('keydown',function(event){
    if(event.key==='Enter'||event.key===' '){event.preventDefault();advanced.click();}
   });
  }
  const active=document.getElementById('activeTab');
  const history=document.getElementById('historyTab');
  function syncTabs(){
   if(active)active.setAttribute('aria-pressed',String(active.classList.contains('active')));
   if(history)history.setAttribute('aria-pressed',String(history.classList.contains('active')));
  }
  if(active)active.addEventListener('click',syncTabs);
  if(history)history.addEventListener('click',syncTabs);
  syncTabs();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);
 else ready();
})();
document.addEventListener('DOMContentLoaded', () => {
  const heading = document.querySelector('.tool-experience-heading');
  if (heading && !document.querySelector('.limit-flow')) {
    const description = heading.querySelector('p');
    if (description) description.textContent = 'Set a target price on Solana and let the order remain active until it fills, expires, or you cancel it.';
    heading.insertAdjacentHTML('afterend', `<section class="limit-flow" aria-label="How limit orders work"><div><b>01</b><strong>Choose Tokens</strong><span>Select what to sell and receive.</span></div><div><b>02</b><strong>Set Your Price</strong><span>Define the rate that triggers the order.</span></div><div><b>03</b><strong>Review Order</strong><span>Check amounts and the fixed fee.</span></div><div><b>04</b><strong>Track or Cancel</strong><span>Manage it from Active and History.</span></div></section><aside class="limit-platform-note"><span>LIMIT ORDER FEE ROUTING</span><strong>Limit Orders are an AquaVaults trading tool.</strong><p>They use a fixed 1% platform fee and do not currently route a community fee share. Community support remains available through Swap, AutoSwap, and EVM Swap.</p></aside>`);
  }

  const feeInput = document.querySelector('#feePercentInput');
  if (feeInput) {
    feeInput.value = '1.0';
    feeInput.min = '1';
    feeInput.max = '1';
    feeInput.readOnly = true;
    feeInput.setAttribute('aria-readonly', 'true');
  }
  const feeNote = feeInput?.closest('.advanced-field')?.querySelector('.fee-note');
  if (feeNote) feeNote.textContent = 'Fixed at 1%. The fee is collected when the order fills and currently supports AquaVaults rather than a selected community.';
});
