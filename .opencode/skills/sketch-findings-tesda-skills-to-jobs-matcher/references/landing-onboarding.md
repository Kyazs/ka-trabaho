# Landing & Onboarding

## Design Decisions

### Hero Section
- **Badge**: Inline badge at top of hero reading "Your Path to Success" (or similar motivational framing)
- **Headline**: Large, bold display font (Plus Jakarta Sans, 800 weight) with line break for mobile readability
- **Subheadline**: Short, punchy description that speaks directly to user benefit (not feature description)
- **CTAs**: Primary CTA is "Begin Your Journey" (action-oriented language), secondary CTAs for Chat and Browse
- **Visual treatment**: Clean, centered layout on mobile with generous vertical padding

### Journey Steps (Step-by-Step Infographic)
- **Format**: Vertical stack of numbered cards (1-4)
- **Connector**: Vertical line between step numbers creating visual flow/progression
- **Step structure**: Number badge + title + descriptive paragraph
- **Color coding**: Steps use neutral/primary colors; final step (success) uses success green to signal achievement
- **Animation**: Staggered fade-in animation when scrolling into view (stagger-1 through stagger-4)

### Stats Section
- **Format**: 2-column grid of stat cards
- **Each card**: Icon (emoji or SVG) + large number + label
- **Key stats**: 300+ courses, ₱160 daily allowance, NC II certification, 95% placement rate
- **Purpose**: Build trust through concrete numbers before asking for user input

### CTA Placement
- **Hero CTAs**: Primary + secondary at top of page (immediate action)
- **Bottom CTAs**: Repeated after journey + stats (capture users who scrolled through the infographic)
- **Navigation hint**: Subtle reminder that tabs exist at the top (for users who want to explore without assessment)

## CSS Patterns

### Hero Badge
```css
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Step Card with Connector
```css
.step-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  position: relative;
}
.step-number {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  flex-shrink: 0;
}
.step-connector {
  position: absolute;
  left: 28px;
  top: 60px;
  width: 2px;
  height: calc(100% - 40px);
  background: var(--color-primary-light);
  z-index: 0;
}
.step-card:last-child .step-connector { display: none; }
```

### Stat Card Grid
```css
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 24px 0;
}
.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
}
.stat-number {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
}
.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 500;
}
```

### Primary CTA Button
```css
.cta-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px 24px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.cta-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

## HTML Structures

### Hero Section
```html
<div class="hero">
  <div class="hero-badge">Your Path to Success</div>
  <h1>From Zero<br>to Hero</h1>
  <p>See exactly how TESDA can transform your skills into a career — step by step.</p>
  <button class="cta-primary">
    <span>🚀</span> Begin Your Journey
  </button>
</div>
```

### Step Journey
```html
<div class="step-card">
  <div class="step-connector"></div>
  <div class="step-number">1</div>
  <div class="step-content">
    <h4>Where Are You Now?</h4>
    <p>Junior high grad? ALS completer? No worries — TESDA accepts all. Share your story.</p>
  </div>
</div>
```

## What to Avoid

- **Form-first landing**: Don't immediately show the assessment form. Users need context and trust before committing to filling a form.
- **Overwhelming stats**: Keep stats to 4 max (2x2 grid). More than that feels like a data dump.
- **Generic CTAs**: "Submit" or "Get Started" are weak. Use action-oriented language like "Begin Your Journey" or "Find My Match."
- **Lorem ipsum**: Use real TESDA data shapes and Filipino context (Taglish/English bilingual support).

## Origin
Synthesized from sketch: 001-landing-infographic
Winner: Variant B (Step-by-Step Journey)
Source files available in: sources/001-landing-infographic/
