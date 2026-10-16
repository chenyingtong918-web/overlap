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
