(function () {
  'use strict';

  function setText(selector, text) {
    var node = document.querySelector(selector);
    if (node) node.textContent = text;
  }

  function hide(selector) {
    var node = document.querySelector(selector);
    if (node) node.hidden = true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    setText('.account-hero h1', 'Your activity. One home.');
    setText('.account-hero > p', 'Build your public identity, track Rewards progress, revisit the communities you support and see your verified activity in one place.');
    setText('.account-connection .account-eyebrow', 'Get started');
    setText('#accountWalletHeading', 'Connect your Solana wallet');

    var status = document.querySelector('#accountStatus');
    if (status && !document.querySelector('.account-value-strip')) {
      var strip = document.createElement('div');
      strip.className = 'account-value-strip';
      strip.setAttribute('aria-label', 'Account benefits');
      strip.innerHTML = '<div><span>01</span><strong>Build your identity</strong><small>Control how you appear across AquaVaults.</small></div>' +
        '<div><span>02</span><strong>Track Rewards</strong><small>See points, tasks and cycle progress.</small></div>' +
        '<div><span>03</span><strong>Keep communities close</strong><small>Return to the builders you support.</small></div>';
      status.parentNode.insertBefore(strip, status);
    }

    hide('#profileCoopBadge');
    hide('[data-hub-tab="coop"]');
    var coopState = document.querySelector('#accountCoopState');
    if (coopState && coopState.closest('article')) coopState.closest('article').hidden = true;
    var coopWeight = document.querySelector('#hubCoopWeight');
    if (coopWeight && coopWeight.closest('article')) coopWeight.closest('article').hidden = true;

    setText('.av-activity-head p', 'Explore your verified swaps, community support, Rewards progress and any historical program records.');
    setText('.account-hub-panel[data-hub-panel="overview"] > .account-hub-hint', 'Rewards points reflect verified participation during the active cycle and do not represent an immediate payout.');
    var rewardsPanel = document.querySelector('[data-hub-panel="rewards"]');
    if (rewardsPanel && !rewardsPanel.querySelector('.account-overline')) {
      var label = document.createElement('span');
      label.className = 'account-overline';
      label.textContent = 'YOUR REWARDS HOME';
      rewardsPanel.insertBefore(label, rewardsPanel.firstChild);
    }
    var rewardsNotes = rewardsPanel ? rewardsPanel.querySelectorAll('.account-hub-hint') : [];
    if (rewardsNotes.length) {
      rewardsNotes[rewardsNotes.length - 1].innerHTML = 'Visit the <a href="../rewards/">public Rewards leaderboard</a> to see the active standings and how the program works.';
    }
  });
})();
