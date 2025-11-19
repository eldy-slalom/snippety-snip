import Database from "better-sqlite3";
import { join, dirname, isAbsolute } from "path";
import { readFileSync, mkdirSync } from "fs";

let db: Database.Database | null = null;
let currentDbPath: string | null = null;

function resolveDatabasePath(): string {
  const override = process.env.SNIPPETY_DB_PATH;

  if (override && override.trim().length > 0) {
    return isAbsolute(override) ? override : join(process.cwd(), override);
  }

  return join(process.cwd(), "data", "snippets.db");
}

/**
 * Get or create the SQLite database instance
 * @returns Database instance
 */
export function getDatabase(): Database.Database {
  const resolvedPath = resolveDatabasePath();

  if (db && currentDbPath !== resolvedPath) {
    db.close();
    db = null;
    currentDbPath = null;
  }

  if (!db) {
    // Ensure data directory exists
    mkdirSync(dirname(resolvedPath), { recursive: true });

    db = new Database(resolvedPath);
    currentDbPath = resolvedPath;
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
    currentDbPath = null;
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
  return currentDbPath ?? resolveDatabasePath();
}
