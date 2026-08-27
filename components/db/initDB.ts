import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("easyflashcards.db");

export function initDatabase() {
  db.execSync("PRAGMA journal_mode = WAL;");
  db.execSync("PRAGMA foreign_keys = ON;");

  const row = db.getFirstSync<{ user_version: number }>("PRAGMA user_version;");
  let currentVersion = row?.user_version ?? 0;

  console.log("🔍 DB version actual:", currentVersion); // <-- agregá esto

  // ... resto igual

  // Versión 1: Tablas iniciales
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

  // Versión 2: Configuración del sistema
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
      // Ignorar si la columna ya existía
    }

    currentVersion = 2;
    db.execSync(`PRAGMA user_version = 2;`);
  }

  // Versión 3: Deck de ejemplo (se inserta una única vez, en la migración)
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
    console.log("✅ Deck de ejemplo insertado, deckRow:", deckRow); // <-- agregá esto
    currentVersion = 3;
    db.execSync(`PRAGMA user_version = 3;`);
  }
}

// 🚨 Se ejecuta al importar el módulo, garantizando las tablas listas
initDatabase();
