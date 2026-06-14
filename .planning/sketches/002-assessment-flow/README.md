---
sketch: 002
name: assessment-flow
question: "What's the best flow for assessment input → processing → results on mobile?"
winner: A
tags: [assessment, flow, states, mobile]
---

# Sketch 002: Assessment Flow

## Design Question
The current app shows the assessment form and results simultaneously. This sketch explores three different approaches to creating a clear sequential flow: input form → loading state → results display, optimized for mobile screens.

## How to View
Open: `.planning/sketches/002-assessment-flow/index.html`

Use the Phone/Tablet/Desktop buttons in the bottom-right toolbar to preview at different viewports.

**To test each variant:** Click the "Find My Match" button and watch the flow. Use the "Start New Assessment" / "Edit Profile" button to reset.

## Variants

### A: Full Page Replacement
- Input form is fully visible on load
- Click "Find My Match" → form disappears, loading state appears in its place
- Loading completes → results replace the loading state
- "Start New Assessment" resets to the initial form
- **Best for:** Cleanest, no-scroll experience, keeps user focused on one task at a time

### B: Smooth Scroll Reveal
- Input form stays visible at the top
- Click "Find My Match" → loading state appears below the form
- Auto-scrolls to loading state
- Loading completes → results appear below the loading state
- Auto-scrolls to results
- "Edit My Profile" scrolls back to form
- **Best for:** Users who want to reference their inputs while viewing results, easy to edit and re-run

### C: Accordion Expand
- Input form fully visible on load
- Click "Find My Match" → form collapses into a compact summary bar (showing key selections)
- Loading state appears below
- Results appear below
- Tap the collapsed form bar to expand and edit inputs again
- "Edit Profile & Recalculate" expands the form
- **Best for:** Power users who want to iterate quickly, keeps context visible without taking full screen

## What to Look For
- Which flow feels most natural on a phone? (single focus vs. scroll vs. accordion)
- Does the loading state feel informative or just slow?
- Is it easy to find how to edit inputs and re-run?
- Does the results display feel like a reward/achievement after the wait?
- How does each variant handle the "back to form" action?
