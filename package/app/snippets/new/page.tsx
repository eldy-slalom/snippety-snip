/**
 * Create Snippet Page
 * Renders the snippet creation form
 */

import SnippetForm from '../../../components/snippets/SnippetForm';

export default function NewSnippetPage() {
    return (
        <div className="container">
            <header className="page-header">
                <h1>Create New Snippet</h1>
                <p>Save your code snippets for future reference</p>
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