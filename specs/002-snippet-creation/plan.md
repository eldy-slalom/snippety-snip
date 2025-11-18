# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (project uses Next.js + TypeScript; see `tsconfig.json`)  
**Primary Dependencies**: Next.js (App Router), React, better-sqlite3 or sqlite client (repo uses `lib/db/client.ts`), Jest + React Testing Library for tests  
**Storage**: SQLite (local file-based DB, migrations in `lib/db/migrations/`)  
**Testing**: Jest with React Testing Library (see `/package/jest.config.ts` and `/package/jest.setup.ts`)  
**Target Platform**: Web (Next.js app, local-first desktop/web usage)  
**Project Type**: Web application (frontend + serverless API routes via Next.js App Router)  
**Performance Goals**: Page loads < 2s, operations < 500ms (from Constitution)  
**Constraints**: Offline-first, local SQLite storage, TypeScript strict mode (see `docs/`), TDD and 80% coverage required by constitution  
**Scale/Scope**: Single-user local-first app; not designed for multi-tenant or large-scale server deployment

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Summary: The planned work for snippet creation conforms to the repository constitution with the following explicit commitments and verifications required during implementation.

- TDD (GATE): Tests will be written before or alongside implementation. Unit tests for validators and service layer, component tests for `SnippetForm`, and integration tests for the API route will be created. Acceptance: tests exist and initially fail before implementation.
- Coverage (GATE): Ensure new tests contribute towards the 80% minimum coverage. Measure with `npm test -- --coverage` in CI and locally.
- TypeScript strict mode (GATE): All new code must compile under project's TS config. Run `npm run build` or `tsc --noEmit` as part of pre-merge checks.
- Local-first & Storage (GATE): Use SQLite via `lib/db` client and migrations. Ensure DB migrations are updated and `lib/db/init` is called in quickstart.
- API routes (GATE): Use thin API route handlers under `app/api/snippets` delegating to `lib/db/snippets.ts` service functions.
- Security & Input Validation (GATE): Validate inputs server-side and use parameterized queries. Add tests for validation failure paths.

If any of the gates above cannot be met, the plan must justify the deviation and propose mitigations. At this stage there are no violations; all gates are actionable and have corresponding acceptance criteria in the tests and CI.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
