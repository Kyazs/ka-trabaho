# Hero Redundancy Fix: Tab-Specific Contextual Headers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the shared gradient banner that appears on every non-landing tab with a slim, tab-specific contextual header component.

**Architecture:** Create a reusable `PageHeader` presentational component. Remove the shared banner from `App.tsx`. Add the correct `PageHeader` instance at the top of each non-landing tab (`match`, `explorer`, `chat`, `jobs`, `faq`). Keep the landing page hero untouched.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Vite, Lucide React icons

---

## File Structure

| File | Responsibility | Action |
|------|---------------|--------|
| `src/index.css` | Global styles; left accent card utilities | Modify (add indigo accent) |
| `src/components/PageHeader.tsx` | Reusable contextual header component | Create |
| `src/App.tsx` | Main tab routing; currently hosts the shared banner | Modify (remove banner, add headers) |
| `src/components/LandingPage.tsx` | Landing page hero (separate) | No change |

---

## Task 1: Add `.accent-indigo` CSS utility

**Files:**
- Modify: `src/index.css:158`

The existing redesign plan already defines `.accent-blue`, `.accent-emerald`, `.accent-amber`, `.accent-purple`, and `.accent-slate`. We need indigo for the Explorer and FAQ tabs.

- [ ] **Step 1: Add the indigo accent rule**

Edit `src/index.css` and add `.accent-indigo` right after `.accent-purple`:

```css
.accent-indigo::before { background-color: var(--color-indigo-500); }
```

So the accent block becomes:

```css
.accent-blue::before { background-color: var(--color-blue-500); }
.accent-emerald::before { background-color: var(--color-emerald-500); }
.accent-amber::before { background-color: var(--color-amber-500); }
.accent-purple::before { background-color: var(--color-purple-500); }
.accent-indigo::before { background-color: var(--color-indigo-500); }
.accent-slate::before { background-color: var(--color-slate-500); }
```

- [ ] **Step 2: Verify no syntax errors**

Run: `npm run lint`
Expected: `tsc --noEmit` passes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add indigo accent color utility for contextual headers"
```

---

## Task 2: Create the `PageHeader` component

**Files:**
- Create: `src/components/PageHeader.tsx`

- [ ] **Step 1: Write the component file**

Create `src/components/PageHeader.tsx` with the following content:

```tsx
import React from "react";
import type { LucideIcon } from "lucide-react";

export type AccentColor = "blue" | "indigo" | "emerald" | "amber" | "purple" | "slate";

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: AccentColor;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

const ICON_BG: Record<AccentColor, string> = {
  blue: "bg-blue-50",
  indigo: "bg-indigo-50",
  emerald: "bg-emerald-50",
  amber: "bg-amber-50",
  purple: "bg-purple-50",
  slate: "bg-slate-50",
};

const ICON_TEXT: Record<AccentColor, string> = {
  blue: "text-blue-600",
  indigo: "text-indigo-600",
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  purple: "text-purple-600",
  slate: "text-slate-600",
};

const ACTION_BG: Record<AccentColor, string> = {
  blue: "bg-blue-50",
  indigo: "bg-indigo-50",
  emerald: "bg-emerald-50",
  amber: "bg-amber-50",
  purple: "bg-purple-50",
  slate: "bg-slate-50",
};

const ACTION_TEXT: Record<AccentColor, string> = {
  blue: "text-blue-700",
  indigo: "text-indigo-700",
  emerald: "text-emerald-700",
  amber: "text-amber-700",
  purple: "text-purple-700",
  slate: "text-slate-700",
};

const ACTION_HOVER_BG: Record<AccentColor, string> = {
  blue: "hover:bg-blue-100",
  indigo: "hover:bg-indigo-100",
  emerald: "hover:bg-emerald-100",
  amber: "hover:bg-amber-100",
  purple: "hover:bg-purple-100",
  slate: "hover:bg-slate-100",
};

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  accent,
  action,
}: PageHeaderProps) {
  return (
    <div className={`accent-card accent-${accent} p-5 md:p-6 mb-6`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ICON_BG[accent]} ${ICON_TEXT[accent]}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 md:text-xl">
              {title}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={`hidden md:flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all touch-manipulation ${ACTION_BG[accent]} ${ACTION_TEXT[accent]} ${ACTION_HOVER_BG[accent]}`}
          >
            {action.icon && <action.icon className="h-4 w-4" />}
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run lint`
Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/PageHeader.tsx
git commit -m "feat: add reusable PageHeader component for tab contextual headers"
```

---

## Task 3: Remove the shared banner and add contextual headers in `App.tsx`

**Files:**
- Modify: `src/App.tsx`

### Step 3.1: Remove banner imports and `startAiMatching` dead code

The shared banner imports `Sparkles` and `MessageSquare` only for its CTAs. We will keep `Sparkles` and `MessageSquare` because they are used by the new headers, but the banner-specific usage is gone.

`startAiMatching` is currently only called by the banner. After removing the banner, repurpose it as the action for the `match` tab header so the scroll-and-focus behavior is preserved.

- [ ] **Step 3.1: Remove the old banner block**

In `src/App.tsx`, delete the entire banner block starting with `{/* Banner Informational Header */}` and ending with `</div>` around lines 541–583.

Before removal, the area looks like:

```tsx
        {/* Banner Informational Header */}
        <div id="welcome-alert-banner" className="mb-10 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 shadow-2xl text-white sm:p-10 relative overflow-hidden">
          ...
        </div>
```

After removal, the code should flow directly from the `</>` fragment opening to the `TAB 1: AI JOB & COURSE MATCHER` comment.

- [ ] **Step 3.2: Add `PageHeader` import**

Add this import near the top of `src/App.tsx` (after the `Navbar` import):

```tsx
import PageHeader from "./components/PageHeader";
```

- [ ] **Step 3.3: Add helper object for tab header content**

Add a helper constant near the `QUICK_INTERESTS` constants (after line 162):

```tsx
const PAGE_HEADER_CONTENT: Record<
  "match" | "explorer" | "chat" | "jobs" | "faq",
  {
    title: { fil: string; en: string };
    subtitle: { fil: string; en: string };
    icon: React.ElementType;
    accent: "blue" | "indigo" | "emerald";
  }
> = {
  match: {
    title: { fil: "AI Pagtutugma ng Kurso", en: "AI Course Matcher" },
    subtitle: {
      fil: "Sagutin ang ilang tanong para makita ang pinaka-angkop na TESDA course para sa iyo.",
      en: "Answer a few questions to find your best-fit TESDA course.",
    },
    icon: Sparkles,
    accent: "blue",
  },
  explorer: {
    title: { fil: "Sektor at Kurso", en: "Course & Job Explorer" },
    subtitle: {
      fil: "Tingnan ang mga accredited na programa at demand sa trabaho sa iyong lugar.",
      en: "Browse accredited programs and see local job demand.",
    },
    icon: Search,
    accent: "indigo",
  },
  chat: {
    title: { fil: "Kausapin si Ka-TrabaHO", en: "Chat with Ka-TrabaHO" },
    subtitle: {
      fil: "Magtanong tungkol sa TESDA, scholarship, at requirements.",
      en: "Ask anything about TESDA, scholarships, and requirements.",
    },
    icon: MessageSquare,
    accent: "emerald",
  },
  jobs: {
    title: { fil: "Hanapin ang Trabaho", en: "Job Market" },
    subtitle: {
      fil: "Alamin ang mga high-demand na trabahong akma sa iyong profile.",
      en: "Find high-demand roles matched to your profile.",
    },
    icon: Briefcase,
    accent: "emerald",
  },
  faq: {
    title: { fil: "Mga Karaniwang Katanungan", en: "Frequently Asked Questions" },
    subtitle: {
      fil: "Mga mabilisang sagot tungkol sa TESDA programs.",
      en: "Quick answers about TESDA programs.",
    },
    icon: HelpCircle,
    accent: "indigo",
  },
};
```

- [ ] **Step 3.4: Add a small render helper inside the component**

Add this helper function inside the `App` component, after the `filteredSectors` definition and before the `return` statement:

```tsx
  const renderPageHeader = (tab: keyof typeof PAGE_HEADER_CONTENT) => {
    const config = PAGE_HEADER_CONTENT[tab];
    return (
      <PageHeader
        title={config.title[lang]}
        subtitle={config.subtitle[lang]}
        icon={config.icon}
        accent={config.accent}
      />
    );
  };
```

If you want to keep the `startAiMatching` focus/scroll behavior on the match tab, use this version instead for the `match` case:

```tsx
  const renderPageHeader = (tab: keyof typeof PAGE_HEADER_CONTENT) => {
    const config = PAGE_HEADER_CONTENT[tab];
    return (
      <PageHeader
        title={config.title[lang]}
        subtitle={config.subtitle[lang]}
        icon={config.icon}
        accent={config.accent}
        action={
          tab === "match"
            ? {
                label: lang === "fil" ? "Magsimula" : "Start",
                onClick: startAiMatching,
                icon: Sparkles,
              }
            : undefined
        }
      />
    );
  };
```

- [ ] **Step 3.5: Insert headers into each tab**

For each non-landing tab, insert `{renderPageHeader("<tab>")}` at the top of the tab content container, immediately inside the `<div id="tab-...">`.

**Match tab** (around line 588):

```tsx
        {currentTab === "match" && (
          <div id="tab-matching-content" className="space-y-8 animate-fade-in">
            {renderPageHeader("match")}
            <AssessmentWizard
```

**Explorer tab** (around line 644):

```tsx
        {currentTab === "explorer" && (
          <div id="tab-explorer-content" className="space-y-8 animate-fade-in">
            {renderPageHeader("explorer")}
            {/* Search Input Filter */}
```

**Chat tab** (around line 882):

Replace the existing centered header card (the block with `Kausapin si Ka-TrabaHO` and the `Live AI Companion Assistance` badge) with the new header.

```tsx
        {currentTab === "chat" && (
          <div id="tab-chat-content" className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            {renderPageHeader("chat")}
            {/* Quick pre-seeded questions */}
```

Remove the old header block:

```tsx
            {/* Header chat instruction */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg text-center">
              ...
            </div>
```

**FAQ tab** (around line 1075):

Replace the existing centered header block with the new header.

```tsx
        {currentTab === "faq" && (
          <div id="tab-faq-content" className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            {renderPageHeader("faq")}
            <div className="space-y-4" id="faq-accordions-container">
```

Remove the old header block:

```tsx
            <div className="text-center max-w-md mx-auto mb-8">
              ...
            </div>
```

**Jobs tab** (around line 1128):

```tsx
        {currentTab === "jobs" && (
          <div id="tab-jobs-content" className="space-y-8 animate-fade-in">
            {renderPageHeader("jobs")}
            {/* Job Matching Form */}
```

- [ ] **Step 3.6: Verify TypeScript compiles**

Run: `npm run lint`
Expected: No type errors.

- [ ] **Step 3.7: Build the project**

Run: `npm run build`
Expected: Vite build completes successfully with no errors.

- [ ] **Step 3.8: Commit**

```bash
git add src/App.tsx
git commit -m "feat: replace shared banner with tab-specific PageHeader components"
```

---

## Task 4: Manual verification

- [ ] **Step 4.1: Start the dev server**

Run: `npm run dev`
Expected: Server starts and prints a local URL (e.g., `http://localhost:5173`).

- [ ] **Step 4.2: Verify landing page**

Open the landing page. Confirm:
- The large "From Zero to Hero" hero is still present.
- The shared gradient banner is **not** shown on the landing page.

- [ ] **Step 4.3: Verify each tab header**

Click through the bottom tabs or nav links for: **Match**, **Explorer**, **Chat**, **Jobs**, **FAQ**.

For each tab confirm:
- The old shared gradient banner is gone.
- A white contextual header card appears with the correct icon, title, subtitle, and left accent color from the content mapping table.
- No horizontal scroll is introduced.

- [ ] **Step 4.4: Verify mobile layout**

Use the browser dev tools device emulator (e.g., iPhone SE / 375px width).

Confirm:
- Headers are compact (`p-5`, no right-side action button).
- Bottom tab bar does not overlap the last content item (existing `pb-24` should still apply).
- Text is readable and not stretched.

- [ ] **Step 4.5: Verify language toggle**

Toggle the language between EN and TL using the existing language toggle.

Confirm:
- All tab headers switch language correctly.
- Titles and subtitles match the Fil/En mapping in the spec.

- [ ] **Step 4.6: Verify accessibility**

Inspect each contextual header with dev tools.

Confirm:
- The header title is rendered as an `<h2>`.
- The icon has `aria-hidden="true"`.

- [ ] **Step 4.7: Stop the dev server**

Press `Ctrl + C` in the terminal running `npm run dev`.

- [ ] **Step 4.8: Final verification commit (if any tweaks were made)**

If no changes were needed after manual verification, this step is optional. If you made small fixes, commit them:

```bash
git add -A
git commit -m "fix: polish contextual header spacing and mobile layout"
```

---

## Self-Review Checklist

- [ ] **Spec coverage:** Each spec requirement (remove banner, per-tab headers, landing untouched, mobile compact, correct bilingual content, accessibility) is covered by a task or verification step.
- [ ] **Placeholder scan:** No TBDs, TODOs, or vague instructions remain in the plan.
- [ ] **Type consistency:** `PageHeaderProps` uses `LucideIcon` for icons and `AccentColor` for accent colors; `PAGE_HEADER_CONTENT` keys match the `tab` parameter type.
- [ ] **No scope creep:** Only `index.css`, `PageHeader.tsx`, and `App.tsx` are changed. No backend, data, or wizard changes.

---

**Plan complete.** After this plan is executed, the shared banner redundancy will be eliminated and each tab will display a focused, contextual header consistent with the existing mobile-first design system.
