-- Initial database schema for Snippety-Snip
-- Creates the snippets table with all required fields

CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK(length(title) > 0 AND length(title) <= 100),
    content TEXT NOT NULL CHECK(length(content) > 0),
    language TEXT NOT NULL,
    tags TEXT NOT NULL CHECK(length(tags) > 0),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_snippets_language ON snippets(language);
CREATE INDEX IF NOT EXISTS idx_snippets_created_at ON snippets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippets_updated_at ON snippets(updated_at DESC);

-- Trigger to automatically update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_snippets_timestamp 
AFTER UPDATE ON snippets
BEGIN
    UPDATE snippets 
    SET updated_at = datetime('now') 
    WHERE id = NEW.id;
END;

