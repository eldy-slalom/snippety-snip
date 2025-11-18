import Link from 'next/link';
import { SnippetService } from '../lib/db/snippets';

export default async function Home() {
  // Fetch all snippets (MVP)
  const snippets = await SnippetService.getAllBasicSnippets();

  return (
    <div className="container">
      <header className="page-header">
        <h1>My Snippets</h1>
        <Link href="/snippets/new" className="btn btn-primary">
          + Add New Snippet
        </Link>
      </header>
      <main className="page-content">
        {snippets.length === 0 ? (
          <div className="empty-state">
            <p>No snippets found. Start by adding your first snippet!</p>
            <Link href="/snippets/new" className="btn btn-primary">
              Add Snippet
            </Link>
          </div>
        ) : (
          <div className="snippet-list">
            {snippets.map((snippet: any) => (
              <div key={snippet.id} className="card snippet-card">
                <h2 style={{ marginBottom: '8px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{snippet.title}</h2>
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
