(() => {
  const heading = document.querySelector('.wheel-heading');
  if (!heading || document.querySelector('.wheel-trust-strip')) return;

  const kicker = heading.querySelector('.wheel-kicker');
  if (kicker) kicker.textContent = 'Giveaways without the friction';

  const strip = document.createElement('section');
  strip.className = 'wheel-trust-strip';
  strip.setAttribute('aria-label', 'Wheel Spinner essentials');
  strip.innerHTML = `
    <div>
      <span class="wheel-trust-label">Start free</span>
      <strong>Up to 25 names</strong>
      <p>No wallet or account required.</p>
    </div>
    <div>
      <span class="wheel-trust-label">Upgrade once</span>
      <strong>From $5 per event</strong>
      <p>More entries, imports and customization.</p>
    </div>
    <div>
      <span class="wheel-trust-label">Private by design</span>
      <strong>Saved in this browser</strong>
      <p>Participant names are not stored in your wallet.</p>
    </div>`;

  heading.insertAdjacentElement('afterend', strip);
})();
