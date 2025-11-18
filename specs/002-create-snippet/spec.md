# Feature Specification: Create a New Code Snippet with Title and Content

**Feature Branch**: `002-create-snippet`  
**Created**: 2025-11-18  
**Status**: Draft  
**Input**: User Story US-1.1: "Create a new code snippet with title and content"

## Clarifications

### Session 2025-11-18

- Q: Should the form auto-save drafts to prevent data loss if user navigates away accidentally? → A: No auto-save in v1.0, but show confirmation dialog when navigating away with unsaved changes
- Q: Should the title field auto-trim whitespace on input or only on submission? → A: Trim on submission/validation only, preserve user input during editing
- Q: Should there be a character counter visible for the title field showing remaining characters? → A: Yes, display "X/100" character counter below title field
- Q: What should happen if the database write fails during snippet creation? → A: Display error message, keep user on form with data intact, allow retry
- Q: Should the form provide real-time validation feedback as user types or only on submission? → A: Real-time validation for character limits, submission validation for empty/whitespace-only content
- Q: Should the code content field have any formatting assistance (e.g., tab key handling)? → A: Yes, tab key should insert actual tab character (not change focus), preserve all whitespace

### Clarification Questions (Awaiting Answers)

**Navigation & User Flow:**
- Q1: When a user successfully creates a snippet, should they be redirected to the snippet detail page showing the newly created snippet, or back to the snippet list? (FR-017 states "snippet detail page or list")
- Q2: Should the confirmation dialog when navigating away (FR-018) trigger for all navigation attempts (back button, clicking links, closing tab/window), or only internal navigation?
- Q3: If a user clicks "Cancel" or "Discard" in the navigation confirmation dialog, what should happen to the form data?

**Character Limits & Validation:**
- Q4: For the title field exceeding 100 characters (Scenario 4), should the input be hard-limited (prevent typing beyond 100) or soft-limited (allow typing but show error)?
- Q5: When content exceeds 50,000 characters (Edge Case 1), should the system: (a) prevent paste/typing, (b) truncate silently, (c) truncate with warning, or (d) show error and reject?
- Q6: Should there be a character counter for the code content field showing current character count (similar to title), or is this only for title?

**Error Handling & Messaging:**
- Q7: What should the specific error message text be when database write fails (FR-019)? Should it include technical details or be user-friendly generic message?
- Q8: Should error messages disappear when the user corrects the invalid field, or persist until form is successfully submitted?
- Q9: Where should error messages be displayed: (a) inline below each field, (b) at the top of the form, (c) both, or (d) in a toast/modal?

**Success Feedback:**
- Q10: What should the success message text be (FR-016)? (e.g., "Snippet created successfully", "Your snippet has been saved", etc.)
- Q11: Should the success message be displayed as: (a) toast notification, (b) banner at top of page, (c) modal, or (d) inline message?
- Q12: How long should the success message remain visible before auto-dismissing (if applicable)?

**Form Behavior Details:**
- Q13: When the submit button is disabled to prevent double-submission (FR-015), should there be visual feedback (loading spinner, "Saving..." text)?
- Q14: Should the form fields be disabled/read-only while the save operation is in progress?
- Q15: If validation fails on submission, should focus automatically move to the first invalid field?

**Empty/Initial State:**
- Q16: Should the form fields have placeholder text? If yes, what should they say?
- Q17: Should field labels include visual indicators (asterisks) to show they are required?
- Q18: Should there be helper text below fields explaining requirements before user interaction?

**Whitespace Handling Edge Cases:**
- Q19: For code content validation (FR-009), "whitespace-only" means any combination of spaces, tabs, newlines - should this include other Unicode whitespace characters (non-breaking spaces, zero-width spaces)?
- Q20: When trimming title whitespace (FR-012), should internal consecutive spaces be preserved or collapsed to single spaces?

**Technical Implementation:**
- Q21: For line ending normalization (FR-021), should this happen client-side before submission or server-side during save?
- Q22: When preserving tab characters (FR-006), should tabs be stored as literal tab characters (\t) or converted to a specific number of spaces?
- Q23: Should the form implement any protection against XSS attacks beyond standard input sanitization?

**Browser Compatibility:**
- Q24: For the server-side validation fallback when JavaScript is disabled (Edge Case 7), should the form use traditional POST submission or require JavaScript?
- Q25: What is the minimum browser version support required for this feature?

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Create a new code snippet with title and content (Priority: P0)

As a developer, I want to create a new code snippet with a title and code content so that I can save useful code snippets for future reference.

**Why this priority**: This is the foundational feature of the application. Without the ability to create snippets, no other features (view, edit, delete, search) can function. This is the core value proposition of the application and must be implemented first.

**Independent Test**: This feature can be fully tested independently by creating a minimal form that saves to the database. Even without viewing, editing, or searching functionality, users can create snippets and verify they are saved correctly by checking the database directly. The feature is self-contained with clear inputs and outputs.

**Acceptance Scenarios**:

1. **Given** a user navigates to the "Add Snippet" page, **When** they view the form, **Then** they see empty title and code content fields with clear labels and validation requirements
2. **Given** a user is on the add snippet form, **When** they enter a title with 1-100 characters, **Then** the title is accepted and the character counter updates to show remaining characters
3. **Given** a user is on the add snippet form, **When** they enter multi-line code content with tabs, spaces, and newlines, **Then** all formatting is preserved exactly as entered
4. **Given** a user enters a title exceeding 100 characters, **When** they continue typing, **Then** the input is prevented or truncated and an error message is displayed
5. **Given** a user attempts to submit the form with an empty title field, **When** they click submit, **Then** submission is prevented and an error message states "Title is required"
6. **Given** a user attempts to submit the form with a title containing only whitespace, **When** they click submit, **Then** submission is prevented and an error message states "Title cannot be empty or whitespace only"
7. **Given** a user attempts to submit the form with empty code content, **When** they click submit, **Then** submission is prevented and an error message states "Code content is required"
8. **Given** a user attempts to submit the form with code content containing only whitespace, **When** they click submit, **Then** submission is prevented and an error message states "Code content cannot be empty or whitespace only"
9. **Given** a user has entered valid title and code content, **When** they submit the form, **Then** the snippet is saved to the database and they are redirected to the snippet detail page or list with a success message
10. **Given** a user has entered data in the form, **When** they attempt to navigate away without saving, **Then** a confirmation dialog appears asking if they want to discard unsaved changes
11. **Given** a database write fails during snippet creation, **When** the save operation completes, **Then** an error message is displayed, the user remains on the form with their data intact, and they can retry submission

### Edge Cases

- What happens when a user pastes extremely large content (over 50,000 characters)? → System accepts content up to 50,000 characters, displays warning if limit exceeded, truncates or prevents paste
- How does the system handle special Unicode characters in title or code content? → System accepts and preserves all valid Unicode characters including emojis, special symbols, and international characters
- What happens if a user submits the form multiple times rapidly (double-click)? → Submit button is disabled after first click until operation completes, preventing duplicate submissions
- How does the system handle tabs vs spaces in code content? → System preserves exact input - tabs are stored as tabs, spaces as spaces, no conversion occurs
- What happens when network/database connection is lost during save operation? → Error message displayed, user data preserved in form, retry option provided
- How does the form handle browser autofill/autocomplete in title field? → Autofill is allowed for title field, validation still applies to autofilled content
- What happens if JavaScript is disabled in the browser? → Server-side validation still prevents invalid submissions, but user experience degrades (no real-time feedback)
- How does the system handle line ending differences (CRLF vs LF)? → System normalizes to LF (\n) on save for consistency across platforms

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a form with title and code content input fields accessible via `/snippets/new` route
- **FR-002**: System MUST accept title input as text with a maximum length of 100 characters
- **FR-003**: System MUST display a character counter showing remaining characters for title field (format: "X/100")
- **FR-004**: System MUST accept code content as multi-line textarea with a reasonable maximum length of 50,000 characters
- **FR-005**: System MUST preserve all whitespace, indentation, tabs, and line breaks in code content exactly as entered
- **FR-006**: System MUST handle tab key in code content field by inserting a tab character rather than changing focus
- **FR-007**: System MUST require both title and code content fields before allowing form submission
- **FR-008**: System MUST validate that title is not empty or whitespace-only after trimming leading/trailing whitespace
- **FR-009**: System MUST validate that code content is not empty or whitespace-only after trimming leading/trailing whitespace
- **FR-010**: System MUST display field-specific error messages when validation fails: "Title is required", "Title cannot be empty or whitespace only", "Title must be 100 characters or less", "Code content is required", "Code content cannot be empty or whitespace only"
- **FR-011**: System MUST provide real-time validation feedback for character limits (title exceeding 100 characters)
- **FR-012**: System MUST trim leading and trailing whitespace from title before saving to database
- **FR-013**: System MUST preserve all content in code field without trimming (except for potential line ending normalization)
- **FR-014**: System MUST save the snippet to SQLite database with title and code content when form is validly submitted
- **FR-015**: System MUST disable submit button after first click until save operation completes to prevent duplicate submissions
- **FR-016**: System MUST display a success message after successful snippet creation
- **FR-017**: System MUST redirect user to snippet detail page or snippet list after successful creation
- **FR-018**: System MUST show confirmation dialog when user attempts to navigate away from form with unsaved changes
- **FR-019**: System MUST handle database write failures gracefully by displaying error message, keeping user on form with data intact, and allowing retry
- **FR-020**: System MUST accept and preserve Unicode characters including international characters, emojis, and special symbols in both title and code content
- **FR-021**: System MUST normalize line endings to LF (\n) for consistency across platforms

### Key Entities _(include if feature involves data)_

- **Snippet**: The core entity representing a code snippet. For this feature, the minimal Snippet entity includes:
  - **id**: Unique identifier (auto-generated, primary key)
  - **title**: String, max 100 characters, required, trimmed before storage
  - **code**: String, max 50,000 characters, required, whitespace preserved, line endings normalized to LF
  - **created_at**: Timestamp, automatically set on creation (ISO 8601 format)
  - **updated_at**: Timestamp, automatically set on creation (ISO 8601 format)
  
  Note: Language and tags fields are part of the complete Snippet entity but are handled by separate user stories (US-1.2 and US-1.3). For this feature, we focus only on title and code content.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can successfully create and save snippets with valid title and code content 100% of the time when validation passes
- **SC-002**: Form validation prevents submission of invalid data (empty/whitespace-only fields, exceeding character limits) 100% of the time
- **SC-003**: Character counter updates in real-time within 50ms of user input for 95% of interactions
- **SC-004**: Code formatting (whitespace, indentation, line breaks) is preserved identically in database for 100% of saved snippets
- **SC-005**: Form submission completes and redirects user within 2 seconds for 90% of operations under normal conditions
- **SC-006**: Confirmation dialog appears when navigating away with unsaved changes for 100% of navigation attempts
- **SC-007**: Database write failures are handled gracefully with clear error messages and data preservation for 100% of failure scenarios
- **SC-008**: Double-submission is prevented 100% of the time through button disabling
- **SC-009**: Unicode characters are preserved correctly for 100% of snippets containing international characters or special symbols

## Assumptions

- Database connection is available and functional during normal operation (error handling addresses temporary failures)
- Users have JavaScript enabled in their browsers for optimal experience (server-side validation provides fallback)
- The "Add Snippet" form is accessible via standard navigation from the home page or navigation menu
- Success message and redirect destination (snippet detail page or list) will be determined based on overall UX patterns established in the project
- Language and tags fields will be added in subsequent user stories (US-1.2, US-1.3) and are not part of this specification
- The database schema supports the minimal Snippet entity fields (id, title, code, created_at, updated_at)
- Tab key behavior in textarea is handled via client-side JavaScript (browsers default to focus change)
- Line ending normalization to LF is acceptable across all target platforms (Windows, macOS, Linux)
- The form does not include draft/auto-save functionality in v1.0
- Maximum code content length of 50,000 characters is sufficient for the target use case (typical code snippets)
