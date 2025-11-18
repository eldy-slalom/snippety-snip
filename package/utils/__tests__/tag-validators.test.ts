/**
 * Unit tests for tag validation utilities
 * TDD Red Phase - Tests written before implementation
 */

import {
  validateTagFormat,
  normalizeTagName,
  trimTag,
  validateTagCount,
  isDuplicateTag,
  MAX_TAGS_PER_SNIPPET,
  MIN_TAGS_PER_SNIPPET,
} from '../tag-validators';

describe('validateTagFormat', () => {
  describe('valid tags', () => {
    it('should accept lowercase alphanumeric tags', () => {
      const result = validateTagFormat('javascript');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept uppercase alphanumeric tags', () => {
      const result = validateTagFormat('JAVASCRIPT');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept mixed case alphanumeric tags', () => {
      const result = validateTagFormat('JavaScript');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept tags with hyphens', () => {
      const result = validateTagFormat('react-hooks');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept tags with underscores', () => {
      const result = validateTagFormat('snake_case');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept tags with numbers', () => {
      const result = validateTagFormat('es2015');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept tags with mixed alphanumeric, hyphens, and underscores', () => {
      const result = validateTagFormat('node_js-v18');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept single character tags', () => {
      const result = validateTagFormat('a');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept tags up to 30 characters', () => {
      const result = validateTagFormat('a'.repeat(30));
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('invalid tags - empty', () => {
    it('should reject empty strings', () => {
      const result = validateTagFormat('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Tag cannot be empty');
    });

    it('should reject whitespace-only strings', () => {
      const result = validateTagFormat('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Tag cannot be empty');
    });

    it('should reject tabs and newlines', () => {
      const result = validateTagFormat('\t\n');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Tag cannot be empty');
    });
  });

  describe('invalid tags - length', () => {
    it('should reject tags longer than 30 characters', () => {
      const result = validateTagFormat('a'.repeat(31));
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Tag must be 30 characters or less');
    });

    it('should reject tags much longer than 30 characters', () => {
      const result = validateTagFormat('a'.repeat(100));
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Tag must be 30 characters or less');
    });
  });

  describe('invalid tags - special characters', () => {
    it('should reject tags with spaces', () => {
      const result = validateTagFormat('java script');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Tags can only contain letters, numbers, hyphens, and underscores');
    });

    it('should reject tags with @ symbol', () => {
      const result = validateTagFormat('tag@123');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Tags can only contain letters, numbers, hyphens, and underscores');
    });

    it('should reject tags with $ symbol', () => {
      const result = validateTagFormat('jquery$');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Tags can only contain letters, numbers, hyphens, and underscores');
    });

    it('should reject tags with # symbol', () => {
      const result = validateTagFormat('c#');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Tags can only contain letters, numbers, hyphens, and underscores');
    });

    it('should reject tags with dot', () => {
      const result = validateTagFormat('node.js');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Tags can only contain letters, numbers, hyphens, and underscores');
    });

    it('should reject tags with slashes', () => {
      const result = validateTagFormat('c/c++');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Tags can only contain letters, numbers, hyphens, and underscores');
    });

    it('should reject tags with parentheses', () => {
      const result = validateTagFormat('tag(1)');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Tags can only contain letters, numbers, hyphens, and underscores');
    });
  });

  describe('trimming whitespace', () => {
    it('should trim leading whitespace and validate', () => {
      const result = validateTagFormat('  javascript');
      expect(result.valid).toBe(true);
    });

    it('should trim trailing whitespace and validate', () => {
      const result = validateTagFormat('javascript  ');
      expect(result.valid).toBe(true);
    });

    it('should trim both leading and trailing whitespace', () => {
      const result = validateTagFormat('  javascript  ');
      expect(result.valid).toBe(true);
    });
  });
});

describe('normalizeTagName', () => {
  it('should convert to lowercase', () => {
    expect(normalizeTagName('JavaScript')).toBe('javascript');
  });

  it('should trim whitespace and convert to lowercase', () => {
    expect(normalizeTagName('  JavaScript  ')).toBe('javascript');
  });

  it('should handle uppercase tags', () => {
    expect(normalizeTagName('REACT')).toBe('react');
  });

  it('should handle mixed case tags', () => {
    expect(normalizeTagName('TypeScript')).toBe('typescript');
  });

  it('should preserve hyphens and underscores', () => {
    expect(normalizeTagName('React-Native')).toBe('react-native');
    expect(normalizeTagName('Node_JS')).toBe('node_js');
  });

  it('should handle already normalized tags', () => {
    expect(normalizeTagName('javascript')).toBe('javascript');
  });
});

describe('trimTag', () => {
  it('should trim leading whitespace', () => {
    expect(trimTag('  javascript')).toBe('javascript');
  });

  it('should trim trailing whitespace', () => {
    expect(trimTag('javascript  ')).toBe('javascript');
  });

  it('should trim both leading and trailing whitespace', () => {
    expect(trimTag('  javascript  ')).toBe('javascript');
  });

  it('should handle tabs and newlines', () => {
    expect(trimTag('\t\njavascript\n\t')).toBe('javascript');
  });

  it('should preserve case', () => {
    expect(trimTag('  JavaScript  ')).toBe('JavaScript');
  });

  it('should preserve internal whitespace', () => {
    expect(trimTag('  java script  ')).toBe('java script');
  });
});

describe('validateTagCount', () => {
  it('should accept minimum tag count', () => {
    const result = validateTagCount(MIN_TAGS_PER_SNIPPET);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept maximum tag count', () => {
    const result = validateTagCount(MAX_TAGS_PER_SNIPPET);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept tag count in valid range', () => {
    const result = validateTagCount(3);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject zero tags', () => {
    const result = validateTagCount(0);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('At least one tag is required');
  });

  it('should reject negative tag count', () => {
    const result = validateTagCount(-1);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('At least one tag is required');
  });

  it('should reject tag count exceeding maximum', () => {
    const result = validateTagCount(MAX_TAGS_PER_SNIPPET + 1);
    expect(result.valid).toBe(false);
    expect(result.error).toBe(`Maximum ${MAX_TAGS_PER_SNIPPET} tags per snippet`);
  });

  it('should reject much larger tag count', () => {
    const result = validateTagCount(100);
    expect(result.valid).toBe(false);
    expect(result.error).toBe(`Maximum ${MAX_TAGS_PER_SNIPPET} tags per snippet`);
  });
});

describe('isDuplicateTag', () => {
  it('should detect exact duplicates (case-sensitive comparison)', () => {
    expect(isDuplicateTag('javascript', ['javascript', 'react'])).toBe(true);
  });

  it('should detect case-insensitive duplicates', () => {
    expect(isDuplicateTag('JavaScript', ['javascript', 'react'])).toBe(true);
  });

  it('should detect uppercase duplicates', () => {
    expect(isDuplicateTag('JAVASCRIPT', ['javascript', 'react'])).toBe(true);
  });

  it('should detect duplicates with whitespace', () => {
    expect(isDuplicateTag('  javascript  ', ['javascript', 'react'])).toBe(true);
  });

  it('should return false for non-duplicates', () => {
    expect(isDuplicateTag('typescript', ['javascript', 'react'])).toBe(false);
  });

  it('should return false for empty tag list', () => {
    expect(isDuplicateTag('javascript', [])).toBe(false);
  });

  it('should handle tags with hyphens and underscores', () => {
    expect(isDuplicateTag('react-native', ['React-Native', 'vue'])).toBe(true);
    expect(isDuplicateTag('node_js', ['Node_JS', 'deno'])).toBe(true);
  });

  it('should return false for similar but different tags', () => {
    expect(isDuplicateTag('javascript', ['java', 'typescript'])).toBe(false);
  });
});
