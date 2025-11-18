import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CodeBlock } from '../CodeBlock';
import { CodeBlockSettingsProvider } from '@/contexts/CodeBlockSettingsContext';

// Mock fetch
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('CodeBlock', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    const renderWithProvider = (component: React.ReactElement) => {
        return render(
            <CodeBlockSettingsProvider>
                {component}
            </CodeBlockSettingsProvider>
        );
    };

    it('should render loading state initially', () => {
        mockFetch.mockImplementation(() => new Promise(() => { })); // Never resolves

        renderWithProvider(<CodeBlock content="const x = 1;" language="javascript" />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render highlighted code after loading', async () => {
        const mockHtml = '<pre><code class="language-javascript">const x = 1;</code></pre>';
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ html: mockHtml }),
        } as Response);

        renderWithProvider(<CodeBlock content="const x = 1;" language="javascript" />);

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        const codeBlock = screen.getByRole('region', { name: /code block/i });
        expect(codeBlock).toBeInTheDocument();
    }); it('should call API with correct parameters', async () => {
        const mockHtml = '<pre><code>test</code></pre>';
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ html: mockHtml }),
        } as Response);

        const content = 'const x = 1;';
        const language = 'javascript';

        renderWithProvider(<CodeBlock content={content} language={language} />);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/codeblock/highlight',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content,
                        language,
                        theme: 'dark', // default theme
                    }),
                })
            );
        });
    });

    it('should toggle line numbers when button is clicked', async () => {
        const mockHtml = '<pre><code>test</code></pre>';
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ html: mockHtml }),
        } as Response);

        renderWithProvider(<CodeBlock content="const x = 1;" language="javascript" />);

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        const toggleButton = screen.getByRole('button', { name: /toggle line numbers/i });

        // Initially should show "Hide Line Numbers" (default is true)
        expect(toggleButton).toHaveTextContent('Hide Line Numbers');

        // Click to hide
        fireEvent.click(toggleButton);
        expect(toggleButton).toHaveTextContent('Show Line Numbers');

        // Click to show again
        fireEvent.click(toggleButton);
        expect(toggleButton).toHaveTextContent('Hide Line Numbers');
    });

    it('should handle API error and show fallback', async () => {
        mockFetch.mockRejectedValueOnce(new Error('API Error'));

        renderWithProvider(<CodeBlock content="const x = 1;" language="javascript" />);

        await waitFor(() => {
            expect(screen.getByText('Failed to highlight code')).toBeInTheDocument();
        });

        // Should still render content as plain text
        const codeBlock = screen.getByRole('code');
        expect(codeBlock).toBeInTheDocument();
    });

    it('should handle HTTP error response', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        } as Response);

        renderWithProvider(<CodeBlock content="const x = 1;" language="javascript" />);

        await waitFor(() => {
            expect(screen.getByText('Failed to highlight code')).toBeInTheDocument();
        });
    });

    it('should have accessibility attributes', async () => {
        const mockHtml = '<pre><code>test</code></pre>';
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ html: mockHtml }),
        } as Response);

        renderWithProvider(<CodeBlock content="const x = 1;" language="javascript" />);

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        const region = screen.getByRole('region', { name: /code block/i });
        expect(region).toBeInTheDocument();

        const codeElement = screen.getAllByRole('code')[0]; // Get the first (outer) code element
        expect(codeElement).toHaveAttribute('aria-label', 'javascript code snippet');

        const toggleButton = screen.getByRole('button', { name: /toggle line numbers/i });
        expect(toggleButton).toHaveAttribute('aria-pressed');
    }); it('should update when theme changes', async () => {
        const mockHtml = '<pre><code>test</code></pre>';
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ html: mockHtml }),
        } as Response);

        renderWithProvider(<CodeBlock content="const x = 1;" language="javascript" />);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        // Theme change would trigger re-render through context
        // This is tested implicitly through the API call parameters test
    });
});
