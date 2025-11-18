/**
 * Component tests for SnippetForm
 * TDD Red Phase - Tests written before implementation
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import SnippetForm from '../SnippetForm';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

const mockPush = jest.fn();
const mockRouter = {
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
};

describe('SnippetForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (global.fetch as jest.Mock).mockClear();
    });

    describe('Rendering', () => {
        it('should render form fields correctly', () => {
            render(<SnippetForm />);

            expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/code content/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /create snippet/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        });

        it('should render form fields with correct attributes', () => {
            render(<SnippetForm />);

            const titleInput = screen.getByLabelText(/title/i);
            const contentTextarea = screen.getByLabelText(/code content/i);

            expect(titleInput).toHaveAttribute('type', 'text');
            expect(titleInput).toHaveAttribute('maxLength', '100');
            expect(titleInput).toHaveAttribute('placeholder', 'Enter a descriptive title for your snippet');

            expect(contentTextarea).toHaveAttribute('rows', '15');
            expect(contentTextarea).toHaveAttribute('maxLength', '50000');
            expect(contentTextarea).toHaveAttribute('placeholder', 'Paste your code snippet here...');
        });

        it('should mark required fields with asterisk', () => {
            render(<SnippetForm />);

            expect(screen.getByText(/title \*/i)).toBeInTheDocument();
            expect(screen.getByText(/code content \*/i)).toBeInTheDocument();
        });
    });

    describe('Form Validation', () => {
        it('should show error message when title field is empty on blur', async () => {
            const user = userEvent.setup();
            render(<SnippetForm />);

            const titleInput = screen.getByLabelText(/title/i);

            await user.click(titleInput);
            await user.tab(); // Blur the field

            expect(screen.getByText('Title is required')).toBeInTheDocument();
        });

        it('should show error message when title contains only whitespace on blur', async () => {
            const user = userEvent.setup();
            render(<SnippetForm />);

            const titleInput = screen.getByLabelText(/title/i);

            await user.type(titleInput, '   \t  \n  ');
            await user.tab(); // Blur the field

            expect(screen.getByText('Title cannot be empty or whitespace only')).toBeInTheDocument();
        });

        it('should show error message when content field is empty on blur', async () => {
            const user = userEvent.setup();
            render(<SnippetForm />);

            const contentTextarea = screen.getByLabelText(/code content/i);

            await user.click(contentTextarea);
            await user.tab(); // Blur the field

            expect(screen.getByText('Code content is required')).toBeInTheDocument();
        });

        it('should show error message when content contains only whitespace on blur', async () => {
            const user = userEvent.setup();
            render(<SnippetForm />);

            const contentTextarea = screen.getByLabelText(/code content/i);

            await user.type(contentTextarea, '   \t  \n  ');
            await user.tab(); // Blur the field

            expect(screen.getByText('Code content cannot be empty or whitespace only')).toBeInTheDocument();
        });

        it('should disable submit button when there are validation errors', async () => {
            const user = userEvent.setup();
            render(<SnippetForm />);

            const titleInput = screen.getByLabelText(/title/i);
            const submitButton = screen.getByRole('button', { name: /create snippet/i });

            await user.click(titleInput);
            await user.tab(); // Blur to trigger validation

            await waitFor(() => {
                expect(submitButton).toBeDisabled();
            });
        });

        it('should enable submit button when all fields are valid', async () => {
            const user = userEvent.setup();
            render(<SnippetForm />);

            const titleInput = screen.getByLabelText(/title/i);
            const contentTextarea = screen.getByLabelText(/code content/i);
            const submitButton = screen.getByRole('button', { name: /create snippet/i });

            await user.type(titleInput, 'Valid Title');
            await user.type(contentTextarea, 'console.log("valid content");');

            await waitFor(() => {
                expect(submitButton).not.toBeDisabled();
            });
        });
    });

    describe('Form Submission', () => {
        it('should submit form with valid data', async () => {
            const user = userEvent.setup();
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                status: 201,
                json: async () => ({
                    snippet: {
                        id: 1,
                        title: 'Test Snippet',
                        content: 'console.log("test");',
                        created_at: '2023-01-01T00:00:00Z',
                        updated_at: '2023-01-01T00:00:00Z'
                    }
                }),
            });

            render(<SnippetForm />);

            const titleInput = screen.getByLabelText(/title/i);
            const contentTextarea = screen.getByLabelText(/code content/i);
            const submitButton = screen.getByRole('button', { name: /create snippet/i });

            await user.type(titleInput, 'Test Snippet');
            await user.type(contentTextarea, 'console.log("test");');
            await user.click(submitButton);

            expect(global.fetch).toHaveBeenCalledWith('/api/snippets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Test Snippet',
                    content: 'console.log("test");'
                }),
            });

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/');
            });
        });

        it('should prevent submission when validation errors exist', async () => {
            const user = userEvent.setup();
            render(<SnippetForm />);

            const submitButton = screen.getByRole('button', { name: /create snippet/i });

            await user.click(submitButton);

            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should show loading state during submission', async () => {
            const user = userEvent.setup();
            (global.fetch as jest.Mock).mockImplementation(() =>
                new Promise(resolve => setTimeout(resolve, 100))
            );

            render(<SnippetForm />);

            const titleInput = screen.getByLabelText(/title/i);
            const contentTextarea = screen.getByLabelText(/code content/i);
            const submitButton = screen.getByRole('button', { name: /create snippet/i });

            await user.type(titleInput, 'Test Snippet');
            await user.type(contentTextarea, 'console.log("test");');
            await user.click(submitButton);

            expect(screen.getByRole('button', { name: /creating.../i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /creating.../i })).toBeDisabled();
        });

        it('should handle API errors gracefully', async () => {
            const user = userEvent.setup();
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({
                    error: 'Validation failed'
                }),
            });

            const mockOnError = jest.fn();
            render(<SnippetForm onError={mockOnError} />);

            const titleInput = screen.getByLabelText(/title/i);
            const contentTextarea = screen.getByLabelText(/code content/i);
            const submitButton = screen.getByRole('button', { name: /create snippet/i });

            await user.type(titleInput, 'Test Snippet');
            await user.type(contentTextarea, 'console.log("test");');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnError).toHaveBeenCalledWith('Validation failed');
            });
        });
    });

    describe('Navigation', () => {
        it('should navigate to home page on cancel', async () => {
            const user = userEvent.setup();
            render(<SnippetForm />);

            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            await user.click(cancelButton);

            expect(mockPush).toHaveBeenCalledWith('/');
        });

        it('should call onSuccess callback when provided', async () => {
            const user = userEvent.setup();
            const mockOnSuccess = jest.fn();
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                status: 201,
                json: async () => ({
                    snippet: {
                        id: 1,
                        title: 'Test Snippet',
                        content: 'console.log("test");',
                        created_at: '2023-01-01T00:00:00Z',
                        updated_at: '2023-01-01T00:00:00Z'
                    }
                }),
            });

            render(<SnippetForm onSuccess={mockOnSuccess} />);

            const titleInput = screen.getByLabelText(/title/i);
            const contentTextarea = screen.getByLabelText(/code content/i);
            const submitButton = screen.getByRole('button', { name: /create snippet/i });

            await user.type(titleInput, 'Test Snippet');
            await user.type(contentTextarea, 'console.log("test");');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSuccess).toHaveBeenCalled();
            });
        });
    });

    describe('Input Constraints', () => {
        it('should enforce maximum title length', async () => {
            const user = userEvent.setup();
            render(<SnippetForm />);

            const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
            const longTitle = 'a'.repeat(150);

            await user.type(titleInput, longTitle);

            // Input should be limited to 100 characters by maxLength attribute
            expect(titleInput.value.length).toBeLessThanOrEqual(100);
        });

        it('should enforce maximum content length', async () => {
            const user = userEvent.setup();
            render(<SnippetForm />);

            const contentTextarea = screen.getByLabelText(/code content/i) as HTMLTextAreaElement;
            const longContent = 'a'.repeat(50001);

            await user.type(contentTextarea, longContent);

            // Textarea should be limited to 50000 characters by maxLength attribute
            expect(contentTextarea.value.length).toBeLessThanOrEqual(50000);
        });
    });
});