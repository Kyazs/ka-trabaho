# Assessment Flow & States

## Design Decisions

### State Machine: Form → Loading → Results → Reset
- **Single-focus principle**: Only one state is visible at a time. This prevents cognitive overload on mobile.
- **No scroll required**: The full flow fits within a single viewport height (or close to it), keeping the user focused.

### Form State
- **Card container**: White card with rounded corners (16px radius), border, and padding on a light background
- **Field groups**: Label (small, uppercase, muted) + input (large tap target, rounded, focus ring) + spacing
- **Range slider**: For age selection with live value display in a badge
- **Tag pills**: For interests/skills — toggleable, selected state uses primary color
- **Submit button**: Full-width, prominent, disabled state when no interests selected

### Loading State
- **Full card replacement**: Loading card replaces the form card completely (same position, same width)
- **Spinner**: Centered animated spinner (48px, primary color border)
- **Title**: "Analyzing Your Profile" — humanizes the AI process
- **Progress steps**: Vertical list of 4 steps with dots that animate:
  - Step 1: "Reading your profile" (completes immediately)
  - Step 2: "Scanning 300+ courses" (active after ~1s)
  - Step 3: "Finding local opportunities" (active after ~2.5s)
  - Step 4: "Building your report" (active after ~3s, completes at ~4s)
- **Purpose**: Makes the wait feel productive and transparent, not like a black box

### Results State
- **Success badge**: Green badge "✓ Match Found" at top of results
- **AI Counselor Insights**: Distinctive summary card (light blue background) with italicized quote-style text explaining the AI reasoning
- **Course cards**: Full-width cards with:
  - Header: Match number + match score percentage (green badge)
  - Body: Course code badge + course name + "Why for you" explanation + immediate job title
  - Actions: "Chat About Course" (primary) + "Details" (secondary outline)
- **Back button**: "Start New Assessment" or "Edit Profile & Recalculate" — clear way to re-enter the form

### Transitions
- **Form → Loading**: Form fades out, loading fades in (0.4s ease-in-out)
- **Loading → Results**: Loading fades out, results fade in
- **Results → Form**: Form fades in from opacity 0
- All transitions use CSS `transition: all 0.4s ease-in-out`

## CSS Patterns

### Form Card
```css
.form-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
}
```

### Field Input
```css
.field-input, .field-select {
  width: 100%;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg);
  font-size: 1rem;
  font-family: var(--font-sans);
  color: var(--color-text);
  transition: all 0.2s ease;
}
.field-input:focus, .field-select:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-surface);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}
```

### Tag Pill
```css
.tag {
  padding: 8px 16px;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--color-text-muted);
}
.tag.selected {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
```

### Loading Spinner
```css
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-primary-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Loading Progress Steps
```css
.loading-steps {
  margin-top: 24px;
  text-align: left;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}
.loading-step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
.loading-step.done {
  color: var(--color-success);
}
.loading-step.active .step-dot {
  background: var(--color-primary);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
```

### Match Score Badge
```css
.match-score {
  background: var(--color-success-light);
  color: var(--color-success);
  font-weight: 700;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 9999px;
  border: 1px solid var(--color-success-light);
}
```

### AI Summary Card
```css
.ai-summary {
  background: var(--color-primary-light);
  border: 1px solid var(--color-primary-light);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}
.ai-summary h4 {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ai-summary p {
  font-size: 0.875rem;
  color: var(--color-text);
  font-style: italic;
  line-height: 1.5;
}
```

## HTML Structures

### Form → Loading → Results Flow
```html
<!-- Form State (initially visible) -->
<div id="form" class="form-card">
  <!-- Form fields -->
  <button onclick="startAssessment()">Find My Match</button>
</div>

<!-- Loading State (hidden initially) -->
<div id="loading" class="loading-card" style="display: none;">
  <div class="spinner"></div>
  <h3>Analyzing Your Profile</h3>
  <div class="loading-steps">
    <div class="loading-step done"><div class="step-dot"></div><span>Reading your profile</span></div>
    <div class="loading-step active"><div class="step-dot"></div><span>Scanning 300+ courses</span></div>
    <!-- ... -->
  </div>
</div>

<!-- Results State (hidden initially) -->
<div id="results" class="results-card" style="display: none;">
  <div class="results-badge">✓ Match Found</div>
  <div class="ai-summary"><!-- AI reasoning --></div>
  <div class="course-card"><!-- Course 1 --></div>
  <div class="course-card"><!-- Course 2 --></div>
  <button onclick="resetAssessment()">Start New Assessment</button>
</div>
```

### JavaScript State Transition
```javascript
function startAssessment() {
  document.getElementById('form').style.display = 'none';
  document.getElementById('loading').style.display = 'block';
  // Animate progress steps, then...
  document.getElementById('loading').style.display = 'none';
  document.getElementById('results').style.display = 'block';
}
function resetAssessment() {
  document.getElementById('results').style.display = 'none';
  document.getElementById('form').style.display = 'block';
}
```

## What to Avoid

- **Showing form + results simultaneously**: This was the original problem. The form and results should never be visible at the same time. It creates confusion about what to do next.
- **Generic loading**: A spinner alone feels slow. Always pair with progress steps that explain what's happening.
- **No way back**: Users must be able to edit their profile and re-run. Include a clear "Start New Assessment" or "Edit Profile" button.
- **Too many results**: On mobile, 2-3 course cards is the max before scrolling becomes tedious. Show top matches with an option to see more.
- **Missing AI explanation**: The AI summary card is critical for trust. Without it, results feel like a black box.

## Origin
Synthesized from sketch: 002-assessment-flow
Winner: Variant A (Full Page Replacement)
Source files available in: sources/002-assessment-flow/
