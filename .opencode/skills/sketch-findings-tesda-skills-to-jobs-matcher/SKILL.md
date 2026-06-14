---
name: sketch-findings-tesda-skills-to-jobs-matcher
description: Validated design decisions, CSS patterns, and visual direction from sketch experiments. Auto-loaded during UI implementation on tesda-skills-to-jobs-matcher.
---

<context>
## Project: tesda-skills-to-jobs-matcher

Mobile-first redesign focusing on two key UX improvements: (1) Replace the immediate feature dump with an engaging infographic landing page that builds trust and context before asking users to fill forms, and (2) Create a clear sequential flow for the AI assessment (input → processing → results) rather than showing everything at once. The design should feel approachable, trustworthy, and motivating for Filipino youth seeking vocational opportunities.

Current app: React + Tailwind, blue/indigo branding, bilingual Taglish/English
Target audience: Out-of-school youth (15-24) in the Philippines
Existing mobile menu already implemented in Navbar.tsx
Current layout uses `max-w-7xl` container with responsive grid columns

Sketch sessions wrapped: 2026-06-14
</context>

<design_direction>
## Overall Direction

**Palette:** Blue (#2563eb) primary with indigo accents, emerald green (#10b981) for success states, amber (#f59e0b) for accent/warnings. Light backgrounds (#f8fafc) with white cards.

**Typography:** Plus Jakarta Sans for display/headlines (bold, modern), Inter for body text (clean, readable), JetBrains Mono for code/course codes.

**Spacing System:** 4px base unit (4, 8, 12, 16, 20, 24, 32, 40, 48, 64). Generous vertical padding on mobile (24-32px between sections).

**Border Radius:** 12px for cards, 16px for large cards, 24px for hero/CTAs, 9999px for pills/badges.

**Shadows:** Subtle shadows (sm: 0 1px 2px, md: 0 4px 6px, lg: 0 10px 15px) for depth without heaviness.

**Layout Approach:** Mobile-first, single-column stacking. Max-width container for content. Cards are full-width on mobile with internal padding.

**Interaction Patterns:**
- All interactive elements have :hover and :active states
- Transitions are 0.15-0.2s ease for UI elements, 0.4s ease-in-out for page/state transitions
- Loading states use animated spinners + progress steps (not just spinners)
- Form validation uses focus rings (3px primary-light) rather than error borders
- Tags use toggle states with smooth color transitions

**Voice & Tone:** Encouraging, non-judgmental, action-oriented. Taglish/English bilingual support. Avoids jargon (e.g., "Junior high grad? No worries" instead of "Minimum education requirement: Junior High School").
</design_direction>

<findings_index>
## Design Areas

| Area | Reference | Key Decision |
|------|-----------|--------------|
| Landing & Onboarding | references/landing-onboarding.md | Hero + step-by-step journey infographic with stats, CTAs at top and bottom |
| Assessment Flow & States | references/assessment-flow-states.md | Form → Loading (with progress steps) → Results, full replacement, no simultaneous states |

## Theme

The winning theme file is at `sources/themes/default.css`.

## Source Files

Original sketch HTML files are preserved in `sources/` for complete reference.
- `sources/001-landing-infographic/` — Landing page with 3 variants (A: card stats, B: step journey [winner], C: dashboard)
- `sources/002-assessment-flow/` — Assessment flow with 3 variants (A: full replacement [winner], B: scroll reveal, C: accordion)
</findings_index>

<metadata>
## Processed Sketches

- 001-landing-infographic (Winner: Variant B)
- 002-assessment-flow (Winner: Variant A)
</metadata>
