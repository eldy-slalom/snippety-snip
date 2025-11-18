# Feature Specification: Add Tags to Organize Snippets

**Feature Branch**: `001-snippet-tags`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Add tags to organize snippets"

## Clarifications

### Session 2025-01-27

- Q: How should tags be stored in the database? → A: Normalized tags table with junction table (many-to-many relationship)
- Q: Should tag names be normalized for uniqueness (e.g., case-insensitive, trimmed) to prevent duplicate tags with different casing? → A: Case-insensitive normalization - tags stored in normalized form, users can type any case
- Q: How should autocomplete match user input against existing tags? → A: Prefix matching (starts with) - matches tags that begin with user input
- Q: What should happen when a user enters a tag that becomes empty after trimming whitespace? → A: Treat as invalid tag and show validation error requiring non-empty tag
- Q: What is the maximum number of autocomplete suggestions to display at once? → A: 8 suggestions - moderate, good balance

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add tags to organize snippets (Priority: P1)

As a developer, I want to add tags to my snippets so that I can organize and categorize my code snippets for easier discovery.

**Why this priority**: Tags are essential for organizing and finding snippets in a collection. Without tags, users would need to remember exact titles or browse through all snippets manually. Tags enable efficient categorization and search, making the snippet management system truly useful.

**Independent Test**: This feature can be fully tested independently by allowing users to add tags to snippets (even if snippets themselves are minimal placeholders). The tag input, validation, autocomplete, and tag management can all be tested in isolation. Users can immediately see value through improved organization capabilities.

**Acceptance Scenarios**:

1. **Given** a user is creating or editing a snippet, **When** they enter tags in the tag input field, **Then** the system accepts and displays the tags
2. **Given** a user enters a tag, **When** they type characters that match the beginning of existing tags (prefix match), **Then** the system shows autocomplete suggestions
3. **Given** a user selects a tag from autocomplete, **When** they confirm the selection, **Then** the tag is added to the snippet
4. **Given** a user enters tags, **When** they attempt to add more than 5 tags, **Then** the system prevents adding additional tags and shows a validation message
5. **Given** a user enters a tag, **When** the tag contains invalid characters or exceeds 30 characters, **Then** the system shows validation errors and prevents submission
6. **Given** a user enters tags, **When** they attempt to add a duplicate tag to the same snippet, **Then** the system prevents the duplicate and shows feedback
7. **Given** a user submits a snippet, **When** they have not added at least one tag, **Then** the system prevents submission and shows a validation error requiring at least one tag
8. **Given** a user has existing snippets with tags, **When** they start typing in the tag input field, **Then** the system suggests tags from existing snippets that match the input
9. **Given** a user enters a tag containing only whitespace, **When** the system trims the whitespace, **Then** the tag becomes empty and the system shows a validation error requiring a non-empty tag

### Edge Cases

- What happens when a user enters only whitespace as a tag? → System trims whitespace, detects empty tag, and shows validation error requiring non-empty tag
- How does the system handle tags with leading/trailing spaces? → System trims whitespace before validation; if tag becomes empty, validation error is shown
- What happens when autocomplete suggestions appear but the user types a completely new tag? → User can continue typing to create a new tag; autocomplete suggestions are suggestions only, not required
- How does the system handle tag normalization when a user types "JavaScript" but "javascript" already exists? → System normalizes both to same case-insensitive form and reuses existing tag
- What happens when a user removes all tags from a snippet that previously had tags? → System prevents submission (FR-003 requires at least one tag) and shows validation error
- How does the system handle special characters that are technically allowed but might cause display issues?
- What happens when there are no existing tags in the system yet (first-time user scenario)?
- How does the system handle rapid tag input (typing speed vs autocomplete response time)?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow users to add tags to snippets during snippet creation or editing
- **FR-002**: System MUST support adding multiple tags per snippet (minimum 1, maximum 5)
- **FR-003**: System MUST require at least one tag per snippet before allowing snippet submission
- **FR-004**: System MUST validate tag format: alphanumeric characters, hyphens, and underscores only, maximum 30 characters per tag
- **FR-005**: System MUST prevent duplicate tags within the same snippet (duplicate detection uses case-insensitive matching)
- **FR-006**: System MUST provide autocomplete suggestions based on existing tags as the user types, using case-insensitive prefix matching (tags that start with user input), displaying a maximum of 8 suggestions at once
- **FR-007**: System MUST support tag input via comma-separated values or individual tag entry
- **FR-008**: System MUST trim leading and trailing whitespace from tags before validation and storage
- **FR-011**: System MUST normalize tag names (case-insensitive) before storage to prevent duplicate tags with different casing
- **FR-012**: System MUST reject tags that become empty after trimming whitespace and display a validation error requiring a non-empty tag
- **FR-009**: System MUST display validation errors clearly when tag requirements are not met
- **FR-010**: System MUST store tags using a normalized tags table with a junction table for the many-to-many relationship between snippets and tags, enabling efficient autocomplete queries and tag management

### Key Entities _(include if feature involves data)_

- **Tag**: Represents a label used to categorize and organize snippets. Each tag has a unique identifier and a name (string, max 30 chars, alphanumeric with hyphens/underscores). Tag names are normalized (case-insensitive) before storage to ensure uniqueness. Tags are stored in a normalized tags table. Tags can be associated with multiple snippets, and snippets can have multiple tags (1-5 tags per snippet).
- **Snippet**: Represents a code snippet that can have tags associated with it. The relationship between Snippet and Tag is many-to-many, implemented via a junction table that links snippet IDs to tag IDs.
- **SnippetTag** (junction entity): Represents the many-to-many relationship between snippets and tags. Each record links one snippet to one tag, enabling efficient queries for autocomplete and tag-based operations.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can successfully add tags to snippets 95% of the time without encountering validation errors
- **SC-002**: Tag autocomplete suggestions appear within 200ms of user input for 90% of tag entries
- **SC-003**: Users can add the maximum number of tags (5) to a snippet in under 10 seconds
- **SC-004**: Tag validation prevents invalid tag submissions 100% of the time (zero invalid tags stored)
- **SC-005**: Users can discover and reuse existing tags through autocomplete for 70% of tag entries (reducing tag duplication)
- **SC-006**: Tag input and validation complete without blocking user interaction or causing noticeable delays

## Assumptions

- Tags are normalized using case-insensitive matching (e.g., "JavaScript", "javascript", and "JAVASCRIPT" are treated as the same tag and stored in normalized form)
- Tag autocomplete searches across all existing tags in the system, not just tags from the current user's snippets
- Tags are stored persistently and remain available for autocomplete suggestions across sessions
- The tag input interface supports both keyboard and mouse/touch interactions
- Tag display and management (editing, removing) are handled in the snippet creation/editing interface
- Tag search and filtering capabilities (using tags to find snippets) are out of scope for this feature and will be handled separately
