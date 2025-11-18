```markdown
# Research: Snippet Creation Feature

## Decision Summary

- Decision: Use Next.js (App Router) + TypeScript for the feature.
  - Rationale: The repository is already a Next.js TypeScript project (see `app/`, `tsconfig.json`). Server Components and API route patterns fit the local-first architecture.
  - Alternatives considered: Separate backend service (unnecessary complexity for local-first app); SPA-only approach (loses server-side APIs and file-based routing benefits).

- Decision: Use SQLite for persistent storage with existing `lib/db` service layer.
  - Rationale: Constitution mandates local SQLite; repository includes `lib/db/client.ts`, migrations, and `lib/db/snippets.ts` and `lib/db/tags.ts`.
  - Alternatives considered: In-memory storage for dev (insufficient for persistence); external DB (violates privacy/local-first requirement).

- Decision: Use Jest + React Testing Library for tests and follow TDD.
  - Rationale: Constitution mandates TDD and Jest; repo already contains Jest config and tests under `app/api/tags/__tests__` and component tests.
  - Alternatives considered: Other test runners (not aligned with constitution).

- Decision: Input validation will be implemented client-side (form) and server-side (API route) using shared validation utilities where possible.
  - Rationale: Defense in depth; prevents invalid data from being saved regardless of client behavior.

- Decision: Normalize code content line endings to LF on save, preserve all characters otherwise.
  - Rationale: Spec clarifies normalization to LF; implement in server-side service layer when creating snippet.

## Open Questions (resolved)

- Q: When should validation messages appear? → A: On blur (field loses focus) and on submit; immediate visual feedback required but not per keystroke.
- Q: Post-save redirect → A: Redirect to snippet list page `/` (as clarified in spec).

## Implementation Notes

- Ensure database schema supports `title` (varchar(100)), `content` (text), `created_at`, `updated_at`.
- Enforce title max length (100) at both client and server validation layers.
- Enforce code content max length (50,000) and prevent whitespace-only values by trimming-only checks where appropriate, but preserve whitespace in storage (so validation differs from storage transformation: only validation rejects whitespace-only inputs; content is stored exactly as entered except for normalized LF endings).
- Provide tests: unit tests for validators, integration tests for API route (create snippet), and component tests for `SnippetForm` behavior.

## Alternatives Considered (brief)

- Shiki/Prism for syntax highlighting: out of scope for this feature.
- Auto-save/draft: explicitly out of scope.

``` 
