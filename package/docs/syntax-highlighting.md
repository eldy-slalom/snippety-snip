# Syntax Highlighting Feature

## Overview

The Syntax Highlighting feature provides code snippets with proper formatting, syntax highlighting, and interactive display settings. Built with Shiki, it supports multiple programming languages and adapts to the app's dark/light theme.

## Components

### CodeBlock

The main component for displaying highlighted code.

**Location**: `package/components/snippets/CodeBlock.tsx`

**Props**:

- `content: string` - The code content to highlight
- `language: string` - The programming language (e.g., "javascript", "python")

**Features**:

- Syntax highlighting with Shiki
- Toggleable line numbers
- Theme adaptation (dark/light)
- Scrollable for long content
- Fallback to plain text for unsupported languages
- WCAG AA accessible

**Usage**:

```tsx
import { CodeBlock } from "@/components/snippets/CodeBlock";

<CodeBlock content="const x = 1;" language="javascript" />;
```

### SnippetView

Component for displaying a complete snippet with metadata and code.

**Location**: `package/components/snippets/SnippetView.tsx`

**Props**:

- `snippet: Snippet` - The snippet object containing all snippet data

**Features**:

- Displays title, language badge, tags, and timestamps
- Integrates CodeBlock for code display
- Responsive layout

**Usage**:

```tsx
import { SnippetView } from "@/components/snippets/SnippetView";

<SnippetView snippet={snippetData} />;
```

## Context

### CodeBlockSettingsContext

Provides global display settings for all code blocks.

**Location**: `package/contexts/CodeBlockSettingsContext.tsx`

**Settings**:

- `showLineNumbers: boolean` - Whether to show line numbers
- `theme: 'dark' | 'light'` - The current theme

**Usage**:

```tsx
import { useCodeBlockSettings } from "@/contexts/CodeBlockSettingsContext";

const { settings, setShowLineNumbers, setTheme } = useCodeBlockSettings();
```

## API

### POST /api/codeblock/highlight

Highlights code using Shiki and returns HTML.

**Request**:

```json
{
  "content": "const x = 1;",
  "language": "javascript",
  "theme": "dark"
}
```

**Response**:

```json
{
  "html": "<pre><code class=\"language-javascript\">...</code></pre>"
}
```

**Error Responses**:

- `400` - Invalid input (missing or invalid content, language, or theme)
- `500` - Highlighting error

## Supported Languages

- JavaScript, TypeScript
- Python, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin
- HTML, CSS, SQL, JSON, YAML, Markdown
- Bash, PowerShell

For unsupported languages, code is displayed as plain text.

## Testing

Tests are located in `package/components/snippets/__tests__/CodeBlock.test.tsx`.

**Run tests**:

```bash
npm test -- CodeBlock.test.tsx
```

**Coverage**:

- Component rendering
- Line number toggle
- Theme adaptation
- API error handling
- Accessibility features

## Styling

Styles follow the app's green screen terminal theme with:

- Dark background with green accents
- Monospace font (Courier New)
- Terminal-style toolbar
- WCAG AA color contrast

**CSS Modules**:

- `CodeBlock.module.css` - Code block styling
- `SnippetView.module.css` - Snippet view styling

## Performance

- Code highlighting is async via API
- Loading states prevent UI blocking
- Max height (600px) with scrolling for large code blocks
- Future: Virtualization for very large snippets

## Accessibility

- ARIA labels for screen readers
- Keyboard navigation (Tab, Enter)
- Focus indicators (cyan outline)
- Toggle button with `aria-pressed` state
- Role attributes (`region`, `code`)

## Configuration

The feature uses global settings stored in `CodeBlockSettingsContext`. Settings persist across all code blocks in the app.

**Default Settings**:

- Line numbers: Enabled
- Theme: Dark

## Future Enhancements

- Copy to clipboard button
- Code line highlighting
- Diff view for code changes
- Virtualization for extremely large code blocks
- More language support
