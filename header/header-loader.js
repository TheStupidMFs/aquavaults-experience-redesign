(function(){
  function basePath(){
    const p=window.location.pathname;
    return p.startsWith("/aquavaults-experience-redesign/")?"/aquavaults-experience-redesign":"";
  }
  function headerPath(type){return basePath()+"/header/header-"+type+".html?v=5"}
  function init(){
    const el=document.getElementById("header-container");
    if(!el){console.warn("Header container not found");return}
    const type=el.getAttribute("data-header-type")||"simple";
    el.innerHTML='<div class="header-loading-skeleton"><div class="header-skeleton-content"><div class="header-skeleton-logo"></div><div class="header-skeleton-title"></div></div></div>';
    fetch(headerPath(type)).then(r=>{if(!r.ok)throw new Error("Failed to load header: "+r.status);return r.text()}).then(html=>{
      el.innerHTML=html;
      // Resolve navigation to actual GitHub Pages files before adding the project prefix.
      const routeMap={
        "/":"/", "/swap":"/swapper/swap/swap-card.html",
        "/communities":"/community-affiliates/",
        "/rewards":"/rewards/", "/coop-rig":"/coop-rig/",
        "/account":"/account/", "/account/":"/account/",
        "/autoswap":"/swapper/autoswap/autoswap-card.html",
        "/limit-order":"/swapper/limit-order/limit-order.html",
        "/evm-swap":"/swapper/evm/swap-card.html",
        "/lp":"/lp/", "/campaigns":"/campaigns/",
        "/wheel":"/wheel/", "/wheel/":"/wheel/",
        "/learn":"/learn/", "/learn/":"/learn/"
      };
      el.querySelectorAll('a[href^="/"]').forEach(a=>{
        const raw=a.getAttribute("href");
        const match=raw.match(/^([^?#]*)(.*)$/);
        const destination=routeMap[match[1]];
        if(destination)a.setAttribute("href",destination+match[2]);
      });
      const root=basePath();
      if(root){
        el.querySelectorAll('a[href^="/"]').forEach(a=>a.setAttribute("href",root+a.getAttribute("href")));
        el.querySelectorAll('img[src^="/"]').forEach(i=>i.setAttribute("src",root+i.getAttribute("src")));
      }
      const boot=()=>{if(window.AquaVaultsHeader&&window.AquaVaultsHeader.init){window.AquaVaultsHeader.init();if(type==="full"&&window.AquaVaultsWalletWidget&&window.AquaVaultsWalletWidget.mount)window.AquaVaultsWalletWidget.mount({el:"av-wallet",autoConnect:true})}else setTimeout(boot,50)};boot();
    }).catch(err=>{console.error("Error loading header:",err);el.innerHTML='<header class="app-header"><a class="header-center" href="'+basePath()+'/"><h1 class="header-title">AquaVaults</h1></a></header>'})
  }
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();
