(function () {
  'use strict';

  function placeFeeControl() {
    var target = document.getElementById('swapSupportFeeControl');
    var fee = document.getElementById('feeInput');
    var field = fee && fee.closest('.constraint-field');
    if (target && field && field.parentNode !== target) target.appendChild(field);
  }

  function placeRewardsBelowAction() {
    var button = document.getElementById('swapBtn');
    var rewards = document.getElementById('avRewardsDiscovery');
    if (button && rewards && button.nextElementSibling !== rewards) button.insertAdjacentElement('afterend', rewards);
  }

  document.addEventListener('DOMContentLoaded', function () {
    placeFeeControl();
    placeRewardsBelowAction();
    var outcome = document.querySelector('.outcome-section');
    if (outcome) new MutationObserver(placeRewardsBelowAction).observe(outcome, { childList: true });
  });
})();
