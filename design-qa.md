# Coffee chat empty state and meeting — visual QA

Date: 2026-10-15

Result: passed

## Reference

Figma file `Xm7eRTP53bgi4eeKJ1DLCG`, complete Coffee journey `4:955` on page `3:939`. High-fidelity design context and reference screenshots were obtained for C01 `4:1405`, D02 `4:1699`, D03 `4:1728`, D04 `4:1758` through the available Figma connection. This supersedes the earlier unavailable-file limitation.

## Visual checks

The 390×844 references were compared side by side with the app's existing 393×852 iPhone viewport. Final comparisons are saved locally at:

- `/private/tmp/overlap-coffee-qa/empty-final-compare.png`
- `/private/tmp/overlap-coffee-qa/preflight-final-compare.png`
- `/private/tmp/overlap-coffee-qa/room-final-compare.png`
- `/private/tmp/overlap-coffee-qa/notes-final-compare.png`

Verified the 112×116 notebook frame and 28px exported pencil; original text and spacing; preflight title, 24px-radius photo, 52px mic/camera controls, preparation switch and full-width 48px Join action; connected header and hangup; video with 72×92 self preview; Start/Topics/Close rail and inline topic card; fixed bottom controls. Corrected inherited body color, an extra horizontal action inset and the old duplicate call header. The reference blue gradients are scoped to preparation and call screens.

Device chrome/time remain runtime-owned. The extra eight device pixels are absorbed by flexible video height and bottom-safe positioning. Both iPhone and Pixel were checked for action/card clearance. No blocking in-scope visual differences remain.

## Assets

Figma SVGs are stored in `public/coffee` at their natural root dimensions: pencil 28×28; mic/video/phone/notebook 20×20; bulb 19×19; switch 32×20. The notebook frame/rules are ordinary Figma layout rectangles, implemented as native layout. Figma photo downloads were hash-checked against `public/figma/video-self.png` and `video-person.png` and were byte-identical, so existing photos are reused without duplicate binaries. Asset slots and rendered geometry were inspected; no temporary remote asset URLs are used at runtime.

## Interaction and regression

- Preflight can open preparation and return to the preview; saved notes toggle on/off before joining.
- A connected call has no duplicate detail header. Mic/camera controls retain their preflight choices. Camera-off hides only the self preview, leaving the other participant visible.
- Notes toggle the inline card, retain the current topic across hide/show, advance through saved topic metadata and allow expanding full private notes. Empty preparation never invents saved notes.
- End call returns the same plan to Reflect and its feedback action.
- Targeted tests: 6 passed.
- Full Playwright suite: 45 passed.
- Build and protected runtime integrity: passed; all 28 protected files unchanged.
- Sites packaging tests: 4 passed.
- Browser console: no errors or warnings.

## October 15 expanded note follow-up — D05

Reference: file `Xm7eRTP53bgi4eeKJ1DLCG`, node `4:3672`. Read complete design context and its screenshot. Compared the 390×844 reference against the existing 393×852 app viewport in the browser. Proof: `/private/tmp/overlap-coffee-qa/expanded-final.png`.

The expanded view now stays inside the call, uses a centered 156×156 remote video with no self overlay/name badge, and shows only the current topic in a white 24px-radius card. Verified photo y=174, card y=344, 16px padding, 12px vertical gaps, 16/24 title, 14/22 talking points/Ask/Share, and 36px Next. Fixed progress and call controls remain visible. Runtime device chrome and the extra 8px viewport height remain unchanged. Long notes scroll within the available body above controls.

Verified expand/collapse, Next while expanded, topic identity after deselection, note hide/show, and Close/end-call transitions. iPhone and Pixel regression coverage checks centered square video, card/control clearance, current-topic-only content and absence of a modal. Browser console is clean.

Build/runtime integrity passed (28 protected files unchanged). Full Playwright suite: 45 passed. Sites tests: 4 passed.

Result: passed
