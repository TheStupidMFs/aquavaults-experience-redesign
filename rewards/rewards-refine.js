(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var kicker = document.querySelector('.rewards-kicker');
    var title = document.querySelector('.rewards-hero h1');
    var copy = document.querySelector('.rewards-hero > p');
    if (kicker) kicker.textContent = 'AQUAVAULTS REWARDS';
    if (title) title.textContent = 'See who’s building momentum.';
    if (copy) copy.textContent = 'Follow the active leaderboard, understand how verified participation earns points and see which communities are moving the ecosystem forward.';

    var status = document.querySelector('#rewardsGlobalStatus');
    if (status && !document.querySelector('.rewards-hero-actions')) {
      var actions = document.createElement('div');
      actions.className = 'rewards-hero-actions';
      actions.innerHTML = '<a href="../account/#rewards">View my progress</a><a href="./rules/">Read the rules</a>';
      status.parentNode.insertBefore(actions, status);
    }

    var progress = document.querySelector('[data-game-view="play"]');
    if (progress) {
      var accountLink = document.createElement('a');
      accountLink.className = 'rewards-game-account-link';
      accountLink.href = '../account/#rewards';
      accountLink.textContent = 'My Account';
      progress.replaceWith(accountLink);
    }
  });
})();
