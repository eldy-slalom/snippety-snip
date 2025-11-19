# Tasks: Assign Snippet Language Dropdown

**Input**: Design documents from `/specs/001-language-selection/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Story-specific automated tests are requested to preserve TDD coverage for the language selection flow.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each slice.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish shared assets required by all subsequent work.

- [x] T001 Create shared language options constant exporting sorted id/label pairs in `package/constants/languages.ts`
- [x] T002 Update snippet domain types to include `LanguageId` union and require language on create/update in `package/types/snippet.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core validation and persistence changes that must exist before story work.

- [x] T003 Integrate language constant into create/update validation helpers with explicit error messaging in `package/utils/snippet-validators.ts`
- [x] T004 Ensure `SnippetService` create/update paths enforce the required language and persist controlled ids in `package/lib/db/snippets.ts`
- [x] T005 Update request schema enum for language options in `specs/002-snippet-creation/contracts/create-snippet.yaml`

**Checkpoint**: Validation, persistence, and contract all recognize the controlled language list.

---

## Phase 3: User Story 1 - Choose language during snippet creation (Priority: P1) 🎯 MVP

**Goal**: Allow snippet authors to pick a language before saving, enforcing alphabetical options and required selection.

**Independent Test**: Using the add-snippet form, confirm submission fails without a language and succeeds when one is chosen, with the language shown after creation.

### Tests for User Story 1 (write first)

- [ ] T006 [P] [US1] Extend form tests for dropdown rendering, alphabetical order, and required validation in `package/components/snippets/__tests__/SnippetForm.test.tsx`
- [ ] T007 [P] [US1] Add API handler tests covering missing-language 400 response and successful persistence in `package/app/api/snippets/__tests__/route.test.ts`
- [ ] T008 [P] [US1] Update database service tests to assert language is stored and returned in `package/lib/db/__tests__/snippets.test.ts`

### Implementation for User Story 1

- [ ] T009 [US1] Render native `<select>` with empty default, sorted options, and inline error messaging in `package/components/snippets/SnippetForm.tsx`
- [ ] T010 [US1] Initialize snippet creation page state without a default language and submit selected value in `package/app/snippets/new/page.tsx`
- [ ] T011 [US1] Wire API route to reuse validators and map language constants before calling service in `package/app/api/snippets/route.ts`
- [ ] T012 [US1] Surface persisted language in snippet detail and confirmation views within `package/components/snippets/SnippetView.tsx`

**Checkpoint**: User Story 1 is fully functional and independently testable end-to-end.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and documentation touchpoints.

- [ ] T013 Execute automated checks (`npm test`, `npm run lint`) from `package/` per quickstart guidance
- [ ] T014 Follow manual quickstart flow to validate dropdown UX and documentation in `specs/001-language-selection/quickstart.md`

---

## Dependencies & Execution Order

1. **Setup (Phase 1)** → establishes shared language assets
2. **Foundational (Phase 2)** → depends on Setup; blocks all story work
3. **User Story 1 (Phase 3)** → depends on Foundational completion; delivers MVP
4. **Polish (Phase 4)** → runs after targeted story completion

Within Phase 3, run test tasks (T006–T008) before implementation tasks (T009–T012) to honor TDD.

## Story Dependency Graph

- US1 depends on completion of Setup and Foundational phases
- No additional user stories in scope; US1 is the MVP slice

## Parallel Execution Opportunities

- T001 and T002 touch different files but T002 should wait for the exported constant; treat as sequential
- T006–T008 can run in parallel after foundational work (distinct test files)
- T009–T012 can progress in parallel where file boundaries do not overlap (e.g., T009 with T011)
- T013 can execute once implementation is merged; T014 can proceed immediately after T013 passes

## Implementation Strategy

1. Complete Setup and Foundational phases to lock down shared validation and persistence
2. For US1, author tests (T006–T008) and confirm they fail
3. Implement UI/API changes (T009–T012) until tests pass and manual flow succeeds
4. Run automated checks (T013) and manual verification (T014)
5. US1 constitutes the MVP; feature can ship once Phase 3 passes acceptance
