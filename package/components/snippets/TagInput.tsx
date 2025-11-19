'use client';

/**
 * TagInput Component
 * Client component for adding and managing tags with autocomplete
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  validateTagFormat,
  normalizeTagName,
  validateTagCount,
  isDuplicateTag,
  MAX_TAGS_PER_SNIPPET,
} from '@/utils/tag-validators';
import type { Tag } from '@/types/tag';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch autocomplete suggestions (debounced)
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`/api/tags?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      }
    } catch (err) {
      console.error('Failed to fetch tag suggestions:', err);
    }
  }, []);

  // Debounced input change handler
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(inputValue);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue, fetchSuggestions]);

  // Add tag handler
  const addTag = (tagName: string) => {
    setError(null);

    // Validate tag count
    const countValidation = validateTagCount(tags.length + 1);
    if (!countValidation.valid) {
      setError(countValidation.error || 'Maximum tags reached');
      return;
    }

    // Validate tag format
    const formatValidation = validateTagFormat(tagName);
    if (!formatValidation.valid) {
      setError(formatValidation.error || 'Invalid tag format');
      return;
    }

    const normalized = normalizeTagName(tagName);

    // Check for duplicates
    if (isDuplicateTag(normalized, tags)) {
      setError('This tag is already added');
      return;
    }

    // Add tag
    onChange([...tags, normalized]);
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Remove tag handler
  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
    setError(null);
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation(); // Prevent form submission
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (tagName: string) => {
    addTag(tagName);
  };

  return (
    <div className="tag-input-container">
      <label htmlFor="tag-input" aria-label="Tags">
        Tags ({tags.length}/{MAX_TAGS_PER_SNIPPET})
        <span style={{ fontSize: '0.875rem', color: '#666', marginLeft: '8px' }}>
          Press Enter to add each tag
        </span>
      </label>

      {/* Display existing tags */}
      {tags.length > 0 && (
        <div className="tag-list">
          {tags.map((tag, index) => (
            <span key={index} className="tag-badge">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                aria-label={`Remove tag ${tag}`}
                className="tag-remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input field */}
      <div className="input-wrapper">
        <input
          id="tag-input"
          type="text"
          role="textbox"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          disabled={tags.length >= MAX_TAGS_PER_SNIPPET}
          className="tag-input"
        />

        {/* Autocomplete suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list" role="list">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                role="listitem"
                onClick={() => handleSuggestionClick(suggestion.name)}
                className="suggestion-item"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <style jsx>{`
        .tag-input-container {
          margin: 1rem 0;
        }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background-color: #e0e0e0;
          color: #212121;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .tag-remove {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.25rem;
          line-height: 1;
          padding: 0;
          color: #666;
        }

        .tag-remove:hover {
          color: #000;
        }

        .input-wrapper {
          position: relative;
        }

        .tag-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        .tag-input:disabled {
          background-color: #f0f0f0;
          cursor: not-allowed;
        }

        .suggestions-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ccc;
          border-top: none;
          border-radius: 0 0 4px 4px;
          list-style: none;
          margin: 0;
          padding: 0;
          max-height: 200px;
          overflow-y: auto;
          z-index: 10;
        }

        .suggestion-item {
          padding: 0.5rem;
          cursor: pointer;
        }

        .suggestion-item:hover {
          background-color: #f0f0f0;
        }

        .error-message {
          color: #d32f2f;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}
