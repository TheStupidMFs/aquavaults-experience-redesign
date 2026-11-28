(() => {
  const stats = document.querySelector('.about-stats-bar');
  if (!stats || document.querySelector('.learn-paths')) return;

  const paths = document.createElement('section');
  paths.className = 'learn-paths';
  paths.setAttribute('aria-labelledby', 'learn-paths-title');
  paths.innerHTML = `
    <div class="learn-paths-intro">
      <span>Choose your path</span>
      <h2 id="learn-paths-title">Start with what you came to do.</h2>
      <p>Skip the search. Pick the route that matches your role and move through the right guides in order.</p>
    </div>
    <div class="learn-path-list">
      <a href="../learn/intro">
        <small>New users</small>
        <strong>Understand AquaVaults</strong>
        <span>Learn the model, choose a community, and make your first swap.</span>
      </a>
      <a href="../learn/for-token-communities">
        <small>Community leaders</small>
        <strong>Build community revenue</strong>
        <span>Explore listings, fee routing, campaigns, and growth tools.</span>
      </a>
      <a href="../learn/community-driven-liquidity">
        <small>Long-term vision</small>
        <strong>Explore the liquidity engine</strong>
        <span>See how activity, liquidity, and community ownership connect.</span>
      </a>
    </div>`;

  stats.insertAdjacentElement('afterend', paths);
})();
