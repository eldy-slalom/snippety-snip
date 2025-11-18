'use client';

/**
 * SnippetForm Component
 * Form for creating and editing code snippets with tag support
 */

import React, { useState, FormEvent } from 'react';
import TagInput from './TagInput';

interface SnippetFormProps {
  initialData?: {
    title: string;
    content: string;
    language: string;
    tags: string[];
  };
  onSubmit: (data: {
    title: string;
    content: string;
    language: string;
    tags: string[];
  }) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function SnippetForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save Snippet',
}: SnippetFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [language, setLanguage] = useState(initialData?.language || 'javascript');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    if (tags.length === 0) {
      setError('At least one tag is required');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        language,
        tags,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save snippet');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="snippet-form">
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter snippet title..."
          maxLength={100}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="language">
          Language <span className="required">*</span>
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          required
          className="form-input"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="ruby">Ruby</option>
          <option value="php">PHP</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="sql">SQL</option>
          <option value="bash">Bash</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="content">
          Code <span className="required">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your code snippet here..."
          rows={15}
          required
          className="form-input code-textarea"
        />
      </div>

      <div className="form-group">
        <TagInput tags={tags} onChange={setTags} />
        <p className="help-text">
          Add 1-5 tags to organize your snippet. Tags help with searching and categorization.
        </p>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>

      <style jsx>{`
        .snippet-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          border: 1px solid #ef9a9a;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        .required {
          color: #d32f2f;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
        }

        .code-textarea {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
          resize: vertical;
        }

        .help-text {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #666;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background-color: #4caf50;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #45a049;
        }

        .btn-secondary {
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ccc;
        }

        .btn-secondary:hover:not(:disabled) {
          background-color: #e0e0e0;
        }
      `}</style>
    </form>
  );
}
