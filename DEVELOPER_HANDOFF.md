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
