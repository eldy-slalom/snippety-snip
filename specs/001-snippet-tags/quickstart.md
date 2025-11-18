# Quickstart: Add Tags to Organize Snippets

**Date**: 2025-01-27  
**Feature**: 001-snippet-tags

## Overview

This document provides test scenarios and implementation guidance for the tag management feature. Use these scenarios to validate the implementation and guide development.

## Test Scenarios

### Scenario 1: Add Tags to New Snippet

**Given**: User is creating a new snippet  
**When**: User enters tags "javascript", "react", "hooks"  
**Then**: 
- Tags are displayed as badges/chips
- Tags are normalized (lowercase)
- Snippet can be saved with tags

**Test Steps**:
1. Navigate to `/snippets/new`
2. Fill in snippet title and content
3. Enter tags: "javascript", "react", "hooks"
4. Submit form
5. Verify tags are saved and displayed

**Expected Database State**:
- `tags` table contains: "javascript", "react", "hooks"
- `snippet_tags` table contains 3 associations

### Scenario 2: Autocomplete Tag Suggestions

**Given**: Existing tags "javascript", "java", "typescript" exist  
**When**: User types "java" in tag input  
**Then**: Autocomplete shows "java" and "javascript" (prefix match)

**Test Steps**:
1. Create snippets with tags: "javascript", "java", "typescript"
2. Navigate to snippet creation/edit
3. Type "java" in tag input field
4. Verify autocomplete dropdown appears
5. Verify "java" and "javascript" are shown (max 8 suggestions)

**API Call**:
```http
GET /api/tags?q=java
```

**Expected Response**:
```json
[
  {"id": 1, "name": "java", "created_at": "..."},
  {"id": 2, "name": "javascript", "created_at": "..."}
]
```

### Scenario 3: Tag Validation - Invalid Characters

**Given**: User enters tag with invalid characters  
**When**: User types "tag@123"  
**Then**: Validation error shown, tag not accepted

**Test Steps**:
1. Navigate to snippet creation/edit
2. Enter tag: "tag@123"
3. Verify validation error appears
4. Verify tag is not added to snippet

**Expected Error**: "Tags can only contain letters, numbers, hyphens, and underscores"

### Scenario 4: Tag Validation - Maximum Length

**Given**: User enters tag exceeding 30 characters  
**When**: User types tag longer than 30 chars  
**Then**: Validation error shown, tag not accepted

**Test Steps**:
1. Navigate to snippet creation/edit
2. Enter tag: "a".repeat(31)
3. Verify validation error appears
4. Verify tag is not added

**Expected Error**: "Tag must be 30 characters or less"

### Scenario 5: Tag Validation - Maximum Count

**Given**: Snippet already has 5 tags  
**When**: User attempts to add 6th tag  
**Then**: Validation error shown, 6th tag not accepted

**Test Steps**:
1. Create/edit snippet with 5 tags
2. Attempt to add 6th tag
3. Verify validation error appears
4. Verify only 5 tags remain

**Expected Error**: "Maximum 5 tags per snippet"

### Scenario 6: Tag Validation - Minimum Count

**Given**: User removes all tags from snippet  
**When**: User attempts to save snippet  
**Then**: Validation error shown, snippet not saved

**Test Steps**:
1. Create/edit snippet
2. Remove all tags
3. Attempt to save
4. Verify validation error appears
5. Verify snippet is not saved

**Expected Error**: "At least one tag is required"

### Scenario 7: Tag Normalization - Case Insensitive

**Given**: Tag "javascript" already exists  
**When**: User types "JavaScript" or "JAVASCRIPT"  
**Then**: Existing tag is reused (normalized to "javascript")

**Test Steps**:
1. Create snippet with tag "javascript"
2. Create new snippet
3. Type "JavaScript" in tag input
4. Select from autocomplete or submit
5. Verify tag is stored as "javascript"
6. Verify both snippets share the same tag

**Expected Database State**:
- `tags` table has one row: `{id: 1, name: "javascript"}`
- Both snippets reference tag_id: 1

### Scenario 8: Tag Normalization - Whitespace Handling

**Given**: User enters tag with whitespace  
**When**: User types "  javascript  "  
**Then**: Tag is trimmed to "javascript" before validation

**Test Steps**:
1. Navigate to snippet creation/edit
2. Enter tag: "  javascript  " (with spaces)
3. Submit or tab away
4. Verify tag is stored as "javascript" (trimmed)

**Edge Case**: If tag becomes empty after trimming, show validation error

### Scenario 9: Duplicate Tag Prevention

**Given**: Snippet already has tag "javascript"  
**When**: User attempts to add "javascript" again  
**Then**: Duplicate is prevented, feedback shown

**Test Steps**:
1. Create/edit snippet with tag "javascript"
2. Attempt to add "javascript" again (or "JavaScript")
3. Verify duplicate is prevented
4. Verify feedback message appears

**Expected Behavior**: Tag not added, message: "This tag is already added"

### Scenario 10: Autocomplete - No Matches

**Given**: No tags match user input  
**When**: User types "xyz123"  
**Then**: No autocomplete suggestions shown, user can create new tag

**Test Steps**:
1. Navigate to snippet creation/edit
2. Type "xyz123" in tag input
3. Verify no autocomplete dropdown appears (or empty dropdown)
4. Verify user can continue typing to create new tag

### Scenario 11: Autocomplete - Empty Query

**Given**: User clears tag input  
**When**: Tag input is empty  
**Then**: No autocomplete suggestions shown

**Test Steps**:
1. Navigate to snippet creation/edit
2. Type in tag input, then clear it
3. Verify autocomplete dropdown closes or doesn't appear

### Scenario 12: Tag Display - Edit Snippet

**Given**: Snippet has tags "javascript", "react"  
**When**: User edits snippet  
**Then**: Tags are pre-populated in tag input field

**Test Steps**:
1. Create snippet with tags "javascript", "react"
2. Navigate to edit snippet page
3. Verify tags are displayed in tag input
4. Verify tags can be modified or removed

## Implementation Checklist

### Database Layer
- [ ] Create migration file `002_add_tags.sql`
- [ ] Implement `TagService` class in `lib/db/tags.ts`
- [ ] Add methods: `createOrFindTag()`, `getTagsByPrefix()`, `getTagsBySnippetId()`
- [ ] Update `SnippetService` to handle tag associations
- [ ] Add tag validation utilities in `utils/tag-validators.ts`

### API Layer
- [ ] Create `app/api/tags/route.ts` endpoint
- [ ] Implement GET handler with query parameter validation
- [ ] Add error handling and response formatting
- [ ] Add input sanitization and SQL injection prevention

### Component Layer
- [ ] Create `components/snippets/TagInput.tsx` (Client Component)
- [ ] Implement autocomplete dropdown with debouncing
- [ ] Add tag validation (client-side)
- [ ] Create `components/snippets/TagList.tsx` (Server Component)
- [ ] Update `components/snippets/SnippetForm.tsx` to include TagInput

### Type Definitions
- [ ] Create `types/tag.ts` with Tag, SnippetTag interfaces
- [ ] Export types from `types/index.ts`

### Testing
- [ ] Write unit tests for TagService (TDD)
- [ ] Write unit tests for tag validators
- [ ] Write integration tests for `/api/tags` endpoint
- [ ] Write component tests for TagInput
- [ ] Write component tests for TagList
- [ ] Achieve 80%+ test coverage

## Performance Targets

- Autocomplete API response: <200ms for 90% of requests
- Tag input validation: <50ms (client-side)
- Tag save operation: <500ms total
- Database queries: Use indexes for efficient prefix matching

## Success Criteria Validation

- **SC-001**: 95% success rate - Test with various tag inputs, measure success rate
- **SC-002**: 200ms autocomplete - Measure API response times, ensure 90% <200ms
- **SC-003**: 10 seconds for 5 tags - Time user interaction, ensure <10s
- **SC-004**: 100% validation - Test all invalid inputs, verify none stored
- **SC-005**: 70% tag reuse - Track autocomplete usage vs new tag creation
- **SC-006**: Non-blocking - Verify UI remains responsive during operations

