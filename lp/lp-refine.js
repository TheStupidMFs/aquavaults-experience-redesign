(function () {
  'use strict';

  function buildStatusSection() {
    var hero = document.querySelector('.lp-hero');
    if (!hero || document.querySelector('.lp-system-status')) return;
    hero.insertAdjacentHTML('afterend', `
      <section class="lp-system-status" aria-label="Liquidity system status">
        <div><span>SYSTEM STATUS</span><strong>Active development</strong><p>Pool discovery and fee-routing tools are being completed in phases.</p></div>
        <div><span>YOUR CUSTODY</span><strong>Your position stays in your wallet</strong><p>Opening, claiming and closing always require wallet approval.</p></div>
        <div><span>POOL SOURCE</span><strong>Meteora DAMM v2</strong><p>AquaVaults adds community designation and support routing around Meteora.</p></div>
      </section>
      <section class="lp-meaning-strip" aria-label="Pool directory meanings">
        <div><b>Community Pools</b><span>Officially submitted by a listed community and approved for display.</span></div>
        <div><b>Routing Pools</b><span>Pools users have requested for AquaVaults community fee routing.</span></div>
        <div><b>AquaVaults Supported</b><span>Eligible positions can claim fees and route a chosen share to a community.</span></div>
      </section>`);
  }

  document.addEventListener('DOMContentLoaded', buildStatusSection);
})();
