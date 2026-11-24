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