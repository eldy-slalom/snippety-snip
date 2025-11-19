/**
 * Component tests for SnippetView
 */

import { render, screen } from '@testing-library/react';
import { LANGUAGE_LABEL_BY_ID } from '@/constants/languages';
import type { Snippet } from '@/types/snippet';
import { SnippetView } from '../SnippetView';

jest.mock('../CodeBlock', () => ({
  CodeBlock: ({ content, language }: { content: string; language: string }) => (
    <div data-testid="code-block" data-language={language}>
      {content}
    </div>
  ),
}));

describe('SnippetView', () => {
  const baseSnippet: Snippet = {
    id: 42,
    title: 'Sample Snippet',
    content: 'console.log("Hello");',
    language: 'typescript',
    tags: 'frontend,logging',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-02T12:34:56.000Z',
  };

  it('renders the human-readable language label', () => {
    render(<SnippetView snippet={baseSnippet} />);

    expect(screen.getByText(LANGUAGE_LABEL_BY_ID.typescript)).toBeInTheDocument();
  });

  it('renders tags and code block content', () => {
    render(<SnippetView snippet={baseSnippet} />);

    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('logging')).toBeInTheDocument();

    const codeBlock = screen.getByTestId('code-block');
    expect(codeBlock).toHaveAttribute('data-language', 'typescript');
    expect(codeBlock).toHaveTextContent(baseSnippet.content);
  });
});
