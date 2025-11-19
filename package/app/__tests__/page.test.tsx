import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LANGUAGE_LABEL_BY_ID } from '@/constants/languages';
import Home from '../page';
import { SnippetService } from '@/lib/db/snippets';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe('Home page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the language label for each snippet', async () => {
    jest.spyOn(SnippetService, 'getAllBasicSnippets').mockReturnValue([
      {
        id: 1,
        title: 'Test Snippet',
        content: 'console.log(42);',
        language: 'typescript',
        tags: 'utility',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      },
    ]);

    const page = await Home();
    render(page);

    expect(screen.getByText(LANGUAGE_LABEL_BY_ID.typescript)).toBeInTheDocument();
  });
});
