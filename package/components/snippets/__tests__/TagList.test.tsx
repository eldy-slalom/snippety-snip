/**
 * Component tests for TagList
 * TDD Red Phase - Tests written before implementation
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import TagList from '../TagList';

describe('TagList', () => {
  describe('rendering', () => {
    it('should render tags as badges', () => {
      const tags = ['javascript', 'react', 'typescript'];
      render(<TagList tags={tags} />);

      expect(screen.getByText('javascript')).toBeInTheDocument();
      expect(screen.getByText('react')).toBeInTheDocument();
      expect(screen.getByText('typescript')).toBeInTheDocument();
    });

    it('should render nothing when tags array is empty', () => {
      const { container } = render(<TagList tags={[]} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('should render single tag', () => {
      render(<TagList tags={['javascript']} />);

      expect(screen.getByText('javascript')).toBeInTheDocument();
    });

    it('should render maximum tags (5)', () => {
      const tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];
      render(<TagList tags={tags} />);

      tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });
  });

  describe('styling', () => {
    it('should apply tag badge styling', () => {
      render(<TagList tags={['javascript']} />);

      const tag = screen.getByText('javascript');
      // CSS modules generate class names, just check it has a class
      expect(tag.className).toBeTruthy();
    });

    it('should render tags with proper spacing', () => {
      render(<TagList tags={['javascript', 'react']} />);

      const container = screen.getByText('javascript').parentElement?.parentElement;
      // CSS modules generate class names, just check it has a class
      expect(container?.className).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('should have proper semantic HTML', () => {
      render(<TagList tags={['javascript', 'react']} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('should render tags as list items', () => {
      render(<TagList tags={['javascript', 'react']} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
    });
  });

  describe('edge cases', () => {
    it('should handle very long tag names', () => {
      const longTag = 'a'.repeat(30);
      render(<TagList tags={[longTag]} />);

      expect(screen.getByText(longTag)).toBeInTheDocument();
    });

    it('should handle tags with hyphens and underscores', () => {
      render(<TagList tags={['react-native', 'node_js']} />);

      expect(screen.getByText('react-native')).toBeInTheDocument();
      expect(screen.getByText('node_js')).toBeInTheDocument();
    });

    it('should handle tags with numbers', () => {
      render(<TagList tags={['es2015', 'python3']} />);

      expect(screen.getByText('es2015')).toBeInTheDocument();
      expect(screen.getByText('python3')).toBeInTheDocument();
    });
  });
});
