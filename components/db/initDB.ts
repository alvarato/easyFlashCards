import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("easyflashcards.db");

export function initDatabase() {
  db.execSync("PRAGMA journal_mode = WAL;");
  db.execSync("PRAGMA foreign_keys = ON;");

  const row = db.getFirstSync<{ user_version: number }>("PRAGMA user_version;");
  let currentVersion = row?.user_version ?? 0;

  console.log("🔍 Current DB version:", currentVersion);

  // Version 1: Initial tables
  // NOTE: kept exactly as originally shipped (Spanish column names).
  // Do NOT rename columns here — apps already on v1 ran this as-is.
  // The rename to English happens in version 4 below.
  if (currentVersion < 1) {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS decks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        creado_en TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        deck_id INTEGER NOT NULL,
        frente TEXT NOT NULL,
        reverso TEXT NOT NULL,
        intervalo INTEGER DEFAULT 0,
        facilidad REAL DEFAULT 2.5,
        repeticiones INTEGER DEFAULT 0,
        proximo_repaso TEXT DEFAULT (datetime('now')),
        creado_en TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (deck_id) REFERENCES decks (id) ON DELETE CASCADE
      );
    `);
    currentVersion = 1;
    db.execSync(`PRAGMA user_version = 1;`);
  }

  // Version 2: System settings
  // NOTE: kept exactly as originally shipped. Do not modify.
  if (currentVersion < 2) {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        random INTEGER DEFAULT 0,
        read INTEGER DEFAULT 0,
        advance INTEGER DEFAULT 0,
        percentage INTEGER DEFAULT 100,
        language TEXT DEFAULT 'es'
      );

      INSERT OR IGNORE INTO settings (id, random, read, advance, percentage, language)
      VALUES (1, 0, 0, 0, 100, 'es');
    `);

    try {
      db.execSync(
        `ALTER TABLE settings ADD COLUMN language TEXT DEFAULT 'es';`,
      );
    } catch (e) {
      // Ignore if the column already existed
    }

    currentVersion = 2;
    db.execSync(`PRAGMA user_version = 2;`);
  }

  // Version 3: Example deck (inserted only once, during migration)
  // NOTE: kept exactly as originally shipped (still uses the Spanish
  // column names nombre/frente/reverso, since at this point in the
  // migration chain those are still the real column names). Do not modify.
  if (currentVersion < 3) {
    const exampleCards: [string, string][] = [
      ["Hello", "Hola"],
      ["Goodbye", "Adiós"],
      ["Please", "Por favor"],
      ["Thank you", "Gracias"],
      ["Good morning", "Buenos días"],
      ["Good night", "Buenas noches"],
      ["Yes", "Sí"],
      ["No", "No"],
      ["How are you?", "¿Cómo estás?"],
      ["My name is...", "Me llamo..."],
    ];

    db.execSync(`INSERT INTO decks (nombre) VALUES ('Example Deck');`);

    const deckRow = db.getFirstSync<{ id: number }>(
      `SELECT id FROM decks WHERE nombre = 'Example Deck' ORDER BY id DESC LIMIT 1;`,
    );

    if (deckRow?.id) {
      const insertCard = db.prepareSync(
        `INSERT INTO cards (deck_id, frente, reverso) VALUES ($deckId, $frente, $reverso);`,
      );
      try {
        for (const [frente, reverso] of exampleCards) {
          insertCard.executeSync({
            $deckId: deckRow.id,
            $frente: frente,
            $reverso: reverso,
          });
        }
      } finally {
        insertCard.finalizeSync();
      }
    }
    console.log("✅ Example deck inserted, deckRow:", deckRow);
    currentVersion = 3;
    db.execSync(`PRAGMA user_version = 3;`);
  }

  // Version 4: Standardize column names to English
  // Renames the legacy Spanish columns to their English equivalents so the
  // schema matches the rest of the codebase (db.ts, csv.ts, etc.).
  // - Fresh installs: still go through v1→v3 first (creating the Spanish
  //   columns), then land here and get renamed in the same run, so they end
  //   up identical to upgraded installs.
  // - Existing installs: their data is preserved, only the column names change.
  // Requires SQLite 3.25+ for ALTER TABLE ... RENAME COLUMN, which the
  // expo-sqlite versions used here support.
  if (currentVersion < 4) {
    db.execSync(`
      ALTER TABLE decks RENAME COLUMN nombre TO name;
      ALTER TABLE decks RENAME COLUMN creado_en TO createdAt;

      ALTER TABLE cards RENAME COLUMN deck_id TO deckId;
      ALTER TABLE cards RENAME COLUMN frente TO front;
      ALTER TABLE cards RENAME COLUMN reverso TO back;
      ALTER TABLE cards RENAME COLUMN intervalo TO interval;
      ALTER TABLE cards RENAME COLUMN facilidad TO easeFactor;
      ALTER TABLE cards RENAME COLUMN repeticiones TO repetitions;
      ALTER TABLE cards RENAME COLUMN proximo_repaso TO nextReview;
      ALTER TABLE cards RENAME COLUMN creado_en TO createdAt;
    `);

    console.log("🔤 Columns renamed to English (decks/cards).");
    currentVersion = 4;
    db.execSync(`PRAGMA user_version = 4;`);
  }
}

// 🚨 Runs on module import, guaranteeing the tables are ready
initDatabase();