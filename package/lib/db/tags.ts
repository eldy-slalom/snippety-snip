/**
 * Tag service layer
 * Handles all database operations for tags
 */

import { getDatabase } from './client';
import { normalizeTagName } from '@/utils/tag-validators';
import type { Tag } from '@/types/tag';

/**
 * TagService - Service layer for tag operations
 */
export class TagService {
  /**
   * Create a new tag or find existing tag by name (case-insensitive)
   * @param tagName - Tag name (will be normalized)
   * @returns Tag object
   */
  static createOrFindTag(tagName: string): Tag {
    const db = getDatabase();
    const normalized = normalizeTagName(tagName);

    // Try to find existing tag
    const existing = db
      .prepare('SELECT * FROM tags WHERE name = ?')
      .get(normalized) as Tag | undefined;

    if (existing) {
      return existing;
    }

    // Create new tag
    const stmt = db.prepare('INSERT INTO tags (name) VALUES (?)');
    const result = stmt.run(normalized);

    const newTag = db
      .prepare('SELECT * FROM tags WHERE id = ?')
      .get(result.lastInsertRowid) as Tag;

    return newTag;
  }

  /**
   * Get tags by prefix (for autocomplete)
   * @param prefix - Search prefix (case-insensitive)
   * @param limit - Maximum number of results (default: 8)
   * @returns Array of matching tags
   */
  static getTagsByPrefix(prefix: string, limit: number = 8): Tag[] {
    const db = getDatabase();

    if (!prefix || prefix.trim() === '') {
      return [];
    }

    const normalized = normalizeTagName(prefix);
    
    return db
      .prepare(
        'SELECT * FROM tags WHERE name LIKE ? || \'%\' ORDER BY name LIMIT ?'
      )
      .all(normalized, limit) as Tag[];
  }

  /**
   * Get all tags associated with a snippet
   * @param snippetId - Snippet ID
   * @returns Array of tags
   */
  static getTagsBySnippetId(snippetId: number): Tag[] {
    const db = getDatabase();

    return db
      .prepare(`
        SELECT t.id, t.name, t.created_at
        FROM tags t
        INNER JOIN snippet_tags st ON t.id = st.tag_id
        WHERE st.snippet_id = ?
        ORDER BY t.name
      `)
      .all(snippetId) as Tag[];
  }

  /**
   * Associate tags with a snippet (replaces existing associations)
   * @param snippetId - Snippet ID
   * @param tagNames - Array of tag names
   */
  static associateTagsWithSnippet(snippetId: number, tagNames: string[]): void {
    const db = getDatabase();

    // Remove existing associations
    db.prepare('DELETE FROM snippet_tags WHERE snippet_id = ?').run(snippetId);

    if (tagNames.length === 0) {
      return;
    }

    // Normalize and deduplicate tag names
    const uniqueTagNames = Array.from(
      new Set(tagNames.map(name => normalizeTagName(name)))
    );

    // Create or find tags and associate with snippet
    const stmt = db.prepare(
      'INSERT INTO snippet_tags (snippet_id, tag_id) VALUES (?, ?)'
    );

    for (const tagName of uniqueTagNames) {
      const tag = this.createOrFindTag(tagName);
      stmt.run(snippetId, tag.id);
    }
  }

  /**
   * Remove all tags from a snippet
   * @param snippetId - Snippet ID
   */
  static removeTagsFromSnippet(snippetId: number): void {
    const db = getDatabase();
    db.prepare('DELETE FROM snippet_tags WHERE snippet_id = ?').run(snippetId);
  }
}
