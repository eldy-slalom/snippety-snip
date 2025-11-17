# Functional Requirements

## Overview

This document outlines the functional requirements for the Snippety-Snip application, a local code snippet management tool. The application allows users to create, view, edit, delete, search, and manage code snippets with support for multiple programming languages and file formats.

---

## 1. Add Snippet

### Description

Users can create and save new code snippets with metadata including title, code content, programming language, and tags. The system automatically manages creation and update timestamps.

### Requirements

1. **Title Field**

   - Required field
   - Text input
   - Maximum length: 100 characters
   - Validation: Cannot be empty or whitespace only

2. **Code Content Field**

   - Required field
   - Multi-line textarea input
   - Supports code formatting (preserves whitespace, tabs, newlines)
   - No maximum length limit (reasonable limit: 50,000 characters)
   - Validation: Cannot be empty or whitespace only

3. **Language Field**

   - Required field
   - Dropdown/select input
   - Pre-populated list of common programming languages
   - Must include: JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, HTML, CSS, SQL, JSON, YAML, Markdown, Shell/Bash, PowerShell, and "Other"
   - Default selection: None (user must select)
   - Validation: Must select a language from the dropdown
   - List sorted alphabetically

4. **Tags Field**

   - Required field
   - At least one tag must be provided
   - Tag input with autocomplete suggestions
   - Supports multiple tags (comma-separated or individual tag inputs)
   - Tag format: Alphanumeric characters, hyphens, underscores
   - Maximum tag length: 30 characters
   - Maximum number of tags: 5 per snippet
   - Validation: At least one tag required, no duplicate tags

5. **Timestamps**
   - Updated timestamp: Automatically set when snippet is created and updated on edits
   - Format: ISO 8601 format (YYYY-MM-DD HH:MM:SS)
   - Display format: User-friendly relative time (e.g., "2 hours ago", "3 days ago")

### Behavior

1. User navigates to "Add Snippet" page (`/snippets/new`)
2. Form displays with all required fields
3. User fills in:
   - Title
   - Code content (with syntax highlighting preview)
   - Language (from dropdown)
   - Tags (at least one)
4. Form validation occurs:
   - Real-time validation for each field
   - Submit button disabled until all requirements met
   - Error messages displayed for invalid fields
5. On successful submission:
   - Snippet is saved to SQLite database
   - Success message displayed
   - User redirected to snippet detail page or snippet list
6. On validation failure:
   - Form remains on page
   - Error messages displayed for invalid fields
   - User can correct and resubmit

---

## 2. View Snippet List

### Description

Users can view a list of all saved snippets with key information displayed in a card format. The list supports sorting and displays essential snippet metadata.

### Requirements

1. **List Display**

   - Show all snippets in chronological order (newest first) by default
   - Display snippet cards/list items with:
     - Snippet title
     - Language badge/indicator
     - Tags (displayed as badges/chips)
     - Preview of code content (first 3-5 lines, truncated)
     - Updated timestamp (relative time)
     - Action buttons (View, Edit, Delete)

2. **Sorting Options**

   - Sort by: Date Created (newest/oldest), Date Updated (newest/oldest), Title (A-Z, Z-A), Language
   - Default sort: Date Created (newest first)
   - Sort controls visible and accessible

3. **Empty State**

   - Display friendly message when no snippets exist
   - Show "Add Your First Snippet" call-to-action button

4. **Pagination/Infinite Scroll** (if needed)
   - If more than 20 snippets, implement infinite scroll
   - Show snippet count (e.g., "Showing 1-20 of 45 snippets")

### Behavior

1. User navigates to home page (`/`)
2. Application fetches all snippets from SQLite database
3. Snippets are displayed in a list/grid format
4. Each snippet card shows:
   - Title (clickable, links to detail view)
   - Language badge with color coding
   - Tags as small badges
   - Code preview (syntax highlighted, truncated)
   - Relative timestamp
   - Quick action buttons
5. User can:
   - Click on snippet title or card to view full snippet
   - Use sort dropdown to change sort order
   - Click "Edit" button to edit snippet
   - Click "Delete" button to delete snippet
   - Use search/filter to narrow down results

---

## 3. View Individual Snippet

### Description

Users can view the complete details of a single snippet including full code content with syntax highlighting, all metadata, and available actions.

### Requirements

1. **Snippet Display**

   - Full snippet title
   - Complete code content with syntax highlighting
   - Language indicator/badge
   - All tags displayed as badges
   - Created timestamp (formatted: "Created on [date] at [time]")
   - Updated timestamp (formatted: "Last updated [relative time]")
   - Copy to clipboard button (prominent)
   - Edit button
   - Delete button

2. **Code Display**

   - Syntax highlighting based on selected language
   - Preserve code formatting (indentation, whitespace)
   - Line numbers (optional, toggleable)
   - Monospace font
   - Scrollable code block if content is long
   - Dark/light theme support (based on app theme)

3. **Navigation**
   - Back button/link to return to snippet list
   - Breadcrumb navigation (Home > Snippet Title)

### Behavior

1. User clicks on a snippet from the list or navigates directly via URL (`/snippets/[id]`)
2. Application fetches snippet details from SQLite database by ID
3. If snippet not found:
   - Display 404 error page
   - Show "Snippet not found" message
   - Provide link back to snippet list
4. If snippet found:
   - Display full snippet details
   - Apply syntax highlighting to code content
   - Render all tags
   - Show timestamps
   - Enable action buttons (Copy, Edit, Delete)
5. User can:
   - Copy snippet to clipboard (see Copy to Clipboard feature)
   - Edit snippet (see Edit Snippet feature)
   - Delete snippet (see Delete Snippet feature)
   - Navigate back to list

---

## 4. Edit Snippet

### Description

Users can modify existing snippets, updating any field including title, code content, language, and tags. The updated timestamp is automatically refreshed.

### Requirements

1. **Edit Form**

   - Pre-populate all fields with current snippet data
   - Same validation rules as "Add Snippet"
   - All fields editable:
     - Title
     - Code content
     - Language (dropdown with current selection)
     - Tags (pre-populated, editable)

2. **Save Changes**

   - "Save" button to commit changes
   - "Cancel" button to discard changes and return to snippet view
   - Confirmation dialog if user tries to navigate away with unsaved changes

3. **Update Timestamp**
   - Automatically update "updated_at" timestamp on save

### Behavior

1. User clicks "Edit" button from snippet list or snippet detail page
2. User is navigated to edit page (`/snippets/[id]/edit`)
3. Form is pre-populated with current snippet data
4. User modifies fields as needed
5. Real-time validation occurs (same as Add Snippet)
6. On "Save":
   - Validate all fields
   - If valid:
     - Update snippet in SQLite database
     - Update "updated_at" timestamp
     - Display success message
     - Redirect to snippet detail page
   - If invalid:
     - Display error messages
     - Keep form open for corrections
7. On "Cancel":
   - Discard changes
   - Return to snippet detail page or list
8. If user navigates away with unsaved changes:
   - Show confirmation dialog
   - Allow user to save, discard, or cancel navigation

---

## 5. Delete Snippet

### Description

Users can permanently remove snippets from the database. Deletion requires confirmation to prevent accidental data loss.

### Requirements

1. **Delete Action**

   - Delete button available from:
     - Snippet list (each snippet card)
     - Snippet detail page
   - Button should be visually distinct (e.g., red/danger styling)

2. **Confirmation**

   - Confirmation dialog required before deletion
   - Dialog displays:
     - Snippet title
     - Warning message: "Are you sure you want to delete this snippet? This action cannot be undone."
     - "Cancel" button
     - "Delete" button (destructive styling)

3. **Deletion Process**
   - Permanently remove snippet from SQLite database
   - No soft delete or archive functionality (permanent deletion)

### Behavior

1. User clicks "Delete" button on snippet card or detail page
2. Confirmation dialog appears
3. Dialog shows snippet title and warning message
4. User options:
   - Click "Cancel": Dialog closes, no action taken
   - Click "Delete": Proceed with deletion
5. On confirmation:
   - Snippet is deleted from SQLite database
   - Success message displayed: "Snippet '[title]' deleted successfully"
   - User redirected to snippet list
   - Snippet list refreshes to show updated list
6. If deletion fails:
   - Error message displayed
   - User remains on current page
   - Snippet not deleted

---

## 6. Search and Filter

### Description

Users can search and filter snippets by tags and language to quickly find specific snippets from their collection.

### Requirements

1. **Search by Tags**

   - Search input field
   - Autocomplete suggestions based on existing tags
   - Filter snippets that contain any of the searched tags
   - Support multiple tag search (comma-separated or space-separated)
   - Tag matching: Case-insensitive partial match
   - Display active tag filters as removable badges/chips

2. **Filter by Language**

   - Language dropdown filter
   - Options: All Languages, [Individual languages from language list]
   - Filter snippets matching selected language
   - Display active language filter indicator
   - Multiple language selection (optional enhancement)

3. **Combined Filtering**

   - Tags and language filters work together (AND logic)
   - Clear all filters button
   - Filter state persists during session (optional)

4. **Search Results**
   - Display filtered snippet count: "Showing X of Y snippets"
   - Highlight matching tags in results
   - Show "No results found" message when filters yield no matches
   - Provide "Clear filters" option when filters are active

### Behavior

1. User accesses search/filter controls (on snippet list page)
2. **Tag Search:**
   - User types in tag search input
   - Autocomplete suggestions appear based on existing tags
   - User selects tag(s) or types tag name
   - Snippet list filters to show snippets with matching tags
   - Active tag filters displayed as removable badges
3. **Language Filter:**
   - User selects language from dropdown
   - Snippet list filters to show snippets with selected language
   - Active language filter displayed
4. **Combined Results:**
   - If both tag and language filters active:
     - Show snippets matching BOTH criteria
     - Display combined filter indicators
5. **Clear Filters:**
   - User clicks "Clear all" or removes individual filter badges
   - Filters reset, full snippet list displayed
6. **No Results:**
   - If no snippets match filters:
     - Display "No snippets found" message
     - Show active filters
     - Provide "Clear filters" button

---

## 7. Copy to Clipboard

### Description

Users can quickly copy snippet code content to their clipboard for use in other applications. This feature provides instant access to code without manual selection.

### Requirements

1. **Copy Button**

   - Prominent "Copy" button on snippet detail page
   - Icon button (copy icon) on snippet list cards (optional)
   - Accessible button with clear label

2. **Copy Functionality**

   - Copy only the code content (not title, tags, etc.)
   - Preserve code formatting (whitespace, indentation, newlines)
   - Support all code formats and languages

3. **User Feedback**

   - Visual feedback on successful copy:
     - Button text changes to "Copied!" temporarily (2-3 seconds)
     - Icon changes to checkmark
     - Optional toast notification: "Code copied to clipboard"
   - Error handling if copy fails:
     - Display error message
     - Provide fallback (select text manually)

4. **Browser Compatibility**
   - Use Clipboard API (modern browsers)
   - Fallback to document.execCommand for older browsers
   - Handle permission errors gracefully

### Behavior

1. User clicks "Copy" button on snippet detail page or snippet card
2. Application copies code content to clipboard
3. On success:
   - Button shows "Copied!" feedback
   - Toast notification appears (optional)
   - Code is available in clipboard for pasting
4. User can paste code into any application
5. After 2-3 seconds, button returns to normal "Copy" state
6. If copy fails:
   - Error message displayed
   - User can manually select and copy code

---

## 8. Syntax Highlighting

### Description

Code snippets are displayed with syntax highlighting based on their selected programming language, improving readability and code comprehension.

### Requirements

1. **Syntax Highlighting Library**

   - Use a robust syntax highlighting library (e.g., Prism.js, Highlight.js, or Shiki)
   - Support all languages available in language dropdown
   - Light and dark theme support (match app theme)

2. **Language Detection**

   - Use language field from snippet metadata
   - Apply appropriate syntax highlighting rules
   - Fallback to plain text if language not recognized

3. **Code Display**

   - Preserve original code formatting
   - Highlight keywords, strings, comments, functions, etc.
   - Maintain readability with appropriate color contrast
   - Support line numbers (optional, toggleable)

4. **Performance**

   - Efficient rendering for large code blocks
   - Lazy loading for syntax highlighting (if needed)
   - No performance degradation with many snippets

5. **Theme Support**
   - Syntax highlighting colors adapt to app theme (light/dark)
   - Consistent with overall app design (green screen terminal theme)

### Behavior

1. When snippet is displayed (list preview or detail view):
   - Application detects snippet language from metadata
   - Syntax highlighting library processes code content
   - Code is rendered with appropriate color highlighting
2. Syntax highlighting applies:
   - Keywords (if, for, function, etc.) in one color
   - Strings in another color
   - Comments in muted color
   - Functions/variables in distinct colors
   - Language-specific syntax rules applied
3. Code formatting preserved:
   - Indentation maintained
   - Whitespace preserved
   - Line breaks respected
4. Theme adaptation:
   - Colors adjust based on app theme (light/dark mode)
   - Maintains readability and contrast
5. If language not supported:
   - Code displayed as plain text
   - No highlighting applied
   - Still readable and functional

---

## 9. Multiple File Format Support

### Description

The application supports various file formats and content types beyond traditional programming languages, allowing users to store code snippets, configuration files, markup, and other text-based content.

### Requirements

1. **Supported Formats**

   - Programming languages: JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, etc.
   - Markup languages: HTML, XML, SVG
   - Stylesheets: CSS, SCSS, SASS, Less
   - Data formats: JSON, YAML, TOML
   - Documentation: Markdown
   - Configuration: INI, Properties, Environment files
   - Shell scripts: Bash, PowerShell, Shell
   - Database: SQL
   - Other: Plain text, Dockerfile, Makefile

2. **Language Dropdown**

   - Include all supported formats in language dropdown
   - Organized categories (optional):
     - Programming Languages
     - Markup & Stylesheets
     - Data Formats
     - Configuration Files
     - Scripts
     - Other

3. **Syntax Highlighting**

   - Apply appropriate syntax highlighting for each format
   - Support for format-specific syntax rules
   - Fallback to plain text for unrecognized formats

4. **Content Handling**
   - Preserve format-specific characters and structure
   - Support special characters and encoding
   - Handle binary-like content (base64 encoded, etc.) if needed

### Behavior

1. When adding/editing snippet:
   - User selects format from language dropdown
   - Dropdown includes all supported formats
   - User can select appropriate format for their content
2. Content storage:
   - Code content stored as-is in database
   - Format metadata stored in language field
   - No content transformation or validation beyond basic requirements
3. Content display:
   - Syntax highlighting applied based on selected format
   - Format-specific rendering (if applicable)
   - Content displayed exactly as entered
4. Format-specific features:
   - JSON snippets: Validate JSON structure (optional)
   - Markdown snippets: Render as formatted text (optional enhancement)
   - SQL snippets: Format SQL queries (optional enhancement)

---

## Non-Functional Requirements

### Performance

- Snippet list should load within 2 seconds
- Individual snippet view should load within 1 second
- Search/filter operations should be responsive (< 500ms)
- Syntax highlighting should not cause noticeable delay

### Usability

- Intuitive user interface following Material Design principles
- Responsive design (mobile, tablet, desktop)
- Accessible keyboard navigation
- Clear error messages and user feedback

### Data Management

- All data stored locally in SQLite database
- No data loss on application restart
- Database backups recommended (user responsibility)

### Browser Compatibility

- Support modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Graceful degradation for unsupported features

---

## Out of Scope (Future Enhancements)

The following features are explicitly out of scope for the initial version but may be considered for future releases:

- Export snippets (JSON, CSV, etc.)
- Import snippets from other tools
- Snippet sharing/collaboration
- Cloud sync
- Snippet versioning/history
- Favorites/bookmarks
- Snippet templates
- Code execution/preview
- Integration with external tools (GitHub, GitLab, etc.)
- User authentication (multi-user support)
- Snippet categories/folders
- Rich text editing for descriptions
- File attachments
- Snippet analytics/statistics

---

## Version History

- **v1.0** - Initial Functional Requirements Document
  - Core features: Add, View List, View Detail, Edit, Delete
  - Search and filter by tags and language
  - Copy to clipboard functionality
  - Syntax highlighting support
  - Multiple file format support
