# Implementation Plan: Syntax Highlighting Feature

## Technical Context

- Next.js 14+ (App Router)
- TypeScript
- SQLite for snippets
- Shiki for syntax highlighting
- CodeBlockDisplaySettings are global for the app
- No per-user or per-snippet display settings
- App theme context for dark/light
- Accessibility: WCAG AA, keyboard navigation
- Performance: Lazy rendering/virtualization for large blocks
- API endpoint for code highlighting

## Constitution Check

- TDD required (Jest, RTL)
- 80%+ test coverage
- TypeScript strict mode
- Local-first, privacy-focused
- No external data storage
- Simplicity, clarity, accessibility
- All gates passed

## Phase 0: Research

- See research.md (all clarifications resolved)

## Phase 1: Design & Contracts

- See data-model.md for entities and validation
- See contracts/codeblock-api.yaml for API contract
- See quickstart.md for setup steps

## Phase 2: Agent Context Update

- Run `.specify/scripts/bash/update-agent-context.sh copilot` after implementation
- Add Shiki and code block API to agent context

## Artifacts

- research.md
- data-model.md
- contracts/codeblock-api.yaml
- quickstart.md
- plan.md

## Branch

- 003-syntax-highlighting
