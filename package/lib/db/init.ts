#!/usr/bin/env node

/**
 * Database initialization script
 * Creates the database and runs migrations
 */

import { getDatabase, runMigration, closeDatabase } from "./client";
import { join } from "path";

// Use process.cwd() to get the project root (package directory)
const MIGRATIONS_DIR = join(process.cwd(), "lib", "db", "migrations");

async function initializeDatabase() {
  try {
    console.log("Initializing database...");

    // Get database instance (creates file if it doesn't exist)
    const db = getDatabase();
    console.log("Database connection established");

    // Run migrations
    const migrationFiles = ["001_initial_schema.sql", "002_add_tags.sql"];

    for (const migrationFile of migrationFiles) {
      const migrationPath = join(MIGRATIONS_DIR, migrationFile);
      console.log(`Running migration: ${migrationFile}`);
      runMigration(migrationPath);
    }

    console.log("Database initialized successfully!");
    console.log(`Database location: ${db.name}`);

    // Verify tables exist
    const tables = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='snippets'"
      )
      .get();

    if (tables) {
      console.log("✓ Snippets table created successfully");
    } else {
      throw new Error("Snippets table was not created");
    }

    closeDatabase();
  } catch (error) {
    console.error("Error initializing database:", error);
    closeDatabase();
    process.exit(1);
  }
}

// Run initialization if this script is executed directly
initializeDatabase();

export { initializeDatabase };
