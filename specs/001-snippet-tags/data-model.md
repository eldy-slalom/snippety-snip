# Data Model: Add Tags to Organize Snippets

**Date**: 2025-01-27  
**Feature**: 001-snippet-tags

## Overview

This document defines the database schema for the tag management feature. The design uses a normalized tags table with a junction table to implement the many-to-many relationship between snippets and tags.

## Entities

### Tag

Represents a label used to categorize and organize snippets.

**Table**: `tags`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique tag identifier |
| `name` | TEXT | NOT NULL, UNIQUE, CHECK(length(name) > 0 AND length(name) <= 30) | Normalized tag name (lowercase, trimmed) |
| `created_at` | TEXT | NOT NULL DEFAULT (datetime('now')) | Timestamp when tag was first created |

**Validation Rules**:
- Name must be 1-30 characters after trimming whitespace
- Name must contain only alphanumeric characters, hyphens, and underscores
- Name is normalized to lowercase before storage
- Name must be unique (case-insensitive uniqueness enforced by normalization)

**Indexes**:
- `idx_tags_name` on `name` - For efficient autocomplete prefix queries

**Business Rules**:
- Tags are created automatically when first used (no manual tag creation)
- Tag names are normalized (lowercase, trimmed) before storage
- Tags persist even if all associated snippets are deleted (orphaned tags remain for potential reuse)

### SnippetTag (Junction Table)

Represents the many-to-many relationship between snippets and tags.

**Table**: `snippet_tags`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `snippet_id` | INTEGER | NOT NULL, FOREIGN KEY REFERENCES snippets(id) ON DELETE CASCADE | Reference to snippet |
| `tag_id` | INTEGER | NOT NULL, FOREIGN KEY REFERENCES tags(id) ON DELETE CASCADE | Reference to tag |
| `created_at` | TEXT | NOT NULL DEFAULT (datetime('now')) | Timestamp when association was created |

**Composite Primary Key**: (`snippet_id`, `tag_id`)

**Validation Rules**:
- Each snippet can have 1-5 tags (enforced at application level)
- No duplicate tag associations per snippet (enforced by composite primary key)
- Tag associations are case-insensitive (normalized tag names prevent duplicates)

**Indexes**:
- `idx_snippet_tags_snippet_id` on `snippet_id` - For efficient snippet queries
- `idx_snippet_tags_tag_id` on `tag_id` - For efficient tag queries

**Business Rules**:
- When a snippet is deleted, all associated tag relationships are deleted (CASCADE)
- When a tag is deleted, all associated snippet relationships are deleted (CASCADE)
- Tag associations are created when snippets are created or updated

## Relationships

### Snippet ↔ Tag (Many-to-Many)

- **Relationship**: Many-to-many via `snippet_tags` junction table
- **Cardinality**: 
  - One snippet can have 1-5 tags (enforced at application level)
  - One tag can be associated with many snippets (unlimited)
- **Cascade Behavior**:
  - Deleting a snippet deletes all its tag associations
  - Deleting a tag deletes all its snippet associations

## Database Migration

**Migration File**: `lib/db/migrations/002_add_tags.sql`

```sql
-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE CHECK(length(name) > 0 AND length(name) <= 30),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Create junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS snippet_tags (
    snippet_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (snippet_id, tag_id),
    FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_snippet_tags_snippet_id ON snippet_tags(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_tags_tag_id ON snippet_tags(tag_id);
```

## Data Access Patterns

### Tag Creation
- Tags are created automatically when first referenced
- Normalization (lowercase, trim) happens before insertion
- If tag already exists (case-insensitive), reuse existing tag

### Tag Autocomplete Query
```sql
SELECT id, name 
FROM tags 
WHERE name LIKE ? || '%' 
ORDER BY name 
LIMIT 8;
```

### Snippet Tag Associations
- When creating/updating snippet: Insert/update associations in `snippet_tags`
- When querying snippet: JOIN `snippet_tags` and `tags` to get tag names
- When deleting snippet: CASCADE deletes associations automatically

## TypeScript Types

```typescript
export interface Tag {
  id: number;
  name: string;
  created_at: string;
}

export interface SnippetTag {
  snippet_id: number;
  tag_id: number;
  created_at: string;
}

export interface TagWithCount extends Tag {
  snippet_count?: number; // Optional: for future tag statistics
}
```

## Validation Rules Summary

1. **Tag Name Format**: Alphanumeric, hyphens, underscores only (regex: `^[a-zA-Z0-9_-]+$`)
2. **Tag Name Length**: 1-30 characters (after trimming)
3. **Tag Normalization**: Convert to lowercase before storage
4. **Whitespace Handling**: Trim leading/trailing whitespace, reject if empty after trimming
5. **Snippet Tag Count**: 1-5 tags per snippet (enforced at application level)
6. **Duplicate Prevention**: Case-insensitive duplicate detection within same snippet

## Notes

- Tags are never manually deleted by users (orphaned tags remain for potential reuse)
- Tag normalization ensures case-insensitive uniqueness
- Junction table enables efficient queries in both directions (snippet → tags, tag → snippets)
- Indexes optimize autocomplete queries and relationship lookups

