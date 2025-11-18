/**
 * Tag validation utilities
 * Implements validation rules for tag names and collections
 */

import type { TagValidationResult } from '@/types/tag';

/**
 * Regex pattern for valid tag names: alphanumeric, hyphens, underscores only
 */
const TAG_FORMAT_REGEX = /^[a-zA-Z0-9_-]+$/;

/**
 * Maximum tag length after trimming
 */
const MAX_TAG_LENGTH = 30;

/**
 * Minimum tag length after trimming
 */
const MIN_TAG_LENGTH = 1;

/**
 * Maximum number of tags per snippet
 */
export const MAX_TAGS_PER_SNIPPET = 5;

/**
 * Minimum number of tags per snippet
 */
export const MIN_TAGS_PER_SNIPPET = 1;

/**
 * Validate tag name format (alphanumeric, hyphens, underscores only)
 * @param tagName - Raw tag name to validate
 * @returns Validation result with error message if invalid
 */
export function validateTagFormat(tagName: string): TagValidationResult {
  const trimmed = tagName.trim();

  // Check if empty after trimming
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Tag cannot be empty',
    };
  }

  // Check length
  if (trimmed.length < MIN_TAG_LENGTH) {
    return {
      valid: false,
      error: `Tag must be at least ${MIN_TAG_LENGTH} character`,
    };
  }

  if (trimmed.length > MAX_TAG_LENGTH) {
    return {
      valid: false,
      error: `Tag must be ${MAX_TAG_LENGTH} characters or less`,
    };
  }

  // Check format (alphanumeric, hyphens, underscores only)
  if (!TAG_FORMAT_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: 'Tags can only contain letters, numbers, hyphens, and underscores',
    };
  }

  return { valid: true };
}

/**
 * Normalize tag name: lowercase and trim whitespace
 * @param tagName - Raw tag name
 * @returns Normalized tag name
 */
export function normalizeTagName(tagName: string): string {
  return tagName.trim().toLowerCase();
}

/**
 * Trim whitespace from tag name
 * @param tagName - Raw tag name
 * @returns Trimmed tag name
 */
export function trimTag(tagName: string): string {
  return tagName.trim();
}

/**
 * Validate tag count for a snippet
 * @param count - Number of tags
 * @returns Validation result with error message if invalid
 */
export function validateTagCount(count: number): TagValidationResult {
  if (count < MIN_TAGS_PER_SNIPPET) {
    return {
      valid: false,
      error: 'At least one tag is required',
    };
  }

  if (count > MAX_TAGS_PER_SNIPPET) {
    return {
      valid: false,
      error: `Maximum ${MAX_TAGS_PER_SNIPPET} tags per snippet`,
    };
  }

  return { valid: true };
}

/**
 * Check if a tag is a duplicate in a tag list (case-insensitive)
 * @param tagName - Tag name to check
 * @param existingTags - List of existing tag names
 * @returns True if tag is a duplicate
 */
export function isDuplicateTag(tagName: string, existingTags: string[]): boolean {
  const normalized = normalizeTagName(tagName);
  return existingTags.some((tag) => normalizeTagName(tag) === normalized);
}
