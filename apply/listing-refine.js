(() => {
  const hero = document.querySelector('.av-apply .account-hero');
  if (!hero || document.querySelector('.listing-journey')) return;

  const journey = document.createElement('section');
  journey.className = 'listing-journey';
  journey.setAttribute('aria-label', 'Community listing process');
  journey.innerHTML = `
    <div><span>Apply</span><p>Share the community, social links, and project context you have today.</p></div>
    <div><span>Review</span><p>AquaVaults checks the application and contacts you if anything needs clarification.</p></div>
    <div><span>Approve</span><p>Approved communities receive a request for their logo and listing artwork.</p></div>
    <div><span>Go live</span><p>The completed listing is published with its approved community information.</p></div>`;
  hero.insertAdjacentElement('afterend', journey);
})();
