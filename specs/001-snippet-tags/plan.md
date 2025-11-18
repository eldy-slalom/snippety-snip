# Implementation Plan: Add Tags to Organize Snippets

**Branch**: `001-snippet-tags` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-snippet-tags/spec.md`

## Summary

Implement tag management functionality for code snippets, enabling users to add 1-5 tags per snippet with autocomplete suggestions. Tags are stored in a normalized database structure with case-insensitive normalization to prevent duplicates. The feature includes tag input validation, autocomplete with prefix matching (max 8 suggestions), and efficient tag storage using a many-to-many relationship via a junction table.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**: Next.js 14+ (App Router), React 18+, better-sqlite3, React Server Components  
**Storage**: SQLite (local database) - normalized tags table + snippet_tags junction table  
**Testing**: Jest, React Testing Library, minimum 80% coverage (TDD required)  
**Target Platform**: Web (Next.js App Router), works offline  
**Project Type**: Web application (Next.js full-stack)  
**Performance Goals**: Autocomplete suggestions appear within 200ms for 90% of entries, tag operations complete in <500ms  
**Constraints**: Local-first architecture, no external dependencies, <2s page loads, <500ms operations, offline-capable  
**Scale/Scope**: Single-user local application, supports thousands of snippets and tags

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check ✅

- ✅ **TDD Compliance**: Tests will be written before implementation (Red-Green-Refactor cycle)
- ✅ **Code Quality**: TypeScript strict mode, explicit types, no `any`
- ✅ **Local-First**: SQLite database, no external dependencies, works offline
- ✅ **Technology Stack**: Next.js 14+ App Router, React Server Components, TypeScript
- ✅ **Performance**: Autocomplete <200ms target aligns with <500ms operation constraint
- ✅ **Architecture**: API routes (`app/api/**/route.ts`), service layer (`lib/db/`), thin handlers
- ✅ **File Organization**: Follows Next.js App Router structure, kebab-case naming

### Post-Design Check ✅

- ✅ **Data Model**: Normalized tags table + junction table aligns with requirements (data-model.md)
- ✅ **API Contracts**: RESTful endpoint `/api/tags` follows existing patterns (contracts/tags-api.md)
- ✅ **Component Structure**: TagInput (Client Component) and TagList (Server Component) follow guidelines
- ✅ **Database Migration**: Non-breaking migration strategy maintains backward compatibility
- ✅ **Performance**: Indexed queries and limit of 8 suggestions meet <200ms target
- ✅ **Validation**: Client + server-side validation follows security best practices

## Project Structure

### Documentation (this feature)

```text
specs/001-snippet-tags/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
package/
├── app/
│   ├── api/
│   │   └── tags/
│   │       └── route.ts              # GET /api/tags?q=prefix (autocomplete)
│   ├── snippets/
│   │   ├── new/
│   │   │   └── page.tsx              # Create snippet with tags
│   │   └── [id]/
│   │       └── page.tsx              # Edit snippet with tags
│   └── ...
├── components/
│   ├── snippets/
│   │   ├── TagInput.tsx              # Tag input component with autocomplete
│   │   ├── TagList.tsx               # Display tags as badges/chips
│   │   └── SnippetForm.tsx           # Updated to include tag input
│   └── ...
├── lib/
│   └── db/
│       ├── tags.ts                   # Tag service layer (new)
│       ├── snippets.ts               # Updated to handle tags
│       └── migrations/
│           └── 002_add_tags.sql      # Migration for tags + junction table
├── types/
│   └── tag.ts                         # Tag type definitions (new)
└── utils/
    └── tag-validators.ts              # Tag validation utilities (new)
```

**Structure Decision**: Using existing Next.js App Router structure. New files:
- `lib/db/tags.ts` - Tag service layer for CRUD operations and autocomplete
- `components/snippets/TagInput.tsx` - Client component for tag input with autocomplete
- `components/snippets/TagList.tsx` - Server component for displaying tags
- `app/api/tags/route.ts` - API endpoint for tag autocomplete
- `lib/db/migrations/002_add_tags.sql` - Database migration for tags schema
- `types/tag.ts` - TypeScript type definitions for tags

## Complexity Tracking

> **No violations detected** - All design decisions align with constitution principles.
