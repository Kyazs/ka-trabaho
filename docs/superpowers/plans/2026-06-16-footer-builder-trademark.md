# Footer Builder Trademark Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing basic footer in Ka-TrabaHO with a full two-zone structured footer that includes navigation, social links, and a builder trademark credit for John Casper Santos.

**Architecture:** Create a new `Footer.tsx` component with bilingual copy, social pill chips, nav links, and a builder credit bar. Replace the existing App.tsx footer (lines 1664-1683) and remove the LandingPage.tsx inline footer (lines 455-464). The new footer renders on all tabs except chat (matching current behavior).

**Tech Stack:** React, Tailwind CSS (kt-* custom tokens), React Router `<Link>`, Lucide React icons

---

### Task 1: Create Footer Component

**Files:**
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Write the Footer component**

```tsx
import { Link } from "react-router-dom";
import { Github, Globe, Linkedin } from "lucide-react";

interface FooterProps {
  lang: "fil" | "en";
}

const COPY = {
  tagline: {
    fil: "Ginawa para sa mga kabataang Pilipino — AI-powered na gabay sa TESDA courses at trabaho, libre.",
    en: "Made for Filipino youth — AI-powered guide to TESDA courses and jobs, free.",
  },
  copyright: {
    fil: "© 2025 Ka-TrabaHO · Sinusuportahan ng TESDA data",
    en: "© 2025 Ka-TrabaHO · Supported by TESDA data",
  },
  navLabel: { fil: "Mag-navigate", en: "Navigate" },
  legalLabel: { fil: "Legal", en: "Legal" },
  privacy: { fil: "Privacy", en: "Privacy" },
  accessibility: { fil: "Accessibility", en: "Accessibility" },
  dataPolicy: { fil: "Data Policy", en: "Data Policy" },
  builtBy: { fil: "Ginawa ni John Casper Santos", en: "Built by John Casper Santos" },
  github: { fil: "GitHub", en: "GitHub" },
  portfolio: { fil: "Portfolio", en: "Portfolio" },
  linkedin: { fil: "LinkedIn", en: "LinkedIn" },
};

const NAV_LINKS = [
  { key: "assessment", to: "/match" },
  { key: "explorer", to: "/explorer" },
  { key: "jobs", to: "/jobs" },
  { key: "chat", to: "/chat" },
  { key: "faq", to: "/faq" },
] as const;

const NAV_LABELS = {
  assessment: { fil: "Assessment", en: "Assessment" },
  explorer: { fil: "Course Explorer", en: "Course Explorer" },
  jobs: { fil: "Job Market", en: "Job Market" },
  chat: { fil: "Chat kay Ka-TrabaHO", en: "Chat with Ka-TrabaHO" },
  faq: { fil: "FAQ", en: "FAQ" },
};

const SOCIAL_LINKS = [
  { key: "github" as const, href: "https://github.com/Kyazs", Icon: Github },
  { key: "portfolio" as const, href: "https://www.caspersantos.dev/", Icon: Globe },
  { key: "linkedin" as const, href: "https://www.linkedin.com/in/jcasper-santos/", Icon: Linkedin },
];

export default function Footer({ lang }: FooterProps) {
  const t = (obj: { fil: string; en: string }) => obj[lang];

  return (
    <footer className="border-t border-kt-border bg-kt-bg">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 md:justify-between">
          {/* Left Zone */}
          <div className="min-w-0 md:max-w-[340px]">
            <div className="font-display text-xl font-extrabold text-kt-blue">
              ka-traba<span className="text-kt-gold">HO</span>
            </div>
            <p className="text-[13px] text-kt-slate leading-[1.7] mt-3 max-w-[320px]">
              {t(COPY.tagline)}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {SOCIAL_LINKS.map(({ key, href, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-kt-blue-light text-kt-blue text-xs font-semibold px-3 py-1.5 rounded-full border border-kt-blue-soft hover:bg-kt-blue-soft transition-colors min-h-[36px] touch-manipulation"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t(COPY[key])}
                </a>
              ))}
            </div>
          </div>

          {/* Right Zone */}
          <div className="flex gap-10 md:gap-12">
            {/* Navigate Column */}
            <div>
              <div className="text-xs font-bold text-kt-slate uppercase tracking-[0.08em] mb-3">
                {t(COPY.navLabel)}
              </div>
              <nav aria-label={t(COPY.navLabel)}>
                <ul className="space-y-1.5">
                  {NAV_LINKS.map(({ key, to }) => (
                    <li key={key}>
                      <Link
                        to={to}
                        className="text-[13px] text-kt-near-black font-medium hover:text-kt-blue transition-colors min-h-[44px] inline-flex items-center"
                      >
                        {t(NAV_LABELS[key])}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Legal Column */}
            <div>
              <div className="text-xs font-bold text-kt-slate uppercase tracking-[0.08em] mb-3">
                {t(COPY.legalLabel)}
              </div>
              <ul className="space-y-1.5">
                {(["privacy", "accessibility", "dataPolicy"] as const).map((key) => (
                  <li key={key}>
                    <a
                      href="#"
                      className="text-[13px] text-kt-near-black font-medium hover:text-kt-blue transition-colors min-h-[44px] inline-flex items-center"
                      onClick={(e) => e.preventDefault()}
                    >
                      {t(COPY[key])}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-kt-border mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span className="text-xs text-kt-slate">{t(COPY.copyright)}</span>
          <span className="text-xs text-kt-blue font-bold">{t(COPY.builtBy)}</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit src/components/Footer.tsx`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: add Footer component with builder trademark"
```

---

### Task 2: Integrate Footer into App.tsx

**Files:**
- Modify: `src/App.tsx:1-36` (add import), `src/App.tsx:1664-1683` (replace existing footer)

- [ ] **Step 1: Add Footer import to App.tsx**

At the top of App.tsx, add the import alongside other component imports (after the BottomNav import on line 35):

```tsx
import Footer from "./components/Footer";
```

- [ ] **Step 2: Replace existing footer block (lines 1664-1683) with new Footer component**

Replace:
```tsx
      {/* Footer Branding Area */}
      {currentTab !== "chat" && (
      <footer id="app-footer" className="mt-20 border-t border-kt-border bg-kt-bg py-12 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-kt-blue">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-xl font-extrabold text-kt-near-black">
              Ka-Traba<span className="text-kt-gold">HO</span>
            </span>
          </div>
          <p className="font-bold text-kt-near-black text-base">Ka-TrabaHO Career Guidance System</p>
          <p className="text-sm text-kt-slate max-w-lg mx-auto leading-relaxed">{lang === "fil" ? "Hindi opisyal ngunit magalang na sumusuporta sa mga kabataang Pilipino na kumuha ng libreng TESDA vocational training." : "Unofficial yet respectfully supporting Filipino youth in accessing free TESDA vocational training."}</p>
          <div className="pt-4 border-t border-kt-border mt-6">
            <p className="text-xs text-kt-slate">{lang === "fil" ? "Platform na ginawa gamit ang AI support at lokal na job insights." : "Platform built using AI support and local job insights."}</p>
          </div>
        </div>
       </footer>
      )}
```

With:
```tsx
      {currentTab !== "chat" && <Footer lang={lang} />}
```

- [ ] **Step 3: Verify the app builds**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: integrate two-zone Footer with builder trademark into App"
```

---

### Task 3: Remove Inline Footer from LandingPage.tsx

**Files:**
- Modify: `src/components/LandingPage.tsx:455-464` (remove inline footer), `src/components/LandingPage.tsx:160-161` (remove unused copy keys)

- [ ] **Step 1: Remove the inline footer block from LandingPage.tsx**

Delete lines 455-464 (the `{/* ========== FOOTER ========== */}` section through `</footer>`).

- [ ] **Step 2: Remove unused footer copy keys**

In the `copy` object (around line 160-161), remove:
```ts
  footerMeta: { fil: "Ginawa para sa mga kabataang Pilipino · SK Guiwan · 2025", en: "Made for Filipino youth · SK Guiwan · 2025" },
  footerData: { fil: "Sinusuportahan ng TESDA data", en: "Supported by TESDA data" },
```

- [ ] **Step 3: Verify the app builds**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/LandingPage.tsx
git commit -m "refactor: remove inline footer from LandingPage (now using shared Footer)"
```

---

### Task 4: Visual Verification

**Files:** None (verification only)

- [ ] **Step 1: Start dev server and visually verify**

Run: `npm run dev`

Check:
- Footer appears on landing, match, explorer, jobs, and faq tabs
- Footer does NOT appear on chat tab (existing behavior preserved)
- Bilingual switching works (toggle TL/EN — all footer text switches)
- Social pills link to correct URLs (open in new tab)
- Navigate links route to correct tabs
- Builder credit "Built by John Casper Santos" / "Ginawa ni John Casper Santos" visible in bottom bar
- Mobile stacking: zones stack vertically on small screens
- No z-index conflict with BottomNav on mobile
- Legal links are present but non-functional (href="#", preventDefault)

- [ ] **Step 2: Commit any fixes if needed**

If any visual issues found, fix and commit with:
```bash
git commit -m "fix: footer visual adjustments"
```
