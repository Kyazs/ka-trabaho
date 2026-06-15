---
phase: quick
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/LandingPage.tsx
  - src/index.css
  - src/components/PageHeader.tsx
  - src/App.tsx
autonomous: true
requirements: []
user_setup: []
must_haves:
  truths:
    - "LandingPage.tsx renders the new ka-trabaho desktop design from katrabaho_landing_page_desktop.html"
    - "CTA buttons navigate to the correct tabs (match, explorer, chat) via setCurrentTab"
    - "Component compiles with TypeScript and the production build passes"
    - "Mobile layout stacks vertically without horizontal overflow"
    - "All Tabler icons are replaced with Lucide equivalents; no ti-* classes remain"
    - "Bilingual Taglish/English text is preserved using the existing lang prop"
    - "Shared tab chrome (PageHeader) aligns with the new deep-blue/gold palette"
  artifacts:
    - path: "src/components/LandingPage.tsx"
      provides: "Full landing page React component with hero, trust strip, how-it-works, features, stats, CTA, footer"
      exports: ["default function LandingPage"]
    - path: "src/index.css"
      provides: "New ka-trabaho color tokens and blink cursor animation"
      contains: "--kt-blue, --kt-gold, @keyframes blink"
    - path: "src/components/PageHeader.tsx"
      provides: "Shared tab header using the new visual direction"
      min_lines: 80
  key_links:
    - from: "src/components/LandingPage.tsx"
      to: "Navbar.tsx"
      via: "App.tsx renders Navbar above LandingPage"
      pattern: "Navbar is already provided by App.tsx, so LandingPage must NOT duplicate nav"
    - from: "src/components/LandingPage.tsx"
      to: "setCurrentTab"
      via: "onClick handlers"
      pattern: "setCurrentTab(\"match\"), setCurrentTab(\"explorer\"), setCurrentTab(\"chat\")"
---

<objective>
Replace the existing LandingPage.tsx with the design from `src/components/katrabaho_landing_page_desktop.html` and align the shared tab chrome with the same deep-blue/gold visual direction.

Purpose: Upgrade the landing page to the refined desktop mockup while keeping the existing props contract and tab navigation intact.
Output: A bilingual, mobile-first LandingPage component; updated global tokens/animations; and a refreshed PageHeader used across match/explorer/chat/jobs/faq tabs.
</objective>

<execution_context>
@C:/Users/LENOVO/Downloads/tesda-skills-to-jobs-matcher/.opencode/skills/sketch-findings-tesda-skills-to-jobs-matcher/SKILL.md
</execution_context>

<context>
@src/components/katrabaho_landing_page_desktop.html
@src/components/LandingPage.tsx
@src/App.tsx
@src/components/Navbar.tsx
@src/components/PageHeader.tsx
@src/index.css
</context>

<tasks>

<task type="auto">
  <name>Task 1: Port katrabaho desktop HTML to LandingPage.tsx</name>
  <files>src/components/LandingPage.tsx</files>
  <action>
    Replace the entire LandingPage.tsx with a React + TypeScript implementation that mirrors the HTML mockup. Preserve the exact props interface: { lang: "fil" | "en"; setCurrentTab: (tab: string) => void }. Use Tailwind CSS utility classes for all styling; do not leave inline &lt;style&gt; blocks or raw HTML. Do NOT render the HTML nav bar inside the component because App.tsx already renders Navbar.tsx above it; include the footer at the bottom. Map every ti-* icon to a Lucide equivalent: ti-sparkles → Sparkles, ti-cpu → Cpu, ti-shield-check → ShieldCheck, ti-currency-peso → Coins, ti-school → GraduationCap, ti-map-pin → MapPin, ti-user-circle → UserCircle, ti-brain → Brain, ti-calendar → Calendar, ti-certificate → Award, ti-briefcase → Briefcase, ti-message-chatbot → BotMessageSquare (or MessageSquare), ti-coin → Coins, ti-search → Search, ti-bolt → Zap. Keep bilingual support: use the lang prop to switch all visible text between Taglish and English. Wire all CTA buttons to setCurrentTab with the correct tab ids: "match" for the assessment buttons, "explorer" for course browsing, and "chat" for counselor chat. Keep the design tokens (deep blue #0F3D91, gold #FCD116, near-black #1A1A2E, etc.) consistent with the HTML. No emoji, no Tabler classes, no duplicated navbar.
  </action>
  <verify>
    <automated>npm run build</automated>
    <automated>npx tsc --noEmit</automated>
  </verify>
  <done>LandingPage.tsx renders hero, trust strip, how-it-works, features, stats, CTA, and footer; bilingual; all icons are Lucide; no ti-* classes; no duplicate nav; CTAs navigate to match/explorer/chat.</done>
</task>

<task type="auto">
  <name>Task 2: Add ka-trabaho design tokens and animations to index.css</name>
  <files>src/index.css</files>
  <action>
    Add CSS custom properties under :root for the new palette: --kt-blue (#0F3D91), --kt-blue-mid (#1a52c4), --kt-blue-light (#E8F0FE), --kt-blue-soft (#d4e3ff), --kt-gold (#FCD116), --kt-gold-dark (#c9a700), --kt-near-black (#1A1A2E), --kt-slate (#6B7280), --kt-border (#e5e8ef), --kt-bg (#F8F9FC). Add a @keyframes blink rule for the cursor in the hero question card and a .animate-blink utility. Ensure the existing Plus Jakarta Sans and Inter fonts remain loaded. Keep the existing Tailwind @theme and custom utilities; add new utilities only if needed (e.g., .kt-container for the 1100px centered page wrapper). Verify no conflicts with existing --color-* Tailwind variables.
  </action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>index.css contains the new color tokens and blink animation; CSS compiles; no broken existing styles.</done>
</task>

<task type="auto">
  <name>Task 3: Align PageHeader and tab page chrome with the new landing page style</name>
  <files>src/components/PageHeader.tsx, src/App.tsx</files>
  <action>
    Update PageHeader.tsx so its accent-card styling uses the new ka-trabaho visual direction: deep blue (#0F3D91) icon/action backgrounds, gold (#FCD116) highlights, rounded-2xl cards, and the subtle border/shadow style from the landing page. Replace the existing accent color mapping with the new palette (blue → blue-900, gold → amber-400) so the shared header feels cohesive with the landing page hero. Update App.tsx only if needed to adjust the PAGE_HEADER_CONTENT accent values or to add a compact trust-strip-style banner below the match tab header; keep tab body content unchanged. Do not change the PageHeader props interface. Keep all navigation working.
  </action>
  <verify>
    <automated>npm run build</automated>
    <automated>npx tsc --noEmit</automated>
  </verify>
  <done>PageHeader renders with the new deep-blue/gold palette; tab headers across match/explorer/chat/jobs/faq look aligned with the landing page; build and TypeScript pass.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Client UI | Trusted component rendering; no external data crosses this boundary in this plan. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-QUICK-01 | Information Disclosure | LandingPage.tsx | accept | Content is static marketing copy; no PII or secrets. |
| T-QUICK-02 | Denial of Service | index.css | accept | New CSS is static and small; no user-controlled input. |
| T-QUICK-SC | Tampering | npm installs | mitigate | No new packages required; if any install is needed, slopcheck before proceeding. |
</threat_model>

<verification>
- `npm run build` passes with no TypeScript or bundling errors.
- `npx tsc --noEmit` passes.
- Landing page renders hero, trust strip, how-it-works, features, stats, CTA, and footer.
- All CTAs correctly call `setCurrentTab` for "match", "explorer", and "chat".
- No `ti-*` Tabler classes remain in the changed components.
- Mobile view stacks vertically without horizontal scroll.
- PageHeader on other tabs uses the new deep-blue/gold palette.
</verification>

<success_criteria>
- LandingPage.tsx is a drop-in replacement that preserves the existing props interface and tab navigation.
- The component visually matches the katrabaho_landing_page_desktop.html design (hero, trust strip, steps, features, stats, CTA, footer).
- Taglish/English bilingual support works via the existing `lang` prop.
- Lucide icons replace all Tabler icons.
- The shared PageHeader aligns with the new visual direction.
- Build and TypeScript checks pass.
</success_criteria>

<output>
Create `.planning/quick/260615-ryj-copy-the-katrabaho-landing-page-desktop-/260615-ryj-SUMMARY.md` when done.
</output>
