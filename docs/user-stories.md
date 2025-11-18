# User Stories

This document contains user stories derived from the functional requirements, organized into epics and features. Each user story is tied back to the corresponding functional requirement section.

---

## Epic 1: Snippet Management

### Feature: Add Snippet
**Related to:** Functional Requirement Section 1

#### US-1.1: Create a new code snippet with title and content
**As a** developer  
**I want to** create a new code snippet with a title and code content  
**So that** I can save useful code snippets for future reference

**Description:** Users can create new snippets by providing a title (max 100 characters) and code content (up to 50,000 characters). Both fields are required and validated to ensure they are not empty or whitespace-only.

**Acceptance Criteria:**
- Title field accepts text input up to 100 characters
- Code content field accepts multi-line text with preserved formatting
- Both fields are required and validated
- Form prevents submission if fields are empty or whitespace-only

---

#### US-1.2: Assign a programming language to a snippet
**As a** developer  
**I want to** select a programming language from a dropdown when creating a snippet  
**So that** the system can apply appropriate syntax highlighting and categorization

**Description:** Users must select a language from a pre-populated dropdown list that includes common programming languages (JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, HTML, CSS, SQL, JSON, YAML, Markdown, Shell/Bash, PowerShell, and "Other"). The list is sorted alphabetically and requires a selection (no default).

**Acceptance Criteria:**
- Language dropdown displays all supported languages in alphabetical order
- Language selection is required
- No default language is pre-selected
- Validation prevents submission without language selection

---

#### US-1.3: Add tags to organize snippets
**As a** developer  
**I want to** add tags to my snippets  
**So that** I can organize and categorize my code snippets for easier discovery

**Description:** Users can add one to five tags per snippet. Tags support alphanumeric characters, hyphens, and underscores, with a maximum length of 30 characters per tag. At least one tag is required, and duplicate tags are not allowed. Tag input includes autocomplete suggestions based on existing tags.

**Acceptance Criteria:**
- Tag input supports multiple tags (comma-separated or individual inputs)
- At least one tag is required
- Maximum of 5 tags per snippet
- Each tag can be up to 30 characters (alphanumeric, hyphens, underscores)
- Duplicate tags are prevented
- Autocomplete suggests existing tags as user types

---

#### US-1.4: View automatic timestamps on snippets
**As a** developer  
**I want to** see when snippets were created and last updated  
**So that** I can track when I saved or modified my code snippets

**Description:** The system automatically manages creation and update timestamps in ISO 8601 format. Timestamps are displayed in a user-friendly relative format (e.g., "2 hours ago", "3 days ago") in the UI.

**Acceptance Criteria:**
- Created timestamp is automatically set when snippet is created
- Updated timestamp is automatically set on creation and updated on edits
- Timestamps are stored in ISO 8601 format (YYYY-MM-DD HH:MM:SS)
- Timestamps are displayed in user-friendly relative format in the UI

---

### Feature: View Snippet List
**Related to:** Functional Requirement Section 2

#### US-2.1: View all my saved snippets in a list
**As a** developer  
**I want to** see a list of all my saved snippets  
**So that** I can quickly browse and access my code collection

**Description:** Users can view all snippets displayed in a card/list format showing title, language badge, tags, code preview (first 3-5 lines), relative timestamp, and action buttons. Snippets are displayed in chronological order (newest first) by default.

**Acceptance Criteria:**
- All snippets are displayed in a list/card format
- Each snippet card shows: title, language badge, tags, code preview, timestamp, and action buttons
- Snippets are sorted by date created (newest first) by default
- Code preview shows first 3-5 lines, truncated if longer

---

#### US-2.2: Sort snippets by different criteria
**As a** developer  
**I want to** sort my snippet list by date, title, or language  
**So that** I can organize my snippets in the way that makes most sense for my workflow

**Description:** Users can sort snippets by Date Created (newest/oldest), Date Updated (newest/oldest), Title (A-Z, Z-A), or Language. Sort controls are visible and accessible.

**Acceptance Criteria:**
- Sort dropdown/controls are visible and accessible
- Sorting options include: Date Created (newest/oldest), Date Updated (newest/oldest), Title (A-Z, Z-A), Language
- Default sort is Date Created (newest first)
- Sort order persists during session

---

#### US-2.3: See an empty state when no snippets exist
**As a** developer  
**I want to** see a friendly message when I have no snippets  
**So that** I know how to get started with the application

**Description:** When no snippets exist, the application displays a friendly empty state message with a call-to-action button to add the first snippet.

**Acceptance Criteria:**
- Empty state message is displayed when no snippets exist
- Message includes "Add Your First Snippet" call-to-action button
- Empty state is visually appealing and informative

---

#### US-2.4: Navigate through large collections of snippets
**As a** developer  
**I want to** scroll through many snippets efficiently  
**So that** I can access all my snippets without performance issues

**Description:** If more than 20 snippets exist, the application implements infinite scroll. The snippet count is displayed (e.g., "Showing 1-20 of 45 snippets").

**Acceptance Criteria:**
- Infinite scroll is implemented when more than 20 snippets exist
- Snippet count is displayed (e.g., "Showing 1-20 of 45 snippets")
- Performance remains smooth with large collections

---

### Feature: View Individual Snippet
**Related to:** Functional Requirement Section 3

#### US-3.1: View complete snippet details
**As a** developer  
**I want to** view the full details of a single snippet  
**So that** I can see the complete code content and all metadata

**Description:** Users can view a snippet's full title, complete code content with syntax highlighting, language badge, all tags, created timestamp, updated timestamp, and action buttons (Copy, Edit, Delete).

**Acceptance Criteria:**
- Full snippet title is displayed
- Complete code content is shown with syntax highlighting
- Language indicator/badge is visible
- All tags are displayed as badges
- Created timestamp shows "Created on [date] at [time]"
- Updated timestamp shows "Last updated [relative time]"
- Copy, Edit, and Delete buttons are prominently displayed

---

#### US-3.2: View code with proper formatting and syntax highlighting
**As a** developer  
**I want to** see code with syntax highlighting and preserved formatting  
**So that** I can easily read and understand the code

**Description:** Code is displayed with syntax highlighting based on the selected language, preserving indentation and whitespace. Line numbers are optional and toggleable. Code blocks are scrollable for long content and support dark/light themes.

**Acceptance Criteria:**
- Syntax highlighting is applied based on snippet language
- Code formatting (indentation, whitespace) is preserved
- Line numbers are available (toggleable)
- Monospace font is used
- Long code blocks are scrollable
- Dark/light theme support matches app theme

---

#### US-3.3: Navigate back to snippet list from detail view
**As a** developer  
**I want to** easily return to the snippet list from a snippet detail page  
**So that** I can continue browsing my snippets

**Description:** Users can navigate back to the snippet list using a back button/link or breadcrumb navigation (Home > Snippet Title).

**Acceptance Criteria:**
- Back button/link is visible and accessible
- Breadcrumb navigation shows "Home > Snippet Title"
- Navigation returns user to snippet list

---

#### US-3.4: Handle missing snippets gracefully
**As a** developer  
**I want to** see a clear error message if a snippet doesn't exist  
**So that** I understand what happened and can navigate back

**Description:** If a snippet is not found (e.g., deleted or invalid ID), the application displays a 404 error page with a "Snippet not found" message and a link back to the snippet list.

**Acceptance Criteria:**
- 404 error page is displayed when snippet is not found
- Error message clearly states "Snippet not found"
- Link back to snippet list is provided

---

### Feature: Edit Snippet
**Related to:** Functional Requirement Section 4

#### US-4.1: Edit an existing snippet
**As a** developer  
**I want to** modify an existing snippet's content and metadata  
**So that** I can update my code snippets as they evolve

**Description:** Users can edit any field of an existing snippet (title, code content, language, tags). The form is pre-populated with current snippet data and uses the same validation rules as creating a new snippet.

**Acceptance Criteria:**
- Edit form is accessible from snippet list or detail page
- All fields are pre-populated with current snippet data
- All fields are editable (title, code content, language, tags)
- Same validation rules apply as when creating a snippet

---

#### US-4.2: Save changes to a snippet
**As a** developer  
**I want to** save my edits to a snippet  
**So that** my changes are persisted

**Description:** Users can save changes using a "Save" button. On successful save, the snippet is updated in the database, the updated timestamp is refreshed, a success message is displayed, and the user is redirected to the snippet detail page.

**Acceptance Criteria:**
- "Save" button commits changes to database
- Updated timestamp is automatically refreshed on save
- Success message is displayed after save
- User is redirected to snippet detail page after save
- Validation errors prevent save and display error messages

---

#### US-4.3: Cancel editing without saving changes
**As a** developer  
**I want to** cancel editing a snippet  
**So that** I can discard unwanted changes

**Description:** Users can cancel editing using a "Cancel" button, which discards changes and returns to the snippet detail page or list.

**Acceptance Criteria:**
- "Cancel" button is available on edit form
- Clicking cancel discards all changes
- User is returned to snippet detail page or list

---

#### US-4.4: Prevent accidental loss of unsaved changes
**As a** developer  
**I want to** be warned before losing unsaved changes  
**So that** I don't accidentally lose my work

**Description:** If a user tries to navigate away from the edit page with unsaved changes, a confirmation dialog appears allowing the user to save, discard, or cancel navigation.

**Acceptance Criteria:**
- Confirmation dialog appears when navigating away with unsaved changes
- Dialog allows user to save, discard, or cancel navigation
- Changes are preserved if user cancels navigation

---

### Feature: Delete Snippet
**Related to:** Functional Requirement Section 5

#### US-5.1: Delete a snippet
**As a** developer  
**I want to** permanently delete a snippet  
**So that** I can remove snippets I no longer need

**Description:** Users can delete snippets from either the snippet list or detail page. The delete button is visually distinct (red/danger styling) and requires confirmation before deletion.

**Acceptance Criteria:**
- Delete button is available on snippet list cards and detail page
- Delete button has visually distinct styling (red/danger)
- Deletion permanently removes snippet from database
- Success message is displayed after deletion
- User is redirected to snippet list after deletion

---

#### US-5.2: Confirm before deleting a snippet
**As a** developer  
**I want to** confirm before deleting a snippet  
**So that** I don't accidentally delete important code

**Description:** Before deletion, a confirmation dialog appears showing the snippet title and a warning message: "Are you sure you want to delete this snippet? This action cannot be undone." Users can cancel or confirm deletion.

**Acceptance Criteria:**
- Confirmation dialog appears before deletion
- Dialog displays snippet title
- Warning message states: "Are you sure you want to delete this snippet? This action cannot be undone."
- "Cancel" and "Delete" buttons are available
- Delete button has destructive styling
- Deletion only proceeds after confirmation

---

#### US-5.3: Handle deletion errors gracefully
**As a** developer  
**I want to** see an error message if deletion fails  
**So that** I know what went wrong

**Description:** If deletion fails, an error message is displayed, the user remains on the current page, and the snippet is not deleted.

**Acceptance Criteria:**
- Error message is displayed if deletion fails
- User remains on current page if deletion fails
- Snippet is not deleted if operation fails

---

## Epic 2: Search and Discovery

### Feature: Search and Filter
**Related to:** Functional Requirement Section 6

#### US-6.1: Search snippets by tags
**As a** developer  
**I want to** search for snippets by tags  
**So that** I can quickly find snippets related to specific topics or technologies

**Description:** Users can search snippets using a tag search input with autocomplete suggestions. The search supports multiple tags (comma-separated or space-separated) and performs case-insensitive partial matching. Active tag filters are displayed as removable badges/chips.

**Acceptance Criteria:**
- Tag search input field is available
- Autocomplete suggests existing tags as user types
- Search filters snippets containing any of the searched tags
- Multiple tags can be searched (comma or space-separated)
- Tag matching is case-insensitive and supports partial matches
- Active tag filters are displayed as removable badges/chips

---

#### US-6.2: Filter snippets by programming language
**As a** developer  
**I want to** filter snippets by programming language  
**So that** I can focus on snippets in a specific language

**Description:** Users can filter snippets using a language dropdown filter. Options include "All Languages" and individual languages from the language list. The filter shows snippets matching the selected language, and the active language filter is displayed.

**Acceptance Criteria:**
- Language dropdown filter is available
- Filter includes "All Languages" option and all individual languages
- Filter shows snippets matching selected language
- Active language filter is displayed as an indicator

---

#### US-6.3: Combine tag and language filters
**As a** developer  
**I want to** use both tag and language filters together  
**So that** I can narrow down my search precisely

**Description:** Tag and language filters work together using AND logic, meaning snippets must match both criteria. Users can clear all filters with a single button, and filter state can persist during the session.

**Acceptance Criteria:**
- Tag and language filters work together (AND logic)
- Snippets must match both tag and language criteria when both filters are active
- "Clear all filters" button resets all active filters
- Filter state can persist during session (optional)

---

#### US-6.4: See search results and filter status
**As a** developer  
**I want to** see how many snippets match my search/filter criteria  
**So that** I know if my search is effective

**Description:** The application displays filtered snippet count (e.g., "Showing X of Y snippets"), highlights matching tags in results, shows a "No results found" message when filters yield no matches, and provides a "Clear filters" option when filters are active.

**Acceptance Criteria:**
- Filtered snippet count is displayed: "Showing X of Y snippets"
- Matching tags are highlighted in search results
- "No results found" message appears when filters yield no matches
- Active filters are displayed
- "Clear filters" option is available when filters are active

---

## Epic 3: Code Display and Formatting

### Feature: Syntax Highlighting
**Related to:** Functional Requirement Section 8

#### US-8.1: View code with syntax highlighting
**As a** developer  
**I want to** see code snippets with syntax highlighting  
**So that** I can easily read and understand the code structure

**Description:** Code snippets are displayed with syntax highlighting based on their selected programming language. The highlighting uses a robust library (e.g., Prism.js, Highlight.js, or Shiki) that supports all languages in the dropdown and adapts to light/dark themes.

**Acceptance Criteria:**
- Syntax highlighting is applied to all code snippets
- Highlighting is based on snippet language metadata
- All languages in dropdown are supported
- Syntax highlighting adapts to app theme (light/dark)
- Keywords, strings, comments, functions are highlighted with distinct colors

---

#### US-8.2: Preserve code formatting
**As a** developer  
**I want to** see code with original formatting preserved  
**So that** indentation and structure remain intact

**Description:** Code formatting (indentation, whitespace, line breaks) is preserved when displaying snippets. The code maintains readability with appropriate color contrast and supports optional line numbers.

**Acceptance Criteria:**
- Original code formatting is preserved (indentation, whitespace)
- Line breaks are respected
- Line numbers are optional and toggleable
- Color contrast maintains readability
- Code is displayed in monospace font

---

#### US-8.3: Handle unsupported languages gracefully
**As a** developer  
**I want to** see code even if the language isn't fully supported  
**So that** I can still access my snippets

**Description:** If a language is not recognized or not supported by the syntax highlighting library, the code is displayed as plain text without highlighting, but remains readable and functional.

**Acceptance Criteria:**
- Code is displayed as plain text if language not recognized
- No highlighting is applied for unsupported languages
- Code remains readable and functional
- No errors occur when language is not supported

---

### Feature: Multiple File Format Support
**Related to:** Functional Requirement Section 9

#### US-9.1: Store snippets in various file formats
**As a** developer  
**I want to** save snippets in different file formats  
**So that** I can store code, configuration files, markup, and other text-based content

**Description:** The application supports various file formats including programming languages, markup languages (HTML, XML, SVG), stylesheets (CSS, SCSS, SASS, Less), data formats (JSON, YAML, TOML), documentation (Markdown), configuration files (INI, Properties, Environment files), shell scripts (Bash, PowerShell), SQL, and other formats (Plain text, Dockerfile, Makefile).

**Acceptance Criteria:**
- Language dropdown includes all supported formats
- Formats are organized in categories (optional): Programming Languages, Markup & Stylesheets, Data Formats, Configuration Files, Scripts, Other
- Users can select appropriate format for their content
- Content is stored as-is in database

---

#### US-9.2: Apply format-specific syntax highlighting
**As a** developer  
**I want to** see appropriate syntax highlighting for each file format  
**So that** different content types are displayed correctly

**Description:** Syntax highlighting is applied based on the selected format, with support for format-specific syntax rules. If a format is not recognized, the content falls back to plain text display.

**Acceptance Criteria:**
- Syntax highlighting is applied based on selected format
- Format-specific syntax rules are supported
- Fallback to plain text for unrecognized formats
- Content is displayed exactly as entered

---

#### US-9.3: Preserve format-specific content structure
**As a** developer  
**I want to** preserve special characters and structure in my snippets  
**So that** configuration files and formatted content remain valid

**Description:** The application preserves format-specific characters and structure, supports special characters and encoding, and handles binary-like content (base64 encoded, etc.) if needed.

**Acceptance Criteria:**
- Format-specific characters are preserved
- Content structure is maintained
- Special characters and encoding are supported
- Binary-like content (base64) is handled if needed

---

## Epic 4: User Experience Enhancements

### Feature: Copy to Clipboard
**Related to:** Functional Requirement Section 7

#### US-7.1: Copy snippet code to clipboard
**As a** developer  
**I want to** copy snippet code to my clipboard  
**So that** I can quickly paste it into other applications

**Description:** Users can copy snippet code content to their clipboard using a prominent "Copy" button on the snippet detail page or an icon button on snippet list cards. Only the code content is copied (not title, tags, etc.), and formatting is preserved.

**Acceptance Criteria:**
- "Copy" button is prominently displayed on snippet detail page
- Copy icon button is available on snippet list cards (optional)
- Only code content is copied (not metadata)
- Code formatting (whitespace, indentation, newlines) is preserved
- Copy works for all code formats and languages

---

#### US-7.2: Receive feedback when copying code
**As a** developer  
**I want to** see confirmation when code is copied  
**So that** I know the copy operation was successful

**Description:** On successful copy, the button text changes to "Copied!" temporarily (2-3 seconds), the icon changes to a checkmark, and an optional toast notification appears: "Code copied to clipboard".

**Acceptance Criteria:**
- Button text changes to "Copied!" after successful copy
- Icon changes to checkmark after copy
- Feedback persists for 2-3 seconds
- Optional toast notification: "Code copied to clipboard"
- Button returns to normal state after feedback period

---

#### US-7.3: Handle copy failures gracefully
**As a** developer  
**I want to** be informed if copying fails  
**So that** I can use an alternative method if needed

**Description:** If copy fails, an error message is displayed and a fallback option (manual text selection) is provided. The application uses the Clipboard API for modern browsers and falls back to document.execCommand for older browsers, handling permission errors gracefully.

**Acceptance Criteria:**
- Error message is displayed if copy fails
- Fallback option (manual text selection) is provided
- Clipboard API is used for modern browsers
- Fallback to document.execCommand for older browsers
- Permission errors are handled gracefully

---

## Summary

This document contains **32 user stories** organized into **4 epics** and **8 features**, covering all functional requirements from the functional-requirements.md document:

- **Epic 1: Snippet Management** (19 user stories)
  - Add Snippet (4 stories)
  - View Snippet List (4 stories)
  - View Individual Snippet (4 stories)
  - Edit Snippet (4 stories)
  - Delete Snippet (3 stories)

- **Epic 2: Search and Discovery** (4 user stories)
  - Search and Filter (4 stories)

- **Epic 3: Code Display and Formatting** (6 user stories)
  - Syntax Highlighting (3 stories)
  - Multiple File Format Support (3 stories)

- **Epic 4: User Experience Enhancements** (3 user stories)
  - Copy to Clipboard (3 stories)

Each user story includes:
- User story format (As a/I want to/So that)
- Description
- Acceptance criteria
- Reference to the corresponding functional requirement section

