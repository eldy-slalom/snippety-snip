/**
 * Component tests for TagInput
 * TDD Red Phase - Tests written before implementation
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagInput from '../TagInput';

// Mock fetch for autocomplete API
global.fetch = jest.fn();

describe('TagInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  describe('rendering', () => {
    it('should render input field', () => {
      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should render existing tags as badges', () => {
      render(<TagInput tags={['javascript', 'react']} onChange={mockOnChange} />);
      
      expect(screen.getByText('javascript')).toBeInTheDocument();
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    it('should render remove buttons for each tag', () => {
      render(<TagInput tags={['javascript', 'react']} onChange={mockOnChange} />);
      
      const removeButtons = screen.getAllByLabelText(/remove tag/i);
      expect(removeButtons).toHaveLength(2);
    });

    it('should show placeholder when no tags', () => {
      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByPlaceholderText(/add a tag/i);
      expect(input).toBeInTheDocument();
    });
  });

  describe('adding tags', () => {
    it('should add tag when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'javascript{Enter}');
      
      expect(mockOnChange).toHaveBeenCalledWith(['javascript']);
    });

    it('should normalize tag name (lowercase, trim)', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '  JavaScript  {Enter}');
      
      expect(mockOnChange).toHaveBeenCalledWith(['javascript']);
    });

    it('should clear input after adding tag', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.type(input, 'javascript{Enter}');
      
      expect(input.value).toBe('');
    });

    it('should not add duplicate tags', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={['javascript']} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'javascript{Enter}');
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should show error message for duplicate tags', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={['javascript']} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'javascript{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText(/already added/i)).toBeInTheDocument();
      });
    });

    it('should not add empty tags', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '   {Enter}');
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should not add invalid tags (special characters)', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'tag@123{Enter}');
      
      expect(mockOnChange).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByText(/only contain letters/i)).toBeInTheDocument();
      });
    });

    it('should not add tags longer than 30 characters', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, `${'a'.repeat(31)}{Enter}`);
      
      expect(mockOnChange).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByText(/30 characters or less/i)).toBeInTheDocument();
      });
    });

    it('should not add more than 5 tags', async () => {
      const user = userEvent.setup();
      const tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];
      render(<TagInput tags={tags} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'tag6{Enter}');
      
      expect(mockOnChange).not.toHaveBeenCalled();
      // Input should be disabled when 5 tags are present
      expect(input).toBeDisabled();
    });
  });

  describe('removing tags', () => {
    it('should remove tag when remove button is clicked', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={['javascript', 'react']} onChange={mockOnChange} />);
      
      const removeButtons = screen.getAllByLabelText(/remove tag/i);
      await user.click(removeButtons[0]);
      
      expect(mockOnChange).toHaveBeenCalledWith(['react']);
    });

    it('should remove correct tag', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={['javascript', 'react', 'typescript']} onChange={mockOnChange} />);
      
      const removeButtons = screen.getAllByLabelText(/remove tag/i);
      await user.click(removeButtons[1]); // Remove 'react'
      
      expect(mockOnChange).toHaveBeenCalledWith(['javascript', 'typescript']);
    });
  });

  describe('autocomplete', () => {
    it('should fetch suggestions when typing', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [
          { id: 1, name: 'javascript', created_at: '2025-01-27' },
          { id: 2, name: 'java', created_at: '2025-01-27' },
        ],
      });

      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'java');
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/tags?q=java');
      });
    });

    it('should display autocomplete suggestions', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [
          { id: 1, name: 'javascript', created_at: '2025-01-27' },
          { id: 2, name: 'java', created_at: '2025-01-27' },
        ],
      });

      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'java');
      
      await waitFor(() => {
        expect(screen.getByText('javascript')).toBeInTheDocument();
        expect(screen.getByText('java')).toBeInTheDocument();
      });
    });

    it('should add tag when clicking on autocomplete suggestion', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [
          { id: 1, name: 'javascript', created_at: '2025-01-27' },
        ],
      });

      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'java');
      
      await waitFor(() => {
        expect(screen.getByText('javascript')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('javascript'));
      
      expect(mockOnChange).toHaveBeenCalledWith(['javascript']);
    });

    it('should debounce autocomplete requests', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'jav');
      
      // Should not call fetch immediately
      expect(global.fetch).not.toHaveBeenCalled();
      
      // Should call after debounce delay
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      }, { timeout: 500 });
    });

    it('should hide autocomplete when input is cleared', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [
          { id: 1, name: 'javascript', created_at: '2025-01-27' },
        ],
      });

      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'java');
      
      await waitFor(() => {
        expect(screen.getByText('javascript')).toBeInTheDocument();
      });
      
      await user.clear(input);
      
      await waitFor(() => {
        expect(screen.queryByText('javascript')).not.toBeInTheDocument();
      });
    });
  });

  describe('validation feedback', () => {
    it('should display validation error messages', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'tag@123{Enter}');
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/only contain letters/i);
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveClass(/error/i);
      });
    });

    it('should clear error message when valid input is entered', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={[]} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      
      // Enter invalid tag
      await user.type(input, 'tag@123{Enter}');
      await waitFor(() => {
        expect(screen.getByText(/only contain letters/i)).toBeInTheDocument();
      });
      
      // Clear and enter valid tag
      await user.clear(input);
      await user.type(input, 'javascript{Enter}');
      
      await waitFor(() => {
        expect(screen.queryByText(/only contain letters/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<TagInput tags={['javascript']} onChange={mockOnChange} />);
      
      // Use more specific query for the input field
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'tag-input');
      expect(screen.getByLabelText(/remove tag javascript/i)).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<TagInput tags={['javascript']} onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      input.focus();
      
      expect(input).toHaveFocus();
    });
  });
});
