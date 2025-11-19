/**
 * TypeScript types for snippet entities and related data structures
 */

/**
 * Core snippet entity as stored in the database
 */
export interface Snippet {
  id: number;
  title: string;
  content: string;
  language: string;
  tags: string;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

/**
 * Data required to create a new snippet
 */
export interface CreateSnippetData {
  title: string;
  content: string;
  tags?: string[]; // Optional tags array
}

/**
 * Validation error structure for form validation
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * API response structure for snippet creation
 */
export interface CreateSnippetResponse {
  snippet: Snippet;
}

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  error: string;
  details?: ValidationError[];
}

/**
 * Form state for snippet creation
 */
export interface SnippetFormData {
  title: string;
  content: string;
  tags: string[]; // Tags array
}

/**
 * Form validation state
 */
export interface SnippetFormErrors {
  title?: string;
  content?: string;
  tags?: string;
}
