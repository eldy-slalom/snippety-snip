'use client';

/**
 * New Snippet Page
 * Page for creating a new code snippet with tags
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import SnippetForm from '@/components/snippets/SnippetForm';

export default function NewSnippetPage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    content: string;
    language: string;
    tags: string[];
  }) => {
    try {
      const response = await fetch('/api/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create snippet');
      }

      const snippet = await response.json();
      
      // Redirect to snippet detail page or snippets list
      router.push(`/snippets/${snippet.id}`);
    } catch (error) {
      // Error will be caught by SnippetForm and displayed
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Create New Snippet</h1>
        <p>Add a code snippet with tags for easy organization</p>
      </header>

      <SnippetForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Create Snippet"
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
