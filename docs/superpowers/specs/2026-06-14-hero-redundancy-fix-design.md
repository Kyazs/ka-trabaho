# Hero Redundancy Fix: Tab-Specific Contextual Headers

**Date:** 2026-06-14
**Project:** tesda-skills-to-jobs-matcher
**Topic:** Remove redundant shared banner and replace it with per-tab contextual headers
**Target Audience:** Filipino out-of-school youth, ages 15-24

---

## 1. Goals

- Eliminate the repeated "Match Your Talents to High-Demand Free TESDA Courses!" banner that currently appears on every non-landing tab.
- Give each tab a clear, concise identity so users always know where they are and what they can do.
- Preserve visual consistency with the existing mobile-first redesign (white cards, left accent bars, rounded-2xl, `font-display`).
- Free vertical screen space on mobile without removing orientation text.

---

## 2. Problem Statement

The current `App.tsx` renders a large gradient hero banner immediately after the landing page check:

```tsx
{currentTab === "landing" ? (
  <LandingPage ... />
) : (
  <>
    {/* Banner Informational Header */}
    <div className="rounded-3xl bg-gradient-to-r from-blue-700 ... p-8 ...">
      ...
    </div>
    ...
  </>
)}
```

This banner shows the same headline, description, and two CTAs on **Match**, **Explorer**, **Chat**, **Jobs**, and **FAQ** tabs. It feels redundant and consumes significant vertical space on mobile, especially now that the app uses a fixed bottom tab bar.

---

## 3. Design Direction

### 3.1 Visual Design

- Replace the single shared gradient banner with a **slim, contextual header card** per tab.
- Header style: white card, `rounded-2xl`, subtle shadow, **4px left accent bar** matching the tab theme color, `p-5` mobile / `p-6` desktop.
- Layout: icon + title + one-line subtitle on the left; optional compact action on the right (desktop only).
- Reduced bottom margin: `mb-6` instead of `mb-10` to give content more room.

### 3.2 Accent Color Mapping

| Tab | Accent | Rationale |
|-----|--------|-----------|
| **match** | blue | Primary app color, matches AI/action theme. |
| **explorer** | indigo | Discovery/search theme, distinct from primary blue. |
| **chat** | emerald | Ka-TrabaHO companion / support theme. |
| **jobs** | emerald | Employment/success theme, pairs with chat. |
| **faq** | indigo | Informational, pairs with explorer. |

### 3.3 Content Mapping

| Tab | Icon | Title (Fil) | Title (En) | Subtitle (Fil) | Subtitle (En) |
|-----|------|-------------|------------|----------------|---------------|
| **match** | `Sparkles` | AI Pagtutugma ng Kurso | AI Course Matcher | Sagutin ang ilang tanong para makita ang pinaka-angkop na TESDA course para sa iyo. | Answer a few questions to find your best-fit TESDA course. |
| **explorer** | `Search` | Sektor at Kurso | Course & Job Explorer | Tingnan ang mga accredited na programa at demand sa trabaho sa iyong lugar. | Browse accredited programs and see local job demand. |
| **chat** | `MessageSquare` | Kausapin si Ka-TrabaHO | Chat with Ka-TrabaHO | Magtanong tungkol sa TESDA, scholarship, at requirements. | Ask anything about TESDA, scholarships, and requirements. |
| **jobs** | `Briefcase` | Hanapin ang Trabaho | Job Market | Alamin ang mga high-demand na trabahong akma sa iyong profile. | Find high-demand roles matched to your profile. |
| **faq** | `HelpCircle` | Mga Karaniwang Katanungan | Frequently Asked Questions | Mga mabilisang sagot tungkol sa TESDA programs. | Quick answers about TESDA programs. |

The **landing** page keeps its existing full hero section (`From Zero to Hero`) and does not use this component.

---

## 4. Component Architecture

### 4.1 New Component: `PageHeader`

Create a reusable presentational component at `src/components/PageHeader.tsx`.

```tsx
interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accent: "blue" | "indigo" | "emerald" | "amber" | "purple";
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };
}
```

Responsibilities:
- Render the contextual header card.
- Map `accent` prop to the correct left-border color class.
- Render the icon, title, and subtitle.
- Optionally render a right-side action button on desktop if provided.

### 4.2 Changes in `App.tsx`

- Remove the shared gradient banner block entirely.
- At the top of each non-landing tab content block, render the correct `<PageHeader ... />`.
- Disposition the old banner CTAs:
  - **“Start AI Assessment”** already exists on the landing page hero. Optionally keep it as a secondary action inside the `match` tab header, but it is not required.
  - **“Talk to Counselor”** is redundant when the user is already on the Chat tab; drop it or replace it with a quick prompt inside the chat tab.

### 4.3 Landing Page

- `LandingPage.tsx` remains unchanged. It owns its own hero and is intentionally distinct from the tab headers.

---

## 5. Responsive & Accessibility Behavior

### Mobile (<768px)
- Header is full-width, single-column: icon + title + subtitle.
- Optional action is hidden or rendered as a small icon-only button to save horizontal space.
- Padding: `p-5`.
- Content below keeps `pb-24` (or `pb-20` + `env(safe-area-inset-bottom)`) so the fixed bottom tab bar does not overlap.

### Desktop (≥768px)
- Header sits inside the standard `max-w-5xl` container.
- Layout becomes horizontal: icon/text on the left, optional action on the right.
- Padding: `p-6`.

### Accessibility
- Header title uses `<h2>` for tab pages; landing page keeps its `<h1>`.
- Decorative icons are `aria-hidden="true"`.
- Text uses `text-slate-900` / `text-slate-500` to maintain contrast.
- No new entrance animations; respects existing `prefers-reduced-motion` rules.

---

## 6. Implementation Scope

### Files to Modify

| File | Change |
|------|--------|
| `src/components/PageHeader.tsx` | Create new reusable component. |
| `src/App.tsx` | Remove shared banner; add `<PageHeader />` to each non-landing tab. |
| `src/index.css` | Ensure `.accent-indigo` exists (blue, emerald, amber, purple already exist in the redesign plan). |

### Files NOT to Touch

- `src/components/LandingPage.tsx` — intentionally separate hero.
- `src/components/AssessmentWizard.tsx` — wizard internal UI unchanged.
- `src/components/Navbar.tsx` / `BottomNav.tsx` — navigation unaffected.
- `src/data/tesdaData.ts`, `src/types.ts` — no data changes.
- `api/*`, `server.ts` — no backend changes.

### Dependencies

- None. Uses existing `lucide-react` icons and Tailwind CSS utilities.

---

## 7. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Users may feel disoriented without the big banner | Each tab still has a clear contextual header; landing page keeps its full hero. |
| Removing the banner CTAs could reduce AI matcher starts | Landing page hero and quick-action buttons still drive users to the matcher; the match tab header also reinforces the action. |
| Chat tab already has a centered header; replacing it could conflict with existing styling | The existing chat header is removed and replaced by the consistent `PageHeader` above the chat UI. |
| FAQ tab already has a centered header; replacing it could conflict | Same approach as chat: replace with consistent `PageHeader`. |

---

## 8. Success Criteria

- [ ] The shared gradient banner no longer appears on any tab.
- [ ] Each non-landing tab (`match`, `explorer`, `chat`, `jobs`, `faq`) displays its own contextual header with the correct icon, title, subtitle, and accent color.
- [ ] Landing page continues to show its existing full hero section.
- [ ] Language toggle updates all header text correctly.
- [ ] Mobile view shows compact headers with no bottom-tab overlap.
- [ ] Desktop view shows headers aligned to the main container width.
- [ ] No horizontal scroll or layout regressions.
- [ ] Heading hierarchy remains correct (`h1` on landing, `h2` on tab headers).

---

## 9. Open Questions / Future Work

- Should the `match` tab header include a secondary "Edit Profile" or "Restart" action once results are shown? (Not required for MVP; can be added later.)
- Should the `chat` tab header show the Ka-TrabaHO avatar instead of a generic `MessageSquare` icon? (Nice-to-have; not in this spec.)

---

**Status:** Approved by user on 2026-06-14. Ready for implementation planning.
