---
phase: quick
plan: 01
subsystem: landing-page
---

# Quick Task 01: ka-trabaho Landing Page Desktop Copy Summary

**One-liner:** Replaced the landing page with the refined ka-trabaho desktop mockup (hero, trust strip, steps, features, stats, CTA, footer), added matching design tokens, and aligned the shared tab chrome with the deep-blue/gold palette.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Port katrabaho desktop HTML to LandingPage.tsx | `fff332d` | `src/components/LandingPage.tsx` |
| 2 | Add ka-trabaho design tokens and animations to index.css | `f36bf63` | `src/index.css` |
| 3 | Align PageHeader and tab page chrome with the new landing page style | `edab499` | `src/components/PageHeader.tsx`, `src/App.tsx` |

## Verification Results

Both verification commands pass after all three commits:

```
> npm run build
vite v6.4.3 building for production...
✓ 1679 modules transformed.
dist/index.html                 0.87 kB │ gzip: 0.50 kB
dist/assets/index-orlRqQGf.css 76.09 kB │ gzip: 12.60 kB
dist/assets/index-CyEMNHJ1.js 317.72 kB │ gzip: 93.47 kB
✓ built in 2.37s

> npx tsc --noEmit
(no errors)
```

## What Changed

- **`src/components/LandingPage.tsx`**: Full React + TypeScript drop-in replacement preserving the `{ lang, setCurrentTab }` props contract. Includes:
  - Hero section with eyebrow badge, headline with gold underline and blue accent, dual CTAs routed to `match` and `explorer`
  - AI question card with animated blink cursor, interest chips, and top-match preview
  - Trust strip with TESDA program, allowance, course count, and local-demand badges
  - Four-step how-it-works grid
  - Feature grid (AI assessment, job recommendation, AI counselor, scholarship guide, course explorer)
  - Deep-blue stats section with 300+ courses, ₱160 allowance, 95% placement, 15–30 days training
  - CTA banner and ka-trabaho footer
  - All Tabler icons replaced with Lucide equivalents (`Sparkles`, `Cpu`, `ShieldCheck`, `Coins`, `GraduationCap`, `MapPin`, `UserCircle`, `Brain`, `Calendar`, `Award`, `Briefcase`, `MessageSquare`, `Search`, `Zap`)
  - Bilingual Taglish/English text driven by the `lang` prop
  - Mobile-first responsive layout; no duplicate navbar

- **`src/index.css`**: Added ka-trabaho CSS custom properties under `:root` (`--kt-blue`, `--kt-blue-mid`, `--kt-blue-light`, `--kt-blue-soft`, `--kt-gold`, `--kt-gold-dark`, `--kt-near-black`, `--kt-slate`, `--kt-border`, `--kt-bg`, `--kt-white`) and a `@keyframes blink` + `.animate-blink` utility. Existing fonts and Tailwind theme are preserved.

- **`src/components/PageHeader.tsx`**: Updated to use the new visual direction:
  - White card with subtle border and soft blue-tinted shadow
  - Deep-blue (#0F3D91) icon/action backgrounds for `blue`, `indigo`, `purple`, `slate`
  - Gold (#FCD116) icon/action backgrounds for `amber`
  - Green (#16a34a) for `emerald`
  - Props interface unchanged

- **`src/App.tsx`**: Updated `PAGE_HEADER_CONTENT` accent values to use `blue` (match/FAQ), `amber` (explorer/jobs), and `emerald` (chat), giving each tab header a cohesive blue/gold/green highlight from the new palette. Tab navigation and body content remain unchanged.

## Deviations from Plan

None — the plan executed exactly as written.

## Known Stubs

None. The static content in the hero question card and match preview mirrors the source HTML mockup and is intentional marketing copy.

## Threat Flags

None. Changes are confined to trusted client UI rendering with static content; no new trust boundaries, auth paths, or external data inputs were introduced.

## Self-Check

- [x] Created `src/components/LandingPage.tsx` with the new design
- [x] Created `src/index.css` tokens and blink animation
- [x] Updated `src/components/PageHeader.tsx` and `src/App.tsx`
- [x] `npm run build` passes
- [x] `npx tsc --noEmit` passes
- [x] No `ti-*` classes remain in changed TSX files
- [x] All three tasks committed atomically
- [x] Landing page props interface preserved
- [x] Tab navigation CTAs wired to `match`, `explorer`, and `chat`

## Self-Check: PASSED
