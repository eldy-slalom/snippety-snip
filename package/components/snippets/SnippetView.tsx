'use client';

import React from 'react';
import { Snippet } from '@/types/snippet';
import { CodeBlock } from './CodeBlock';
import styles from './SnippetView.module.css';

/**
 * SnippetView component props
 */
export interface SnippetViewProps {
    /** The snippet to display */
    snippet: Snippet;
}

/**
 * SnippetView component - displays a complete snippet with metadata and code
 * 
 * Features:
 * - Displays snippet title, language, tags, and timestamps
 * - Renders code content with syntax highlighting via CodeBlock
 * - Responsive layout
 * 
 * @example
 * ```tsx
 * <SnippetView snippet={snippetData} />
 * ```
 */export function SnippetView({ snippet }: SnippetViewProps) {
    const tags = snippet.tags.split(',').map(tag => tag.trim());

    return (
        <div className={styles.snippetView}>
            <div className={styles.header}>
                <h1 className={styles.title}>{snippet.title}</h1>
                <div className={styles.metadata}>
                    <span className={styles.language}>{snippet.language}</span>
                    <span className={styles.date}>
                        Updated: {new Date(snippet.updated_at).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className={styles.tags}>
                {tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                        {tag}
                    </span>
                ))}
            </div>

            <div className={styles.codeSection}>
                <CodeBlock content={snippet.content} language={snippet.language} />
            </div>
        </div>
    );
}
