# Syntax Highlighting Feature: Quickstart

## Prerequisites

- Next.js 14+ project with TypeScript
- SQLite database for snippets
- App theme context (dark/light)

## Steps

1. **Install Shiki for syntax highlighting**

   ```bash
   npm install shiki
   ```

2. **Add global code block display settings**

   - Store `showLineNumbers` and `theme` in app context or global state.

3. **Create CodeBlock component**

   - Accepts `content`, `language`, `showLineNumbers`, `theme` as props
   - Uses Shiki to highlight code
   - Renders line numbers if enabled
   - Adapts to theme
   - Scrollable for long content

4. **Integrate with Snippet view**

   - Pass snippet content and language to CodeBlock
   - Use global display settings

5. **Handle unsupported languages**

   - Fallback to plain text rendering

6. **Accessibility**
   - Ensure color contrast meets WCAG AA
   - Keyboard navigation for toggles

## Example Usage

```tsx
<CodeBlock
  content={snippet.content}
  language={snippet.language}
  showLineNumbers={globalSettings.showLineNumbers}
  theme={globalSettings.theme}
/>
```

## Test

- Add Jest/RTL tests for CodeBlock rendering, line number toggle, theme adaptation, fallback behavior.
