'use client';

import React, { useEffect, useState } from 'react';
import { useCodeBlockSettings } from '@/contexts/CodeBlockSettingsContext';
import styles from './CodeBlock.module.css';

/**
 * CodeBlock component props
 */
export interface CodeBlockProps {
    /** The code content to be highlighted */
    content: string;
    /** The programming language for syntax highlighting */
    language: string;
    /** Whether to show in preview mode (hides toolbar) */
    preview?: boolean;
}

/**
 * CodeBlock component - displays code with syntax highlighting
 * 
 * Features:
 * - Syntax highlighting using Shiki
 * - Line numbers (toggleable)
 * - Theme adaptation (dark/light)
 * - Scrollable for long content
 * - Fallback to plain text for unsupported languages
 * - Accessible with ARIA labels and keyboard navigation
 * 
 * @example
 * ```tsx
 * <CodeBlock content="const x = 1;" language="javascript" />
 * ```
 */

export function CodeBlock({ content, language, preview = false }: CodeBlockProps) {
    const { settings, setShowLineNumbers } = useCodeBlockSettings();
    const [highlightedHtml, setHighlightedHtml] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const toggleLineNumbers = () => {
        setShowLineNumbers(!settings.showLineNumbers);
    };

    useEffect(() => {
        async function highlightCode() {
            // Ensure we have a valid theme
            if (!settings.theme || (settings.theme !== 'dark' && settings.theme !== 'light')) {
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/codeblock/highlight', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content,
                        language,
                        theme: settings.theme,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to highlight code');
                }

                const data = await response.json();
                setHighlightedHtml(data.html);
            } catch (err) {
                console.error('Error highlighting code:', err);
                setError('Failed to highlight code');
                // Fallback to plain text
                setHighlightedHtml(`<pre><code>${escapeHtml(content)}</code></pre>`);
            } finally {
                setIsLoading(false);
            }
        }

        highlightCode();
    }, [content, language, settings.theme]);

    if (isLoading) {
        return (
            <div className={styles.codeBlock}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.codeBlock}>
                <div className={styles.error}>{error}</div>
                <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
            </div>
        );
    }

    return (
        <div className={styles.codeBlock} role="region" aria-label="Code block">
            {!preview && (
                <div className={styles.toolbar}>
                    <button
                        onClick={toggleLineNumbers}
                        className={styles.toggleButton}
                        aria-label="Toggle line numbers"
                        aria-pressed={settings.showLineNumbers}
                    >
                        {settings.showLineNumbers ? 'Hide' : 'Show'} Line Numbers
                    </button>
                </div>
            )}
            <div
                className={`${styles.codeContent} ${!preview && settings.showLineNumbers ? styles.withLineNumbers : ''}`}
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                role="code"
                aria-label={`${language} code snippet`}
            />
        </div>
    );
}

function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}
