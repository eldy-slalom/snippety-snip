/**
 * Tag type definitions for the tag management system
 */

/**
 * Tag entity representing a label used to categorize snippets
 */
export interface Tag {
  id: number;
  name: string;
  created_at: string;
}

/**
 * SnippetTag junction table entry for many-to-many relationship
 */
export interface SnippetTag {
  snippet_id: number;
  tag_id: number;
  created_at: string;
}

/**
 * Tag with additional statistics (for future use)
 */
export interface TagWithCount extends Tag {
  snippet_count?: number;
}

/**
 * Tag validation result
 */
export interface TagValidationResult {
  valid: boolean;
  error?: string;
}
