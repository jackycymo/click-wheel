# Homepage design QA

final result: passed

## Visual target and evidence

- Selected direction: second displayed concept, `/Users/jackymo/.codex/generated_images/01a10646-8f50-7500-8c48-f491bea40df5/exec-d69fb85e-1b48-4f82-9c8d-9572d3471f02.png`.
- Copy-preserving revision: `/Users/jackymo/.codex/generated_images/01a10646-8f50-7500-8c48-f491bea40df5/exec-67c03ea5-050d-499b-93c4-ce5d3a0ced43.png`.
- Final comparison: `output/design-review/home-comparison.png`. Source and browser capture were opened together in one comparison input at their native 1422 × 1106 dimensions. Browser CSS viewport 1422 × 1106, capture density 1 pixel per CSS pixel; no density normalization required.
- State: homepage, light appearance, Retro selected, Scarlet accent, paused at 0:42 / 2:58.
- Other evidence: `output/design-review/home-desktop-final.png` (1440 × 1120), `home-mobile.png` (390 × 844), `home-tablet.png` (768 × 1024), `home-dark.png`, and `basic-desktop.png`.
- Also inspected 320 × 740 and the Basic appearance at 390 × 844. Document width equaled viewport width at 320, 390 and 768 pixels.
- Full-resolution comparison made typography, screen labels, switches and wheel details readable; a separate focused crop was unnecessary.

## Findings and comparison history

First comparison used `output/design-review/home-desktop.png` with the revised target. It found:

1. P2: Screen labels too dim and small. Increased the hero's secondary screen contrast, font weight and label size. Final desktop and mobile captures show readable track and duration labels.
2. P2: Display title too narrow and crowded. Increased desktop size and relaxed tracking. Final comparison shows the intended headline scale and hierarchy.
3. P2: Mobile player too large for the initial composition. Reduced its width and padding, and tightened mobile spacing. Final 390px capture shows the complete circular control; smaller/shorter screens remain normally scrollable.

Post-fix comparison found no remaining actionable P0/P1/P2 issues.

## Required fidelity surfaces

- Typography: reused the existing Archivo grotesk, Geist Mono annotations and Doto display. Display scale, short description, monospaced captions and restrained links match the chosen hierarchy. Real type differs slightly from image-generated lettering; acceptable.
- Spacing: broad margins, split title/intro, upright centered player and ruled installation row follow the target. Caption positions follow the live player's midpoint. Mobile becomes a single column with controls above the player and instructions below.
- Colors: warm off-white, charcoal and a restrained orange accent. The text-link orange is deeper than the mockup for readability. Dark mode uses the same warm neutral relationships.
- Asset fidelity: the hero is the existing working React player and wheel, as required by the task, not a replacement photograph. Existing logo/icons are reused. No new decorative raster assets are needed. The live component now has a soft directional cast shadow matching the requested grounding effect; no raster replacement is used.
- Copy: current site title, description, actions, instructions, theme names and documentation retained. No proposed slogans or invented feature copy added. Removed the old handwritten 'Switch it up' decoration.

## Interaction verification

- Retro / Basic switch works on desktop and phone layouts.
- Arrow-key seeking and Home reset work; center button starts and pauses playback.
- Pointer drag changes the value and coasts with the existing inertia behavior.
- Accent selectors update the active color and pressed state.
- All four gallery tabs switch to their matching preview and source.
- Original pass checked both appearances; the follow-up below supersedes this with a bright-only site.
- Start building opens documentation; Examples opens the existing examples route; Explore the themes navigates to the gallery.
- Documentation and example content remain available after client navigation. Styles are scoped to the homepage.
- Browser error log was empty after these checks.
- Lint, production build (including TypeScript/static routes), and git diff whitespace check passed.

## Intentional constraints and follow-up polish

The user requested existing copy and preserved interactions. Actual accent selectors therefore take precedence over the revision image's invented transport buttons. The live wheel retains its existing geometry and dynamic progress markings. Video production remains separate; the centered hero stage provides the intended landing composition. Physical-device haptics were not tested through desktop browser emulation.

## Implementation checklist

- [x] Apply selected visual direction with current copy.
- [x] Preserve live wheel and existing documentation.
- [x] Check desktop, phone, tablet, alternate demo and dark states.
- [x] Fix and recompare P2 findings.
- [x] Run lint and production build.
- [x] Leave the local preview available.


## Follow-up: bright-only appearance, cast shadow, DM Sans

User corrections supersede the original mock's theme controls and heading font. The site now always uses light color-scheme and a fixed light theme-color. Removed the theme switch, stored/system preference initialization, and site-owned dark palettes. Reusable wheel skin source remains intact.

DM Sans is self-hosted through Next.js and applied only to h1–h6. Browser computed styles confirm Archivo remains the homepage body font and Geist remains the docs body font. The heading font is DM Sans on both routes.

The player now has a soft directional cast shadow to the right plus a short contact shadow. Earlier shadow rendering exposed a transparent stripe; filled and blurred that shadow surface, then recaptured and verified the correction. A 320px heading wrap was fixed with a smaller responsive display size. No remaining P0/P1/P2 findings.

Final evidence: `output/design-review/home-dm-sans.png` at 1422 × 1106, opened with the selected original concept in one comparison input; `home-dm-sans-mobile.png` at 390 × 844; `home-dm-sans-narrow.png` at 320 × 740. Title change, absence of theme controls, and current copy are intentional user-directed deviations. Shadow is visibly grounded and does not cause horizontal overflow. Existing typography hierarchy, body copy, palette, live-component fidelity and spacing remain consistent; full resolution images make the relevant details readable without separate crops.

Browser checks confirmed light color-scheme, no dark class, loaded DM Sans, unchanged body fonts, and no console errors. Lint and production build passed after the font/theme changes. Final small-screen CSS adjustment was checked in the browser.

final result: passed

## Follow-up: simplified hero and corrected ground shadow

The user rejected the earlier narrow shadow. This review supersedes the earlier shadow approval. Compared the supplied reference `/var/folders/km/1t77n0fs6pn3mtxvwp265jc00000gn/T/codex-clipboard-e102a705-e148-4bb9-b3c0-4cc23bb13752.png` with `output/design-review/home-grounded.png` together at 1422 × 1106. The shadow now projects from the full base, with a thin contact line and a broad blurred cast fading to the right. The live CSS component retains its existing geometry rather than reproducing the raster object exactly.

Removed the Retro / Basic toggle and the three instruction lines at the user's request. The hero always shows the interactive Retro player. Removed the Explore the themes arrow. Existing body copy, DM Sans headings, light palette, accent controls and playback behavior remain intact.

Final desktop evidence: `output/design-review/home-grounded.png`. Mobile evidence: `output/design-review/home-grounded-mobile.png` at 390 × 844; document width equals viewport width. Browser inspection confirmed the removed controls/text are absent and playback controls remain. Lint and production build passed after the component changes; final CSS blur and cleanup were verified visually. Whitespace validation passed. No remaining actionable P0/P1/P2 findings in this review.

final result: passed

## Follow-up: fixed website accent

Removed the Retro demo's four color buttons and their state/styles. Its accent now inherits the homepage signal color, with the same #bc3c20 fallback on other routes. Browser computed styles confirm the player and website links match; no retro color controls remain. Removed the empty header row so the panel has a clean top edge. Screenshot: `output/design-review/home-fixed-accent.png`. Lint and whitespace validation passed. Browser visual review passed.

## Follow-up: off-white examples

Shared site background now uses the homepage off-white #eeede7, with #f5f4ef cards. Examples and documentation inherit these surfaces consistently. Verified `/examples/default` in the browser: body rgb(238, 237, 231), code card rgb(245, 244, 239). Screenshot: `output/design-review/examples-off-white.png`. Whitespace validation passed; this change only updates CSS colors.

## Follow-up: consistent page width

Unified the homepage, examples/docs content container and shared header around global 1440px maximum width and responsive 24–64px gutters. Removed the examples layout's separate maximum and the header's narrower maximum. Mobile navigation uses the shared gutter too. At a 1600px viewport, both home hero and examples container measure 1440px wide, 80px from the viewport edge, with 64px internal gutters. At 390px, examples use 24px gutters and have no horizontal overflow. Screenshot: `output/design-review/examples-aligned-width.png`. Lint and whitespace checks passed.

## Follow-up: mobile horizontal overflow

Reproduced a 325px document width at a 320px viewport. The hero's skewed shadow pseudo-element extended past the viewport; ordinary content boxes did not. Added horizontal clipping to the hero only, preserving internal scrolling for code panels. After the fix, document width equals viewport width at 320, 375, 390, 414, 430, 480, 768 and 1440px. Screenshot: `output/design-review/home-mobile-overflow-fixed.png`. Visual review and whitespace validation passed.

## Follow-up: mockup lighting and tab underline

The user's close comparison supersedes previous shadow approvals. The key mismatch was the wheel's broad raised inner ring, not only the ground shadow. Replaced its raised face/shadows with a single shallow recessed face, a fine top-left recess edge, a lower-right highlight, slimmer ticks, and a defined raised center button with a directional shadow. Added subtle directional panel shading and stronger top-left edge highlights. The ground shadow now has a darker base contact and a lower, softer projection to the right.

Compared the original selected mockup and current 1422 × 1106 rendering together. Final evidence: `output/design-review/home-lighting-final.png`; mobile: `home-lighting-mobile.png` (keyboard focus visible). Source artwork is photographic; material texture and exact raster lighting remain an approximation in the live component. Existing copy, orange progress markings and controls remain intentional differences. No remaining P0/P1/P2 in this lighting review. Keyboard seeking changed 42 to 43 and back; 320px document width remains 320px. Lint and whitespace validation passed.

Moved the active theme indicator from the bottom of the 44px tab to a text underline with a 6px offset, retaining the original click target. Browser evidence: `theme-underline-detail.png` and `theme-underline-raised.png`.

final result: passed

## Follow-up: shared header and warm documentation palette

Removed homepage-only header styling. All routes now render the same header: Archivo typography, logo size, 72px desktop/68px mobile height, content-aligned bottom rule, and shared spacing. Current Docs/Examples section has an orange underline and aria-current. Sidebar sticky offsets follow the shared header height.

Replaced remaining cool zinc defaults with warm foreground, muted, hover, border and focus tokens. Removed duplicated homepage tokens so the palette stays consistent across routes. Selected sidebar/mobile navigation pages use charcoal with light text and medium weight. Contrast ratios: selected text 14.39:1, muted text on page 5.71:1, current header section 4.70:1.

Browser comparison at 1440px confirmed identical header geometry across `/`, `/docs`, and `/examples/default`: left 64px, inner width 1312px, height 72px, brand 20px, navigation 16px. All three routes have 320px document width at a 320px viewport, with 68px headers. Clicking Docs then Styling updates section/page selection correctly. Browser error log empty. Lint, production build (22 routes), TypeScript, and whitespace validation passed.

Evidence: `output/design-review/docs-shared-header.png`, `examples-shared-header.png`, `examples-shared-header-mobile.png`. Visual review found no remaining P0/P1/P2 issues for this request.

final result: passed

## Follow-up: olive primary color

Changed the site's primary and accent signal to olive #606b35, with pale olive hover surfaces and a lighter #b0ba83 accent on the player's dark screen. Links, selected navigation, focus rings, default controls and the Retro player share the new palette. Contrast: olive links against off-white 4.90:1, light selected text on olive 5.36:1, screen accent on black 9.44:1. Browser-verified home and docs; screenshots `home-olive.png` and `docs-olive.png`. CSS whitespace check passed.


## Follow-up: rotary-control gallery and personal reflection

Implemented the user's editorial reference as a three-column square detail grid between the hero and component themes. Eight original object photographs use explicitly positioned CSS crops focused on the dial or wheel; the ninth tile uses the site's existing terracotta accent. La Marzocco Linea Micra is the espresso-machine reference. Photo provenance is preserved in `website/public/images/objects/sources.json`.

Compared the supplied reference and desktop implementation in the same visual review. The narrow left heading, right Details label, tight square grid, unrounded edges and broad margins follow the reference. The existing warm page background and accent color are intentional site adaptations. Both supplied paragraphs remain verbatim, set in Newsreader serif beneath the images. Mobile retains the three-column grid with smaller gutters, moves the heading above it, and removes the right margin label.

Validation: all eight images loaded; Newsreader confirmed in computed styles; no horizontal overflow at desktop 1280px or mobile 390px. Visually verified all eight crops on both viewports. Lint and production build (including TypeScript and 22 generated routes) passed. No browser errors; the development-only LCP warning occurred when jumping directly to the below-fold gallery, which retains lazy loading for normal homepage visits. No remaining P0/P1/P2 findings for this scoped change.

Evidence: `output/design-review/reflection/reference.png`, `gallery.png`, `desktop.png`, and `mobile.png`.

final result: passed


## Follow-up: Tailwind reflection styling

Converted all reflection layout, typography, color and responsive styles to Tailwind utilities; removed `design-reflection.css`. Only per-photo calculated crop coordinates remain inline. Desktop visual inspection matches the prior gallery. Computed mobile grid remains 3 × 105px with 6px gaps, 22px prose and 31.9px line height; no overflow. Lint and whitespace checks passed. Evidence: `output/design-review/reflection/tailwind.png`.

final result: passed


## Follow-up: simplify reflection copy

Removed the visible A personal reflection and Details labels, centered the gallery and prose, and reduced serif body copy to 20px desktop / 18px mobile. The user's two paragraphs remain unchanged. Browser inspection confirmed removed labels, 20px rendered desktop text and no horizontal overflow. Lint and whitespace checks passed. Evidence: `output/design-review/reflection/simplified.png`.

final result: passed


## Follow-up: hide code scrollbars

Hidden scrollbar tracks on the install command and shared code blocks with Tailwind utilities while retaining overflow-auto. Browser confirmed scrollbar-width:none on both surfaces and successful code-panel scrolling. Lint and whitespace checks passed. Evidence: `output/design-review/scrollbars-hidden.png`.

final result: passed


## Follow-up: selected split layout with Braun HLD 4

Implemented the first displayed ideation image: vertically centered serif copy at left and a 3×3 photo grid at right. Replaced the decorative orange tile with the user-selected real Braun HLD 4 photograph, CSS-cropped around its logo and black circular switch. The source image is unmodified; provenance is recorded in the object sources manifest.

Compared selected mockup `exec-9a3fca43-7564-4676-a89c-aeb6087422d7.png` and rendered `split-hld4.png` together. Intentional differences: retained the user's requested smaller 20px desktop / 18px mobile type, original product photos, actual HLD 4 in the ninth tile, and existing site header. Grid proportions, vertical centering, square crops, warm palette and open margins match the chosen direction. At 390px the paragraphs precede the nine-image grid; no horizontal overflow, three 105px columns. The HLD 4 source limits the detail resolution of its close crop (minor asset limitation). No remaining P0/P1/P2 issues.

Lint, whitespace check, and production build with TypeScript and all 22 routes passed. Evidence: `output/design-review/reflection/split-hld4.png` and `split-hld4-mobile.png`.

final result: passed


## Follow-up: high-resolution rotary-control photographs

Replaced the HLD 4 with the user-selected MXR Phase 90, cropped around its speed dial and orange casing. Replaced the eight other images with larger originals or closer detail photographs. Native crop widths now range from 600–1,400 pixels, compared with 190–555 pixels previously. Source dimensions, crop coordinates, original URLs and rights notes are preserved in `website/public/images/objects/sources.json`. Added the iPod photograph's CC BY 4.0 attribution in the footer. Original files are unmodified; crops use CSS and Next Image at quality 90. No artificial upscaling.

The selected split layout, serif text, and mobile stacking remain unchanged. Both desktop (1200px) and mobile (390px) checks confirmed nine loaded images and no horizontal overflow. Updated asset filenames avoid stale optimized-image cache entries after source replacements. Lint, whitespace checks and the production build (TypeScript and all 22 routes) passed. These assets improve the website collage; not every crop has enough native detail for a full-screen 4K video close-up.

Evidence: `output/design-review/reflection/high-res-desktop.png` and `high-res-mobile.png`.

final result: passed


## Crop review before interactive previews

Reviewed every original and the rendered collage. Reframed the Sculptor to show more of its numbered arc, centered the Stratocaster volume knob without the distracting second knob, and centered the Fellow temperature dial more tightly. Braun, Fender amp, 1176, La Marzocco, iPod and MXR already retain the key control and identifying context. The Sculptor source itself cuts the bottom of the wheel; the tile intentionally remains a detail crop. Browser review and lint passed.

final result: passed

## Follow-up: native playable reference controls

Built all nine hover previews from HTML, Tailwind gradients, borders, shadows, native text and the existing icon SVGs. Each uses ClickWheel.Root/Ring; iPod also uses Center and Rotor. There are no raster images, generated assets or image textures inside the interactive controls. Real photographs remain the resting layer. Generated studies were removed from public assets and retained only under ignored/local output for design history.

Compared the original photo gallery and each rendered native preview together. Preserved each object's colors, primary knob, scale, material cues and surrounding panel. Deliberate adaptations: frontal geometry for angled product shots, CSS approximations of materials/lettering, and a small live value readout. These are web recreations, not pixel-identical photographs. Refined La Marzocco flutes, corrected numbered-scale alignment, and matched signed gearing to each visual rotation. Braun's rim, scale, lettering and white hub remain stationary; only its red indicator rotates.

Browser validation: pointer drags changed all nine values at desktop and 390px mobile width. Arrow keys increment/decrement every control; Home/End clamp all nine to their limits. Scroll gestures changed all nine without scrolling the page. Dragging Braun's central hub left its value unchanged; computed-style comparison across the full Braun subtree found only the red-indicator wrapper rotating. iPod center started its simulated timer, looped at the end, paused, and retained its paused position. Hover exit restores photographs; keyboard focus reveals the active control. All active layers contain zero img elements. A fresh browser load produced no errors or warnings. Mobile grid remains three columns without horizontal overflow. Real touch hardware was not available; pointer interaction was tested at mobile dimensions.

Lint, production build (TypeScript and 22 routes), and whitespace checks passed. Evidence: output/design-review/playable/native-photos.jpg, native-{braun,sculptor,amplifier,guitar,fellow,compressor,espresso,ipod,mxr}.jpg, native-mobile.jpg, and native-final.jpg. No outstanding functional findings in the tested browser. Native material/perspective differences above are intentional.

final result: passed

## Follow-up: Braun and espresso fidelity correction

The previous pass accepted too much visual drift in these two tiles. Reopened the original `braun-sk2-detail.jpg` and `linea-micra-steam-knob.png`, compared the resting crops against the active previews, and corrected the following findings:

- [P1, fixed] Espresso had a flat, petal-shaped front silhouette. Rebuilt it as an oblique barrel with an elliptical silver cap, recessed longitudinal slots, a rounded rear profile, circumferential MICRA lettering and chrome machine context. The slots and cap rotate with the controlled value. Expanded its invisible hit area over the barrel for mobile dragging.
- [P2, fixed] Braun's face was too small, its hub sat too low, the grille was generic dots, and the logo was too heavy/wide. Matched the cropped oversized disc, fixed hub position/size, perforated metal grille, narrower lettering, frequency label positions and grey/olive palette. Preserved the user's requirement: only the red indicator moves.
- [P2, fixed during comparison] Espresso's first revised grooves ran end-to-end and the axis tilted too much. Shortened the grooves into recessed slots, reduced the barrel angle and adjusted the end-cap size against the photo close-up.

User instruction explicitly requires native web recreation; therefore SVG/CSS geometry is intentional and supersedes the image-to-code skill's raster-asset preference. There are no new generated images or raster textures. Native surfaces remain smoother than photographed wear/reflections (P3), and the simulated value badge is an intentional UI addition. Surrounding gallery layout, copy, typography and all other controls are unchanged.

Fidelity review: typography/lettering, crop/alignment, palette, material treatment, and copy checked together against the sources. Evidence in `output/design-review/playable/`: full-view `refinement-photos.jpg`, `refinement-braun.jpg`, `refinement-espresso.jpg`; focused source/native pairs `braun-source-detail.jpg` / `braun-native-detail.jpg` and `espresso-source-detail.jpg` / `espresso-native-detail.jpg`; mobile `refinement-mobile.jpg`. Desktop CSS viewport 1200×900, approximately 196px square tiles, captured at the browser's single-density output and compared at matching crop sizes. Original file sizes are 2000×1333 and 4000×2667; source crops remain the existing 1333px and 1150px squares. Focused captured pairs are 195px squares. Different indicator angles in final captures reflect the drag tests.

Validation: desktop pointer drags changed Braun 88→96.6 and espresso 0→34; both Home/End and arrow keys passed. Mobile 390×844 pointer drags changed Braun 96.6→88.1 and espresso 0→33, including a drag starting on the barrel. No horizontal overflow. Braun's static SVG remained byte-identical across a value change. Fresh page load had zero console errors/warnings. Lint, TypeScript, production build (22 routes) and whitespace checks passed. Real touch hardware remains untested.

final result: passed

## Follow-up: remove preview value badges

Removed the shared top-right output badge from all nine reference previews. Browser inspection confirmed zero remaining badge elements and all nine sliders still expose their formatted values through aria-valuetext. Lint and whitespace checks passed. Evidence: `output/design-review/playable/no-value-labels.jpg`.

final result: passed

## Follow-up: 1176 scale alignment

Corrected the scale's offset relative to the knob by placing the labels, ticks and rotor inside one shared square. Moved ticks outside the knob and gave them the same angular range as the labels. Centered the pointer stripe and calibrated its rotation to the printed scale's unequal 36–48 interval. Browser measurements at 0, 6, 12, 18, 24, 30, 36 and 48 confirmed zero center offset and less than 0.02° between each label and pointer. Visually checked 39 between 36 and 48. Value badges remain removed. Lint, production build and whitespace checks passed. Evidence: `output/design-review/playable/compressor-aligned.jpg`.

final result: passed

## Follow-up: frontal espresso and unbranded radio preview

Changed the espresso recreation to a straight-on circular view, retaining its dark fluted rim, silver MICRA cap and chrome trim. Removed the drawn Braun wordmark from the interactive radio face. Resting reference photographs remain original. Browser visual inspection confirmed both changes, a circular espresso hit area, and a drag changing steam value 33→66. Lint, production build and whitespace checks passed. Evidence: `output/design-review/playable/braun-simplified.jpg` and `espresso-simplified.jpg`.

final result: passed
