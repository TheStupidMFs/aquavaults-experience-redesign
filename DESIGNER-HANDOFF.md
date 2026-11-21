# AquaVaults — Existing Frontend / Fictional Data — Designer Handoff

This package is the existing AquaVaults frontend (HTML, CSS, JavaScript, artwork,
route structure, existing UI renderers) with synthetic API responses. It is not
an alternate UI and does not contain the production backend. **Please redesign
its appearance and UX without inventing new financial or administrative rules.**

## Use the files however you like

- **Cloudflare Pages:** deploy the unzipped folder as the static site root, no
  build step. Keep `_redirects` and `_headers`. Use a *separate* project, never
  production. Protect the design host with Cloudflare Access before sharing.
- **Netlify:** deploy the unzipped folder as the publish directory. `_redirects`
  provides URL rewrites and redirects; inspect the preview after publishing.
- **Other static hosting (Vercel, Nginx, Apache, S3, etc.):** upload the full
  unzipped directory, then translate `_redirects` into your host's routing and
  header equivalents. The root-relative paths require hosting at URL `/`,
  not in a subdirectory like `/preview/`.
- **Run locally:** with Python 3.9+ installed, run `python3 preview-local.py 8080`
  *inside the extracted folder*, then open
  `http://127.0.0.1:8080/design-preview/`.

The mock scripts work on localhost and non-AquaVaults domains. They explicitly
refuse AquaVaults production domain(s). Browser API reads are synthetic and
financial/wallet/Admin writes are blocked by the mock. No live onchain access,
real payouts, or account credentials are provided. Do not add production keys,
API bindings or wallets. Protect a publicly hosted design environment.

## Navigation

- `/design-preview/` — index and scenario/persona controls
- `/design-preview/coverage.html` — HTTP HTML-route checker (not browser JS test)
- `/` — public homepage
- `/communities` — community cards and volume leaderboard
- `/swap`, `/autoswap`, `/limit-order`, `/evm-swap`, `/lp/` — trading and liquidity
- `/portal/dashboard/` — Command Center / Holder Intelligence / Wheel
- `/admin/` — Admin Control Center
- `/rewards/`, `/campaigns`, `/coop-rig` — additional product screens

## Design requirements

- Compare against the current visual appearance of AquaVaults; this is a source
  copy and a *visual reference*, not an invitation to rebuild functionality.
- Fictional figures, dates, wallet IDs, fees, and payout statuses are examples.
- Design around the real frontend surfaces, navigation, inputs and states.
- Keep responsive layout considerations (desktop/mobile/tablet) in scope.
- Existing backend integrations are restored separately after designs are approved.

## Limitations

- Mock scenario controls are stored in browser localStorage; use a private
  profile to start clean. Do not use a real signing wallet with this preview.
- CSV exports, token scan execution, wallet operations, finances and many admin
  buttons are intentionally nonfunctional; display fidelity is the goal.
- A 200 HTTP status does not verify that a page's JavaScript rendered. Inspect
  relevant screens with a browser, particularly Admin and Command Center.
- Static hosts must support `_redirects` equivalents for clean public URLs and
  `/sol/<community-id>` share URLs. The included local Python server does.
- Some links on copied pages may intentionally target external community
  websites, docs or social profiles. Do not treat them as synthetic endpoints.

## Provenance

AquaVaults Stage 5 synthetic design deployment, packaged without modifying
source/staging/GitHub. The ZIP includes `design-preview/portable-release.json`
with content hashes and safety flags.
