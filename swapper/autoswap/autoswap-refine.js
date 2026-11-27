(function () {
  'use strict';

  function syncSummary() {
    var selected = document.querySelector('#communitySelected .community-selected-name');
    var name = document.getElementById('autoswapSupportName');
    var fee = document.getElementById('feeInput');
    var feeOut = document.getElementById('autoswapSupportFee');
    if (name) name.textContent = selected ? selected.textContent.trim() : 'Choose a community';
    if (fee && feeOut) feeOut.textContent = (parseFloat(fee.value) || 0).toFixed(1) + '%';
  }

  document.addEventListener('DOMContentLoaded', function () {
    syncSummary();
    var selected = document.getElementById('communitySelected');
    if (selected) new MutationObserver(syncSummary).observe(selected, { childList: true, subtree: true, characterData: true });
    var fee = document.getElementById('feeInput');
    if (fee) fee.addEventListener('input', syncSummary);
    window.addEventListener('storage', function (event) { if (event.key === 'selectedCommunity') syncSummary(); });
  });
})();
