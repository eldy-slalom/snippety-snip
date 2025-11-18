/**
 * Validation utilities for snippet data
 * Used by both client-side forms and server-side API routes
 */

import { ValidationError } from "../types/snippet";

/**
 * Validates snippet title
 * @param title - The title to validate
 * @returns ValidationError if invalid, null if valid
 */
export function validateTitle(title: string): ValidationError | null {
  // Check if title is empty or undefined
  if (!title) {
    return {
      field: "title",
      message: "Title is required",
    };
  }

  // Check if title is only whitespace
  if (title.trim().length === 0) {
    return {
      field: "title",
      message: "Title cannot be empty or whitespace only",
    };
  }

  // Check title length (max 100 characters)
  if (title.length > 100) {
    return {
      field: "title",
      message: "Title must be 100 characters or less",
    };
  }

  return null;
}

/**
 * Validates snippet content
 * @param content - The content to validate
 * @returns ValidationError if invalid, null if valid
 */
export function validateContent(content: string): ValidationError | null {
  // Check if content is empty or undefined
  if (!content) {
    return {
      field: "content",
      message: "Code content is required",
    };
  }

  // Check if content is only whitespace
  if (content.trim().length === 0) {
    return {
      field: "content",
      message: "Code content cannot be empty or whitespace only",
    };
  }

  // Check content length (max 50,000 characters)
  if (content.length > 50000) {
    return {
      field: "content",
      message: "Code content must be 50,000 characters or less",
    };
  }

  return null;
}

/**
 * Validates complete snippet data
 * @param title - The title to validate
 * @param content - The content to validate
 * @returns Array of validation errors (empty if all valid)
 */
export function validateSnippetData(
  title: string,
  content: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  const titleError = validateTitle(title);
  if (titleError) {
    errors.push(titleError);
  }

  const contentError = validateContent(content);
  if (contentError) {
    errors.push(contentError);
  }

  return errors;
}

/**
 * Normalizes line endings to LF (Unix-style)
 * @param content - The content to normalize
 * @returns Content with normalized line endings
 */
export function normalizeLineEndings(content: string): string {
  return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
