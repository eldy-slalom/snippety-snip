# Research: Add Tags to Organize Snippets

**Date**: 2025-01-27  
**Feature**: 001-snippet-tags

## Overview

All technical decisions are derived from the project constitution and existing codebase patterns. No additional research was required as the technology stack and architectural patterns are already established.

## Technical Decisions

### Database Schema: Normalized Tags Table

**Decision**: Use normalized tags table (`tags`) with junction table (`snippet_tags`) for many-to-many relationship.

**Rationale**:

- Enables efficient autocomplete queries (indexed tag names)
- Prevents tag duplication (normalized storage)
- Supports future tag management features (renaming, statistics)
- Aligns with relational database best practices
- Enables efficient prefix matching queries with SQL LIKE operator

**Alternatives Considered**:

- **Comma-separated string in snippets table**: Rejected - inefficient for autocomplete, no normalization, harder to query
- **JSON array in snippets table**: Rejected - SQLite JSON support limited, harder to query efficiently

### Tag Normalization: Case-Insensitive

**Decision**: Normalize tag names to lowercase before storage, but allow users to type in any case.

**Rationale**:

- Prevents tag proliferation (JavaScript, javascript, JAVASCRIPT become one tag)
- Improves autocomplete discovery (users find tags regardless of casing)
- Maintains cleaner tag system
- Standard practice in tag systems (GitHub, Stack Overflow)

**Alternatives Considered**:

- **Case-sensitive**: Rejected - leads to tag duplication and poor UX
- **Case-preserving with case-insensitive matching**: Considered but rejected - adds complexity without significant benefit

### Autocomplete Matching: Prefix Matching

**Decision**: Use SQL LIKE operator with prefix matching (e.g., `tag LIKE 'java%'`).

**Rationale**:

- Efficient database queries with indexed tag names
- Predictable user experience (matches common autocomplete patterns)
- Fast query performance (<200ms target achievable)
- Standard autocomplete behavior users expect

**Alternatives Considered**:

- **Substring matching**: Rejected - slower queries, less predictable results
- **Fuzzy matching**: Rejected - unnecessary complexity, performance concerns
- **Exact match only**: Rejected - poor UX, requires exact typing

### Autocomplete Limit: 8 Suggestions

**Decision**: Display maximum 8 autocomplete suggestions at once.

**Rationale**:

- Good balance between discoverability and UI clarity
- Prevents overwhelming the user interface
- Maintains good performance (smaller result set)
- Standard practice in autocomplete implementations

**Alternatives Considered**:

- **5 suggestions**: Considered but rejected - may miss relevant tags
- **10+ suggestions**: Considered but rejected - may overwhelm UI

### Tag Validation: Client + Server Side

**Decision**: Validate tags on both client (immediate feedback) and server (security).

**Rationale**:

- Client-side validation provides immediate feedback (better UX)
- Server-side validation ensures security and data integrity
- Follows defense-in-depth security principle
- Aligns with constitution requirement for input validation

**Implementation Pattern**:

- Client: Real-time validation as user types
- Server: Validation in API route handlers before database operations

## Database Migration Strategy

**Decision**: Create new migration file `002_add_tags.sql` to add tags schema without modifying existing snippets table structure.

**Rationale**:

- Non-breaking change (existing snippets continue to work)
- Allows gradual migration of existing data if needed
- Follows database migration best practices
- Maintains backward compatibility

## Component Architecture

**Decision**: Use Client Component for TagInput (needs interactivity), Server Component for TagList (display only).

**Rationale**:

- Aligns with Next.js App Router best practices
- Server Components for static/display content (better performance)
- Client Components only when needed (interactivity, hooks, browser APIs)
- Follows constitution architecture constraints

## API Design: RESTful Endpoint

**Decision**: Create `/api/tags` endpoint with query parameter for autocomplete.

**Rationale**:

- Follows RESTful conventions
- Simple, predictable API design
- Efficient for autocomplete use case
- Aligns with existing API route patterns

**Endpoint Design**:

- `GET /api/tags?q=prefix` - Returns matching tags for autocomplete
- Returns JSON array of tag objects
- Case-insensitive prefix matching
- Limited to 8 results

## Summary

All technical decisions align with the project constitution and existing patterns. The implementation will follow established conventions for database design, API routes, and component architecture. No additional research or external dependencies required.
