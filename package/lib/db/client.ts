import Database from "better-sqlite3";
import { join, dirname } from "path";
import { readFileSync, mkdirSync } from "fs";

const DB_PATH = join(process.cwd(), "data", "snippets.db");

let db: Database.Database | null = null;

/**
 * Get or create the SQLite database instance
 * @returns Database instance
 */
export function getDatabase(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    mkdirSync(dirname(DB_PATH), { recursive: true });

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL"); // Enable Write-Ahead Logging for better performance
  }
  return db;
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Run a migration file
 * @param migrationPath Path to the migration SQL file
 */
export function runMigration(migrationPath: string): void {
  const db = getDatabase();
  const migrationSQL = readFileSync(migrationPath, "utf-8");
  db.exec(migrationSQL);
}

/**
 * Get the database path
 * @returns Path to the database file
 */
export function getDatabasePath(): string {
  return DB_PATH;
}

