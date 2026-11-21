/* AQUAVAULTS DESIGN PREVIEW — SIMULATED WALLET WIDGET ONLY. */
(function () {
  'use strict';
  if (!/^(?!(?:[a-z0-9-]+\.)*aquavaults\.com$)(?!(?:[a-z0-9-]+\.)*aquavaults-com\.pages\.dev$)(?!(?:[a-z0-9-]+\.)*aquavaults\.pages\.dev$)[a-z0-9.-]+$/.test(location.hostname)) {
    throw new Error('Design wallet stub refuses unauthorized host');
  }
  const key = 'av-design-preview-v1';
  const wallet = '9nAM57vViGc4hmfgHAkCzZu8HTUwbcvhBgfuS1eK5Chm';
  const provider = 'DESIGN_PREVIEW';
  const isConnected = () => {
    try { const s=JSON.parse(localStorage.getItem(key)||'{}'); return s.wallet!=='disconnected' && s.wallet!=='not_connected'; }
    catch (_) { return true; }
  };
  const payload = () => ({connected:isConnected(),address:isConnected()?wallet:null,provider});
  function syncStorage() {
    const s=payload();
    // The production header reads this separate cache, not only AquaVaultsWallet.
    // It must be updated BEFORE the deferred header script initializes.
    localStorage.setItem('aquavaults_wallet',JSON.stringify({connected:s.connected,address:s.address}));
  }
  function announce() {
    const s=payload();
    // This is the exact event the existing header listens for.
    window.dispatchEvent(new CustomEvent('av:wallet',{detail:{connected:s.connected,publicKey:s.address,provider}}));
    // header.js relays av:wallet to walletStateChanged. Do not double-send after mount.
    if(!document.getElementById('headerConnectBtn'))
      window.dispatchEvent(new CustomEvent('walletStateChanged',{detail:s}));
  }
  function setConnection(connected) {
    const preview=window.AquaVaultsDesignPreview;
    if (preview?.setState) {preview.setState({wallet:connected?'connected':'disconnected'});return;}
    try {
      const old=JSON.parse(localStorage.getItem(key)||'{}');
      localStorage.setItem(key,JSON.stringify({...old,wallet:connected?'connected':'disconnected'}));
      location.reload();
    } catch (_) {}
  }
  function mount(options={}) {
    const name=typeof options.el==='string' ? options.el.replace(/^#/,'') : 'av-wallet';
    const host=document.getElementById(name);
    if(!host)return;
    let btn=host.querySelector('[data-av-design-wallet-widget]');
    if(!btn){
      host.replaceChildren();
      btn=document.createElement('button');
      btn.type='button';
      btn.dataset.avDesignWalletWidget='1';
      btn.style.cssText='cursor:pointer;border:1px solid #4095ba;border-radius:8px;background:#10334b;color:#eaf7ff;padding:7px 11px;font:inherit;';
      btn.addEventListener('click',()=>setConnection(!isConnected()));
      host.appendChild(btn);
    }
    btn.textContent=isConnected()?'Demo wallet · Connected':'Demo wallet · Connect';
    // Header loader calls mount only after initHeader, whose wallet listeners
    // are then installed. Keep the event asynchronous for consistent ordering.
    Promise.resolve().then(announce);
  }
  syncStorage();
  // One normal re-verification after the header and Account scripts settle.
  // This never bypasses same-wallet/session expiry checks in account/hub.js.
  window.addEventListener('load',()=>{
    if(isConnected())window.dispatchEvent(new CustomEvent('avAccountSessionChanged'));
  });
  // This widget never accesses injected wallets, keys, signatures or adapters.
  window.AquaVaultsWalletWidget=Object.freeze({mount,open:()=>setConnection(true)});
  window.AquaVaultsDesignWallet=Object.freeze({announce,connected:isConnected,payload});
})();
