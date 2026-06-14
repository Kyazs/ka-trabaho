# UI/UX Redesign Design Spec

**Date:** 2026-06-14
**Project:** tesda-skills-to-jobs-matcher
**Topic:** Component Redesign (Option B)
**Target Audience:** Filipino out-of-school youth, ages 15-24

---

## 1. Goals

Fix the following user-reported issues:
- Layout looks stretched on mobile
- Navbar overflows on mobile
- Assessment wizard "Next" button is clickable regardless of input
- Landing page is too bland and has a visual alignment bug (line beside number)

And deliver a bold, energetic, mobile-first redesign.

---

## 2. Visual Identity Refresh

### Color Palette
- **Primary:** Vibrant electric blue `#3b82f6` (Tailwind `blue-500` to `blue-600`) with brighter accent `#60a5fa` (`blue-400`)
- **Energy accent:** Warm coral/orange `#f97316` (`orange-500`) for secondary CTAs, highlights, and badges
- **Success:** Saturated emerald `#10b981` (`emerald-500`) to `#059669` (`emerald-600`)
- **Backgrounds:** Replace flat `bg-slate-50` with subtle gradient `bg-gradient-to-b from-slate-50 to-blue-50/30`
- **Cards:** White with colored left-border accent (4px) instead of plain `border-slate-200`
- **Neutrals:** Keep slate scale for text and borders

### Typography
- **Display:** Plus Jakarta Sans (already in use), increase weight to `font-black` on hero headlines
- **Hero sizing:** `text-4xl` on mobile, `sm:text-5xl`, `lg:text-6xl`
- **Headlines:** `tracking-tight` for modern, punchy feel
- **Body:** Inter (already in use), keep `text-base` to `text-lg`
- **Mono:** JetBrains Mono for data points (course codes, match scores, salary data)

### Shape & Motion
- **Cards:** `rounded-2xl` with `overflow-hidden`
- **Buttons:** `rounded-2xl` with `shadow-lg shadow-blue-500/20` glow on primary CTAs
- **Animations:**
  - Re-use existing `animate-fade-in` and `animate-slide-in`
  - Add subtle `scale-[1.02]` on card entrance
  - Add `active:scale-95` on all buttons for tactile mobile feedback
  - All transitions capped at `0.2s` for UI, `0.3s` for state changes
- **Reduced motion:** Respect `prefers-reduced-motion: reduce` by disabling all entrance animations and hover lifts

---

## 3. Landing Page Redesign

### Fix: Timeline Alignment Bug
**Problem:** The vertical connector line between journey steps uses `absolute left-5` which does not align with the center of the 40px number circle on all screen widths.

**Solution:** Replace the absolute-positioned line with a **flex-column timeline**:
- Each step is a flex container with two children: a left "track" column and a right content card
- The left track column contains:
  - The number circle (centered)
  - A vertical line (`w-0.5 flex-grow bg-blue-200`) below the circle, connecting to the next step
- The last step has no connecting line below it
- This guarantees perfect center alignment regardless of screen width or font size

### Visual Upgrades
- **Hero background:** Add subtle animated background blobs (soft blue radial gradients, `blur-3xl`, `opacity-30`) behind the hero content to create depth without clutter
- **Stats grid:** Replace plain `grid-cols-2` white boxes with **gradient stat cards** (`bg-gradient-to-br from-blue-500 to-blue-600` with white text, bold numbers, small icon above). Use `grid-cols-1` on very small screens (`<360px` implied via natural wrapping or a custom `xs` breakpoint if available) and `grid-cols-2` on `sm` and up.
- **Journey steps:**
  - Each step card gets a **4px left accent bar** matching the step color (blue for steps 1-3, emerald for step 4)
  - Cards get `hover:shadow-md` lift on desktop (disabled on touch devices via `@media (hover: hover)`)
  - Remove plain `border-slate-200` in favor of `shadow-sm` + left accent
- **Quick actions:**
  - Primary CTA: keep blue gradient, add `shadow-blue-500/30` glow, `min-h-[56px]` for thumb tapping
  - Secondary buttons: `border-2 border-blue-200` instead of `border-slate-200`, subtle blue tint on hover
- **Trust badges:** Increase opacity from `opacity-60` to `opacity-90`, add tiny colored icons (blue for gov, emerald for free, orange for mobile), and space them with `gap-4` instead of `gap-6`

### Mobile Layout
- Hero text uses `max-w-xs` on mobile to prevent stretching on wide phones
- Quick action buttons use `w-full` with `max-w-sm` and `mx-auto` for comfortable thumb reach
- Add `pb-20` to the bottom of the landing page so the bottom tab bar (see Section 4) never covers the last item
- Navigation hint section: remove or simplify on mobile (the bottom tab bar makes it redundant)

---

## 4. Navbar Redesign

### Problem
The current navbar is `h-20` (80px) with logo, brand text, "AI Support" badge, language toggle, and hamburger button all in one row. This causes overflow and cramped feel on mobile.

### Solution: Dual-Zone Navigation

#### Desktop (>768px)
- Reduce navbar height to `h-16` (64px)
- Remove the "AI Support" badge from the logo area (redundant)
- Keep nav tabs but tighten padding to `px-4 py-2`
- Keep the existing desktop tab layout (`hidden md:flex`) but with `gap-1` instead of `space-x-2`

#### Mobile (<768px)
- **Top zone:** Ultra-compact sticky header (`h-12`, 48px) containing:
  - Logo icon only (no text) + small brand name `text-sm`
  - Language toggle: compact text-only buttons "EN / TL" (or flag icons if available)
  - Overflow menu button (⋮) for less-used items (FAQ, settings, etc.)
- **Bottom zone:** Fixed bottom tab bar (`h-16`, 64px) containing 5 main tabs:
  - Home (🏠), AI Match (🌟), Courses (📚), Jobs (💼), Chat (💬)
  - Each tab: icon + tiny label, `text-xs` font
  - Active tab: filled colored icon + colored top border indicator (`border-t-2 border-blue-500`)
  - Inactive tab: outline icon + `text-slate-400`
  - Background: `bg-white` with `border-t border-slate-200` and `shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]`
  - Safe area support: `pb-[env(safe-area-inset-bottom)]`
- The hamburger dropdown menu is removed on mobile (replaced by bottom tabs + overflow menu)
- FAQ tab is accessible from the top overflow menu or from within other screens

---

## 5. Assessment Wizard Redesign

### Problem 1: Stretched Layout
The wizard uses `max-w-4xl` which is too wide and feels stretched. The step indicators are a horizontal row that wraps awkwardly on mobile.

### Solution
- Change container to `max-w-2xl` on mobile, `max-w-3xl` on desktop (`max-w-2xl md:max-w-3xl mx-auto`)
- Add `px-4` side padding with `safe-area-inset` awareness (`px-[max(1rem,env(safe-area-inset-left))]` on mobile if needed, but standard `px-4` is acceptable)
- Step indicators on mobile: Replace the horizontal dot row with a **vertical progress bar + current step label** (e.g., "Step 2 of 5: Interests")
- Step indicators on desktop: Keep dot row but with hover tooltips showing step names
- All wizard cards get `rounded-2xl` with a **color-coded top accent bar** (4px):
  - `basic`: blue (`bg-blue-500`)
  - `interests`: amber (`bg-amber-500`)
  - `skills`: purple (`bg-purple-500`)
  - `goal`: emerald (`bg-emerald-500`)
  - `review`: slate (`bg-slate-500`)
  - `processing`: blue (`bg-blue-500`)
  - `results`: emerald (`bg-emerald-500`)

### Problem 2: No Validation
`canProceed()` returns `true` for most steps, so users can click Next without entering anything.

### Solution: Step-by-Step Validation
| Step | Required Input | Validation Rule | Error Message (Fil) | Error Message (En) |
|------|---------------|-----------------|---------------------|-------------------|
| basic | Age + Region | `age >= 15 && selectedRegion !== ""` | "Piliin ang edad at rehiyon mo." | "Please select your age and region." |
| interests | At least 1 interest | `customInterests.length > 0` | "Piliin kahit isa, para mas maigi ang results mo!" | "Pick at least one so we can give you better results!" |
| skills | At least 1 skill OR explicitly skipped | `customSkills.length > 0` | "Piliin kahit isang skill, o i-skip." | "Pick at least one skill, or skip." |
| goal | Career goal text | `careerGoal.trim().length >= 5` | "I-type ang plano mo (kahit 5 letters)." | "Type your goal (at least 5 letters)." |

- **UI for disabled Next:**
  - When validation fails, Next button shows `opacity-50 cursor-not-allowed` and is functionally disabled
  - Add a friendly inline validation message below the form area, not a harsh alert
  - The message uses the `AlertCircle` icon + `text-amber-600` color for warmth, not red
- **Skip option:** On `skills` step, add a secondary "Skip" button (`text-sm text-slate-500 underline`) that marks skills as explicitly skipped and proceeds
- **Accessibility:** Add `aria-invalid="true"` and `aria-describedby` pointing to the validation message on the failing input

### Visual Upgrades
- **Input fields:** `border-2` instead of `border`, with a subtle animated focus ring (`ring-2 ring-blue-500/20` on focus, transition 0.2s)
- **Tag buttons (interests/skills):**
  - Selected state: filled with the step's color + white text + `Check` icon, `shadow-sm`
  - Unselected state: `bg-white border-2 border-slate-200 text-slate-600`
  - Hover: `border-slate-300 bg-slate-50` (desktop only)
- **Review step:** Use a clean summary card with icon bullets (e.g., `User` icon for age/education, `MapPin` for region, `Sparkles` for interests) instead of plain text blocks
- **Processing step:**
  - Replace generic spinner with a **circular progress spinner** + animated step-by-step text
  - Steps cycle through: "Analyzing your profile...", "Matching with 300+ courses...", "Checking job demand in your region...", "Finalizing your top matches..."
  - Each step text fades in and out with a 2-second interval
- **Results step:** Keep the existing card layout but add the gradient left accent and `hover:shadow-lg` lift

---

## 6. Global Mobile Layout & Polish

### Content Containers
- Replace generic `max-w-7xl` with `max-w-5xl` on desktop, `max-w-full` on mobile
- Standardize all tabs to use `px-4` side padding (some currently vary)
- Use `space-y-6` for vertical rhythm on mobile
- Add `pb-24` (or `pb-20` + `safe-area-inset-bottom`) to all scrollable content so bottom tab bar never covers content

### Touch Targets
- All buttons: `min-h-[48px]` minimum (most already comply, verify secondary buttons)
- All clickable cards/tabs: `active:bg-slate-100` feedback on tap
- Add `touch-action: manipulation` to prevent 300ms tap delay on all buttons
- Ensure `cursor-pointer` on all interactive elements

### Scroll & Overflow
- Add `overflow-x-hidden` to the main app container to prevent any horizontal scroll
- Chat panel: `flex-col h-[calc(100vh-120px)]` so input stays fixed and messages scroll
- Explorer sidebar: On mobile, convert left sidebar to a **horizontal chip list** (`flex overflow-x-auto gap-2 pb-2`) or a **collapsible accordion** instead of a 50% width sidebar

### Focus & Accessibility
- Ensure `focus-visible` rings are clearly visible on mobile (2px solid blue-500, 2px offset — already present, verify it works on all inputs)
- Add `scroll-smooth` to `html` element
- `prefers-reduced-motion` media query must disable all `animate-fade-in`, `animate-slide-in`, and hover lifts

### Loading & Empty States
- Add global shimmer skeleton for async content (AI results, chat messages) using the existing `.shimmer` CSS class
- Empty state for explorer search: friendly icon + message
  - Fil: "Walang nahanap. Subukan ibang keyword!"
  - En: "Nothing found. Try another keyword!"

### Safe Areas
- Top header: `pt-[env(safe-area-inset-top)]`
- Bottom tab bar: `pb-[env(safe-area-inset-bottom)]`
- Main content: `px-[env(safe-area-inset-left)]` and `px-[env(safe-area-inset-right)]` if needed (standard `px-4` is usually sufficient)

---

## 7. Implementation Scope (What Changes, What Doesn't)

### Files to Modify
| File | Changes |
|------|---------|
| `src/index.css` | Add new utility classes (gradient backgrounds, active tap states, safe area padding, `touch-action: manipulation`) |
| `src/components/Navbar.tsx` | Complete rewrite for dual-zone nav (compact top header + bottom tab bar) |
| `src/components/LandingPage.tsx` | Redesign timeline, gradient stats, hero background, quick actions |
| `src/components/AssessmentWizard.tsx` | Validation logic, step indicator redesign, input/tag styling, processing animation, review/results polish |
| `src/App.tsx` | Adjust container max-widths, add `overflow-x-hidden`, add safe area padding to main wrapper, remove hamburger logic from App if needed |

### Files NOT to Touch
- `src/data/tesdaData.ts` — data layer unchanged
- `api/*` — backend API endpoints unchanged
- `server.ts` — dev server unchanged
- `src/types.ts` — types unchanged (unless new props needed for nav, but try to avoid)
- `src/main.tsx` — entry point unchanged
- `index.html` — HTML shell unchanged (fonts already loaded)

### Backend / Logic Unchanged
- All AI recommendation logic (`handleSubmitProfile`, API calls)
- All chat logic
- All course/job data and matching algorithms
- State management structure (still centralized in `App.tsx`)

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Bottom tab bar may overlap content on some devices | Always use `pb-20` or `pb-24` on scrollable containers; test with `env(safe-area-inset-bottom)` |
| Validation changes may break existing test flows | Add `aria` attributes and clear error messages; ensure skip option exists for optional steps |
| New CSS classes may conflict with Tailwind v4 | Use standard Tailwind utility classes; add custom classes only in `index.css` with `@layer utilities` |
| Desktop users may dislike the narrower max-width | `max-w-5xl` is still wide enough for readability; `max-w-3xl` on wizard is intentional for focus |

---

## 9. Success Criteria

- [ ] Navbar does not overflow on any mobile screen width (test down to 320px)
- [ ] Landing page timeline connector line is perfectly centered with number circles on all widths
- [ ] Landing page stats cards use gradient styling and feel bold/energetic
- [ ] Assessment wizard "Next" button is disabled when required fields are empty, with friendly inline error
- [ ] Bottom tab bar is accessible and functional on mobile; all 5 main tabs work
- [ ] No horizontal scroll on any screen width
- [ ] All touch targets are ≥48px height
- [ ] `prefers-reduced-motion` disables animations
- [ ] Safe area insets work on notched phones (iPhone, Android)
- [ ] Visual style is consistent across all 6 tabs

---

## 10. Open Questions / Future Work

- Should we add a dark mode toggle? (Not in this spec — can be a future phase)
- Should the bottom tab bar animate on tab switch (e.g., icon scale pop)? (Not required for MVP, but nice-to-have)
- Should we add a pull-to-refresh gesture on mobile? (Not in this spec)

---

**Status:** Approved by user on 2026-06-14. Ready for implementation planning.
