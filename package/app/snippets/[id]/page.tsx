'use client';

/**
 * Edit Snippet Page
 * Page for editing an existing code snippet with tags
 */

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SnippetForm from '@/components/snippets/SnippetForm';

interface SnippetData {
  id: number;
  title: string;
  content: string;
  language: string;
  tagList: { id: number; name: string }[];
}

export default function EditSnippetPage() {
  const router = useRouter();
  const params = useParams();
  const snippetId = params.id as string;

  const [snippet, setSnippet] = useState<SnippetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await fetch(`/api/snippets/${snippetId}`);
        
        if (!response.ok) {
          throw new Error('Snippet not found');
        }

        const data = await response.json();
        setSnippet(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load snippet');
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [snippetId]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    language: string;
    tags: string[];
  }) => {
    try {
      const response = await fetch(`/api/snippets/${snippetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update snippet');
      }

      // Redirect to snippet detail page or snippets list
      router.push(`/snippets/${snippetId}`);
    } catch (error) {
      // Error will be caught by SnippetForm and displayed
      throw error;
    }
  };

  const handleCancel = () => {
    router.push(`/snippets/${snippetId}`);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading snippet...</div>
        <style jsx>{`
          .page-container {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .loading {
            text-align: center;
            padding: 4rem;
            color: #666;
            font-size: 1.125rem;
          }
        `}</style>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="page-container">
        <div className="error">
          <h1>Error</h1>
          <p>{error || 'Snippet not found'}</p>
          <button onClick={() => router.push('/')} className="btn">
            Go Back
          </button>
        </div>
        <style jsx>{`
          .page-container {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .error {
            text-align: center;
            padding: 4rem;
          }
          .error h1 {
            color: #d32f2f;
            margin-bottom: 1rem;
          }
          .error p {
            color: #666;
            margin-bottom: 2rem;
          }
          .btn {
            padding: 0.75rem 1.5rem;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
          }
          .btn:hover {
            background-color: #45a049;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Edit Snippet</h1>
        <p>Update your code snippet and tags</p>
      </header>

      <SnippetForm
        initialData={{
          title: snippet.title,
          content: snippet.content,
          language: snippet.language,
          tags: snippet.tagList.map((tag) => tag.name),
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Update Snippet"
      />

      <style jsx>{`
        .page-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .page-header p {
          color: #666;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}
