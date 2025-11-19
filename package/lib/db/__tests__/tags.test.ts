/**
 * Unit tests for TagService
 * TDD Red Phase - Tests written before implementation
 */

import { TagService } from "../tags";
import { getDatabase, closeDatabase } from "../client";
import { join } from "path";
import { unlinkSync, existsSync, mkdirSync } from "fs";

const TEST_DB_PATH = join(process.cwd(), "data", "test-tags.db");

describe("TagService", () => {
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

    // Drop tables if they exist to ensure clean slate
    db.exec(`DROP TABLE IF EXISTS snippet_tags`);
    db.exec(`DROP TABLE IF EXISTS tags`);
    db.exec(`DROP TABLE IF EXISTS snippets`);

    // Create snippets table (required for foreign key)
    db.exec(`
      CREATE TABLE IF NOT EXISTS snippets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        language TEXT NOT NULL,
        tags TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Create tags and snippet_tags tables
    db.exec(`
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
  });

  afterEach(() => {
    // Clean up after tests
    closeDatabase();
    if (existsSync(TEST_DB_PATH)) {
      unlinkSync(TEST_DB_PATH);
    }
    delete process.env.SNIPPETY_DB_PATH;
  });

  describe("createOrFindTag", () => {
    it("should create a new tag", () => {
      const tag = TagService.createOrFindTag("javascript");

      expect(tag).toBeDefined();
      expect(tag.name).toBe("javascript");
      expect(tag.id).toBeGreaterThan(0);
      expect(tag.created_at).toBeDefined();
    });

    it("should normalize tag name to lowercase", () => {
      const tag = TagService.createOrFindTag("JavaScript");

      expect(tag.name).toBe("javascript");
    });

    it("should trim whitespace from tag name", () => {
      const tag = TagService.createOrFindTag("  javascript  ");

      expect(tag.name).toBe("javascript");
    });

    it("should return existing tag if already exists (case-insensitive)", () => {
      const tag1 = TagService.createOrFindTag("javascript");
      const tag2 = TagService.createOrFindTag("JavaScript");

      expect(tag1.id).toBe(tag2.id);
      expect(tag1.name).toBe(tag2.name);
    });

    it("should handle tags with hyphens", () => {
      const tag = TagService.createOrFindTag("react-hooks");

      expect(tag.name).toBe("react-hooks");
    });

    it("should handle tags with underscores", () => {
      const tag = TagService.createOrFindTag("node_js");

      expect(tag.name).toBe("node_js");
    });

    it("should create multiple different tags", () => {
      const tag1 = TagService.createOrFindTag("javascript");
      const tag2 = TagService.createOrFindTag("typescript");
      const tag3 = TagService.createOrFindTag("react");

      expect(tag1.id).not.toBe(tag2.id);
      expect(tag2.id).not.toBe(tag3.id);
      expect(tag1.id).not.toBe(tag3.id);
    });
  });

  describe("getTagsByPrefix", () => {
    beforeEach(() => {
      // Seed database with test tags
      TagService.createOrFindTag("javascript");
      TagService.createOrFindTag("java");
      TagService.createOrFindTag("typescript");
      TagService.createOrFindTag("react");
      TagService.createOrFindTag("react-native");
      TagService.createOrFindTag("vue");
      TagService.createOrFindTag("angular");
      TagService.createOrFindTag("python");
      TagService.createOrFindTag("php");
      TagService.createOrFindTag("ruby");
    });

    it("should return tags matching prefix", () => {
      const tags = TagService.getTagsByPrefix("java");

      expect(tags).toHaveLength(2);
      expect(tags.map((t) => t.name)).toContain("javascript");
      expect(tags.map((t) => t.name)).toContain("java");
    });

    it("should be case-insensitive", () => {
      const tags = TagService.getTagsByPrefix("Java");

      expect(tags).toHaveLength(2);
      expect(tags.map((t) => t.name)).toContain("javascript");
      expect(tags.map((t) => t.name)).toContain("java");
    });

    it("should return empty array if no matches", () => {
      const tags = TagService.getTagsByPrefix("golang");

      expect(tags).toHaveLength(0);
    });

    it("should limit results to 8 tags", () => {
      // Add more tags to test limit
      for (let i = 0; i < 10; i++) {
        TagService.createOrFindTag(`tag${i}`);
      }

      const tags = TagService.getTagsByPrefix("tag");

      expect(tags.length).toBeLessThanOrEqual(8);
    });

    it("should return tags ordered alphabetically", () => {
      const tags = TagService.getTagsByPrefix("react");

      expect(tags.length).toBeGreaterThan(0);
      // Verify tags are ordered alphabetically
      for (let i = 0; i < tags.length - 1; i++) {
        expect(
          tags[i].name.localeCompare(tags[i + 1].name)
        ).toBeLessThanOrEqual(0);
      }
      // Verify all tags start with 'react'
      tags.forEach((tag) => {
        expect(tag.name).toMatch(/^react/);
      });
    });

    it("should handle single character prefix", () => {
      const tags = TagService.getTagsByPrefix("p");

      expect(tags.length).toBeGreaterThan(0);
      expect(tags.map((t) => t.name)).toContain("python");
      expect(tags.map((t) => t.name)).toContain("php");
    });

    it("should handle exact match", () => {
      const tags = TagService.getTagsByPrefix("vue");

      expect(tags).toHaveLength(1);
      expect(tags[0].name).toBe("vue");
    });

    it("should return empty array for empty prefix", () => {
      const tags = TagService.getTagsByPrefix("");

      expect(tags).toHaveLength(0);
    });
  });

  describe("getTagsBySnippetId", () => {
    let snippetId: number;

    beforeEach(() => {
      // Create a test snippet
      const db = getDatabase();
      const result = db
        .prepare(
          "INSERT INTO snippets (title, content, language, tags) VALUES (?, ?, ?, ?)"
        )
        .run("Test Snippet", 'console.log("test")', "javascript", "");
      snippetId = result.lastInsertRowid as number;
    });

    it("should return empty array if snippet has no tags", () => {
      const tags = TagService.getTagsBySnippetId(snippetId);

      expect(tags).toHaveLength(0);
    });

    it("should return tags associated with snippet", () => {
      // Associate tags with snippet
      const tag1 = TagService.createOrFindTag("javascript");
      const tag2 = TagService.createOrFindTag("react");

      const db = getDatabase();
      db.prepare(
        "INSERT INTO snippet_tags (snippet_id, tag_id) VALUES (?, ?)"
      ).run(snippetId, tag1.id);
      db.prepare(
        "INSERT INTO snippet_tags (snippet_id, tag_id) VALUES (?, ?)"
      ).run(snippetId, tag2.id);

      const tags = TagService.getTagsBySnippetId(snippetId);

      expect(tags).toHaveLength(2);
      expect(tags.map((t) => t.name)).toContain("javascript");
      expect(tags.map((t) => t.name)).toContain("react");
    });

    it("should return tags ordered alphabetically", () => {
      // Associate tags in non-alphabetical order
      const tag1 = TagService.createOrFindTag("vue");
      const tag2 = TagService.createOrFindTag("angular");
      const tag3 = TagService.createOrFindTag("react");

      const db = getDatabase();
      db.prepare(
        "INSERT INTO snippet_tags (snippet_id, tag_id) VALUES (?, ?)"
      ).run(snippetId, tag1.id);
      db.prepare(
        "INSERT INTO snippet_tags (snippet_id, tag_id) VALUES (?, ?)"
      ).run(snippetId, tag2.id);
      db.prepare(
        "INSERT INTO snippet_tags (snippet_id, tag_id) VALUES (?, ?)"
      ).run(snippetId, tag3.id);

      const tags = TagService.getTagsBySnippetId(snippetId);

      expect(tags).toHaveLength(3);
      expect(tags[0].name).toBe("angular");
      expect(tags[1].name).toBe("react");
      expect(tags[2].name).toBe("vue");
    });

    it("should handle snippet with maximum tags (5)", () => {
      // Associate 5 tags with snippet
      for (let i = 1; i <= 5; i++) {
        const tag = TagService.createOrFindTag(`tag${i}`);
        const db = getDatabase();
        db.prepare(
          "INSERT INTO snippet_tags (snippet_id, tag_id) VALUES (?, ?)"
        ).run(snippetId, tag.id);
      }

      const tags = TagService.getTagsBySnippetId(snippetId);

      expect(tags).toHaveLength(5);
    });

    it("should return empty array for non-existent snippet", () => {
      const tags = TagService.getTagsBySnippetId(99999);

      expect(tags).toHaveLength(0);
    });
  });

  describe("associateTagsWithSnippet", () => {
    let snippetId: number;

    beforeEach(() => {
      // Create a test snippet
      const db = getDatabase();
      const result = db
        .prepare(
          "INSERT INTO snippets (title, content, language, tags) VALUES (?, ?, ?, ?)"
        )
        .run("Test Snippet", 'console.log("test")', "javascript", "general");
      snippetId = result.lastInsertRowid as number;
    });

    it("should associate tags with snippet", () => {
      TagService.associateTagsWithSnippet(snippetId, [
        "javascript",
        "react",
        "typescript",
      ]);

      const tags = TagService.getTagsBySnippetId(snippetId);

      expect(tags).toHaveLength(3);
      expect(tags.map((t) => t.name)).toContain("javascript");
      expect(tags.map((t) => t.name)).toContain("react");
      expect(tags.map((t) => t.name)).toContain("typescript");
    });

    it("should create tags if they do not exist", () => {
      TagService.associateTagsWithSnippet(snippetId, ["newtag1", "newtag2"]);

      const tags = TagService.getTagsBySnippetId(snippetId);

      expect(tags).toHaveLength(2);
      expect(tags.map((t) => t.name)).toContain("newtag1");
      expect(tags.map((t) => t.name)).toContain("newtag2");
    });

    it("should reuse existing tags", () => {
      // Create tag first
      const existingTag = TagService.createOrFindTag("javascript");

      TagService.associateTagsWithSnippet(snippetId, ["javascript", "react"]);

      const tags = TagService.getTagsBySnippetId(snippetId);

      expect(tags).toHaveLength(2);
      expect(tags.find((t) => t.name === "javascript")?.id).toBe(
        existingTag.id
      );
    });

    it("should clear existing associations before adding new ones", () => {
      // Associate initial tags
      TagService.associateTagsWithSnippet(snippetId, ["tag1", "tag2"]);

      // Update with new tags
      TagService.associateTagsWithSnippet(snippetId, ["tag3", "tag4"]);

      const tags = TagService.getTagsBySnippetId(snippetId);

      expect(tags).toHaveLength(2);
      expect(tags.map((t) => t.name)).toContain("tag3");
      expect(tags.map((t) => t.name)).toContain("tag4");
      expect(tags.map((t) => t.name)).not.toContain("tag1");
      expect(tags.map((t) => t.name)).not.toContain("tag2");
    });

    it("should handle empty tag array", () => {
      TagService.associateTagsWithSnippet(snippetId, []);

      const tags = TagService.getTagsBySnippetId(snippetId);

      expect(tags).toHaveLength(0);
    });

    it("should normalize tag names", () => {
      TagService.associateTagsWithSnippet(snippetId, [
        "JavaScript",
        "  React  ",
        "TypeScript",
      ]);

      const tags = TagService.getTagsBySnippetId(snippetId);

      expect(tags).toHaveLength(3);
      expect(tags.map((t) => t.name)).toContain("javascript");
      expect(tags.map((t) => t.name)).toContain("react");
      expect(tags.map((t) => t.name)).toContain("typescript");
    });

    it("should handle duplicate tag names in array", () => {
      TagService.associateTagsWithSnippet(snippetId, [
        "javascript",
        "JavaScript",
        "JAVASCRIPT",
      ]);

      const tags = TagService.getTagsBySnippetId(snippetId);

      expect(tags).toHaveLength(1);
      expect(tags[0].name).toBe("javascript");
    });
  });

  describe("removeTagsFromSnippet", () => {
    let snippetId: number;

    beforeEach(() => {
      // Create a test snippet with tags
      const db = getDatabase();
      const result = db
        .prepare(
          "INSERT INTO snippets (title, content, language, tags) VALUES (?, ?, ?, ?)"
        )
        .run("Test Snippet", 'console.log("test")', "javascript", "general");
      snippetId = result.lastInsertRowid as number;

      // Associate tags
      TagService.associateTagsWithSnippet(snippetId, [
        "javascript",
        "react",
        "typescript",
      ]);
    });

    it("should remove all tags from snippet", () => {
      TagService.removeTagsFromSnippet(snippetId);

      const tags = TagService.getTagsBySnippetId(snippetId);

      expect(tags).toHaveLength(0);
    });

    it("should not affect other snippets", () => {
      // Create another snippet with same tags
      const db = getDatabase();
      const result = db
        .prepare(
          "INSERT INTO snippets (title, content, language, tags) VALUES (?, ?, ?, ?)"
        )
        .run(
          "Another Snippet",
          'console.log("test2")',
          "javascript",
          "general"
        );
      const snippetId2 = result.lastInsertRowid as number;

      TagService.associateTagsWithSnippet(snippetId2, ["javascript", "react"]);

      // Remove tags from first snippet
      TagService.removeTagsFromSnippet(snippetId);

      // Second snippet should still have tags
      const tags = TagService.getTagsBySnippetId(snippetId2);
      expect(tags).toHaveLength(2);
    });
  });
});
