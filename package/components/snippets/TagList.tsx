/**
 * TagList Component
 * Server component for displaying tags as read-only badges
 */

import React from 'react';

interface TagListProps {
  tags: string[];
}

export default function TagList({ tags }: TagListProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className="tag-list" role="list">
      {tags.map((tag, index) => (
        <li key={index} className="tag-item" role="listitem">
          <span className="tag">{tag}</span>
        </li>
      ))}

      <style jsx>{`
        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .tag-item {
          display: inline-block;
        }

        .tag {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background-color: #4caf50;
          color: white;
          border-radius: 16px;
          font-size: 0.875rem;
          font-weight: 500;
        }
      `}</style>
    </ul>
  );
}
