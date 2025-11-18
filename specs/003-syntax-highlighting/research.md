# Syntax Highlighting Feature: Research

## Decision: Syntax Highlighting Library

- Chosen: Shiki
- Rationale: Shiki provides fast, theme-aware, and accurate syntax highlighting for many languages, supports both dark/light themes, and is widely used in modern code editors. It is well maintained and works well with React/Next.js.
- Alternatives considered: Prism.js, Highlight.js

## Decision: Display Settings Scope

- Chosen: Global (one setting for the entire app)
- Rationale: Simpler implementation, matches clarified spec, avoids complexity of per-user or per-snippet settings.
- Alternatives considered: Per user, per snippet

## Decision: Performance for Large Code Blocks

- Chosen: Lazy rendering and virtualization for large code blocks
- Rationale: Ensures UI remains responsive even for very large snippets. Only visible lines are rendered, reducing DOM load.
- Alternatives considered: Render all lines at once

## Decision: Theme Adaptation

- Chosen: Use app theme context to switch Shiki theme
- Rationale: Ensures code blocks always match app theme, improves UX consistency.
- Alternatives considered: Manual theme switching, static theme

## Decision: Fallback for Unsupported Languages

- Chosen: Plain text rendering
- Rationale: Prevents errors and ensures all code is readable, even if not highlighted.
- Alternatives considered: Attempt best-match highlighting, error message

## Decision: Accessibility

- Chosen: WCAG AA color contrast, keyboard navigation for toggle controls
- Rationale: Ensures code blocks are usable for all users, meets accessibility standards.
- Alternatives considered: No accessibility focus
