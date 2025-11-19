# Tasks: Add Tags to Organize Snippets

**Input**: Design documents from `/specs/001-snippet-tags/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: TDD is mandatory per constitution - all tests must be written before implementation (Red-Green-Refactor cycle).

**Organization**: Tasks are organized by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Code in `package/` directory
- **Next.js App Router**: `package/app/` for pages and API routes
- **Components**: `package/components/`
- **Database**: `package/lib/db/`
- **Types**: `package/types/`
- **Utils**: `package/utils/`
- **Tests**: Co-located with source files or in `__tests__/` directories

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project structure verification and preparation

- [x] T001 Verify existing project structure matches plan.md requirements
- [x] T002 [P] Verify TypeScript configuration supports strict mode in package/tsconfig.json
- [x] T003 [P] Verify Jest and React Testing Library are configured in package/package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create database migration file package/lib/db/migrations/002_add_tags.sql with tags and snippet_tags tables
- [x] T005 [P] Create TypeScript type definitions in package/types/tag.ts (Tag, SnippetTag interfaces)
- [x] T006 [P] Create tag validation utilities in package/utils/tag-validators.ts (validateTagFormat, normalizeTagName, trimTag)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Add tags to organize snippets (Priority: P1) 🎯 MVP

**Goal**: Enable users to add 1-5 tags per snippet with autocomplete suggestions, validation, and normalized storage

**Independent Test**: Users can create/edit snippets with tags, see autocomplete suggestions, and tags are stored correctly. Feature works independently without requiring other snippet features.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T007 [P] [US1] Write unit tests for TagService.createOrFindTag() in package/lib/db/**tests**/tags.test.ts
- [x] T008 [P] [US1] Write unit tests for TagService.getTagsByPrefix() in package/lib/db/**tests**/tags.test.ts
- [x] T009 [P] [US1] Write unit tests for TagService.getTagsBySnippetId() in package/lib/db/**tests**/tags.test.ts
- [x] T010 [P] [US1] Write unit tests for tag validators in package/utils/**tests**/tag-validators.test.ts
- [x] T011 [P] [US1] Write integration test for GET /api/tags endpoint in package/app/api/tags/**tests**/route.test.ts
- [x] T012 [P] [US1] Write component tests for TagInput in package/components/snippets/**tests**/TagInput.test.tsx
- [x] T013 [P] [US1] Write component tests for TagList in package/components/snippets/**tests**/TagList.test.tsx

### Implementation for User Story 1

#### Database Layer

- [x] T014 [US1] Implement TagService class in package/lib/db/tags.ts with createOrFindTag() method
- [x] T015 [US1] Implement TagService.getTagsByPrefix() method in package/lib/db/tags.ts for autocomplete
- [x] T016 [US1] Implement TagService.getTagsBySnippetId() method in package/lib/db/tags.ts to fetch snippet tags
- [x] T017 [US1] Update SnippetService in package/lib/db/snippets.ts to handle tag associations on create/update
- [x] T018 [US1] Update SnippetService.getAllSnippets() in package/lib/db/snippets.ts to include tags via JOIN
- [x] T019 [US1] Update SnippetService.getSnippetById() in package/lib/db/snippets.ts to include tags via JOIN

#### API Layer

- [x] T020 [US1] Create GET handler in package/app/api/tags/route.ts for autocomplete endpoint
- [x] T021 [US1] Implement query parameter validation and error handling in package/app/api/tags/route.ts
- [x] T022 [US1] Add SQL injection prevention using parameterized queries in package/app/api/tags/route.ts

#### Component Layer

- [x] T023 [US1] Create TagInput Client Component in package/components/snippets/TagInput.tsx with input field
- [x] T024 [US1] Implement autocomplete dropdown with debouncing in package/components/snippets/TagInput.tsx
- [x] T025 [US1] Add client-side tag validation (format, length, duplicates) in package/components/snippets/TagInput.tsx
- [x] T026 [US1] Implement tag normalization (trim, lowercase) in package/components/snippets/TagInput.tsx
- [x] T027 [US1] Add tag removal functionality in package/components/snippets/TagInput.tsx
- [x] T028 [US1] Create TagList Server Component in package/components/snippets/TagList.tsx to display tags as badges
- [x] T029 [US1] Update SnippetForm component in package/components/snippets/SnippetForm.tsx to include TagInput
- [x] T030 [US1] Update snippet creation page in package/app/snippets/new/page.tsx to handle tags in form submission
- [ ] T031 [US1] Update snippet edit page in package/app/snippets/[id]/page.tsx to pre-populate tags and handle updates

#### Integration

- [x] T032 [US1] Integrate TagInput with API endpoint for autocomplete in package/components/snippets/TagInput.tsx
- [x] T033 [US1] Ensure tag validation errors display clearly in package/components/snippets/TagInput.tsx
- [x] T034 [US1] Verify tag normalization works end-to-end (input → storage → display)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can add tags to snippets, see autocomplete suggestions, and tags are stored correctly.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and validation across the feature

- [ ] T035 [P] Run database migration to verify tags schema in package/lib/db/migrations/002_add_tags.sql
- [ ] T036 [P] Verify all tests pass and achieve 80%+ coverage
- [ ] T037 [P] Run quickstart.md validation scenarios to verify all acceptance criteria
- [ ] T038 [P] Performance testing: Verify autocomplete API responds in <200ms for 90% of requests
- [ ] T039 [P] Code review: Verify TypeScript strict mode compliance and no `any` types
- [ ] T040 [P] Code review: Verify all validation rules are enforced (client + server)
- [ ] T041 [P] Documentation: Update README.md if needed with tag feature information
- [ ] T042 [P] Accessibility: Verify TagInput and TagList components meet WCAG AA standards

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user story work
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
  - Tests MUST be written first (TDD) and fail before implementation
  - Database layer → API layer → Component layer → Integration
- **Polish (Phase 4)**: Depends on User Story 1 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
  - This is the MVP and can be delivered independently

### Within User Story 1

- **Tests First** (T007-T013): Write all tests, ensure they FAIL (Red)
- **Database Layer** (T014-T019): Implement TagService and update SnippetService
- **API Layer** (T020-T022): Implement autocomplete endpoint
- **Component Layer** (T023-T031): Build UI components
- **Integration** (T032-T034): Connect all layers and verify end-to-end

### Parallel Opportunities

- **Phase 1**: T002 and T003 can run in parallel
- **Phase 2**: T005 and T006 can run in parallel (after T004)
- **Phase 3 Tests**: All test tasks (T007-T013) can run in parallel
- **Phase 3 Database**: T014-T016 can run in parallel (after tests)
- **Phase 3 API**: T020-T022 can run in parallel (after database layer)
- **Phase 3 Components**: T023-T027 can run in parallel (after API layer)
- **Phase 4**: All polish tasks (T035-T042) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (TDD - write tests first):
Task: "Write unit tests for TagService.createOrFindTag() in package/lib/db/__tests__/tags.test.ts"
Task: "Write unit tests for TagService.getTagsByPrefix() in package/lib/db/__tests__/tags.test.ts"
Task: "Write unit tests for TagService.getTagsBySnippetId() in package/lib/db/__tests__/tags.test.ts"
Task: "Write unit tests for tag validators in package/utils/__tests__/tag-validators.test.ts"
Task: "Write integration test for GET /api/tags endpoint in package/app/api/tags/__tests__/route.test.ts"
Task: "Write component tests for TagInput in package/components/snippets/__tests__/TagInput.test.tsx"
Task: "Write component tests for TagList in package/components/snippets/__tests__/TagList.test.tsx"

# After tests are written and failing, launch database layer tasks:
Task: "Implement TagService class in package/lib/db/tags.ts with createOrFindTag() method"
Task: "Implement TagService.getTagsByPrefix() method in package/lib/db/tags.ts for autocomplete"
Task: "Implement TagService.getTagsBySnippetId() method in package/lib/db/tags.ts to fetch snippet tags"

# After database layer, launch API layer:
Task: "Create GET handler in package/app/api/tags/route.ts for autocomplete endpoint"
Task: "Implement query parameter validation and error handling in package/app/api/tags/route.ts"
Task: "Add SQL injection prevention using parameterized queries in package/app/api/tags/route.ts"

# After API layer, launch component layer:
Task: "Create TagInput Client Component in package/components/snippets/TagInput.tsx with input field"
Task: "Implement autocomplete dropdown with debouncing in package/components/snippets/TagInput.tsx"
Task: "Add client-side tag validation (format, length, duplicates) in package/components/snippets/TagInput.tsx"
Task: "Create TagList Server Component in package/components/snippets/TagList.tsx to display tags as badges"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify project structure)
2. Complete Phase 2: Foundational (database migration, types, validators)
3. Complete Phase 3: User Story 1
   - Write all tests first (TDD) - ensure they FAIL
   - Implement database layer to make tests pass
   - Implement API layer
   - Implement component layer
   - Integrate and verify
4. **STOP and VALIDATE**: Test User Story 1 independently using quickstart.md scenarios
5. Complete Phase 4: Polish and validation
6. Deploy/demo if ready

### Incremental Delivery

Since there's only one user story, the delivery is:

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Polish and optimize → Final delivery

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Write all tests (T007-T013) - TDD
   - Developer B: Prepare component structure
3. Once tests are written and failing:
   - Developer A: Database layer (T014-T019)
   - Developer B: API layer (T020-T022)
4. Once database and API are done:
   - Developer A: TagInput component (T023-T027)
   - Developer B: TagList component and integration (T028-T034)
5. Polish phase: All developers review and validate

---

## Notes

- **[P] tasks** = different files, no dependencies - can work in parallel
- **[US1] label** = maps task to User Story 1 for traceability
- **TDD is mandatory**: All tests (T007-T013) must be written FIRST and FAIL before implementation
- **Verify tests fail**: Before implementing, ensure all tests fail (Red phase)
- **Commit after each task or logical group**: Small, frequent commits
- **Stop at checkpoint**: Validate User Story 1 independently before polish phase
- **File paths**: All paths are relative to repository root, code is in `package/` directory
- **Avoid**: Vague tasks, same file conflicts, skipping TDD phase

---

## Task Summary

- **Total Tasks**: 42
- **Setup Tasks**: 3 (Phase 1)
- **Foundational Tasks**: 3 (Phase 2)
- **User Story 1 Tasks**: 28 (Phase 3)
  - Test Tasks: 7
  - Implementation Tasks: 21
- **Polish Tasks**: 8 (Phase 4)

**MVP Scope**: Phases 1-3 (User Story 1) = 34 tasks

**Independent Test Criteria**: Users can create/edit snippets with tags, see autocomplete suggestions, validate tags, and tags are stored correctly. Feature works independently without requiring other snippet features.
