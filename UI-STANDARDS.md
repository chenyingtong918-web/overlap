# Overlap UI standard

Implemented in `src/prototype.css`. Shared variables apply to the application and its sheets.

| Foundation | Standard |
|---|---|
| Spacing | 2px grid; prefer 4, 8, 12, 16, 20, 24, 32. Screen gutter 24px; card padding 16 or 20px; section gap 24px. |
| Typography | Poppins 400/500/600. Compact badge 10px; metadata 12px; body, form input and main controls 14px; card heading 16–18px; section heading 20px; page heading 28–32px; home headline 40px. |
| Corners | 8–12px small controls; 16–20px fields; 24px cards and bubbles; 32px composer and sheet; 1000px capsules. Circles use 50%. |
| Colors | Primary text #183441; secondary #526f7f; outgoing bubble #079edb. White/ice-blue surfaces over a soft blue background. |
| Glass | Cards: 72% white, 20px blur with 140% saturation. Composer: 86% white. Sheets: 92% white with 28px blur. |
| Edges | 1px white highlight; low-opacity cool shadow. Borders are optical hairlines, not spacing values. |
| Content | Keep text fully opaque. Outgoing messages and selected controls retain strong filled colors. |
| Interaction | Preserve safe-area placement, horizontal Carousel gestures, sticky Explore controls and fixed composer. |

Size tokens use `--space-*`, `--type-*`, and `--radius-*`. Use an existing token before introducing a new size. Padding, margins, gaps, font sizes and corner radii use even values. Runtime-owned device geometry, hairline borders, percentages, letter spacing, and animation transforms are not spacing-grid values.

Frosted surfaces fall back to opaque pale blue where backdrop blur is unavailable or reduced transparency is requested. Avoid stacking blur on every nested chip.
