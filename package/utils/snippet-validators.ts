/**
 * Validation utilities for snippet data
 * Used by both client-side forms and server-side API routes
 */

import { LANGUAGE_IDS } from "@/constants/languages";
import type { LanguageId } from "@/constants/languages";
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
export function validateSnippetData({
  title,
  content,
  language,
  tags,
}: {
  title: string;
  content: string;
  language: string | null | undefined;
  tags?: string[];
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const titleError = validateTitle(title);
  if (titleError) {
    errors.push(titleError);
  }

  const contentError = validateContent(content);
  if (contentError) {
    errors.push(contentError);
  }

  const languageError = validateLanguage(language);
  if (languageError) {
    errors.push(languageError);
  }

  const tagsError = validateTags(tags);
  if (tagsError) {
    errors.push(tagsError);
  }

  return errors;
}

/**
 * Validates provided language against supported options.
 */
export function validateLanguage(
  language: string | null | undefined
): ValidationError | null {
  if (!language || language.trim() === "") {
    return {
      field: "language",
      message: "Language selection is required",
    };
  }

  const normalized = language.toLowerCase() as LanguageId;

  if (!LANGUAGE_IDS.includes(normalized)) {
    return {
      field: "language",
      message: "Choose a language from the supported list",
    };
  }

  return null;
}

/**
 * Validates snippet tags requirement.
 */
export function validateTags(tags?: string[]): ValidationError | null {
  if (!tags || tags.length === 0) {
    return {
      field: "tags",
      message: "At least one tag is required",
    };
  }

  return null;
}

/**
 * Normalizes line endings to LF (Unix-style)
 * @param content - The content to normalize
 * @returns Content with normalized line endings
 */
export function normalizeLineEndings(content: string): string {
  return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
