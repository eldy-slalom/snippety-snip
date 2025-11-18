/**
 * Snippet service layer
 * Handles all database operations for snippets
 */

import { getDatabase } from './client';
import { TagService } from './tags';
import type { Tag } from '@/types/tag';

export interface Snippet {
  id: number;
  title: string;
  content: string;
  language: string;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface SnippetWithTags extends Omit<Snippet, 'tags'> {
  tagList: Tag[];
}

export interface CreateSnippetData {
  title: string;
  content: string;
  language: string;
  tags: string[];
}

export interface UpdateSnippetData {
  title?: string;
  content?: string;
  language?: string;
  tags?: string[];
}

/**
 * SnippetService - Service layer for snippet operations
 */
export class SnippetService {
  /**
   * Get all snippets with tags, ordered by most recently updated
   */
  static getAllSnippets(): SnippetWithTags[] {
    const db = getDatabase();
    const snippets = db
      .prepare('SELECT * FROM snippets ORDER BY updated_at DESC')
      .all() as Snippet[];

    return snippets.map((snippet) => ({
      ...snippet,
      tagList: TagService.getTagsBySnippetId(snippet.id),
    }));
  }

  /**
   * Get a snippet by ID with tags
   */
  static getSnippetById(id: number): SnippetWithTags | null {
    const db = getDatabase();
    const snippet = db
      .prepare('SELECT * FROM snippets WHERE id = ?')
      .get(id) as Snippet | undefined;

    if (!snippet) {
      return null;
    }

    return {
      ...snippet,
      tagList: TagService.getTagsBySnippetId(snippet.id),
    };
  }

  /**
   * Create a new snippet with tags
   */
  static createSnippet(data: CreateSnippetData): SnippetWithTags {
    const db = getDatabase();
    const stmt = db.prepare(
      'INSERT INTO snippets (title, content, language, tags) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(data.title, data.content, data.language, '');
    const snippetId = result.lastInsertRowid as number;

    // Associate tags
    if (data.tags && data.tags.length > 0) {
      TagService.associateTagsWithSnippet(snippetId, data.tags);
    }

    const snippet = this.getSnippetById(snippetId);
    if (!snippet) {
      throw new Error('Failed to retrieve created snippet');
    }
    return snippet;
  }

  /**
   * Update an existing snippet with tags
   */
  static updateSnippet(
    id: number,
    data: UpdateSnippetData
  ): SnippetWithTags | null {
    const db = getDatabase();
    const updates: string[] = [];
    const values: unknown[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }
    if (data.content !== undefined) {
      updates.push('content = ?');
      values.push(data.content);
    }
    if (data.language !== undefined) {
      updates.push('language = ?');
      values.push(data.language);
    }

    if (updates.length > 0) {
      values.push(id);
      const stmt = db.prepare(
        `UPDATE snippets SET ${updates.join(', ')} WHERE id = ?`
      );
      stmt.run(...values);
    }

    // Update tags if provided
    if (data.tags !== undefined) {
      TagService.associateTagsWithSnippet(id, data.tags);
    }

    return this.getSnippetById(id);
  }

  /**
   * Delete a snippet by ID
   */
  static deleteSnippet(id: number): boolean {
    const db = getDatabase();
    const stmt = db.prepare("DELETE FROM snippets WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Search snippets by tags
   */
  static searchByTags(tags: string[]): Snippet[] {
    const db = getDatabase();
    // Search for snippets that contain any of the provided tags
    const placeholders = tags.map(() => "tags LIKE ?").join(" OR ");
    const searchTerms = tags.map((tag) => `%${tag}%`);
    return db
      .prepare(`SELECT * FROM snippets WHERE ${placeholders} ORDER BY updated_at DESC`)
      .all(...searchTerms) as Snippet[];
  }

  /**
   * Filter snippets by language
   */
  static filterByLanguage(language: string): Snippet[] {
    const db = getDatabase();
    return db
      .prepare("SELECT * FROM snippets WHERE language = ? ORDER BY updated_at DESC")
      .all(language) as Snippet[];
  }
}

