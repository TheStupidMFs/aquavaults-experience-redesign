(function () {
  'use strict';

  function buildCampaignIntro() {
    var app = document.getElementById('campaign-app');
    var status = document.getElementById('campaign-status');
    if (!app || !status || document.querySelector('.campaign-intro')) return;

    status.insertAdjacentHTML('beforebegin', `
      <header class="campaign-intro">
        <span>COMMUNITY COMPETITION</span>
        <h1>Campaigns turn activity into momentum.</h1>
        <p>AquaVaults schedules focused competitions, communities choose whether to participate, and qualifying activity is tracked automatically throughout the campaign window.</p>
      </header>
      <section class="campaign-journey" aria-label="How campaigns work">
        <div><b>01</b><strong>AquaVaults Publishes</strong><span>A campaign template, dates and frozen rules are announced.</span></div>
        <div><b>02</b><strong>Communities Decide</strong><span>Eligible communities can participate or withdraw before launch.</span></div>
        <div><b>03</b><strong>Activity Scores</strong><span>Qualifying onchain activity automatically adds leaderboard points.</span></div>
        <div><b>04</b><strong>Results Finalize</strong><span>Standings are reconciled before bonuses are applied.</span></div>
      </section>
      <section class="campaign-transparency" aria-label="Campaign data and rewards">
        <div><span>PUBLIC VIEW</span><strong>Points and placement</strong><p>Leaderboards show competitive progress without exposing a community's private revenue totals.</p></div>
        <div><span>COMMUNITY DASHBOARD</span><strong>Activity and fee value</strong><p>Participating communities can review how qualifying activity translates into campaign points.</p></div>
        <div class="campaign-bonus"><span>WINNER BONUS</span><strong>1st: +10% · 2nd &amp; 3rd: +5%</strong><p>Campaign rewards are revenue bonuses applied during the campaign's defined reward window.</p></div>
      </section>`);
  }

  document.addEventListener('DOMContentLoaded', buildCampaignIntro);
})();
