import Link from 'next/link';
import { SnippetService } from '../lib/db/snippets';
import type { Snippet as SnippetRecord } from '../types/snippet';
import TagList from '../components/snippets/TagList';

export default async function Home() {
  // Fetch all snippets with tags
  const snippets = await SnippetService.getAllBasicSnippets();

  return (
    <div className="container">
      <header className="page-header">
        <h1 style={{ margin: '24px 0px 0px 0px' }}>My Snippets</h1>
        <Link href="/snippets/new" className="btn btn-primary" style={{ fontWeight: '700', color: 'black', margin: '16px 0px' }} >
          + Add New Snippet
        </Link>
      </header>
      <main className="page-content">
        {snippets.length === 0 ? (
          <div className="empty-state">
            <p>No snippets found. Start by adding your first snippet!</p>
          </div>
        ) : (
          <div className="snippet-list">
            {snippets.map((snippet: SnippetRecord) => {
              // Parse tags from comma-separated string
              const tags = snippet.tags ? snippet.tags.split(',').map((tag: string) => tag.trim()) : [];

              return (
                <div key={snippet.id} className="card snippet-card">
                  <h2 style={{ marginBottom: '8px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{snippet.title}</h2>

                  {/* Display tags */}
                  {tags.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <TagList tags={tags} />
                    </div>
                  )}

                  <pre className="snippet-preview" style={{ marginBottom: '8px', fontFamily: 'var(--font-family-mono)', background: 'var(--color-surface-variant)', padding: '12px', borderRadius: '4px', overflowX: 'auto' }}>
                    {snippet.content.length > 120
                      ? snippet.content.slice(0, 120) + '...'
                      : snippet.content}
                  </pre>
                  <div className="snippet-meta" style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    <span>Created: {new Date(snippet.created_at).toLocaleString()}</span>
                    {' | '}
                    <span>Updated: {new Date(snippet.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div >
  );
}
