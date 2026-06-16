---
name: Ka-TrabaHO
description: AI-powered TESDA skills-to-jobs matcher for Filipino out-of-school youth
colors:
  depth-blue: "#0F3D91"
  depth-blue-mid: "#1a52c4"
  depth-blue-light: "#E8F0FE"
  depth-blue-soft: "#d4e3ff"
  sunshine-gold: "#FCD116"
  sunshine-gold-dark: "#c9a700"
  near-black: "#1A1A2E"
  slate: "#6B7280"
  border: "#e5e8ef"
  background: "#F8F9FC"
  white: "#ffffff"
  success-green: "#16a34a"
  chat-purple: "#5b21b6"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, Inter, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Plus Jakarta Sans, Inter, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  title:
    fontFamily: "Plus Jakarta Sans, Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.08em"
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.depth-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.depth-blue-mid}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "14px 28px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.depth-blue}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
  chip-blue:
    backgroundColor: "{colors.depth-blue-light}"
    textColor: "{colors.depth-blue}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  chip-gold:
    backgroundColor: "#fffbe6"
    textColor: "#92710a"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  card-default:
    backgroundColor: "{colors.white}"
    textColor: "{colors.near-black}"
    rounded: "{rounded.lg}"
    padding: "20px"
  input-default:
    backgroundColor: "{colors.white}"
    textColor: "{colors.near-black}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  nav-tab-active:
    backgroundColor: "{colors.depth-blue-light}"
    textColor: "{colors.depth-blue}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
---

# Design System: Ka-TrabaHO

## 1. Overview

**Creative North Star: "The Open Doorstep"**

A doorway always left open. No barriers, no gatekeeping — step through and the path is lit. Every screen in Ka-TrabaHO is that doorstep: welcoming, clear, and always pointing forward. The design rejects both the stiffness of government portals and the coldness of corporate dashboards. Instead, it borrows the warmth of a neighbor's front gate — you walk up, you see the way in, and nobody asks for your credentials at the door.

The palette is anchored in two colors drawn from the Philippine flag: Depth Blue for trust and structure, Sunshine Gold for hope and energy. These are not decorative choices — they carry cultural recognition. A Filipino youth seeing deep navy and golden yellow instinctively reads "official, but ours." The blue does the structural work (navigation, primary actions, active states); the gold does the emotional work (accents, highlights, the underline beneath "trabaho" in the logo). Everything else is neutral canvas — off-white backgrounds, slate text, thin borders — so the two flag colors breathe.

The system is mobile-first by conviction, not by compromise. The audience is on basic smartphones with prepaid data. Every pixel, every request, every animation frame must justify itself against a 3G connection and a 5.5-inch screen.

**Key Characteristics:**
- Resting calm, lifted on touch — cards are flat at rest; depth appears only on interaction
- Flag-anchored palette — Depth Blue structures, Sunshine Gold energizes; neutral carries the content
- Mobile-first density — generous touch targets, no wasted vertical space, single-column default
- Bilingual by design — every label and error message exists in Taglish and English as first-class copies, not afterthoughts
- One action per screen — the next step is always visible, always tappable

## 2. Colors

A two-anchor palette rooted in the Philippine flag, with a wide neutral ramp for the 90% of the surface that carries content.

### Primary
- **Depth Blue** (#0F3D91): The structural color. Used for primary buttons, active navigation, header bars, icon backgrounds, and any element that says "this is the main action." Carries trust and government credibility without feeling bureaucratic. Appears on ~15% of any given screen.
- **Depth Blue Mid** (#1a52c4): Hover and active state for Depth Blue elements. Darker screens and the brand icon hover lift.

### Secondary
- **Sunshine Gold** (#FCD116): The emotional color. Used for the logo "HO" highlight, hero underlines, accent badges, selected chip states, and any element that says "this is the highlight." Never used for large surface fills — its power is in rarity and specificity.
- **Sunshine Gold Dark** (#c9a700): Hover state for gold elements.

### Tertiary
- **Success Green** (#16a34a): Used exclusively for success states — completed steps, "active" indicators, positive demand labels. Never decorative.
- **Chat Purple** (#5b21b6): Used exclusively within the chat feature's tone system — purple-tinted badges and tag backgrounds. Not used elsewhere.

### Neutral
- **Near Black** (#1A1A2E): Body text, headings, and the default ink color. A deep navy-tinted black rather than pure black, which reads warmer and more intentional against the off-white background.
- **Slate** (#6B7280): Secondary text, descriptions, helper text, muted labels. Must maintain 4.5:1 contrast against white and #F8F9FC backgrounds.
- **Border** (#e5e8ef): Card borders, dividers, input strokes. The single border color for the entire system.
- **Background** (#F8F9FC): Page background. A barely-blue off-white that gives depth against white cards without reading as "gray."
- **White** (#ffffff): Card surfaces, input backgrounds, modal overlays.

**The Two-Anchor Rule.** Depth Blue and Sunshine Gold are the only saturated colors on any given screen. All other hues (green for success, red for errors, amber for demand, purple for chat tone) are semantic and context-bound — they appear only when the state demands them, never as decoration. If a screen has more than two saturated non-semantic colors, it has broken the rule.

**The Neutral-90 Rule.** At least 90% of any screen's surface area is neutral (background, white cards, slate text, borders). The anchors punctuate; they do not paint.

## 3. Typography

**Display Font:** Plus Jakarta Sans (fallback: Inter, system sans-serif)
**Body Font:** Inter (fallback: ui-sans-serif, system-ui, sans-serif)
**Mono Font:** JetBrains Mono (fallback: monospace)

**Character:** Plus Jakarta Sans is geometric and bold — it gives headings a confident, modern punch that feels neither corporate nor childish. Inter is the workhorse: clean, highly readable at small sizes, and optimized for screens. The pairing works because they occupy different weight territories: Plus Jakarta Sans at 700-900 (heavy, declarative), Inter at 400-600 (quiet, supportive). The gap in personality is the hierarchy.

### Hierarchy
- **Display** (weight 800, clamp(2.25rem, 5vw, 3.25rem), line-height 1.08, letter-spacing -0.04em): Hero headlines only. The aggressive tracking compression is intentional — it creates visual density that reads as "confidence" not "crowding." Maximum one per page.
- **Headline** (weight 700, 1.25rem, line-height 1.3): Section headers, card titles, page headers. The workhorse heading level.
- **Title** (weight 700, 1rem, line-height 1.4): Sub-section labels, course names, job titles. Dense but not loud.
- **Body** (weight 400, 0.875rem, line-height 1.7): Descriptions, explanations, chat messages. Line-height is generous (1.7) because the audience reads on small screens and the content often explains unfamiliar concepts. Max line length 65ch.
- **Label** (weight 700, 0.6875rem, letter-spacing 0.08em, uppercase): Eyebrows, category tags, field labels, badge text. The tracking (0.08em) is deliberate — wider than the default but tight enough to read as "label" not "shouted."
- **Mono** (weight 700, 0.75rem, line-height 1.4): Course codes (e.g., "CSS NC II"), salary figures, data values. Used only for short, machine-readable strings.

**The Weight-Gap Rule.** A heading and its adjacent body text must differ by at least 200 in font-weight. If a headline is 700 and the description beneath it is 600, the hierarchy collapses. Display at 800-900, headlines at 700, body at 400-500.

## 4. Elevation

The system is flat at rest. Cards, inputs, and containers sit on the page with borders and background color differences to separate them — no shadow at idle. Depth is an event, not a state: it appears when the user interacts (hover, focus) and disappears when they move away.

This is a deliberate choice. Ambient shadow on every card creates visual noise that fatigues on mobile. Flat-at-rest is calmer, faster to render, and makes the hover lift more dramatic by contrast.

### Shadow Vocabulary
- **Brand Whisper** (`0 4px 32px rgba(15,61,145,0.07)`): The default card shadow that appears on hover/focus. The 32px blur radius creates a diffuse, soft glow rather than a sharp drop. The blue tint (rgba(15,61,145,...)) ties the shadow to the brand — it reads as "blue glow" not "gray shadow."
- **Lift** (`0 20px 40px -12px rgba(0,0,0,0.15)`): Used for card-hover effects with a simultaneous translateY(-4px). The larger spread and offset create a dramatic "picking up" effect.
- **Nav Glow** (`0_-4px_6px_-1px_rgba(0,0,0,0.05)`): The bottom navigation bar's top-edge shadow. Minimal, ambient.

**The Rest-Flat Rule.** No element casts a shadow at rest. Shadows are reserved for hover, focus, and modal overlays. If a card has a shadow with no user interaction, the shadow is ambient noise and must be removed.

## 5. Components

### Buttons
- **Shape:** Rounded corners (12px for standard, 10px for CTA hero buttons)
- **Primary:** Depth Blue background (#0F3D91), white text, font-display bold 700, padding 14px 28px. On hover: background shifts to Depth Blue Mid (#1a52c4), slight translateY(-2px). On active: scale(0.95). Always includes an icon left of label.
- **Secondary / Ghost:** Transparent background, Depth Blue text, 1.5px border in Depth Blue Soft (#d4e3ff). On hover: background fills Depth Blue Light (#E8F0FE). No icon required.
- **Disabled:** 50% opacity, cursor-not-allowed. No hover effects.

### Chips / Tags
- **Style:** Pill shape (9999px radius), 13px font-semibold, padding 6px 14px, 1px border.
- **Blue chip:** Depth Blue Light background, Depth Blue text, Depth Blue Soft border. Used for interest tags, category labels, sector indicators.
- **Gold chip:** #fffbe6 background, #92710a text, Sunshine Gold border. Used for selected/highlighted states.
- **Neutral chip:** Background (#F8F9FC) with slate text and border border. Used for skill tags, metadata.
- **State:** Toggle chips shift from neutral to blue/gold on selection. Smooth background-color transition (0.2s ease).

### Cards / Containers
- **Corner Style:** 16px radius (rounded-2xl) for standard cards, 20px for hero/feature cards, 24px for chat frame.
- **Background:** White (#ffffff)
- **Shadow Strategy:** Flat at rest (1px border only). Brand Whisper shadow on hover. See Elevation section.
- **Border:** 1px solid #e5e8ef. Consistent across all card variants.
- **Internal Padding:** 20px mobile / 24px desktop. Generous padding ensures touch targets are never cramped.

### Inputs / Fields
- **Style:** 1px solid #e5e8ef stroke, white background, 12px radius, 12px 16px padding. Text in Inter 500 at 14px.
- **Focus:** Border shifts to Depth Blue (#0F3D91), 3px ring in Depth Blue Light (#E8F0FE). The ring is the primary focus indicator — it's large enough to see on mobile.
- **Error:** Red-300 border, red-50 background tint, red-500 focus ring. Error text in Inter 700 at 12px with AlertCircle icon.
- **Disabled:** Slate-100 background, slate-400 text, cursor-not-allowed.

### Navigation
- **Top navbar:** Sticky, white/90 background with backdrop-blur-xl. Brand mark left (Depth Blue icon square + "Ka-Traba" + Sunshine Gold "HO"). Desktop tabs as horizontal links with active state (Depth Blue Light background + Depth Blue text + 1px border). Mobile collapses to logo + language toggle + overflow menu.
- **Bottom nav (mobile only):** Fixed, white background, 5 tabs. Active tab shows Depth Blue icon + text + 2px indicator line above icon. Inactive shows slate gray. 64px height with safe-area-inset-bottom support.
- **Language toggle:** Pill-shaped segmented control (TL/EN), slate-100 background, active segment white with shadow and border.

### Chat Bubbles
- **User messages:** Depth Blue background, white text, 16px radius with top-right corner flat (rounded-tr-none). Max-width 75%. Shadow-md.
- **Model messages:** White background, near-black text, 1px border in #e5e8ef, top-left corner flat (rounded-tl-none). Shadow-md.
- **Timestamps:** 11px, 70% opacity of parent text color. Below message content.

### Stat Cards (Signature Component)
- **Style:** Full-gradient background (Depth Blue to Depth Blue Mid, 135deg), white text, 16px radius, centered layout. Shadow tinted with Depth Blue. Used only for key metrics — one per data point, never nested.

## 6. Do's and Don'ts

### Do:
- **Do** use Depth Blue and Sunshine Gold as the only saturated colors on any screen. All other hues are semantic (success green, error red) and appear only when state demands them.
- **Do** keep cards flat at rest with 1px #e5e8ef borders. Shadows appear only on hover/focus.
- **Do** pair Plus Jakarta Sans at 700-900 weight with Inter at 400-500. The weight gap IS the hierarchy.
- **Do** use generous line-height (1.7) for body text — the audience reads on small screens and needs breathing room.
- **Do** ensure every interactive element has a visible focus indicator (3px Depth Blue Light ring) and a minimum 44px touch target.
- **Do** write every label, error message, and celebration in both Taglish and English as first-class copy.
- **Do** use the brand-tinted shadow (`0 4px 32px rgba(15,61,145,0.07)`) for hover states — the blue tint ties depth to the brand.
- **Do** surface the next concrete action on every screen. Dead ends are failures.

### Don't:
- **Don't** create the look of a government portal — dense text walls, tiny fonts, outdated layouts, bureaucratic tone. As stated in PRODUCT.md: "Ka-TrabaHO must never feel like paperwork."
- **Don't** create the look of a corporate SaaS dashboard — navy-and-white tables, metric dashboards, HR-manager aesthetics. This is for youth seeking their first break.
- **Don't** use ambient shadows on resting cards. Flat-at-rest is the doctrine. If a card has shadow with no user interaction, remove it.
- **Don't** use gradient text (`background-clip: text` with gradient). Use solid Depth Blue for emphasis via weight or size instead.
- **Don't** use border-left or border-right greater than 1px as a colored accent stripe on cards, list items, or callouts. Use background tints or full borders instead.
- **Don't** use more than two saturated non-semantic colors on any single screen. The Two-Anchor Rule is strict.
- **Don't** use slate (#6B7280) for body text on tinted backgrounds without verifying ≥4.5:1 contrast. On Depth Blue Light (#E8F0FE), slate passes; on darker tints, bump toward Near Black.
- **Don't** use tiny uppercase tracked eyebrows on every section. One deliberate eyebrow on the hero is voice; eyebrows everywhere is AI grammar.
- **Don't** use numbered section markers (01 / 02 / 03) as default scaffolding. Numbers earn their place only when the section IS a real ordered sequence.
