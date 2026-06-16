# Footer Component Design: Two-Zone Builder Trademark

**Date:** 2026-06-16
**Project:** Ka-TrabaHO (tesda-skills-to-jobs-matcher)
**Status:** Approved

## Summary

Add a full structured footer to Ka-TrabaHO that serves as both a navigation aid and a builder trademark for John Casper Santos. The footer uses a two-zone layout, appears on all pages/tabs, and follows the existing design system (Depth Blue + Sunshine Gold anchors, flat-at-rest, chip patterns).

## Layout

### Two-Zone Structure

```
┌──────────────────────────────────────────────────────────┐
│ LEFT ZONE                      │ RIGHT ZONE              │
│ Brand mark + tagline           │ Navigate │ Legal        │
│ Social pills (GitHub,          │ Assessment│ Privacy      │
│   Portfolio, LinkedIn)         │ Explorer  │ Accessibility│
│                                │ Jobs      │ Data Policy  │
│                                │ Chat      │              │
│                                │ FAQ       │              │
├──────────────────────────────────────────────────────────┤
│ © 2025 Ka-TrabaHO · Supported by TESDA data              │
│                                Built by John Casper Santos│
└──────────────────────────────────────────────────────────┘
```

### Left Zone
- Brand mark: `ka-traba` in Depth Blue weight 800 + `HO` in Sunshine Gold weight 800, using Plus Jakarta Sans
- Tagline: Bilingual (fil/en), switches with `lang` prop. Filipino default: "Ginawa para sa mga kabataang Pilipino — AI-powered na gabay sa TESDA courses at trabaho, libre."
- Social pills: 3 chip-style links using existing `bg-kt-blue-light text-kt-blue border-kt-blue-soft` pattern
  - GitHub: github.com/Kyazs
  - Portfolio: caspersantos.dev
  - LinkedIn: linkedin.com/in/jcasper-santos

### Right Zone
- Two columns with label eyebrows (weight 700, size 12px, uppercase, letter-spacing 0.08em, color kt-slate)
- **Navigate column:** 5 internal links using React Router `<Link>` — Assessment (/match), Explorer (/explorer), Jobs (/jobs), Chat (/chat), FAQ (/faq)
- **Legal column:** 3 placeholder links (href="#") — Privacy, Accessibility, Data Policy

### Bottom Bar
- Separated by `border-t border-kt-border`
- Left: "© 2025 Ka-TrabaHO · Supported by TESDA data" in kt-slate, 12px
- Right: "Built by John Casper Santos" in kt-blue, weight 700, 12px

## Responsive Behavior

- **Desktop (md+):** Two zones side-by-side with `justify-between`; right-zone columns side-by-side
- **Mobile (<md):** Zones stack vertically; right-zone columns remain side-by-side or stack if needed; bottom bar stacks center-aligned

## Component Architecture

- New file: `src/components/Footer.tsx`
- Props: `lang: "fil" | "en"`
- Exported as default function component
- Rendered in `App.tsx` below `<main>`, inside the root `<div>`, after `<BottomNav />` (or before it on desktop where BottomNav is hidden)
- Footer replaces the existing inline footer in `LandingPage.tsx` (remove lines 456-464)

## Bilingual Copy

| Key | Filipino | English |
|-----|----------|---------|
| tagline | Ginawa para sa mga kabataang Pilipino — AI-powered na gabay sa TESDA courses at trabaho, libre. | Made for Filipino youth — AI-powered guide to TESDA courses and jobs, free. |
| copyright | © 2025 Ka-TrabaHO · Sinusuportahan ng TESDA data | © 2025 Ka-TrabaHO · Supported by TESDA data |
| navLabel | Mag-navigate | Navigate |
| legalLabel | Legal | Legal |
| privacy | Privacy | Privacy |
| accessibility | Accessibility | Accessibility |
| dataPolicy | Data Policy | Data Policy |
| builtBy | Ginawa ni John Casper Santos | Built by John Casper Santos |

## Design System Compliance

- Two-Anchor Rule: Depth Blue (brand, links, builder credit) + Sunshine Gold (HO in logo) — no additional saturated colors
- Neutral-90 Rule: Footer surface is kt-bg (#F8F9FC) with white/kt-slate text — 90%+ neutral
- Rest-Flat Rule: No shadows at rest — border-top only
- Weight-Gap Rule: Brand mark at 800, body text at 400-500, labels at 700 — 200+ gap maintained
- Touch targets: All links have min-h-[44px] with inline-flex items-center

## Implementation Tasks

1. Create `src/components/Footer.tsx` with two-zone layout, bilingual copy object, social pills, nav links, bottom bar
2. Add Footer to `App.tsx` — render below `<main>` on all tabs
3. Remove inline footer from `LandingPage.tsx` (lines 456-464)
4. Verify mobile stacking behavior
5. Verify bilingual switching with lang toggle
6. Ensure BottomNav z-index doesn't overlap footer on mobile
