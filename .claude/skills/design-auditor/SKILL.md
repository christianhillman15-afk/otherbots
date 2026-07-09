---
name: design-auditor
description: >-
  Audit a UI/design (code, screenshot, or Figma) against 19 professional
  categories and produce a scored report. Use when the user wants a design
  review, a UX/accessibility audit, a quality score for a page or component,
  or a prioritized list of what to fix to make an interface more polished and
  accessible. Triggers on "audit this design", "review the UI", "score this
  page", "is this accessible", "design feedback", "what should I fix".
---

# Design Auditor

A comprehensive design-review system that audits UI/UX across **19 categories**
using an explicit, scored methodology. Always end with a numeric score and a
prioritized fix list — never hand-wave.

> Adapted for this repo from the community skill
> **claude-design-auditor-skill** by Ashutos1997
> (https://github.com/Ashutos1997/claude-design-auditor-skill), catalogued in
> BehiSecc/awesome-claude-skills. Credit to the original author.

## Scoring model (show the arithmetic)

```
Score = 100 − (blockers × 12) − (criticals × 8) − (warnings × 4) − (tips × 1)
```

Severity levels:

- 🚫 **Blocker** (−12) — legal / critical accessibility violation
- 🔴 **Critical** (−8) — breaks usability or accessibility
- 🟡 **Warning** (−4) — weakens the design
- 🟢 **Tip** (−1) — polish-level improvement

Report an **Overall Score**, plus a separate **Accessibility Score** and
**Ethics Score**. Never skip the score; if a value must be estimated (e.g.
from a screenshot), flag it 🟡 Medium confidence and deduct accordingly.

## Input confidence

| Input | Confidence | Behavior |
|---|---|---|
| Figma (MCP) | High | Full audit, exact values |
| Code (HTML/CSS/React) | High | Full audit, quote actual lines |
| Screenshot | Medium | Visual audit, discount estimated values |
| Description only | Low | No score; list risks instead |

## The 19 audit categories

1. **Typography** — hierarchy, sizing (≥14px body / 16px inputs), line-height 1.4–1.6×, measure 45–75ch, contrast.
2. **Color & Contrast** — WCAG AA (4.5:1 text, 3:1 large/UI), color-blind safety, consistent semantic meaning.
3. **Spacing & Layout** — 8pt grid, proximity, alignment, breathing room, consistent rhythm.
4. **Visual Hierarchy & Focus** — one clear primary action per view, z-index logic, avoid overchoice.
5. **Consistency** — component reuse, one icon family, a radius scale, nested-radius rule (inner < outer).
6. **Accessibility (WCAG)** — touch targets ≥44×44px, visible focus states, alt text, form labels, described errors, skip link.
7. **Forms & Inputs** — label placement, validation timing, correct input types, autocomplete attributes.
8. **Motion & Animation** — respects `prefers-reduced-motion`, UI 150–300ms / page 300–500ms, consistent easing.
9. **Dark Mode** — non-inverted colors, elevation via surface color not just shadow, reduced saturation.
10. **Responsive & Adaptive** — breakpoint coverage, no fixed-width overflow, 16px min input font on mobile.
11. **Loading, Empty & Error States** — skeletons over spinners, directive empty states, error recovery, success confirmation.
12. **Content & Microcopy** — action verbs on buttons, human error messages, clear placeholders, no lorem at handoff.
13. **Internationalization** — no hardcoded strings where avoidable, text-expansion budget, RTL readiness, locale formats.
14. **Elevation & Shadows** — a consistent shadow scale, sane blur-to-offset ratio, shadow = elevation hierarchy.
15. **Iconography** — one family/style, optical sizes (16/20/24/32/40/48), accessible SVG, consistent stroke weight.
16. **Navigation** — `aria-current="page"`, active-state contrast ≥3:1, breadcrumbs at 3+ levels, skip links.
17. **Design Tokens & Variables** — no raw hex/px in components, semantic names (purpose not appearance), reusable in dark mode.
18. **Ethical Design & Dark Patterns** — no confirmshaming, no CTA-hierarchy inversion, no trick questions, no disguised ads.
19. **Inclusive Design & Heuristics** — Nielsen's 10 heuristics, WCAG 2.1 AA baseline.

## Process

1. Detect input type & confidence; detect framework/design-system if code.
2. Extract typography, color, and spacing values (quote real lines when code).
3. Walk all 19 categories; skip only categories that genuinely don't apply and say which.
4. Group findings by severity; compute the score arithmetic explicitly.
5. End with a "What Next" list ordered by score impact (fix blockers/criticals first).

## Report format (mandatory)

- Detected input type & confidence
- Detected component/page type & any skipped categories
- Per-category findings with severity icons
- Overall / Accessibility / Ethics scores with arithmetic shown
- Prioritized "What Next" recommendations
