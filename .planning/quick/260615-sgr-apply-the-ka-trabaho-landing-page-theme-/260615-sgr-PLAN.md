---
phase: "quick-260615-sgr"
plan: "01"
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/AssessmentWizard.tsx
  - src/App.tsx
  - src/components/Navbar.tsx
  - src/components/BottomNav.tsx
autonomous: true
requirements: []
user_setup: []
must_haves:
  truths:
    - AssessmentWizard matches the ka-trabaho landing page palette, card style, and visual rhythm
    - Explorer, chat, jobs, and FAQ tab sections in App.tsx use the same ka-trabaho palette and card styling
    - Global footer uses the ka-trabaho blue/gold branding and matches the landing page footer style
    - Navbar and BottomNav remain functionally identical; only tiny cohesion tweaks are applied
    - npm run build and npx tsc --noEmit pass without errors
  artifacts:
    - path: src/components/AssessmentWizard.tsx
      provides: "Themed wizard UI (steps, inputs, chips, buttons, results cards, enrollment tips)"
    - path: src/App.tsx
      provides: "Themed explorer, chat, jobs, FAQ sections and footer"
    - path: src/components/Navbar.tsx
      provides: "Cohesive blue/gold nav styling if tweaked"
    - path: src/components/BottomNav.tsx
      provides: "Cohesive active state if tweaked"
  key_links:
    - from: "src/components/AssessmentWizard.tsx"
      to: "src/App.tsx"
      via: "rendered inside the match tab"
      pattern: "currentTab === \"match\""
    - from: "src/index.css"
      to: "src/components/AssessmentWizard.tsx and src/App.tsx"
      via: "shared CSS custom properties"
      pattern: "--kt-"
---

<objective>
Apply the ka-trabaho landing page visual theme (deep blue #0F3D91, gold #FCD116, near-black #1A1A2E, slate #6B7280, light backgrounds #F8F9FC, white rounded-2xl cards, soft shadows) to the remaining app surfaces: AssessmentWizard and the explorer, chat, jobs, and FAQ sections in App.tsx plus the global footer. Keep PageHeader as-is because it is already aligned with the landing page palette. Preserve all existing functionality, props, data structures, and bilingual text strings.

Purpose: Make the app feel like one cohesive ka-trabaho experience instead of a mismatched collection of pages.
Output: Themed components and a passing build.
</objective>

<execution_context>
@C:/Users/LENOVO/.config/opencode/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@src/components/LandingPage.tsx
@src/components/PageHeader.tsx
@src/components/AssessmentWizard.tsx
@src/App.tsx
@src/components/Navbar.tsx
@src/components/BottomNav.tsx
@src/index.css
@.planning/STATE.md
</context>

<interfaces>
PageHeader props interface from src/components/PageHeader.tsx:
```typescript
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
```
AssessmentWizard consumes the full `AssessmentWizardProps` from `src/types` and is rendered inside App.tsx's match tab. Do not change the props interface or the event handlers.
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Theme AssessmentWizard.tsx to ka-trabaho</name>
  <files>src/components/AssessmentWizard.tsx</files>
  <action>
    Update AssessmentWizard.tsx so every visual element follows the landing page ka-trabaho theme. Reference src/components/LandingPage.tsx for the exact visual language.

    - Background/page: keep the wizard container white with rounded-2xl, border #e5e8ef, and shadow-[0_4px_32px_rgba(15,61,145,0.07)].
    - Step indicator: replace the per-step amber/purple/emerald/slate colors with a single ka-trabaho blue (#0F3D91) active state, #E8F0FE completed state, and #e5e8ef inactive state. The mobile progress bar should use #0F3D91 fill on a #E8F0FE track.
    - Step headers/icons: replace gradient icon boxes with solid colored rounded-xl boxes using #0F3D91 (blue), #FCD116 (gold) for the review/check steps, and #16a34a (green) only for success/goal accents. Do not use Tailwind gradient classes for icon boxes.
    - Form inputs (range, select, textarea): use white bg, border #e5e8ef, focus:border #0F3D91, focus:ring #E8F0FE. The age badge should be bg-[#E8F0FE] text-[#0F3D91]. The range slider accent color should be #0F3D91 if possible (use accent-[#0F3D91] or the closest native accent color).
    - Quick-interest and quick-skill chips: selected state = bg-[#0F3D91] text-white; unselected state = bg-[#E8F0FE] text-[#0F3D91] border-[#d4e3ff]. The skills selected pills can keep a slightly different blue tint but must stay within the ka-trabaho palette (e.g. bg-[#E8F0FE] text-[#0F3D91]).
    - Custom add buttons: change from the slate gradient to ka-trabaho blue bg-[#0F3D91] hover:bg-[#1a52c4] text-white rounded-xl.
    - Navigation buttons (Back/Next): use #0F3D91 for the active next button, #E8F0FE/#0F3D91 for back, disabled uses #e5e8ef/#6B7280.
    - Review card: white rounded-2xl border #e5e8ef, labels use #6B7280, values use #1A1A2E, interest/skill pills use #E8F0FE/#0F3D91. The submit button should be bg-[#0F3D91] hover:bg-[#1a52c4] text-white; loading state uses #FCD116 gold text on a #fffbe6 bg; disabled state uses #e5e8ef border.
    - Processing spinner: blue ring (#0F3D91) on #E8F0FE track.
    - Results match badge: use #FCD116 gold for the percentage highlight text or border on a white card; the match score pill should be blue (#0F3D91) with white text or gold (#FCD116) with #1A1A2E text. Pick one consistent pattern.
    - Results cards: white rounded-2xl/rounded-3xl cards with border #e5e8ef, shadow-[0_4px_32px_rgba(15,61,145,0.07)], course code badge in #E8F0FE/#0F3D91, job icon box in #E8F0FE/#0F3D91. Buttons: primary "Itanong sa Chat" = bg-[#0F3D91] hover:bg-[#1a52c4]; secondary "Detalye" = border #d4e3ff text-[#0F3D91] hover:bg-[#E8F0FE].
    - Enrollment tips card: convert from dark slate to the ka-trabaho deep blue (#0F3D91) with white text, gold (#FCD116) accent icon, and white/10 translucent inner cards. Keep the same layout and text.
    - Error/alert cards: keep semantic red/amber colors but tone them to the ka-trabaho palette where possible (e.g. keep red-500/amber-500 for actual errors; do not introduce new bright colors).
    - Preserve all existing text, event handlers, props, IDs, and accessibility attributes. Do not change any Taglish/English strings.
    - No inline hex colors other than the ka-trabaho palette (#0F3D91, #FCD116, #1A1A2E, #6B7280, #e5e8ef, #F8F9FC, #ffffff, #E8F0FE, #d4e3ff, #1a52c4, #fffbe6, #92710a, #16a34a, #166534) or the colors already present in LandingPage.tsx.
  </action>
  <verify>
    <automated>cd "C:\Users\LENOVO\Downloads\tesda-skills-to-jobs-matcher" && npx tsc --noEmit</automated>
    <automated>cd "C:\Users\LENOVO\Downloads\tesda-skills-to-jobs-matcher" && npm run build</automated>
  </verify>
  <done>AssessmentWizard.tsx uses the ka-trabaho palette consistently, the wizard still renders all steps, and the build passes.</done>
</task>

<task type="auto">
  <name>Task 2: Theme App.tsx tab sections and global footer</name>
  <files>src/App.tsx</files>
  <action>
    Update App.tsx so the explorer, chat, jobs, and FAQ sections plus the global footer match the ka-trabaho landing page style. Do not change any logic, data structures, props, or text strings.

    - Main root background: change from bg-slate-50 to bg-[#F8F9FC]. Keep text-slate-800 only if it matches; otherwise switch body text to text-[#1A1A2E].
    - Explorer tab:
      - Search box: white rounded-2xl card with border #e5e8ef, shadow-[0_4px_32px_rgba(15,61,145,0.07)], search icon #6B7280, input focus #0F3D91.
      - Mobile sector chips: selected = bg-[#0F3D91] text-white; unselected = white border #e5e8ef text-[#1A1A2E].
      - Desktop sector list: selected = bg-[#0F3D91] text-white with white/10 icon box; unselected = white bg border #e5e8ef text-[#1A1A2E] hover:bg-[#E8F0FE].
      - Sector description card, job cards, course cards: white rounded-2xl border #e5e8ef shadow-[0_4px_32px_rgba(15,61,145,0.07)].
      - Demand badges: keep semantic color coding (Very High = red-700, High = amber-700, others = blue-700) but use softer bg tones from the existing classes; do not add new colors.
      - Course code badge: bg-[#E8F0FE] text-[#0F3D91] border-[#d4e3ff]. Level badge: keep purple/indigo or switch to blue/gold tones from the palette. Duration text: #6B7280.
      - "Itanong kung paano sumali" button: border #d4e3ff text-[#0F3D91] hover:bg-[#E8F0FE].
    - Chat tab:
      - Page container: white rounded-3xl border #e5e8ef shadow-[0_4px_32px_rgba(15,61,145,0.07)].
      - Header: bg-[#0F3D91] text-white, KT avatar on a gold (#FCD116) or white/10 rounded-xl, status dot #22c55e.
      - Quick question chips: bg-[#E8F0FE] text-[#0F3D91] border-[#d4e3ff] hover:bg-[#d4e3ff].
      - Message bubbles: user = bg-[#0F3D91] text-white; AI = white border #e5e8ef text-[#1A1A2E]. Timestamps use #6B7280.
      - Input area: white border-t #e5e8ef, input focus #0F3D91, send button bg-[#0F3D91] hover:bg-[#1a52c4].
      - Typing dots: #0F3D91.
      - Rate-limit badges: keep existing semantic green/amber/red colors but ensure they are consistent with the landing page tone.
    - FAQ tab:
      - FAQ cards: white rounded-2xl border #e5e8ef shadow-[0_4px_32px_rgba(15,61,145,0.07)], question number badge bg-[#E8F0FE] text-[#0F3D91].
      - Offline-apply reference block: same card style; info box bg-[#E8F0FE] text-[#0F3D91] border-[#d4e3ff].
    - Jobs tab:
      - Job matching form card: white rounded-2xl border #e5e8ef shadow-[0_4px_32px_rgba(15,61,145,0.07)].
      - Submit button: switch from emerald gradient to ka-trabaho blue (#0F3D91) primary; loading and disabled states match the landing page style (gold loading bg, slate disabled).
      - Job results cards: same treatment as course match results in Task 1 (white cards, border #e5e8ef, blue/gold accents, primary blue chat button, secondary blue-outline detail button).
      - FAQ tip card: convert to deep blue (#0F3D91) with white text and gold accent.
    - Footer:
      - bg-[#F8F9FC] border-t #e5e8ef, logo icon box bg-[#0F3D91] with white icon, brand text "Ka-Traba" #1A1A2E + "HO" #FCD116, body text #6B7280, bottom border #e5e8ef.
      - Remove the old blue-600 gradient from the logo icon and footer text.
    - Preserve all imports, state, event handlers, IDs, and text strings. Do not add or remove any functionality.
  </action>
  <verify>
    <automated>cd "C:\Users\LENOVO\Downloads\tesda-skills-to-jobs-matcher" && npx tsc --noEmit</automated>
    <automated>cd "C:\Users\LENOVO\Downloads\tesda-skills-to-jobs-matcher" && npm run build</automated>
  </verify>
  <done>App.tsx tab sections and footer use the ka-trabaho palette, all tabs still render, and the build passes.</done>
</task>

<task type="auto">
  <name>Task 3: Apply small cohesion tweaks to Navbar and BottomNav</name>
  <files>src/components/Navbar.tsx, src/components/BottomNav.tsx</files>
  <action>
    Make minor color adjustments to Navbar.tsx and BottomNav.tsx so they feel part of the same ka-trabaho theme without changing their layout, navigation behavior, or icons.

    - Navbar:
      - Logo icon box: change from the blue-600 gradient to a solid bg-[#0F3D91] with white icon; keep the same rounded-xl and shadow.
      - Brand text: "Ka-Traba" = text-[#1A1A2E], "HO" = text-[#FCD116].
      - Active desktop tab: keep the light blue bg but use bg-[#E8F0FE] text-[#0F3D91] border-[#d4e3ff] instead of the indigo-50/blue-700 mix. Hover state: hover:bg-[#F8F9FC].
      - Language toggle: keep existing structure but ensure selected pill uses text-[#1A1A2E] and border #e5e8ef; unselected stays #6B7280.
      - Overflow menu active FAQ item: bg-[#E8F0FE] text-[#0F3D91].
    - BottomNav:
      - Active state is already blue; change only the active color to #0F3D91 (text-[#0F3D91] and the top indicator bg-[#0F3D91]) and inactive to #6B7280. Keep everything else identical.
      - Keep the mobile-only display and safe-area classes unchanged.
    - Preserve all functionality, props, labels, IDs, and bilingual text. Do not change text strings or icons.
  </action>
  <verify>
    <automated>cd "C:\Users\LENOVO\Downloads\tesda-skills-to-jobs-matcher" && npx tsc --noEmit</automated>
    <automated>cd "C:\Users\LENOVO\Downloads\tesda-skills-to-jobs-matcher" && npm run build</automated>
  </verify>
  <done>Navbar and BottomNav use the exact ka-trabaho blue/gold colors, navigation still works, and the build passes.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries
| Boundary | Description |
|----------|-------------|
| User browser → React UI | No new external services; only visual styling changes. |

## STRIDE Threat Register
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-260615-sgr-01 | Information Disclosure | DOMPurify usage in chat | accept | No functional change; existing DOMPurify usage preserved. |
| T-260615-sgr-SC | Tampering | npx tsc / npm run build | mitigate | Run both commands and confirm zero errors before finishing. |
</threat_model>

<verification>
After all tasks are complete, run the verification commands in order:
1. `cd "C:\Users\LENOVO\Downloads\tesda-skills-to-jobs-matcher" && npx tsc --noEmit` must exit 0.
2. `cd "C:\Users\LENOVO\Downloads\tesda-skills-to-jobs-matcher" && npm run build` must exit 0.
3. Visually spot-check by switching tabs (landing, match, explorer, chat, jobs, faq) in a browser to confirm no horizontal overflow and that the ka-trabaho palette is consistent.
</verification>

<success_criteria>
- AssessmentWizard.tsx no longer contains blue-500/amber-500/purple-500 gradients that clash with the landing page; it uses #0F3D91, #FCD116, and the ka-trabaho neutrals.
- App.tsx explorer, chat, jobs, FAQ, and footer all use white rounded-2xl cards, border #e5e8ef, and the same blue/gold accent colors.
- Navbar and BottomNav use the exact ka-trabaho blue/gold without layout changes.
- `npx tsc --noEmit` and `npm run build` both pass.
</success_criteria>

<output>
Create `.planning/quick/260615-sgr-apply-the-ka-trabaho-landing-page-theme-/260615-sgr-SUMMARY.md` when done.
</output>
