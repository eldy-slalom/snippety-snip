# Implementation Plan: Assign Snippet Language Dropdown

**Branch**: `001-language-selection` | **Date**: 2025-11-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-language-selection/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Require snippet creators to pick a language from a predefined list so downstream syntax highlighting and filtering remain accurate. Implementation uses a native `<select>` with a shared constants source for language options, adds validation in both client UI and API layer, and persists the chosen value with each snippet.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x (Next.js App Router)  
**Primary Dependencies**: Next.js 14, React 18, better-sqlite3, Zod validators  
**Storage**: SQLite (local file via `lib/db/client.ts`)  
**Testing**: Jest + React Testing Library + supertest for API handlers  
**Target Platform**: Local-first web application (Node 18 runtime)  
**Project Type**: Web (Next.js app under `package/`)  
**Performance Goals**: Form validation feedback <1s, maintain existing <500ms snippet operations  
**Constraints**: Must remain offline-capable, WCAG 2.1 AA compliant for form controls  
**Scale/Scope**: Single-user desktop usage with hundreds of snippets and languages capped at 21 entries

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **TDD Commitment**: Plan includes new tests for dropdown rendering, validation, and API enforcement before implementation begins – PASS.
- **Quality Standards**: Reuses existing form/components structure, avoids new dependencies, adheres to TypeScript strict mode – PASS.
- **Local-First Architecture**: No external services introduced; SQLite remains sole persistence layer – PASS.
- **UX Excellence**: Accessibility considerations (keyboard navigation, screen reader messaging) embedded in requirements – PASS.

## Project Structure

### Documentation (this feature)

```text
specs/001-language-selection/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md             # Created by /speckit.tasks

Updates to existing contract: `specs/002-snippet-creation/contracts/create-snippet.yaml`
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
package/
├── app/
│   ├── snippets/
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── view/
│   └── api/
│       └── snippets/
│           ├── route.ts
│           └── __tests__/route.test.ts
├── components/
│   └── snippets/
│       ├── SnippetForm.tsx
│       ├── TagInput.tsx
│       ├── TagList.tsx
│       └── CodeBlock.tsx
├── lib/db/
│   ├── snippets.ts
│   └── tags.ts
├── types/
│   └── snippet.ts
├── utils/
│   ├── snippet-validators.ts
│   └── tag-validators.ts
└── __tests__/
    └── (shared test setup)

package/public/
package/docs/
package/jest.setup.ts
```

**Structure Decision**: Work entirely inside the existing Next.js application under `package/`, touching the snippet creation form, shared snippet components, API route validation, and supporting utilities.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| _None_ | _N/A_ | _N/A_ |

No additional complexity exemptions required; plan adheres to constitution defaults.
