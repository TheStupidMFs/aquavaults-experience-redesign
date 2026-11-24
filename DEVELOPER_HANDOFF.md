# AquaVaults Experience Redesign: Developer Handoff

## Scope and safety
This GitHub Pages repository is a **design preview**, not a production-ready swap application. The `design-preview/mock-runtime.js` and `mock-extension.js` supply synthetic wallet/API data. Never deploy these mock scripts to production. Do not infer real balances, eligibility, payments or rewards from preview data.

The goal is a plug-in frontend: preserve existing production business logic and connect the presentation to AquaVaults' real services.

## Feature status terminology
- **Frontend-ready**: interactive in the preview without a production backend.
- **Backend-dependent**: UI exists but requires real endpoints, permissions, records or storage.
- **Preview-only**: an explicitly synthetic behavior, never represented as persisted or verified.

## Account: Edit Profile
**Frontend-ready:** clicking Edit Profile, Customize Cover or avatar edit opens a working editor. Supports display name, bio, image selection, client-side type/size validation (PNG/JPEG/WebP, 5 MB), immediate image preview, save/cancel, and responsive layout.

**Preview-only:** without a configured adapter, Save applies the changes to the current page's DOM. It does **not** upload images, write to a database or persist across refreshes. UI explicitly says so.

**Backend-dependent:** permanent profile storage, authenticated owner authorization, uploaded avatar/banner URLs, moderation, identity synchronization, and public profile sharing.

### Integration contract
Define `window.AquaVaultsProfileAdapter` before a user saves:
```js
window.AquaVaultsProfileAdapter = {
  async load({ wallet }) {
    // Return { displayName, bio, avatarUrl, bannerUrl }
  },
  async save({ wallet, displayName, bio, avatarFile, bannerFile }) {
    // Authenticate the current session server-side.
    // Upload/validate image files server-side and persist metadata.
    // Return { displayName, bio, avatarUrl, bannerUrl }.
  }
};
```
The editor calls `save` when present. The `load` method is a proposed interface for the integration engineer to wire into Account initialization. **It is not yet invoked by the preview.** Never trust a wallet string supplied by the browser as proof of ownership; verify the signed session server-side.

Source files:
- `account/profile-editor.js`: editor behavior and adapter boundary
- `account/profile-editor.css`: isolated styling
- `account/index.html`: editor markup and click targets

## Remaining interaction inventory (not yet QA-certified)
| Area | Interaction | Status / required verification |
| --- | --- | --- |
| Global header | All nav items, dropdowns, wallet control | Verify route targets, keyboard, responsive behavior |
| Home | Explore Communities, Start Swap, community tiles | Verify real route targets |
| Communities | Search, filter, row selection, favorite, Support, Visit Project | Preview interaction exists; verify links and favorite backend |
| Swap | Community dropdown, fee, slippage, priority, token selection, swap | Backend-dependent for live transactions; **never** test with real funds in preview |
| Account | Profile editor | Frontend-ready; persistence backend-dependent |
| Account | Share and Activity | Backend-dependent, currently placeholders |
| Account | Identity, favorites, Connector, Rewards/Co-Op data | Backend-dependent; verify existing hooks and session handling |
| Rewards | Play, Leaderboard, Details, objectives, loyalty selection | Verify tabs; actual eligibility/points backend-dependent |
| Co-Op | Participate, Rig Details, Activity | Verify tabs; real participation and weight backend-dependent |
| Secondary tools | AutoSwap, Limit Orders, EVM Swap | Not audited in this pass |

## Acceptance criteria before production handoff
1. Every visible button/link has a tested action, valid destination, or is visibly disabled with explanation.
2. No fake values are displayed as real user activity.
3. Wallet auth and ownership are verified by the backend.
4. Uploaded images are validated, stored, and returned as stable URLs.
5. Responsive tests at 360, 390, 768, 1024, and desktop widths.
6. Keyboard focus, Escape-to-close, form errors, loading and empty states work.
7. Real API failures and disconnected-wallet states have safe feedback.
8. Remove mock runtime and mock wallet scripts from production builds.
9. Confirm token selection, fee routing and transaction signing against the actual backend before release.

## Implementation note
The current prototype includes inherited inline scripts and mock runtime behavior. A production developer should isolate presentation adapters from business logic, and run a full interaction regression suite before deployment. This handoff is an integration guide, **not** a claim of completed QA.

## Account Activity Feed: frontend-ready, data integration pending
The Account **Activity** tab now opens a working feed view. Filters: All, Swaps, Communities, Rewards, Co-Op. Refresh, Back to Overview, loading, empty and failure states are implemented. There are **no invented transactions**. In the absence of an adapter, the feed explicitly identifies the backend connection as pending.

Set `window.AquaVaultsActivityAdapter` before the user opens Activity:
```js
window.AquaVaultsActivityAdapter = {
  async list({wallet,type,limit}) {
    // Read verified events for the authenticated user, newest first.
    return {items: [
      // {id, type:'swap'|'community'|'rewards'|'coop',
      //  title, description, occurredAt, status, txUrl, community, amount}
    ]};
  }
};
```
The frontend escapes record text through DOM textContent and only allows HTTPS transaction links. All records, ownership, timestamps, transaction verification and pagination must come from the backend. The `wallet` input is a UI hint, not authentication. Server must check the signed session and authorization. `type='all'` requests the combined feed; other types request their category. The frontend filters the response again as a guard.

Files: `account/activity-feed.js`, `account/activity-feed.css`, and the Activity markup in `account/index.html`.

**Acceptance tests:** Open Activity, switch every filter, refresh, return via Overview/Back, simulate loading/error/empty states, verify no fake records, confirm authenticated API returns only the current user's records, test narrow screens and keyboard navigation. Not yet browser-QA-certified.

## My Communities: interactive personal collection
The Account profile now includes **My Communities**, with collection cards, count, Refresh, Remove, Explore and Support in Swap navigation. The preview reads the **same** `av-preview-community-favorites` localStorage key as the Communities discovery page. Favorites are **browser-local only** without an adapter, not authenticated, not wallet-synced, and are explicitly labeled as such. The UI displays up to 10 saved communities, matching the intended account limit. Clicking Support navigates to the swap tool but does **not** silently preselect a community; the user must choose the beneficiary there.

Backend integration contract:
```js
window.AquaVaultsFavoritesAdapter = {
  async list({wallet}) {
    // Return {items:[{id,name}, ...]} for the authenticated account, max 10.
  },
  async remove({wallet,id}) {
    // Server verifies session and ownership; return success or throw.
  }
};
```
A production integration should also implement **add** from Communities, enforce the 10-item limit server-side, and return canonical community IDs. Browser wallet strings are not proof of ownership. Avoid treating localStorage as the source of truth for production. The account page uses the shared `swapper/community-registry.js` for preview display metadata.

Files: `account/my-communities.js`, `account/my-communities.css`, `account/index.html`.

**Not yet verified in a browser:** cross-page favorites synchronization, responsive cards, image URLs, all routes, wallet changes and adapter failure handling.

## Community → Swap contextual journey (frontend V1)
Links from Communities and Account My Communities now point directly to `swapper/swap/swap-card.html?community=<canonical-id>`. Swap already validates the query ID against `window.CommunityRegistry.has(id)` before storing the selection and invoking the existing `window.selectCommunity(id)` hook. The added contextual panel identifies an incoming valid selection and prompts the user to review the fee and token pair. This is **not** a quote, fee split calculation, transaction guarantee or wallet confirmation.

The community ID must be resolved against the production registry and fee routing must still be independently validated by the transaction backend. Do not trust query parameters or localStorage to authorize fee recipients. Existing swap execution and signing code was intentionally not changed.

**QA to perform:** navigate from community detail and Account favorites, verify the correct ID and displayed beneficiary, change the selection, verify invalid IDs don't create a trusted beneficiary, inspect the actual fee and wallet signing prompts, test refresh/back/mobile and disconnected wallet. Verify no stale selection from a previous visit is silently treated as a new community choice.
