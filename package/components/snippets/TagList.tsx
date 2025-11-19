/**
 * TagList Component
 * Server component for displaying tags as read-only badges
 */

import React from 'react';
import styles from './TagList.module.css';

interface TagListProps {
  tags: string[];
}

export default function TagList({ tags }: TagListProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className={styles.tagList} role="list">
      {tags.map((tag, index) => (
        <li key={index} className={styles.tagItem} role="listitem">
          <span className={styles.tag}>{tag}</span>
        </li>
      ))}
    </ul>
  );
}
