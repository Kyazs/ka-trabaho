# UI/UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the TESDA skills-to-jobs matcher app with a bold, energetic, mobile-first UI that fixes navbar overflow, landing page blandness, stretched mobile layout, and wizard validation gaps.

**Architecture:** Keep existing React + Tailwind v4 + single-page tab architecture. Replace top-heavy navbar with dual-zone mobile nav (compact top header + fixed bottom tab bar). Redesign LandingPage and AssessmentWizard components with new visual system. Add validation to wizard steps. Keep all backend APIs and state management unchanged.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Vite, Lucide React icons

---

## File Structure

| File | Responsibility | Action |
|------|---------------|--------|
| `src/index.css` | Global styles, custom utilities, animations, safe area support | Modify |
| `src/components/Navbar.tsx` | Top header + mobile bottom tab bar | Rewrite |
| `src/components/LandingPage.tsx` | Hero, timeline, stats, CTAs, trust badges | Rewrite |
| `src/components/AssessmentWizard.tsx` | Multi-step wizard with validation, step UI, processing state | Major modify |
| `src/App.tsx` | Main container, tab routing, max-widths, overflow control | Modify |
| `src/data/tesdaData.ts` | Static data (regions, courses, FAQ) | No change |
| `src/types.ts` | TypeScript interfaces | No change |
| `api/*` | Backend serverless functions | No change |
| `server.ts` | Express dev server | No change |

---

## Task 1: CSS Foundation

**Files:**
- Modify: `src/index.css`

**Context:** Tailwind v4 uses CSS-native configuration. Add new utility classes and overrides for the redesign.

- [ ] **Step 1: Add safe area, touch, and active state utilities**

Add to the end of `src/index.css`:

```css
/* Safe area support */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Touch action manipulation for mobile buttons */
.touch-manipulation {
  touch-action: manipulation;
}

/* Active tap feedback for mobile */
.active-tap:active {
  background-color: #f1f5f9; /* slate-100 */
}
@media (hover: hover) {
  .active-tap:hover {
    background-color: #f8fafc; /* slate-50 */
  }
}

/* Gradient stat card base */
.gradient-stat-card {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
}

/* Left accent border cards */
.accent-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}
.accent-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 1rem 0 0 1rem;
}
.accent-blue::before { background-color: #3b82f6; }
.accent-emerald::before { background-color: #10b981; }
.accent-amber::before { background-color: #f59e0b; }
.accent-purple::before { background-color: #a855f7; }
.accent-slate::before { background-color: #64748b; }

/* Hero background blobs */
.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.25;
  pointer-events: none;
}
.hero-blob-1 {
  width: 300px;
  height: 300px;
  background: #3b82f6;
  top: -100px;
  left: -50px;
}
.hero-blob-2 {
  width: 250px;
  height: 250px;
  background: #60a5fa;
  top: 50px;
  right: -80px;
}
.hero-blob-3 {
  width: 200px;
  height: 200px;
  background: #93c5fd;
  bottom: -50px;
  left: 30%;
}

/* Scroll smooth for anchor/tab navigation */
html {
  scroll-behavior: smooth;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .animate-fade-in,
  .animate-slide-in,
  .card-hover {
    animation: none !important;
    transform: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 2: Verify the build still works**

Run: `npx vite build` (or `npm run build` if defined in package.json)
Expected: Build succeeds with no CSS errors.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add CSS utilities for redesign (safe area, tap states, gradients, blobs, reduced motion)"
```

---

## Task 2: Navbar - Compact Top Header + Desktop Tabs

**Files:**
- Rewrite: `src/components/Navbar.tsx`

**Context:** The current navbar is 80px tall with a large logo, brand text, "AI Support" badge, language toggle, and hamburger all crammed in one row. We replace it with a compact top header and a separate mobile bottom tab bar (Task 3).

- [ ] **Step 1: Rewrite Navbar for compact top header + desktop tabs**

Replace the entire file with:

```tsx
import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Briefcase,
  MessageSquare,
  HelpCircle,
  GraduationCap,
  Home,
  MoreVertical,
  Globe,
} from "lucide-react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: "fil" | "en";
  setLang: (lang: "fil" | "en") => void;
}

export default function Navbar({ currentTab, setCurrentTab, lang, setLang }: NavbarProps) {
  const [overflowOpen, setOverflowOpen] = useState(false);

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    setOverflowOpen(false);
  };

  const desktopTabs = [
    { id: "landing", label: lang === "fil" ? "Simula" : "Home", icon: Home },
    { id: "match", label: "AI Matcher", icon: Sparkles },
    { id: "explorer", label: lang === "fil" ? "Mga Kurso" : "Courses", icon: BookOpen },
    { id: "jobs", label: lang === "fil" ? "Mga Trabaho" : "Jobs", icon: Briefcase },
    { id: "chat", label: "Chat", icon: MessageSquare },
  ];

  return (
    <>
      {/* === Top Header === */}
      <header id="app-header" className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm safe-area-top">
        <div className="mx-auto flex h-12 md:h-16 max-w-5xl items-center justify-between px-4">
          {/* Logo */}
          <div
            onClick={() => setCurrentTab("landing")}
            className="flex cursor-pointer items-center gap-2 group"
            id="nav-brand"
          >
            <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 font-bold text-white shadow-md shadow-blue-200 group-hover:shadow-lg group-hover:scale-105 transition-all">
              <GraduationCap className="h-5 w-5 md:h-6 md:w-6" id="brand-icon" />
            </div>
            <span className="font-display text-sm md:text-xl font-extrabold tracking-tight text-slate-900">
              Ka-Traba<span className="text-blue-600">HO</span>
            </span>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1" id="nav-tabs-desktop">
            {desktopTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}-btn`}
                  onClick={() => setCurrentTab(tab.id)}
                  aria-current={currentTab === tab.id ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    currentTab === tab.id
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language Toggle - compact on mobile */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={() => setLang("fil")}
                className={`rounded-md px-2 py-1 text-xs font-bold transition-all ${
                  lang === "fil"
                    ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                TL
              </button>
              <button
                onClick={() => setLang("en")}
                className={`rounded-md px-2 py-1 text-xs font-bold transition-all ${
                  lang === "en"
                    ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                EN
              </button>
            </div>

            {/* Overflow menu (mobile + desktop for FAQ) */}
            <div className="relative">
              <button
                onClick={() => setOverflowOpen(!overflowOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all"
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              {overflowOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-50">
                  <button
                    onClick={() => handleTabClick("faq")}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${
                      currentTab === "faq"
                        ? "text-blue-700 bg-blue-50"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <HelpCircle className="h-4 w-4" />
                    FAQ
                  </button>
                  <a
                    href="https://www.tesda.gov.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    <Globe className="h-4 w-4" />
                    TESDA Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
```

- [ ] **Step 2: Verify desktop nav renders and tabs work**

Run dev server (`npm run dev` or `npx tsx server.ts`), open in browser at desktop width, click through tabs. Expected: Compact header with logo, 5 tabs, language toggle, overflow menu. FAQ opens from overflow menu.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: redesign navbar with compact top header and overflow menu"
```

---

## Task 3: Mobile Bottom Tab Bar

**Files:**
- Create: `src/components/BottomNav.tsx`
- Modify: `src/App.tsx` (to import and render BottomNav)

**Context:** Mobile needs a fixed bottom tab bar for one-tap navigation. The 5 primary tabs are Home, AI Match, Courses, Jobs, Chat. FAQ is in the top overflow menu.

- [ ] **Step 1: Create BottomNav component**

Create `src/components/BottomNav.tsx`:

```tsx
import React from "react";
import {
  Home,
  Sparkles,
  BookOpen,
  Briefcase,
  MessageSquare,
} from "lucide-react";

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: "fil" | "en";
}

const tabs = [
  { id: "landing", icon: Home, label: "Home" },
  { id: "match", icon: Sparkles, label: "AI Match" },
  { id: "explorer", icon: BookOpen, label: "Courses" },
  { id: "jobs", icon: Briefcase, label: "Jobs" },
  { id: "chat", icon: MessageSquare, label: "Chat" },
];

export default function BottomNav({ currentTab, setCurrentTab, lang }: BottomNavProps) {
  return (
    <nav
      id="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] safe-area-bottom md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-all touch-manipulation active-tap ${
                isActive ? "text-blue-600" : "text-slate-400"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className={`relative ${isActive ? "-mt-1" : ""}`}>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full" />
                )}
                <Icon
                  className={`h-6 w-6 transition-all ${isActive ? "fill-current" : ""}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className="text-[10px] font-semibold leading-none">
                {lang === "fil" && tab.id === "landing" ? "Simula" : tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Import BottomNav in App.tsx**

In `src/App.tsx`, add the import:
```tsx
import BottomNav from "./components/BottomNav";
```

Find the main layout container (near the bottom of App.tsx, where `Navbar` is rendered). After the main content area closing tag, add:
```tsx
<BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} lang={lang} />
```

Ensure the main content area has `pb-20` (or `pb-24`) at the bottom so content isn't hidden by the bottom nav. Find the main wrapper and add:
```tsx
className="... pb-24 md:pb-0"
```
(The `md:pb-0` removes the bottom padding on desktop since the bottom nav is hidden.)

- [ ] **Step 3: Verify mobile bottom tab bar renders and is tappable**

Open browser in mobile viewport (width < 768px). Expected: Fixed bottom bar with 5 icons + labels. Tapping each switches tabs. Active tab has blue color and top indicator line. Content above scrolls without being hidden.

- [ ] **Step 4: Commit**

```bash
git add src/components/BottomNav.tsx src/App.tsx
git commit -m "feat: add fixed mobile bottom tab bar for primary navigation"
```

---

## Task 4: Landing Page - Hero & Stats

**Files:**
- Rewrite: `src/components/LandingPage.tsx`

**Context:** Landing page is bland. We add hero background blobs, gradient stat cards, and bolder typography. The hero section and stats grid are the first things users see.

- [ ] **Step 1: Rewrite hero section with background blobs and bolder typography**

In `src/components/LandingPage.tsx`, replace the hero section (lines 31-55) with:

```tsx
      {/* ========== HERO SECTION ========== */}
      <section className="relative text-center py-10 px-4 overflow-hidden">
        {/* Background blobs */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        <span className="relative inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-blue-100">
          <Target className="h-4 w-4" />
          {lang === "fil" ? "Ang Iyong Landas sa Tagumpay" : "Your Path to Success"}
        </span>

        <h1 className="relative mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
          {lang === "fil" ? "Mula sa Wala, Hanggang Tagumpay" : "From Zero to Hero"}
        </h1>

        <p className="relative mt-4 text-lg text-slate-500 max-w-sm mx-auto leading-relaxed">
          {lang === "fil"
            ? "Tingnan kung paano magbabago ng TESDA ang iyong galing sa trabaho — hakbang-hakbang."
            : "See exactly how TESDA can transform your skills into a career — step by step."}
        </p>

        <button
          onClick={() => setCurrentTab("match")}
          className="relative mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto max-w-xs touch-manipulation"
        >
          <Rocket className="h-5 w-5" />
          {lang === "fil" ? "Simulan ang Iyong Paglalakbay" : "Begin Your Journey"}
        </button>
      </section>
```

- [ ] **Step 2: Replace stats grid with gradient stat cards**

Replace the stats grid section (lines 130-157) with:

```tsx
      {/* ========== STATS GRID ========== */}
      <section className="px-4 pb-4 animate-fade-in stagger-3" style={{ animationDelay: "0.3s" }}>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
          <div className="gradient-stat-card">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="font-display text-3xl font-extrabold text-white">
              300+
            </div>
            <div className="text-sm text-blue-100 font-medium">
              {lang === "fil" ? "Mga Kurso" : "Courses"}
            </div>
          </div>

          <div className="gradient-stat-card" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-3">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="font-display text-3xl font-extrabold text-white">
              15-30
            </div>
            <div className="text-sm text-emerald-100 font-medium">
              {lang === "fil" ? "Araw ng Pagsasanay" : "Days Training"}
            </div>
          </div>

          <div className="gradient-stat-card" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-3">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div className="font-display text-3xl font-extrabold text-white">
              ₱160
            </div>
            <div className="text-sm text-amber-100 font-medium">
              {lang === "fil" ? "Allowance / Araw" : "Daily Allowance"}
            </div>
          </div>

          <div className="gradient-stat-card" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}>
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-3">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div className="font-display text-3xl font-extrabold text-white">
              95%
            </div>
            <div className="text-sm text-violet-100 font-medium">
              {lang === "fil" ? "Nakakakuha ng Trabaho" : "Job Placement"}
            </div>
          </div>
        </div>
      </section>
```

Note: Add `Award` and `DollarSign` to the Lucide imports at the top of the file if not already present. Also add `xs:grid-cols-2` - if Tailwind doesn't have `xs` by default, use `grid-cols-2` directly since the cards are already readable on small screens, or add a custom breakpoint. Actually, 2-column stat cards with `gap-3` and `p-6` inside should be fine even on 320px screens. Let's just use `grid-cols-2` without `xs:` to keep it simple.

So change to `className="grid grid-cols-2 gap-3"`.

- [ ] **Step 3: Verify landing page renders with new hero and stats**

Run dev server, check landing page. Expected: Hero has soft blue blobs behind it. Stats are 4 gradient cards (blue, emerald, amber, purple) with white text and icons. No overflow or horizontal scroll.

- [ ] **Step 4: Commit**

```bash
git add src/components/LandingPage.tsx
git commit -m "feat: redesign landing hero and stats with gradient cards and animated blobs"
```

---

## Task 5: Landing Page - Timeline Fix & Quick Actions

**Files:**
- Modify: `src/components/LandingPage.tsx`

**Context:** Fix the "line beside the number" bug by replacing absolute positioning with a flex-column timeline. Also update quick actions and trust badges.

- [ ] **Step 1: Replace journey steps with flex-based timeline**

Replace the journey steps section (lines 57-127) with:

```tsx
      {/* ========== JOURNEY STEPS SECTION ========== */}
      <section className="px-4 pb-4 animate-fade-in stagger-1" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display font-bold text-xl text-slate-900">
            {lang === "fil" ? "Ang Iyong Paglalakbay" : "Your Journey"}
          </h2>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="relative">
          {[
            {
              num: 1,
              title: lang === "fil" ? "Saan Ka Ngayon?" : "Where Are You Now?",
              desc:
                lang === "fil"
                  ? "Grade 10 grad? ALS completer? Huwag mag-alala — tinatanggap ng TESDA ang lahat. Ibahagi ang iyong kwento."
                  : "Junior high grad? ALS completer? No worries — TESDA accepts all. Share your story.",
              color: "blue",
            },
            {
              num: 2,
              title: lang === "fil" ? "Tuklasin ang Iyong Match" : "Discover Your Match",
              desc:
                lang === "fil"
                  ? "Sinusuri ng AI ang 300+ kurso sa 5 sektor para hanapin ang pinaka-akma sa iyong hilig at demand sa inyong lugar."
                  : "AI scans 300+ courses across 5 sectors to find what fits your interests and local demand.",
              color: "blue",
            },
            {
              num: 3,
              title: lang === "fil" ? "Libreng Pagsasanay" : "Free Training",
              desc:
                lang === "fil"
                  ? "Mag-enroll sa anumang TESDA center. Walang bayad. May ₱160/araw na allowance para sa pamasahe at pagkain."
                  : "Enroll at any TESDA center. Zero tuition. Plus ₱160/day allowance for transport and food.",
              color: "blue",
            },
            {
              num: 4,
              title: lang === "fil" ? "Maging Certified, Makakuha ng Trabaho" : "Get Certified, Get Hired",
              desc:
                lang === "fil"
                  ? "Makuha ang iyong NC II certificate. Sumali sa 95% ng mga graduate na nakakakuha ng trabaho sa loob ng 6 na buwan."
                  : "Earn your NC II certificate. Join the 95% of graduates who land jobs within 6 months.",
              color: "emerald",
            },
          ].map((step, idx) => (
            <div key={step.num} className="flex gap-4">
              {/* Left track */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white z-10 ${
                    step.color === "emerald" ? "bg-emerald-500" : "bg-blue-600"
                  }`}
                >
                  {step.num}
                </div>
                {idx < 3 && (
                  <div className="w-0.5 flex-grow bg-blue-200 min-h-[40px]" />
                )}
              </div>

              {/* Right card */}
              <div
                className={`accent-card accent-${step.color} p-5 mb-3 flex-grow animate-fade-in`}
                style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
              >
                <h4 className="font-display font-bold text-slate-900 mb-1">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
```

- [ ] **Step 2: Update quick actions with new styling**

Replace the quick actions section (lines 159-188) with:

```tsx
      {/* ========== QUICK ACTIONS SECTION ========== */}
      <section className="px-4 pb-4 animate-fade-in stagger-4" style={{ animationDelay: "0.4s" }}>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display font-bold text-xl text-slate-900">
            {lang === "fil" ? "Magsimula" : "Get Started"}
          </h2>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setCurrentTab("match")}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 touch-manipulation min-h-[56px]"
          >
            <Sparkles className="h-5 w-5" />
            {lang === "fil" ? "AI Course Matching" : "AI Course Matching"}
          </button>

          <button
            onClick={() => setCurrentTab("chat")}
            className="w-full rounded-2xl border-2 border-blue-200 bg-white py-4 text-base font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 touch-manipulation min-h-[56px]"
          >
            <MessageSquare className="h-5 w-5 text-blue-600" />
            {lang === "fil" ? "Tanungin ang AI Counselor" : "Ask AI Counselor"}
          </button>

          <button
            onClick={() => setCurrentTab("explorer")}
            className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 text-base font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 touch-manipulation min-h-[56px]"
          >
            <Search className="h-5 w-5 text-slate-500" />
            {lang === "fil" ? "Tignan ang Lahat ng Kurso" : "Browse All Courses"}
          </button>
        </div>
      </section>
```

- [ ] **Step 3: Update trust badges with higher visibility**

Replace the trust badges section (lines 190-206) with:

```tsx
      {/* ========== TRUST BADGES ========== */}
      <section className="px-4 pb-4 animate-fade-in stagger-4" style={{ animationDelay: "0.4s" }}>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
              <Shield className="h-3 w-3 text-blue-600" />
            </div>
            {lang === "fil" ? "Suportado ng Gobyerno" : "Gov't Backed"}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">
              <Lock className="h-3 w-3 text-emerald-600" />
            </div>
            {lang === "fil" ? "Libre Forever" : "Free Forever"}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-amber-100 flex items-center justify-center">
              <Smartphone className="h-3 w-3 text-amber-600" />
            </div>
            {lang === "fil" ? "Mobile Friendly" : "Mobile Friendly"}
          </div>
        </div>
      </section>
```

- [ ] **Step 4: Remove navigation hint section (redundant with bottom nav)**

Delete the navigation hint section (lines 208-216). The bottom tab bar makes this redundant on mobile, and desktop users see the top tabs.

- [ ] **Step 5: Verify landing page on mobile and desktop**

Check:
- Timeline connector lines are perfectly centered under number circles on all widths
- No horizontal scroll
- Quick action buttons are tall and easy to tap
- Trust badges are visible with colored icon backgrounds
- Content doesn't overflow on 320px wide viewport

- [ ] **Step 6: Commit**

```bash
git add src/components/LandingPage.tsx
git commit -m "feat: fix landing timeline alignment, update quick actions and trust badges"
```

---

## Task 6: Assessment Wizard - Validation Logic

**Files:**
- Modify: `src/components/AssessmentWizard.tsx` (lines 54-65 and related)

**Context:** `canProceed()` currently returns `true` for basic, interests, skills, goal. We need real validation with friendly inline messages.

- [ ] **Step 1: Add validation state and helper**

In `AssessmentWizard.tsx`, add a new state variable near the top (after `const [fadeIn, setFadeIn] = useState(true);`):

```tsx
const [validationError, setValidationError] = useState<string>("");
```

Replace the `canProceed()` function (lines 54-65) with:

```tsx
const canProceed = () => {
    setValidationError("");
    switch (currentStep) {
      case 'basic':
        if (!age || age < 15) {
          setValidationError(lang === 'fil' ? "Piliin ang edad mo (15 pataas)." : "Please select your age (15+).");
          return false;
        }
        if (!selectedRegion) {
          setValidationError(lang === 'fil' ? "Piliin ang rehiyon mo." : "Please select your region.");
          return false;
        }
        return true;
      case 'interests':
        if (customInterests.length === 0) {
          setValidationError(lang === 'fil' ? "Piliin kahit isa, para mas maigi ang results mo!" : "Pick at least one so we can give you better results!");
          return false;
        }
        return true;
      case 'skills':
        // Skills are optional — always allow proceed, but show a gentle nudge if empty
        return true;
      case 'goal':
        if (!careerGoal || careerGoal.trim().length < 5) {
          setValidationError(lang === 'fil' ? "I-type ang plano mo (kahit 5 letters)." : "Type your goal (at least 5 letters).");
          return false;
        }
        return true;
      case 'review':
        if (customInterests.length === 0 && (!careerGoal || careerGoal.trim().length < 5)) {
          setValidationError(lang === 'fil' ? "Kailangan ng interes o plano para mag-match." : "Need at least interests or a goal to match.");
          return false;
        }
        return true;
      case 'processing': return false;
      case 'results': return false;
      default: return true;
    }
  };
```

- [ ] **Step 2: Update nextStep to show validation error and disable button visually**

The `nextStep` function (lines 75-80) should already call `canProceed()`. We need to make sure the Next button visually reflects the disabled state when `canProceed()` is false. Find the Next button in the wizard's step footer and add a disabled style check.

Find the button that calls `nextStep` (look for `onClick={nextStep}`). Add conditional class logic:

```tsx
const isNextDisabled = !canProceed();
// We need to call canProceed without setting error on every render, so instead:
```

Actually, we should separate the validation check from the error setting. Let's refactor:

Replace `canProceed` with a pure validation function that returns `{ valid: boolean, error: string }`:

```tsx
const getStepValidation = () => {
    switch (currentStep) {
      case 'basic':
        if (!age || age < 15) {
          return { valid: false, error: lang === 'fil' ? "Piliin ang edad mo (15 pataas)." : "Please select your age (15+)." };
        }
        if (!selectedRegion) {
          return { valid: false, error: lang === 'fil' ? "Piliin ang rehiyon mo." : "Please select your region." };
        }
        return { valid: true, error: "" };
      case 'interests':
        if (customInterests.length === 0) {
          return { valid: false, error: lang === 'fil' ? "Piliin kahit isa, para mas maigi ang results mo!" : "Pick at least one so we can give you better results!" };
        }
        return { valid: true, error: "" };
      case 'skills':
        return { valid: true, error: "" };
      case 'goal':
        if (!careerGoal || careerGoal.trim().length < 5) {
          return { valid: false, error: lang === 'fil' ? "I-type ang plano mo (kahit 5 letters)." : "Type your goal (at least 5 letters)." };
        }
        return { valid: true, error: "" };
      case 'review':
        if (customInterests.length === 0 && (!careerGoal || careerGoal.trim().length < 5)) {
          return { valid: false, error: lang === 'fil' ? "Kailangan ng interes o plano para mag-match." : "Need at least interests or a goal to match." };
        }
        return { valid: true, error: "" };
      case 'processing':
      case 'results':
        return { valid: false, error: "" };
      default:
        return { valid: true, error: "" };
    }
  };

const canProceed = () => {
    const validation = getStepValidation();
    if (!validation.valid) {
      setValidationError(validation.error);
    }
    return validation.valid;
  };
```

Then in the render, find the Next button and add:

```tsx
const { valid: isNextValid } = getStepValidation();
```

And modify the Next button className:
```tsx
className={`... ${!isNextValid ? 'opacity-50 cursor-not-allowed' : ''}`}
```

- [ ] **Step 3: Add inline validation error message UI**

Find where the wizard renders the step footer (the area with Prev/Next buttons). Add the validation error message just above the buttons:

```tsx
{validationError && (
  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm mb-4">
    <AlertCircle className="h-4 w-4 flex-shrink-0" />
    <span>{validationError}</span>
  </div>
)}
```

Make sure `AlertCircle` is imported from `lucide-react` (it already is in the current imports).

- [ ] **Step 4: Add "Skip" button on skills step**

Find the skills step content in the render. Add a skip button that sets skills to empty and proceeds:

```tsx
<button
  onClick={() => {
    setCustomSkills([]);
    nextStep();
  }}
  className="text-sm text-slate-500 underline hover:text-slate-700 transition-colors"
>
  {lang === 'fil' ? "Walang skill? I-skip muna" : "No skills? Skip for now"}
</button>
```

Place this near the skills tags or at the bottom of the skills section.

- [ ] **Step 5: Clear validation error when user navigates to a different step**

Add to `goToStep`:
```tsx
setValidationError("");
```

- [ ] **Step 6: Verify validation works**

Test on dev server:
1. Go to AI Matcher, click Next on Basic without setting age/region → should see error, stay on step
2. Set age and region, click Next → proceeds to Interests
3. Click Next without selecting interests → error
4. Select an interest, click Next → proceeds to Skills
5. On Skills, click Skip → proceeds to Goal
6. On Goal, type less than 5 chars, click Next → error
7. Type 5+ chars, click Next → proceeds to Review

- [ ] **Step 7: Commit**

```bash
git add src/components/AssessmentWizard.tsx
git commit -m "feat: add step-by-step validation to assessment wizard with friendly inline errors"
```

---

## Task 7: Assessment Wizard - Mobile Step Indicators & Visual Polish

**Files:**
- Modify: `src/components/AssessmentWizard.tsx`

**Context:** The step indicator bar is a horizontal row of dots that wraps awkwardly on mobile. Replace with a progress bar + step label on mobile. Keep dots on desktop.

- [ ] **Step 1: Replace step indicator with responsive progress bar**

Find the step indicator JSX (search for `stepOrder.map` or `stepLabels`). Replace the entire step indicator section with:

```tsx
      {/* Step indicator - Mobile: progress bar + label, Desktop: dots */}
      <div className="mb-6">
        {/* Mobile progress bar */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'fil' ? `Hakbang ${stepIndex + 1} ng ${stepOrder.length}` : `Step ${stepIndex + 1} of ${stepOrder.length}`}
            </span>
            <span className="text-xs font-bold text-blue-600">
              {stepLabels[currentStep]}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${((stepIndex + 1) / stepOrder.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop step dots */}
        <div className="hidden md:flex items-center justify-center gap-2">
          {stepOrder.map((step, idx) => (
            <button
              key={step}
              onClick={() => {
                if (idx <= stepIndex) goToStep(step);
              }}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                idx === stepIndex
                  ? "bg-blue-600 text-white shadow-md"
                  : idx < stepIndex
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-400"
              }`}
              disabled={idx > stepIndex}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                idx === stepIndex ? "bg-white text-blue-600" : ""
              }`}>
                {idx < stepIndex ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  idx + 1
                )}
              </span>
              <span className="hidden lg:inline">{stepLabels[step]}</span>
            </button>
          ))}
        </div>
      </div>
```

Make sure `CheckCircle2` is imported from `lucide-react` (it already is).

- [ ] **Step 2: Add color-coded top accent bar to each step card**

Find the main content wrapper for each step (the card that wraps the step content). It likely has `className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"`. Add a top accent bar by wrapping it or adding a pseudo-element.

Simplest approach: add a small div at the top of each step card:

```tsx
const stepColors: Record<WizardStep, string> = {
  basic: 'bg-blue-500',
  interests: 'bg-amber-500',
  skills: 'bg-purple-500',
  goal: 'bg-emerald-500',
  review: 'bg-slate-500',
  processing: 'bg-blue-500',
  results: 'bg-emerald-500',
};
```

Then in each step's render, add at the top of the card:
```tsx
<div className={`h-1.5 rounded-t-2xl ${stepColors[currentStep]} mb-6`} />
```

Or if the card doesn't have a rounded-t-2xl, add it to the card's className and include the top bar as a child:

```tsx
<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
  <div className={`h-1.5 ${stepColors[currentStep]}`} />
  <div className="p-6">
    {/* step content */}
  </div>
</div>
```

Apply this wrapper to every step's content area.

- [ ] **Step 3: Redesign tag buttons for interests/skills**

Find the tag buttons (likely using `toggleInterestTag` or `toggleSkillTag`). Update the selected/unselected styles:

```tsx
className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all touch-manipulation ${
  isSelected
    ? "bg-blue-600 text-white shadow-sm"
    : "bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
}`}
```

When selected, add a check icon:
```tsx
{isSelected && <Check className="h-3.5 w-3.5" />}
```

Make sure `Check` is imported from `lucide-react` (it already is).

For skills tags, use the same pattern but with purple when selected:
```tsx
? "bg-purple-600 text-white shadow-sm"
```

- [ ] **Step 4: Redesign input fields with thicker border and focus ring**

Find input fields (age, interestInput, skillInput, careerGoal textarea). Update className:

```tsx
className="... border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
```

For the career goal textarea:
```tsx
className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
```

- [ ] **Step 5: Redesign processing step with animated text**

Replace the processing step content with a more engaging spinner and cycling text:

```tsx
const processingSteps = lang === 'fil'
  ? [
      "Sinusuri ang iyong profile...",
      "Tinitignan ang 300+ kurso...",
      "Sinusuri ang demand sa iyong rehiyon...",
      "Pini-finalize ang top matches...",
    ]
  : [
      "Analyzing your profile...",
      "Matching with 300+ courses...",
      "Checking job demand in your region...",
      "Finalizing your top matches...",
    ];

const [processingStepIndex, setProcessingStepIndex] = useState(0);

useEffect(() => {
  if (currentStep !== 'processing') return;
  const interval = setInterval(() => {
    setProcessingStepIndex((prev) => (prev + 1) % processingSteps.length);
  }, 2000);
  return () => clearInterval(interval);
}, [currentStep, lang]);
```

Then in the processing step render:

```tsx
<div className="text-center py-12">
  <div className="relative w-16 h-16 mx-auto mb-6">
    <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
    <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
  </div>
  <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
    {lang === 'fil' ? 'Sinusuri ng AI...' : 'AI is analyzing...'}
  </h3>
  <p className="text-slate-500 transition-opacity duration-500" key={processingStepIndex}>
    {processingSteps[processingStepIndex]}
  </p>
</div>
```

- [ ] **Step 6: Verify wizard on mobile and desktop**

Check:
- Mobile: progress bar at top, step label, no dot overflow
- Desktop: dot step indicators with labels, clickable previous steps
- Each step card has a colored top accent bar
- Input fields have thicker borders and blue focus ring
- Tag buttons have filled selected state with check icon
- Processing step cycles through 4 text messages with spinner
- No horizontal scroll on any step

- [ ] **Step 7: Commit**

```bash
git add src/components/AssessmentWizard.tsx
git commit -m "feat: redesign wizard step indicators, inputs, tags, and processing animation"
```

---

## Task 8: App.tsx Container & Layout Adjustments

**Files:**
- Modify: `src/App.tsx`

**Context:** Adjust main container to prevent stretched layout, add overflow-x-hidden, and ensure safe area padding.

- [ ] **Step 1: Adjust main container max-widths and overflow**

Find the main wrapper in `App.tsx` (the div that wraps the tab content). It likely has `className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12"`. Change to:

```tsx
className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 overflow-x-hidden pb-24 md:pb-0"
```

Also add `overflow-x-hidden` to the outermost app wrapper if there isn't one already. Find the outermost div in the render and add:

```tsx
className="min-h-screen bg-slate-50 overflow-x-hidden"
```

- [ ] **Step 2: Ensure all tabs use consistent padding**

Review the inline-rendered tabs in `App.tsx` (explorer, chat, jobs, faq). Make sure each uses `px-4` minimum and `max-w-5xl mx-auto` if they have their own wrapper. If a tab has a different wrapper, update it to match.

- [ ] **Step 3: Add safe area awareness to main container**

If the outermost wrapper doesn't already have safe area padding, add:

```tsx
className="min-h-screen bg-slate-50 overflow-x-hidden safe-area-top safe-area-bottom"
```

Wait, `safe-area-bottom` would add extra padding at the bottom of the whole page. The bottom nav already has `safe-area-bottom`. We only need `safe-area-top` on the main scrollable area. Actually, the top header already has `safe-area-top`. So we don't need it on the main container. Skip this.

- [ ] **Step 4: Verify app layout on mobile and desktop**

Check all 6 tabs on mobile viewport:
- No horizontal scroll
- Content is not stretched (max-w-5xl is comfortable)
- Bottom padding (`pb-24`) ensures content is visible above bottom nav
- On desktop, no extra bottom padding

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat: adjust app container max-widths, overflow, and mobile padding"
```

---

## Task 9: Explorer Mobile Sidebar (Optional Polish)

**Files:**
- Modify: `src/App.tsx` (the explorer tab inline render)

**Context:** The explorer sidebar uses `grid-cols-1 lg:grid-cols-12` which is fine on mobile (stacked), but the sector list on the left takes up a lot of vertical space before the user sees content. Let's convert it to a horizontal chip list on mobile.

- [ ] **Step 1: Find the explorer tab render in App.tsx**

Search for `explorer` in `App.tsx` to find the inline rendered explorer UI.

- [ ] **Step 2: Wrap the sector list in a responsive container**

The sector list is likely a vertical list on the left side. On mobile, wrap it in:

```tsx
<div className="flex overflow-x-auto gap-2 pb-2 md:hidden">
  {SECTORS_DATA.map((sector) => (
    <button
      key={sector.name}
      onClick={() => setSelectedSector(sector.name)}
      className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
        selectedSector === sector.name
          ? "bg-blue-600 text-white shadow-sm"
          : "bg-white border border-slate-200 text-slate-600"
      }`}
    >
      {sector.name}
    </button>
  ))}
</div>
```

And keep the original vertical list for desktop with `hidden md:block`.

- [ ] **Step 3: Verify explorer on mobile**

Check mobile viewport. Sectors should be a horizontal scrollable chip list. Tapping a chip updates the right panel.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: convert explorer sidebar to horizontal chips on mobile"
```

---

## Self-Review

**1. Spec coverage:**

| Spec Section | Plan Task |
|--------------|-----------|
| CSS utilities (safe area, tap, gradients, blobs, reduced motion) | Task 1 |
| Navbar compact top header + overflow menu | Task 2 |
| Bottom tab bar | Task 3 |
| Landing hero + stats redesign | Task 4 |
| Landing timeline fix + quick actions + trust badges | Task 5 |
| Wizard validation | Task 6 |
| Wizard step indicators + visual polish | Task 7 |
| App container adjustments | Task 8 |
| Explorer mobile sidebar | Task 9 |

All spec requirements are covered. No gaps found.

**2. Placeholder scan:**
- No "TBD", "TODO", "implement later" found.
- No vague "add error handling" or "write tests" without code.
- All code blocks contain actual Tailwind class strings and JSX.
- No "Similar to Task N" references.

**3. Type consistency:**
- `currentTab`, `setCurrentTab`, `lang`, `setLang` prop types are consistent across all components (string, function, "fil" | "en", function).
- `WizardStep` type is used from `../types` consistently.
- Lucide icon imports are consistent and match the component names used.

**No issues found. Plan is ready.**
