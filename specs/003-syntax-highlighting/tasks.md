# Syntax Highlighting Feature: Tasks

## Phase 1: Setup
- [ ] T001 Initialize Shiki dependency in package/package.json
- [ ] T002 Add global display settings to app context (showLineNumbers, theme) in package/app/layout.tsx

## Phase 2: Foundational
- [ ] T003 Create CodeBlockDisplaySettings entity in package/types/codeblock-settings.ts
- [ ] T004 Implement code highlighting API endpoint in package/app/api/codeblock/highlight/route.ts

## Phase 3: User Stories (P1)
### [US1] As a developer, I want to view code snippets with syntax highlighting, line numbers, and theme adaptation so that code is readable and matches the app style.
- [ ] T005 [US1] Create CodeBlock component in package/components/snippets/CodeBlock.tsx
- [ ] T006 [US1] Integrate CodeBlock into SnippetView in package/components/snippets/SnippetView.tsx
- [ ] T007 [US1] Implement line number toggle in CodeBlock and global settings
- [ ] T008 [US1] Ensure theme adaptation in CodeBlock using app context
- [ ] T009 [US1] Handle fallback to plain text for unsupported languages in CodeBlock
- [ ] T010 [US1] Add scrollability for long code blocks in CodeBlock
- [ ] T011 [US1] Add accessibility features (WCAG AA, keyboard navigation) in CodeBlock
- [ ] T012 [US1] Add Jest/RTL tests for CodeBlock rendering, line number toggle, theme adaptation, fallback behavior in package/components/snippets/__tests__/CodeBlock.test.tsx

## Final Phase: Polish & Cross-Cutting Concerns
- [ ] T013 Refactor for performance (lazy rendering/virtualization) in CodeBlock if needed
- [ ] T014 Polish UI for consistency with app theme in package/components/snippets/CodeBlock.tsx
- [ ] T015 Update documentation in package/components/snippets/CodeBlock.tsx and package/docs/

## Dependencies
- T001, T002 → T003, T004
- T003, T004 → T005-T012
- T005-T012 → T013-T015

## Parallel Execution Examples
- T001 and T002 can be done in parallel
- T003 and T004 can be done in parallel after setup
- T005-T011 can be done in parallel by different contributors (different files)
- T012 (tests) can be written in parallel with implementation

## Implementation Strategy
- MVP: Complete all [US1] tasks (T005-T012)
- Incremental delivery: Polish phase after MVP

## Task Count
- Total: 15
- User Story [US1]: 8
- Parallel opportunities: 7
- Independent test criteria: Each [US1] task is independently testable
- Suggested MVP scope: [US1] tasks (T005-T012)

## Format Validation
- All tasks follow strict checklist format (checkbox, ID, labels, file paths)
