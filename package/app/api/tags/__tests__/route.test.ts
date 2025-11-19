/**
 * Integration tests for GET /api/tags endpoint logic
 * TDD Red Phase - Tests written before implementation
 *
 * Note: These tests verify TagService behavior which is called by the API endpoint.
 * The route handler is a thin wrapper around TagService.
 */

import { TagService } from "@/lib/db/tags";
import { getDatabase, closeDatabase } from "@/lib/db/client";
import { join } from "path";
import { unlinkSync, existsSync, mkdirSync } from "fs";

const TEST_DB_PATH = join(process.cwd(), "data", "test-api-tags.db");

describe("GET /api/tags - TagService Integration", () => {
  beforeEach(() => {
    process.env.SNIPPETY_DB_PATH = TEST_DB_PATH;
    // Clean up test database before each test
    if (existsSync(TEST_DB_PATH)) {
      closeDatabase();
      unlinkSync(TEST_DB_PATH);
    }

    // Ensure data directory exists
    mkdirSync(join(process.cwd(), "data"), { recursive: true });

    // Initialize test database with schema
    const db = getDatabase();

    db.exec(`
      CREATE TABLE IF NOT EXISTS snippets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        language TEXT NOT NULL,
        tags TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE CHECK(length(name) > 0 AND length(name) <= 30),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS snippet_tags (
        snippet_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        PRIMARY KEY (snippet_id, tag_id),
        FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
      CREATE INDEX IF NOT EXISTS idx_snippet_tags_snippet_id ON snippet_tags(snippet_id);
      CREATE INDEX IF NOT EXISTS idx_snippet_tags_tag_id ON snippet_tags(tag_id);
    `);

    // Seed database with test tags
    TagService.createOrFindTag("javascript");
    TagService.createOrFindTag("java");
    TagService.createOrFindTag("typescript");
    TagService.createOrFindTag("react");
    TagService.createOrFindTag("react-native");
    TagService.createOrFindTag("vue");
    TagService.createOrFindTag("angular");
  });

  afterEach(() => {
    closeDatabase();
    if (existsSync(TEST_DB_PATH)) {
      unlinkSync(TEST_DB_PATH);
    }
    delete process.env.SNIPPETY_DB_PATH;
  });

  describe("successful requests", () => {
    it("should return tags matching prefix", () => {
      const data = TagService.getTagsByPrefix("java");

      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
      const tagNames = data.map((tag) => tag.name);
      expect(tagNames).toContain("javascript");
      expect(tagNames).toContain("java");
    });

    it("should be case-insensitive", () => {
      const data = TagService.getTagsByPrefix("JAVA");

      expect(data).toHaveLength(2);
      const tagNames = data.map((tag) => tag.name);
      expect(tagNames).toContain("javascript");
      expect(tagNames).toContain("java");
    });

    it("should return empty array if no matches", () => {
      const data = TagService.getTagsByPrefix("golang");

      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
    });

    it("should return empty array for empty query", () => {
      const data = TagService.getTagsByPrefix("");

      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
    });

    it("should return tags ordered alphabetically", () => {
      const data = TagService.getTagsByPrefix("react");

      expect(data.length).toBeGreaterThan(0);
      // Verify alphabetical ordering
      for (let i = 0; i < data.length - 1; i++) {
        expect(
          data[i].name.localeCompare(data[i + 1].name)
        ).toBeLessThanOrEqual(0);
      }
    });

    it("should limit results to 8 tags", () => {
      // Add more tags to test limit
      for (let i = 0; i < 10; i++) {
        TagService.createOrFindTag(`tag${i}`);
      }

      const data = TagService.getTagsByPrefix("tag");

      expect(data.length).toBeLessThanOrEqual(8);
    });

    it("should return tag objects with correct structure", () => {
      const data = TagService.getTagsByPrefix("vue");

      expect(data).toHaveLength(1);
      expect(data[0]).toHaveProperty("id");
      expect(data[0]).toHaveProperty("name");
      expect(data[0]).toHaveProperty("created_at");
      expect(typeof data[0].id).toBe("number");
      expect(typeof data[0].name).toBe("string");
      expect(typeof data[0].created_at).toBe("string");
    });

    it("should handle single character prefix", () => {
      const data = TagService.getTagsByPrefix("r");

      expect(data.length).toBeGreaterThan(0);
      const tagNames = data.map((tag) => tag.name);
      expect(tagNames).toContain("react");
    });
  });

  describe("performance", () => {
    it("should respond quickly (< 200ms)", () => {
      const startTime = Date.now();
      TagService.getTagsByPrefix("java");
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(200);
    });
  });
});
