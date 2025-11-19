# Data Model: Assign Snippet Language Dropdown

## Entities

### Snippet
- **Description**: Persisted code snippet created by the user.
- **Attributes**:
  - `id` (string, UUID) – unique identifier.
  - `title` (string, ≤100 chars) – required; existing constraint.
  - `content` (string) – required; stores code body.
  - `language` (string) – required; must match one of the supported language identifiers.
  - `tags` (string[]) – required ≥1; existing constraint.
  - `created_at` (datetime) – auto-set.
  - `updated_at` (datetime) – auto-updated.
- **Validation Rules**:
  - `language` must be a member of the controlled list: JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, HTML, CSS, SQL, JSON, YAML, Markdown, Shell/Bash, PowerShell, Other.
  - On update, language must remain within supported list.

### LanguageOption (derived)
- **Description**: Controlled vocabulary entry used by UI and validation.
- **Attributes**:
  - `id` (string) – canonical identifier (lowercase, hyphenated as needed).
  - `label` (string) – display string shown to users.
- **Behavior**:
  - Alphabetical ordering by `label` when presented to users.
  - Exposed as immutable set packaged with application code.

## Relationships
- Snippet → LanguageOption: many-to-one logical relationship enforced by application validation (no separate table).
- Snippet ↔ Tag: existing many-to-many relationship unchanged by this feature.

## State Transitions
1. **Draft (form)**: `language` unset until user selects an option.
2. **Ready to Save**: `language` selected; client validation passes.
3. **Persisted**: Snippet stored with selected `language`; downstream views surface value.
4. **Edited Snippet**: When editing, dropdown pre-selects persisted `language`; updates must pass same validation.
