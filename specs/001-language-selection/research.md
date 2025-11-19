# Research: Assign Snippet Language Dropdown

## Decision: Use native HTML `<select>` with explicit empty option
- **Rationale**: Native select elements provide built-in keyboard navigation, screen reader support, and respect browser accessibility expectations without additional dependencies. Including a leading empty option (e.g., "Select a language") ensures no default value is selected while keeping validation straightforward.
- **Alternatives considered**:
  - Custom dropdown component: Rejected due to higher implementation overhead and accessibility risks.
  - Third-party component library: Rejected to avoid new dependencies and styling drift from the terminal aesthetic.

## Decision: Maintain language list in shared constants module
- **Rationale**: Centralizing the supported language set allows reuse across form validation, database constraints, and UI components, reducing duplication and keeping alphabetical ordering consistent.
- **Alternatives considered**:
  - Hardcoding list within the form component: Rejected because it risks divergence from backend validation and increases maintenance cost.
  - Loading options from database at runtime: Rejected as unnecessary complexity for a static list defined in functional requirements.

## Decision: Enforce validation at both client and API layers
- **Rationale**: Client-side enforcement gives immediate feedback, while API-side validation guarantees data integrity if requests bypass the UI. This aligns with constitution requirements for quality and prevents malformed records.
- **Alternatives considered**:
  - Client-only validation: Rejected due to risk of malformed submissions via direct API calls.
  - API-only validation: Rejected because it delays feedback and degrades UX.

## Decision: Store language as constrained text column
- **Rationale**: Persisting the language as a text field restricted to the supported set avoids schema changes while enabling simple filtering and analytics. SQLite supports CHECK constraints or application-level enforcement.
- **Alternatives considered**:
  - Numeric foreign key to a separate languages table: Rejected as overkill for a fixed, short list.
  - Free-form text: Rejected because it contradicts requirement for controlled vocabulary and undermines search/filter accuracy.
