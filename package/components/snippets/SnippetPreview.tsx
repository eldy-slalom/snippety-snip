'use client';

import { CodeBlock } from './CodeBlock';
import type { LanguageId } from '@/constants/languages';

interface SnippetPreviewProps {
  content: string;
  language: LanguageId;
}

/**
 * Maps language IDs from the app to Shiki language names
 */
const languageIdToShiki: Record<string, string> = {
  'c-sharp': 'csharp',
  'c-plus-plus': 'cpp',
  'css': 'css',
  'go': 'go',
  'html': 'html',
  'java': 'java',
  'javascript': 'javascript',
  'json': 'json',
  'kotlin': 'kotlin',
  'markdown': 'markdown',
  'other': 'plaintext',
  'php': 'php',
  'powershell': 'powershell',
  'python': 'python',
  'ruby': 'ruby',
  'rust': 'rust',
  'shell-bash': 'bash',
  'sql': 'sql',
  'swift': 'swift',
  'typescript': 'typescript',
  'yaml': 'yaml',
};

/**
 * SnippetPreview component - displays a truncated code snippet with syntax highlighting
 * Used in the snippet list view
 */
export function SnippetPreview({ content, language }: SnippetPreviewProps) {
  // Truncate content for preview (first 120 characters)
  const previewContent = content.length > 120
    ? content.slice(0, 120) + '...'
    : content;

  // Map language ID to Shiki language name
  const shikiLanguage = languageIdToShiki[language] || 'plaintext';

  return (
    <div style={{ marginBottom: '8px' }}>
      <CodeBlock content={previewContent} language={shikiLanguage} preview={true} />
    </div>
  );
}

