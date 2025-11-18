/**
 * Unit tests for Snippet service layer - MVP basic snippet functions
 * TDD Red Phase - Tests written before implementation
 */

import { SnippetService } from "../snippets";
import { getDatabase, closeDatabase } from "../client";
import { join } from "path";
import { unlinkSync, existsSync, mkdirSync } from "fs";
import type { CreateSnippetData } from "../../../types/snippet";

const TEST_DB_PATH = join(process.cwd(), "data", "test-snippets.db");

describe("SnippetService - MVP Functions", () => {
  beforeEach(() => {
    // Clean up test database before each test
    if (existsSync(TEST_DB_PATH)) {
      closeDatabase();
      unlinkSync(TEST_DB_PATH);
    }

    // Ensure data directory exists
    mkdirSync(join(process.cwd(), "data"), { recursive: true });

    // Initialize test database with schema
    const db = getDatabase();

    // Create snippets table with all required fields
    db.exec(`
      CREATE TABLE IF NOT EXISTS snippets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL CHECK(length(title) > 0 AND length(title) <= 100),
        content TEXT NOT NULL CHECK(length(content) > 0),
        language TEXT NOT NULL,
        tags TEXT NOT NULL CHECK(length(tags) > 0),
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
  });

  afterEach(() => {
    closeDatabase();
    if (existsSync(TEST_DB_PATH)) {
      unlinkSync(TEST_DB_PATH);
    }
  });

  describe("createBasicSnippet", () => {
    it("should create a snippet with valid title and content", () => {
      const snippetData: CreateSnippetData = {
        title: "Test Snippet",
        content: 'console.log("Hello, World!");',
      };

      const result = SnippetService.createBasicSnippet(snippetData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.title).toBe(snippetData.title);
      expect(result.content).toBe(snippetData.content);
      expect(result.created_at).toBeDefined();
      expect(result.updated_at).toBeDefined();
      expect(typeof result.id).toBe("number");
    });

    it("should normalize line endings to LF", () => {
      const snippetData: CreateSnippetData = {
        title: "Line Ending Test",
        content: "Line 1\r\nLine 2\r\nLine 3",
      };

      const result = SnippetService.createBasicSnippet(snippetData);

      expect(result.content).toBe("Line 1\nLine 2\nLine 3");
    });

    it("should preserve formatting including tabs and spaces", () => {
      const snippetData: CreateSnippetData = {
        title: "Formatting Test",
        content:
          'function test() {\n\t  if (true) {\n\t    return "hello";\n\t  }\n}',
      };

      const result = SnippetService.createBasicSnippet(snippetData);

      expect(result.content).toBe(snippetData.content);
    });

    it("should handle exactly 100 character title", () => {
      const longTitle = "a".repeat(100);
      const snippetData: CreateSnippetData = {
        title: longTitle,
        content: "test content",
      };

      const result = SnippetService.createBasicSnippet(snippetData);

      expect(result.title).toBe(longTitle);
      expect(result.title.length).toBe(100);
    });

    it("should handle large content up to 50,000 characters", () => {
      const largeContent = "a".repeat(50000);
      const snippetData: CreateSnippetData = {
        title: "Large Content Test",
        content: largeContent,
      };

      const result = SnippetService.createBasicSnippet(snippetData);

      expect(result.content).toBe(largeContent);
      expect(result.content.length).toBe(50000);
    });

    it("should throw error for empty title", () => {
      const snippetData: CreateSnippetData = {
        title: "",
        content: "some content",
      };

      expect(() => {
        SnippetService.createBasicSnippet(snippetData);
      }).toThrow();
    });

    it("should throw error for empty content", () => {
      const snippetData: CreateSnippetData = {
        title: "Test Title",
        content: "",
      };

      expect(() => {
        SnippetService.createBasicSnippet(snippetData);
      }).toThrow();
    });
  });

  describe("getAllBasicSnippets", () => {
    it("should return empty array when no snippets exist", () => {
      const result = SnippetService.getAllBasicSnippets();

      expect(result).toEqual([]);
    });

    it("should return all snippets ordered by creation date (newest first)", () => {
      // Create multiple snippets
      const snippet1 = SnippetService.createBasicSnippet({
        title: "First Snippet",
        content: "first content",
      });

      const snippet2 = SnippetService.createBasicSnippet({
        title: "Second Snippet",
        content: "second content",
      });

      const result = SnippetService.getAllBasicSnippets();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(snippet2.id); // Newest first
      expect(result[1].id).toBe(snippet1.id);
    });
  });

  describe("getBasicSnippetById", () => {
    it("should return snippet when found", () => {
      const created = SnippetService.createBasicSnippet({
        title: "Test Snippet",
        content: "test content",
      });

      const result = SnippetService.getBasicSnippetById(created.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(created.id);
      expect(result?.title).toBe(created.title);
      expect(result?.content).toBe(created.content);
    });

    it("should return null when snippet not found", () => {
      const result = SnippetService.getBasicSnippetById(999);

      expect(result).toBeNull();
    });
  });
});
