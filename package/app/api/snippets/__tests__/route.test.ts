/**
 * Integration tests for POST /api/snippets endpoint
 * TDD Red Phase - Tests written before implementation
 */

import type { NextRequest } from "next/server";
import { POST, GET } from "../route";
import { SnippetService } from "../../../../lib/db/snippets";
import { getDatabase, closeDatabase } from "../../../../lib/db/client";
import { join } from "path";
import { unlinkSync, existsSync, mkdirSync } from "fs";

const TEST_DB_PATH = join(process.cwd(), "data", "test-api-snippets.db");

const createPostRequest = (body: unknown): NextRequest =>
  ({
    async json() {
      return body;
    },
  } as unknown as NextRequest);

jest.mock("next/server", () => {
  const createResponse = (
    data: unknown,
    init?: { status?: number; headers?: Record<string, string> }
  ) => ({
    status: init?.status ?? 200,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    async json() {
      return data;
    },
  });

  class MockNextRequest {}

  return {
    NextResponse: {
      json: createResponse,
    },
    NextRequest: MockNextRequest,
  };
});

// Mock the database path for tests
jest.mock("../../../../lib/db/client", () => {
  const Database = require("better-sqlite3");
  let testDb: any = null;

  return {
    getDatabase: () => {
      if (!testDb) {
        testDb = new Database(TEST_DB_PATH);
        testDb.pragma("journal_mode = WAL");
      }
      return testDb;
    },
    closeDatabase: () => {
      if (testDb) {
        testDb.close();
        testDb = null;
      }
    },
    runMigration: jest.fn(),
    getDatabasePath: () => TEST_DB_PATH,
  };
});

describe("/api/snippets API Integration Tests", () => {
  const defaultLanguage = "javascript";

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

    // Drop table if exists to ensure clean slate
    db.exec(`DROP TABLE IF EXISTS snippets`);

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

  describe("POST /api/snippets", () => {
    it("should create a snippet with valid data and return 201", async () => {
      const requestBody = {
        title: "Test API Snippet",
        content: 'console.log("API test");',
        language: defaultLanguage,
        tags: ["javascript", "test"],
      };

      const request = createPostRequest(requestBody);

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData.snippet).toBeDefined();
      expect(responseData.snippet.id).toBeDefined();
      expect(responseData.snippet.title).toBe(requestBody.title);
      expect(responseData.snippet.content).toBe(requestBody.content);
      expect(responseData.snippet.language).toBe(defaultLanguage);
      expect(responseData.snippet.created_at).toBeDefined();
      expect(responseData.snippet.updated_at).toBeDefined();
    });

    it("should normalize line endings in content", async () => {
      const requestBody = {
        title: "Line Endings Test",
        content: "Line 1\r\nLine 2\r\nLine 3",
        language: defaultLanguage,
        tags: ["test"],
      };

      const request = createPostRequest(requestBody);

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData.snippet.content).toBe("Line 1\nLine 2\nLine 3");
    });

    it("should return 400 for empty title", async () => {
      const requestBody = {
        title: "",
        content: "some content",
        language: defaultLanguage,
        tags: ["test"],
      };

      const request = createPostRequest(requestBody);

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Validation failed");
      expect(responseData.details).toBeDefined();
      expect(responseData.details).toHaveLength(1);
      expect(responseData.details[0].field).toBe("title");
      expect(responseData.details[0].message).toBe("Title is required");
    });

    it("should return 400 for whitespace-only title", async () => {
      const requestBody = {
        title: "   \t  \n  ",
        content: "some content",
        language: defaultLanguage,
        tags: ["test"],
      };

      const request = createPostRequest(requestBody);

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Validation failed");
      expect(responseData.details[0].field).toBe("title");
      expect(responseData.details[0].message).toBe(
        "Title cannot be empty or whitespace only"
      );
    });

    it("should return 400 for empty content", async () => {
      const requestBody = {
        title: "Valid Title",
        content: "",
        language: defaultLanguage,
        tags: ["test"],
      };

      const request = createPostRequest(requestBody);

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Validation failed");
      expect(responseData.details[0].field).toBe("content");
      expect(responseData.details[0].message).toBe("Code content is required");
    });

    it("should return 400 for whitespace-only content", async () => {
      const requestBody = {
        title: "Valid Title",
        content: "   \t  \n  ",
        language: defaultLanguage,
        tags: ["test"],
      };

      const request = createPostRequest(requestBody);

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Validation failed");
      expect(responseData.details[0].field).toBe("content");
      expect(responseData.details[0].message).toBe(
        "Code content cannot be empty or whitespace only"
      );
    });

    it("should return 400 for multiple validation errors", async () => {
      const requestBody = {
        title: "",
        content: "",
        language: defaultLanguage,
        tags: ["test"],
      };

      const request = createPostRequest(requestBody);

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Validation failed");
      expect(responseData.details).toHaveLength(2);
      expect(responseData.details.some((e) => e.field === "title")).toBe(true);
      expect(responseData.details.some((e) => e.field === "content")).toBe(
        true
      );
    });

    it("should handle large content up to 50,000 characters", async () => {
      const largeContent = "a".repeat(50000);
      const requestBody = {
        title: "Large Content Test",
        content: largeContent,
        language: defaultLanguage,
        tags: ["test"],
      };

      const request = createPostRequest(requestBody);

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData.snippet.content).toBe(largeContent);
      expect(responseData.snippet.content.length).toBe(50000);
    });

    it("should return 400 for content exceeding 50,000 characters", async () => {
      const tooLargeContent = "a".repeat(50001);
      const requestBody = {
        title: "Too Large Content Test",
        content: tooLargeContent,
        language: defaultLanguage,
        tags: ["test"],
      };

      const request = createPostRequest(requestBody);

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Validation failed");
      expect(responseData.details[0].field).toBe("content");
      expect(responseData.details[0].message).toBe(
        "Code content must be 50,000 characters or less"
      );
    });

    it("should return 500 for server errors", async () => {
      // Mock SnippetService to throw an error
      const originalCreateBasicSnippet = SnippetService.createBasicSnippet;
      SnippetService.createBasicSnippet = jest.fn().mockImplementation(() => {
        throw new Error("Database error");
      });

      const requestBody = {
        title: "Test Snippet",
        content: "test content",
        language: defaultLanguage,
        tags: ["test"],
      };

      const request = createPostRequest(requestBody);

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.error).toBe(
        "Failed to create snippet. Please try again."
      );

      // Restore original method
      SnippetService.createBasicSnippet = originalCreateBasicSnippet;
    });

    it("should return 400 when language is missing", async () => {
      const requestBody = {
        title: "Missing Language",
        content: "some content",
        tags: ["test"],
      };

      const request = createPostRequest(requestBody);

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Validation failed");
      expect(responseData.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "language",
            message: "Language selection is required",
          }),
        ])
      );
    });

    it("should return 400 when language is invalid", async () => {
      const requestBody = {
        title: "Invalid Language",
        content: "some content",
        language: "invalid-lang",
        tags: ["test"],
      };

      const request = createPostRequest(requestBody);

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Validation failed");
      expect(responseData.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "language",
            message: "Choose a language from the supported list",
          }),
        ])
      );
    });
  });

  describe("GET /api/snippets", () => {
    it("should return empty array when no snippets exist", async () => {
      const response = await GET();
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.snippets).toEqual([]);
    });

    it("should return all snippets in correct order", async () => {
      // Create test snippets
      const snippet1 = SnippetService.createBasicSnippet({
        title: "First Snippet",
        content: "first content",
        language: defaultLanguage,
        tags: ["test"],
      });

      const snippet2 = SnippetService.createBasicSnippet({
        title: "Second Snippet",
        content: "second content",
        language: defaultLanguage,
        tags: ["test"],
      });

      const response = await GET();
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.snippets).toHaveLength(2);
      expect(responseData.snippets[0].id).toBe(snippet2.id); // Newest first
      expect(responseData.snippets[1].id).toBe(snippet1.id);
    });
  });
});
