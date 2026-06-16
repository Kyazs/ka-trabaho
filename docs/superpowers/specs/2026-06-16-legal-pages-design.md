# Legal Pages Design: Privacy, Accessibility, Data Policy

**Date:** 2026-06-16
**Project:** Ka-TrabaHO (tesda-skills-to-jobs-matcher)
**Status:** Approved

## Summary

Add three legal pages (Privacy Policy, Accessibility Statement, Data Policy) as separate routes with bilingual content. Uses a reusable `LegalPage` component to avoid duplication. Footer legal links updated from placeholder `#` to real routes.

## Routes

- `/privacy` — Privacy Policy
- `/accessibility` — Accessibility Statement
- `/data-policy` — Data Policy

## Architecture

### LegalPage Component

One reusable component at `src/components/LegalPage.tsx`:
- **Props:** `pageKey: "privacy" | "accessibility" | "dataPolicy"`, `lang: "fil" | "en"`
- Looks up content from a `LEGAL_CONTENT` object keyed by `pageKey`
- Renders: `PageHeader` (ShieldCheck icon, blue accent) + white card with sectioned body + back link + last updated date
- No BottomNav on these pages (they're not main app tabs)

### Content Object Structure

```ts
type LegalSection = {
  heading: { fil: string; en: string };
  body: { fil: string; en: string };
};

type LegalPageContent = {
  title: { fil: string; en: string };
  subtitle: { fil: string; en: string };
  lastUpdated: string; // ISO date
  sections: LegalSection[];
};
```

### App.tsx Integration

- Add `"privacy"`, `"accessibility"`, `"data-policy"` to `VALID_TABS`
- Add route handling: when `currentTab` matches one of these, render `<LegalPage pageKey={...} lang={lang} />`
- These pages render inside `<main>` with Navbar + Footer, but BottomNav is hidden (legal pages are not primary tabs)

### Footer Links Update

- Change `src/components/Footer.tsx` legal links from `<a href="#">` to React Router `<Link to="/privacy">`, `<Link to="/accessibility">`, `<Link to="/data-policy">`
- Remove `onClick={(e) => e.preventDefault()}`

## Page Layout

- `PageHeader` with ShieldCheck icon, blue accent (same pattern as FAQ)
- White card: `bg-white rounded-2xl border border-kt-border p-6 md:p-8`
- Sections: heading in `font-display font-bold text-base text-kt-near-black mb-2`, body in `text-sm text-kt-slate leading-[1.7] mb-6`
- Back link at top: `text-kt-blue font-semibold text-sm` — "← Bumalik" / "← Back", navigates to `/` (landing)
- Last updated at bottom: `text-xs text-kt-slate mt-8 pt-4 border-t border-kt-border`

## Content

### Privacy Policy

**Title:** Patakaran sa Privacy / Privacy Policy
**Subtitle:** Paano namin pinangangalagaan ang iyong impormasyon / How we protect your information
**Last Updated:** 2025-06-16

Sections:
1. **Pangkalahatang-ideya / Overview** — Ka-TrabaHO is a free web app that helps Filipino youth find TESDA courses and jobs. This policy explains how we handle your data.
2. **Data na nakaimbak sa iyong device / Data stored on your device** — All profile information (age, education level, region, interests, skills, career goal) and chat history are stored in your browser's localStorage only. Nothing is uploaded to any server for permanent storage.
3. **Data na ipinapadala sa server / Data sent to the server** — When you use AI features (course matching, job matching, chat), your profile and messages are sent to our server for processing. The server forwards them to Google's Gemini API for AI responses. Neither our server nor Google stores your data after processing.
4. **Rate limiting / Rate limiting** — The server tracks request counts by IP address to prevent abuse. IP addresses are not stored permanently and are not linked to any personal profile data.
5. **Kontrol ng user / User control** — You can view your stored data anytime by checking your browser's localStorage. You can delete all your data instantly using the "Burahin ang Data Ko" / "Clear My Data" option in the app menu.
6. **Mga menor-de-edad / Minors** — Ka-TrabaHO is designed for youth aged 15-24. We do not collect additional data from minors beyond what is described above. No account creation is required.
7. **Iba pang partido / Third parties** — Google Gemini API is the only third-party service involved, used solely for AI processing. We do not use analytics trackers, advertising networks, or social media pixels.
8. **Mga pagbabago sa patakaran / Policy changes** — We may update this policy. Changes will be reflected in the "Last updated" date. Continued use of the app constitutes acceptance of changes.

### Accessibility Statement

**Title:** Pahayag sa Accessibility / Accessibility Statement
**Subtitle:** Ang aming komitment sa inklusibong disenyo / Our commitment to inclusive design
**Last Updated:** 2025-06-16

Sections:
1. **Pangkalahatang-ideya / Overview** — Ka-TrabaHO is designed to be accessible to all Filipino youth, including those with disabilities. We follow WCAG 2.1 guidelines as our baseline.
2. **Mobile-first na disenyo / Mobile-first design** — Built for 5.5-inch screens as the minimum. All interactive elements meet the 44px minimum touch target size recommended by WCAG.
3. **Kulay at kontrast / Color and contrast** — Text maintains at least 4.5:1 contrast ratio against backgrounds. The two-anchor color system (Depth Blue on light backgrounds) ensures readability.
4. **Dalawang wika / Bilingual interface** — Full interface available in Filipino and English. Language toggle is always accessible from the navigation bar.
5. **Navegasyon gamit ang keyboard / Keyboard navigation** — All interactive elements are reachable via keyboard. Skip-to-content link provided. Focus indicators use a 3px ring for visibility.
6. **Screen reader support / Screen reader support** — ARIA labels on navigation, live regions for chat updates, semantic HTML structure. Forms have associated labels.
7. **Kilalang limitasyon / Known limitations** — The AI chat interface updates rapidly, which may be challenging for some screen reader users. We recommend using the "Burahin" / "Clear" button to reset the conversation if it becomes difficult to follow.
8. **Feedback / Feedback** — If you encounter accessibility barriers, please contact us through the chat feature or visit the nearest TESDA office for assistance. We are committed to ongoing improvement.

### Data Policy

**Title:** Patakaran sa Data / Data Policy
**Subtitle:** Anong data ang aming kino-collect at paano ito ginagamit / What data we collect and how we use it
**Last Updated:** 2025-06-16

Sections:
1. **Data na kino-collect / Data we collect** — We only collect what you voluntarily provide: age, education level, region/province, interests, skills, and career goal. No accounts, no email, no phone number required.
2. **Saan naka-imbak / Where it's stored** — All data is stored in your browser's localStorage. It never leaves your device except during AI processing (see section 3). If you share a device, use "Burahin ang Data Ko" / "Clear My Data" after each session.
3. **Ano ang ipinapadala / What's sent to the server** — When you request AI matching or chat, your profile and messages are temporarily sent to our server, which forwards them to Google's Gemini API. The response is sent back to you. Neither the server nor Google retains your data after processing is complete.
4. **Retention / Retention** — Data remains in localStorage until you clear it via the app menu, clear your browser data, or use a different browser. There is no automatic expiration.
5. **Cookies at trackers / Cookies and trackers** — Ka-TrabaHO does not use cookies, analytics trackers (like Google Analytics), advertising pixels, or any third-party tracking scripts.
6. **Pagbabahagi ng data / Data sharing** — We do not share your data with any third party except Google's Gemini API for the sole purpose of generating AI responses. Gemini API does not store your data or use it for training.
7. **Karapatang pantao / Your rights** — You have full control: view your data anytime (browser dev tools), delete all data instantly (app menu), or simply close the browser. No account deletion needed because no accounts exist.
8. **Kontakt / Contact** — For data-related concerns, use the chat feature within the app or visit the nearest TESDA office.

## Implementation Tasks

1. Create `src/components/LegalPage.tsx` — reusable component with LEGAL_CONTENT object, PageHeader, sectioned layout, back link
2. Update `src/App.tsx` — add legal routes to VALID_TABS, render LegalPage for each, hide BottomNav on legal pages
3. Update `src/components/Footer.tsx` — replace `<a href="#">` legal links with `<Link to="/privacy">` etc.
4. Visual verification
