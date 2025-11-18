---
description: "Task list for Snippet Creation feature implementation"
---

# Tasks: Snippet Creation

**Input**: Design documents from `/specs/002-snippet-creation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED - following TDD approach as mandated by constitution. Tests must be written first and initially fail before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Based on Next.js App Router structure in `/package/` directory:

- Frontend pages: `package/app/snippets/new/page.tsx`
- API routes: `package/app/api/snippets/route.ts`
- Components: `package/components/snippets/`
- Database services: `package/lib/db/snippets.ts`
- Types: `package/types/snippet.ts`
- Utils: `package/utils/snippet-validators.ts`
- Tests: co-located with source files using `.test.tsx` or `.test.ts` suffix

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and database schema updates

- [ ] T001 Create database migration for snippets table in package/lib/db/migrations/003_add_snippets.sql
- [ ] T002 [P] Create snippet TypeScript types in package/types/snippet.ts
- [ ] T003 [P] Create base snippet validation utilities in package/utils/snippet-validators.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Implement database service layer for snippets in package/lib/db/snippets.ts
- [ ] T005 [P] Create API route handler for POST /api/snippets in package/app/api/snippets/route.ts
- [ ] T006 [P] Create basic SnippetForm component in package/components/snippets/SnippetForm.tsx
- [ ] T007 Update database initialization to run new migrations in package/lib/db/init.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Basic Snippet with Title and Code (Priority: P1) 🎯 MVP

**Goal**: Allow developers to save code snippets with title and content - the core functionality that delivers immediate value

**Independent Test**: Can create a snippet with valid title and code content, verify it's saved and retrievable. Delivers the primary value of preserving code for later use.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T008 [P] [US1] Unit test for snippet creation service function in package/lib/db/**tests**/snippets.test.ts
- [ ] T009 [P] [US1] Integration test for POST /api/snippets endpoint in package/app/api/snippets/**tests**/route.test.ts
- [ ] T010 [P] [US1] Component test for SnippetForm basic rendering in package/components/snippets/**tests**/SnippetForm.test.tsx

### Implementation for User Story 1

- [ ] T011 [US1] Implement createSnippet function in package/lib/db/snippets.ts (includes line ending normalization to LF)
- [ ] T012 [US1] Implement POST request handler in package/app/api/snippets/route.ts (delegates to service layer)
- [ ] T013 [US1] Implement basic form rendering and submission in package/components/snippets/SnippetForm.tsx
- [ ] T014 [US1] Create snippet creation page in package/app/snippets/new/page.tsx
- [ ] T015 [US1] Add success message and redirect to snippet list after creation

**Checkpoint**: At this point, User Story 1 should be fully functional - users can create and save basic snippets

---

## Phase 4: User Story 2 - Prevent Empty or Invalid Submissions (Priority: P2)

**Goal**: Validate input and prevent submission of empty or whitespace-only fields with clear error messages

**Independent Test**: Can attempt to submit form with various invalid inputs (empty fields, whitespace-only, exceeding limits) and verify appropriate error messages appear and submission is blocked.

### Tests for User Story 2 ⚠️

- [ ] T016 [P] [US2] Unit test for input validation functions in package/utils/**tests**/snippet-validators.test.ts
- [ ] T017 [P] [US2] Component test for form validation behavior in package/components/snippets/**tests**/SnippetForm.test.tsx
- [ ] T018 [P] [US2] Integration test for API validation in package/app/api/snippets/**tests**/route.test.ts

### Implementation for User Story 2

- [ ] T019 [US2] Implement validation functions (validateTitle, validateContent) in package/utils/snippet-validators.ts
- [ ] T020 [US2] Add client-side validation to SnippetForm with real-time error display on blur events in package/components/snippets/SnippetForm.tsx
- [ ] T021 [US2] Add server-side validation to API route with proper error responses in package/app/api/snippets/route.ts
- [ ] T022 [US2] Implement form submission prevention when validation errors exist

**Checkpoint**: At this point, User Stories 1 AND 2 work together - users can create snippets with proper validation

---

## Phase 5: User Story 3 - Handle Large Code Content (Priority: P3)

**Goal**: Support large code files up to 50,000 characters without truncation or performance issues

**Independent Test**: Can create a snippet with code content approaching 50,000 characters and verify it's saved and retrieved without data loss or performance degradation.

### Tests for User Story 3 ⚠️

- [ ] T023 [P] [US3] Unit test for large content handling in package/lib/db/**tests**/snippets.test.ts
- [ ] T024 [P] [US3] Component test for large content in textarea in package/components/snippets/**tests**/SnippetForm.test.tsx
- [ ] T025 [P] [US3] Performance test for 50,000 character content in package/app/api/snippets/**tests**/route.test.ts

### Implementation for User Story 3

- [ ] T026 [US3] Update validation to support up to 50,000 characters in package/utils/snippet-validators.ts
- [ ] T027 [US3] Add character limit prevention and feedback in SnippetForm in package/components/snippets/SnippetForm.tsx
- [ ] T028 [US3] Ensure database and API can handle large content without performance issues

**Checkpoint**: All core user stories now support large content properly

---

## Phase 6: User Story 4 - Enforce Title Length Limits (Priority: P3)

**Goal**: Enforce 100-character title limit to maintain consistent UI layout and readability

**Independent Test**: Can attempt to enter titles of various lengths and verify the 100-character limit is enforced with appropriate feedback.

### Tests for User Story 4 ⚠️

- [ ] T029 [P] [US4] Unit test for title length validation in package/utils/**tests**/snippet-validators.test.ts
- [ ] T030 [P] [US4] Component test for title length limiting behavior in package/components/snippets/**tests**/SnippetForm.test.tsx

### Implementation for User Story 4

- [ ] T031 [US4] Add title length validation (100 char limit) to validation utilities in package/utils/snippet-validators.ts
- [ ] T032 [US4] Implement title input character limiting and counter in SnippetForm in package/components/snippets/SnippetForm.tsx
- [ ] T033 [US4] Add title length validation to API route in package/app/api/snippets/route.ts

**Checkpoint**: All user stories should now be independently functional with complete validation

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final cleanup

- [ ] T034 [P] Add error handling for database failures with user-friendly messages
- [ ] T035 [P] Add loading states and disabled form submission during save operations
- [ ] T036 [P] Update documentation with snippet creation feature usage
- [ ] T037 [P] Run full test coverage validation to ensure 80% minimum coverage
- [ ] T038 [P] Validate quickstart.md instructions work end-to-end
- [ ] T039 [P] Code cleanup and consistent error message formatting

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Extends US1 validation but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends content handling but independently testable
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Extends title handling but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD requirement)
- Service layer before API routes
- Components before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for snippet creation service function in package/lib/db/__tests__/snippets.test.ts"
Task: "Integration test for POST /api/snippets endpoint in package/app/api/snippets/__tests__/route.test.ts"
Task: "Component test for SnippetForm basic rendering in package/components/snippets/__tests__/SnippetForm.test.tsx"

# After tests are written and failing, launch implementation in dependency order:
Task: "Implement createSnippet function in package/lib/db/snippets.ts"
Task: "Implement POST request handler in package/app/api/snippets/route.ts"
Task: "Implement basic form rendering in package/components/snippets/SnippetForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently - users can create basic snippets
5. Deploy/demo if ready - this delivers core value

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - basic snippet creation!)
3. Add User Story 2 → Test independently → Deploy/Demo (adds input validation)
4. Add User Story 3 → Test independently → Deploy/Demo (adds large content support)
5. Add User Story 4 → Test independently → Deploy/Demo (adds title length limits)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (MVP)
   - Developer B: User Story 2 (Validation)
   - Developer C: User Story 3 (Large content)
   - Developer D: User Story 4 (Title limits)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies between them
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- TDD approach required: verify tests fail before implementing
- Follow Next.js App Router patterns with server components and API routes
- All validation must be implemented both client-side and server-side
- Line ending normalization to LF happens in service layer
- Commit after each task or logical group of tasks
- Stop at any checkpoint to validate story independently
- 80% test coverage requirement must be maintained
