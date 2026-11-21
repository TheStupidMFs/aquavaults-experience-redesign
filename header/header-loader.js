(function(){function r(e){const t=window.location.pathname;return t.includes("/swapper/swap/")||t.includes("/swapper/autoswap/")?`/header/header-${e}`:t.includes("/swapper/")?`/header/header-${e}`:`/header/header-${e}`}function n(){const e=document.getElementById("header-container");if(!e){console.warn("Header container not found");return}const t=e.getAttribute("data-header-type")||"simple";e.innerHTML=`
      <div class="header-loading-skeleton">
        <div class="header-skeleton-content">
          <div class="header-skeleton-logo"></div>
          <div class="header-skeleton-title"></div>
        </div>
      </div>
    `;const i=r(t);fetch(i).then(a=>{if(!a.ok)throw new Error(`Failed to load header: ${a.status}`);return a.text()}).then(a=>{e.innerHTML=a;const d=()=>{window.AquaVaultsHeader&&window.AquaVaultsHeader.init?(window.AquaVaultsHeader.init(),t==="full"&&window.AquaVaultsWalletWidget&&window.AquaVaultsWalletWidget.mount&&window.AquaVaultsWalletWidget.mount({el:"av-wallet",autoConnect:!0})):setTimeout(d,50)};d()}).catch(a=>{console.error("Error loading header:",a),e.innerHTML='<header class="app-header"><div class="header-center"><h1 class="header-title">AquaVaults</h1></div></header>'})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",n):n()})();
//# sourceMappingURL=header-loader.js.map
