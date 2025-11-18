# Syntax Highlighting Feature: Data Model

## Entities

### Snippet

- id: string (UUID)
- content: string
- language: string

### CodeBlockDisplaySettings (global)

- showLineNumbers: boolean
- theme: "dark" | "light"

## Relationships

- CodeBlockDisplaySettings are global for the app and affect all snippets.

## Validation Rules

- language: must be one of supported languages or "plain text"
- content: non-empty string
- showLineNumbers: boolean
- theme: must match app theme

## State Transitions

- theme: changes when app theme changes
- showLineNumbers: toggled by user (affects all code blocks)

## Notes

- No per-user or per-snippet display settings.
- Fallback to plain text for unsupported languages.
