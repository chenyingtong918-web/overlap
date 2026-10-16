# Profile, messages and calendar — design QA

Date: 2026-10-16

Result: passed (visual checks; see regression limitation below)

## Source

Figma file `Xm7eRTP53bgi4eeKJ1DLCG`, Section 1 `4:4255`. High-fidelity contexts and screenshots were used for profile/tasks `4:3943`, voucher `4:3731`, messages `4:3852`, friends `4:3780`, recommendations `4:3744`, phone lookup `4:3900`, QR `4:3925`, calendar `4:3998`, menu `4:4257`.

## Restoration

Implemented the shared blue gradient, 40px header actions, 24px content inset, rounded white cards, task/reward grouping, full-page voucher, fixed three-tab people navigation, search field, message timestamps/unread badges, friend groups and recommended people. Phone lookup and QR have dedicated screens. The full Monday-first month calendar handles real dates, month lengths and selected-day clamping, and opens existing plan conversations. Cancelled/declined/expired plans are excluded. Pending plans retain their status rather than appearing confirmed.

Existing profile data, dynamic cartoon avatars, human-message history and plan state remain connected. QR/phone lookup use local demo data; no real messages or friend requests are sent. Dates and native status chrome remain dynamic rather than copying stale dates from the design.

## Visual verification

Checked iPhone and Pixel via the in-app browser. Fixed inherited button colors/font sizes and voucher validity contrast. No in-scope layout obstruction, horizontal overflow or missing image was observed. Runtime-owned device chrome remains unchanged. Final screenshots: `/private/tmp/overlap-hub-qa/profile.png`, `messages.png`, `friends.png`, `recommend.png`, `phone.png`, `qr.png`, `calendar.png`, `menu.png`, `voucher.png`, `messages-pixel.png`, `calendar-pixel.png`.

Twenty original SVG exports in `public/hub` are nonempty and retain root dimensions (20px general icons, 16px menu icons, 14px/12px chevrons, 232px QR, 342.5×2 voucher divider). Assets are used in their corresponding design slots; no temporary Figma URLs are referenced in runtime code.

## Verification and limitation

- `npm run build`: passed, including all 28 protected runtime files.
- `npm run test:sites`: 4 passed.
- New hub tests: 4 passed; message search/read state, phone validation/request state, month rollover and pending plan navigation, QR and fixed tabs on both devices.
- Latest full suite: 48 passed, 1 failed in the pre-existing isolated runtime keyboard/footer drag test. That test passed in the earlier full run, but continued failing in isolated retries. A trial stability wait did not resolve it and was reverted. No protected runtime changes or test weakening were retained. All tests for the requested pages passed.
- `git diff --check`: passed.

## 2026-10-16 — Casual plan, current booklet design

Reference: file `Xm7eRTP53bgi4eeKJ1DLCG`, board `6:2308`. Inspected child design contexts and screenshots for discovery/details, invitation, confirmation, detour deck, shared approvals, group selection/votes, arrival, map, camera/review, photo sharing, and completion.

Implemented:
- Discovery/detail type scale, photo sizing, and safe-area Ask to join; pending requests keep the waiting card without a composer.
- Photo recommendation at 368px; text alternatives at 318px; paired avatars and the correct recommendation rationale; pagination follows the active card height.
- Pale agreement cards, proper circular group choices, 1/2/3-person response states, and unanimous activities only in the confirmed plan.
- Added-plan summary versus expanded meeting facts; arrival shows Reflect and keeps Our map available. Private feedback remains reachable via the external Reflection control.
- Just added, map memory summary, and expanded memory sheet as separate states; 176px sheet photo, 442px sheet height, editable captions and multiple stored photos. A photo saved after arrival completes the walk.
- Reused byte-identical Figma walk image (SHA-256 `f5e29ff7c8d9d9169b2cc59041f577f74c02eefef48c6e8eb28405890f870b09`) and existing map/icon exports; retained dynamic cartoon avatars and live device status chrome.

Verification:
- `npm run build`: passed; all 28 protected runtime files unchanged. Existing bundle-size advisory remains.
- `npm run test:sites`: 4 passed.
- Full Playwright run: 50 passed, 1 failed. The existing `mobile-runtime.spec.ts:100` keyboard/footer dismissal test still fails waiting for `data-visible=false`; it is unrelated to the app-level Casual changes and was also documented before this revision.
- Final affected-flow run (Casual fidelity, demo navigation, Figma journeys, plan controls): 21 passed. Includes iPhone and Pixel, correct circular option geometry, 3/2/1 group vote totals, preventing non-unanimous additions, arrival progression, multiple photos, caption persistence, and memory reopening.
- Visual inspection in the in-app browser: confirmed plan, both recommendation forms, approvals, arrival, group options, photo review, new-place map, and expanded memory. Group selection proof saved at `/private/tmp/casual-options-preview.png`; automated screenshots are in test-results.
- Delivery: independent branch `codex/casual-plan-figma`, based on `ad08a95`. This request does not change production/main.

## October 16 — Profile and voucher route correction

Compared Figma 4:3943 and 4:3731 with the local demo. Removed Profile bottom legacy menu and Log out; settings remain in the header. Removed obsolete voucher screen/sheet so claiming and revisiting use the same redemption card. Removed the extra profile minimum-height spacer and matched voucher metadata color. Existing cartoon avatar and relative validity date remain dynamic.

Verified Profile saved-task state and voucher visually in the browser; task edit, claim, return and reopen regression passes. Build and protected-runtime integrity pass; Profile hub + Figma journeys: 14 passed; Sites packaging: 4 passed. Screenshots: /private/tmp/profile-clean-preview.png and /private/tmp/voucher-updated-preview.png.

## October 16 — Menu panel fidelity

Figma 4:4257: corrected nested content padding, 20/28 title, 372px panel, white surface, handle, 24px gutters, 56px rows, 50px action and 38px bottom clearance. Scoped overlay z27/panel z28 covers the app header. Existing exported menu SVGs remain natural-sized: 16px row icons, 14px chevrons, 20px close. iPhone and Pixel geometry, no-scroll, asset geometry, dismissal and My plans navigation tests pass (6 Profile hub tests). Build and 28-file protected runtime check pass. Browser proof: /private/tmp/menu-figma-preview.png.
