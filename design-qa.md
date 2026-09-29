# Follow-up: illustrations removed

User requested removal of the 3D illustrations. Removed image regions from both Home shortcuts, the lunch review card, and Coffee square. Home cards now use compact time metadata and text; cream palette, rounded shapes and existing actions remain. Removed unused illustration layout styles. Browser screenshot confirmed the Home cards have no empty image placeholders and the feed moves up naturally. Build and protected-runtime checks passed. The report below documents the previous illustrated version and is historical.

final result: passed

---

# Overlap visual QA — September 17, 2026

final result: passed

## Scope and visual truth
User requested the supplied image's visual style applied to the existing conversational Overlap prototype. This is a style adaptation to a different product, not a pixel clone of an education app.

Source: `design-reference/style-reference.png` (2048 × 1536). Courses panel crop: x1086–1653, y129–1348, proportionally normalized to393px width. The cream palette, round geometric type, black pills, circular navigation, rounded imagery cards and 3D characters are the visual target. Overlap's paired lunch/coffee cards and conversation entry remain intentional product differences.

Implementation: http://127.0.0.1:4173/

Evidence:
- `qa-warm-home.png`: final Home,393 ×852.
- `qa-warm-coffee.png`: final Coffee square,393 ×852.
- `qa-warm-lunch.png`: final conversational lunch review,393 ×852.
- `qa-warm-pixel.png`: Pixel10 at normal preview scale.
- `qa-warm-calendar-full.png`: pending/confirmed calendar states.
- `qa-warm-comparison.png`: source and final Home/Coffee shown together.
- `qa-warm-focus.png`: focused source/implementation comparison of imagery, type, cards and controls.

Measured iPhone screen393 ×852 CSSpx, scale1. Final Home browser screenshot1400 ×1100, screen at503.5,124. Coffee screenshot1400 ×2348, screen at503.5,748. Crops use observed DOM bounds; density1. Template chrome retained, although source lacks status bar/notch. The first Home recapture had a transient screenshot viewport mismatch and was discarded and recaptured before comparison.

## Findings and comparison history
1. P2 Coffee hero crop cut the character's head. Evidence `qa-warm-coffee-full.png` before correction. Increased hero height177→226px. Final `qa-warm-coffee.png` shows full head, body and seated pose. Lunch review crop adjusted to preserve both faces.
2. P2 Home card descriptions and links were too small in normalized comparison. Increased descriptions9→10px, links9→10px and titles17→18px. Final focused comparison shows untruncated text in both cards; whole card remains a large click target.
3. P2 Preview resize could expose the hidden keyboard and move the outer device canvas. Added an app-owned scroll/resize guard; internal MobileScroll remains responsible for content. Checked Pixel/iPhone switching, input submission and viewport reset. Final outer scrollTop0 and no horizontal content overflow. All28 protected runtime files unchanged.
4. Final full and focused visual comparison: no remaining actionable P0/P1/P2 differences within the requested style adaptation.

## Required fidelity surfaces
- Typography: local Poppins400/500/600 matches rounded geometric reference direction. Main headings32px, paired card headings18px, black prominent display type; copy remains English. Compact metadata is subordinate to actions.
- Layout:22px horizontal inset; paired cards preserve requested structure,27–30px radii, pill inputs/CTAs,49px circular nav. Scrollable feed and forms continue below the first viewport, clear of fixed navigation/composer. The reference uses a single large card; Overlap intentionally retains two.
- Color: warm white with cream and butter-yellow surfaces, near-black CTAs, restrained warm-gray outlines. Previous purple palette removed. No orange/green UI theme.
- Images: two built-in image_gen renders saved in public/art,1254px originals, no fabricated CSS/SVG illustration. Both load; centered home crops retain the subjects. Lunch review intentionally crops below the table to prioritize faces; coffee uses full seated scene.
- Content: workplace connection product, not education copy. AI and simulated participants remain disclosed. AI suggestions lead to editable cards and explicit confirmation. Human conversations stay separate.

## Interaction verification
- Home typed “Lunch at noon with four people” → assistant review “A table for4”, correct12:00 and campus; keyboard dismissed, outer canvas stable.
- Lunch shortcut → draw → reveal Eli → explicit Join → pending result.
- Coffee square → topic → Zoe → choose16:00 → Send invitation → event conversation → simulated acceptance → Calendar shows confirmed16:00 plan.
- Create sheet → activity → edit own words → Publish interest check → published text preserved; no implicit joining.
- Calendar day filter and navigation work.
- Pixel10 and iPhone home render without horizontal overflow; circular navigation remains visible.
- Browser console: one earlier Vite font-import reload error at08:10 during package installation, resolved after install/reload. No later runtime errors in final log review; all image requests complete successfully.
- `npm run build` passed; included `npm run check:runtime` passed28 protected files.

## Follow-up polish
No blocking visual findings. Prototype uses local state and simulated AI/participants; reload resets demonstration data. Original reference includes different character designs and one feature card; those are intentionally adapted to Overlap.

## Implementation checklist
- [x] Reference examined and supplied to image generation
- [x] Project-owned assets stored and integrated
- [x] English UI and all three existing flows preserved
- [x] Full and focused comparisons opened and reviewed
- [x] Crop, type-size and preview-scroll issues fixed and recaptured
- [x] Main interactions and final build verified
