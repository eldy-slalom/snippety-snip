# Feature Specification: Assign Snippet Language Dropdown

**Feature Branch**: `001-language-selection`  
**Created**: 2025-11-19  
**Status**: Draft  
**Input**: User description: "US-1.2: Assign a programming language to a snippet. As a developer I want to select a programming language from a dropdown when creating a snippet so that the system can apply appropriate syntax highlighting and categorization. Users must select a language from a pre-populated dropdown list that includes common programming languages (JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, HTML, CSS, SQL, JSON, YAML, Markdown, Shell/Bash, PowerShell, and \"Other\"). The list is sorted alphabetically and requires a selection (no default). Acceptance Criteria: Language dropdown displays all supported languages in alphabetical order; Language selection is required; No default language is pre-selected; Validation prevents submission without language selection."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Choose language during snippet creation (Priority: P1)

A developer drafting a new snippet selects a programming language from the provided dropdown before submitting the form.

**Why this priority**: Without language selection, snippets cannot be categorized or syntax highlighted correctly, blocking downstream experiences.

**Independent Test**: Attempt to create a snippet from the add-snippet form and confirm it cannot be saved until a language is chosen.

**Acceptance Scenarios**:

1. **Given** the add-snippet form is displayed, **When** the user opens the language dropdown, **Then** the list shows all supported languages in alphabetical order with no default selection.
2. **Given** the user leaves the language field untouched, **When** they attempt to submit the form, **Then** submission is blocked and a clear validation message explains that language selection is required.
3. **Given** the user selects a language and completes the form, **When** the snippet is saved, **Then** the chosen language is stored with the new snippet and is shown back in the confirmation view.

---

### Edge Cases

- User revisits the form after a validation error: previously entered title, content, and language choice remain populated so they do not need to reselect.
- User filters input with keyboard navigation only: the dropdown supports typing the first letter of a language and moves focus accordingly.
- User tries to submit immediately without interacting with the dropdown: validation surfaces inline guidance without erasing other inputs.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The add-snippet form MUST present a labeled language dropdown containing the specified set of languages plus "Other", sorted alphabetically as seen by end users.
- **FR-002**: The language field MUST initialize with no pre-selected value and require the user to make an explicit choice before submission is permitted.
- **FR-003**: The system MUST prevent snippet creation if the language field is empty and display an inline validation message describing how to resolve the issue.
- **FR-004**: Upon successful submission, the system MUST persist the selected language with the snippet record and surface that value in subsequent list or detail views that confirm creation.
- **FR-005**: The language dropdown MUST be usable with keyboard-only navigation and announce its label and validation state to assistive technologies.

### Key Entities _(include if feature involves data)_

- **Snippet Draft**: In-progress snippet content captured on the create form, including title, code body, tags, and a required language attribute that must be set before submission.
- **Language Option**: Member of the supported language set (JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, HTML, CSS, SQL, JSON, YAML, Markdown, Shell/Bash, PowerShell, Other) stored as display label plus stable identifier used when persisting snippets.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of snippets saved through the add-snippet flow include a non-empty language attribute selected from the supported list.
- **SC-002**: During usability validation, 95% of participants identify and select a language within 5 seconds of reaching the dropdown.
- **SC-003**: Form submission attempts without a language choice consistently display validation feedback within 1 second and prevent database writes.
- **SC-004**: Post-release analytics (first 2 weeks) show zero missing-language records when reviewing newly created snippets.

## Assumptions

- The defined language list remains unchanged for this iteration; additions or removals are handled in future features.
- Snippet confirmation views already exist and can display the persisted language without additional design changes.
- Accessibility expectations align with WCAG 2.1 AA for form controls and validation messaging.
