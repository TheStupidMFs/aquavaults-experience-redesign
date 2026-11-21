(function(){
  function basePath(){
    const p=window.location.pathname;
    return p.startsWith("/aquavaults-experience-redesign/")?"/aquavaults-experience-redesign":"";
  }
  function headerPath(type){return basePath()+"/header/header-"+type+".html"}
  function init(){
    const el=document.getElementById("header-container");
    if(!el){console.warn("Header container not found");return}
    const type=el.getAttribute("data-header-type")||"simple";
    el.innerHTML='<div class="header-loading-skeleton"><div class="header-skeleton-content"><div class="header-skeleton-logo"></div><div class="header-skeleton-title"></div></div></div>';
    fetch(headerPath(type)).then(r=>{if(!r.ok)throw new Error("Failed to load header: "+r.status);return r.text()}).then(html=>{
      el.innerHTML=html;
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