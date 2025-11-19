/**
 * Create Snippet Page
 * Renders the snippet creation form
 */

import SnippetForm from '../../../components/snippets/SnippetForm';

export default function NewSnippetPage() {
    return (
        <div className="container">
            <header className="page-header">
                <h1 style={{ margin: '24px 0px 16px 0px' }}>Create New Snippet</h1>
                <p style={{ margin: '0px 0px 24px 0px' }}>Save your code snippets for future reference</p>
            </header>

            <main className="page-content">
                <SnippetForm />
            </main>
        </div>
    );
}

export const metadata = {
    title: 'Create Snippet - Snippety Snip',
    description: 'Create and save a new code snippet',
};