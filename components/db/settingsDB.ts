import * as SQLite from "expo-sqlite";

// ---------------------------------------------
// Connection
// ---------------------------------------------
const db = SQLite.openDatabaseSync("easyflashcards.db");

// ---------------------------------------------
// Types
// ---------------------------------------------
export type Settings = {
  random: boolean;
  read: boolean;
  advance: boolean;
  percentage: number;
  language: string;
};

// ---------------------------------------------
// CRUD
// ---------------------------------------------

/**
 * Gets the global settings object.
 */
export function getSettings(): Settings {
  const row = db.getFirstSync<{
    random: number;
    read: number;
    advance: number;
    percentage: number;
    language: string;
  }>("SELECT * FROM settings WHERE id = 1;");

  return {
    random: Boolean(row?.random ?? 0),
    read: Boolean(row?.read ?? 0),
    advance: Boolean(row?.advance ?? 0),
    percentage: 100, // Always return 100 per business rule
    language: row?.language ?? "es",
  };
}

/**
 * Updates the settings. Allows sending only the fields to change.
 */
export function saveConfig(newSettings: Partial<Settings>) {
  const current = getSettings();
  const updated = { ...current, ...newSettings };

  db.runSync(
    `UPDATE settings 
     SET random = ?, read = ?, advance = ?, percentage = ?, language = ?
     WHERE id = 1;`,
    [
      updated.random ? 1 : 0,
      updated.read ? 1 : 0,
      updated.advance ? 1 : 0,
      100, // Always stored as 100 in the database
      updated.language ?? "es",
    ],
  );
}