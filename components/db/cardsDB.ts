import * as SQLite from "expo-sqlite";

// ---------------------------------------------
// Conexion a la base de datos
// ---------------------------------------------
export const db = SQLite.openDatabaseSync("easyflashcards.db");

// ---------------------------------------------
// Migraciones
// ---------------------------------------------
// Cada vez que cambies el esquema, agrega un nuevo bloque "if (version < N)"
// y sube LATEST_VERSION. Nunca modifiques los bloques ya existentes.
const LATEST_VERSION = 1;

// ---------------------------------------------
// Tipos
// ---------------------------------------------
export type Deck = {
  id: number;
  nombre: string;
  creado_en: string;
};

export interface DeckObject {
  id: number;
  nombre: string;
  creado_en: string;
}

export type Card = {
  id: number;
  deck_id: number;
  frente: string;
  reverso: string;
  intervalo: number;
  facilidad: number;
  repeticiones: number;
  proximo_repaso: string;
  creado_en: string;
};

// Calificacion que da el usuario al repasar una card
export type Calificacion = "otra_vez" | "dificil" | "bien" | "facil";

// ---------------------------------------------
// Decks: CRUD
// ---------------------------------------------
export function crearDeck(nombre: string): number {
  const result = db.runSync("INSERT INTO decks (nombre) VALUES (?);", [nombre]);
  return result.lastInsertRowId;
}

export function obtenerDecks(): Deck[] {
  return db.getAllSync<Deck>("SELECT * FROM decks ORDER BY creado_en DESC;");
}

export function obtenerDeckPorId(deckId: number): Deck | null {
  return db.getFirstSync<Deck>("SELECT * FROM decks WHERE id = ?;", [deckId]);
}

export function renombrarDeck(deckId: number, nuevoNombre: string) {
  db.runSync("UPDATE decks SET nombre = ? WHERE id = ?;", [
    nuevoNombre,
    deckId,
  ]);
}

export function eliminarDeck(deckId: number) {
  // Gracias al ON DELETE CASCADE, las cards del deck se borran solas
  db.runSync("DELETE FROM decks WHERE id = ?;", [deckId]);
}

// ---------------------------------------------
// Cards: CRUD
// ---------------------------------------------
export function crearCard(
  deckId: number,
  frente: string,
  reverso: string,
): number {
  const result = db.runSync(
    "INSERT INTO cards (deck_id, frente, reverso) VALUES (?, ?, ?);",
    [deckId, frente, reverso],
  );
  return result.lastInsertRowId;
}

export function obtenerCardsPorDeck(deckId: number): Card[] {
  return db.getAllSync<Card>(
    "SELECT * FROM cards WHERE deck_id = ? ORDER BY id ASC;",
    [deckId],
  );
}

export function eliminarCard(cardId: number) {
  db.runSync("DELETE FROM cards WHERE id = ?;", [cardId]);
}

export function editarCard(
  cardId: number,
  nuevoFrente: string,
  nuevoReverso: string,
) {
  db.runSync("UPDATE cards SET frente = ?, reverso = ? WHERE id = ?;", [
    nuevoFrente,
    nuevoReverso,
    cardId,
  ]);
}

// Insertar varias cards de una vez (ideal para import CSV)
export function crearCardsDesdeCSV(
  deckId: number,
  filas: { frente: string; reverso: string }[],
) {
  db.withTransactionSync(() => {
    for (const fila of filas) {
      db.runSync(
        "INSERT INTO cards (deck_id, frente, reverso) VALUES (?, ?, ?);",
        [deckId, fila.frente, fila.reverso],
      );
    }
  });
}

// ---------------------------------------------
// Estudio: repaso espaciado (SM-2 simplificado)
// ---------------------------------------------

// Cards que ya tocan repasar hoy (o antes)
export function obtenerCardsParaRepasar(deckId: number): Card[] {
  return db.getAllSync<Card>(
    `SELECT * FROM cards
     WHERE deck_id = ? AND proximo_repaso <= datetime('now')
     ORDER BY proximo_repaso ASC;`,
    [deckId],
  );
}

// Aplica el algoritmo SM-2 y guarda el resultado en la card
export function calificarCard(cardId: number, calificacion: Calificacion) {
  const card = db.getFirstSync<Card>("SELECT * FROM cards WHERE id = ?;", [
    cardId,
  ]);
  if (!card) return;

  const { intervalo, facilidad, repeticiones } = card;

  const notas: Record<Calificacion, number> = {
    otra_vez: 0,
    dificil: 3,
    bien: 4,
    facil: 5,
  };
  const q = notas[calificacion];

  let nuevaFacilidad = facilidad + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (nuevaFacilidad < 1.3) nuevaFacilidad = 1.3;

  let nuevasRepeticiones: number;
  let nuevoIntervalo: number;

  if (q < 3) {
    // Fallo: se reinicia el conteo, vuelve a verse pronto
    nuevasRepeticiones = 0;
    nuevoIntervalo = 1;
  } else {
    nuevasRepeticiones = repeticiones + 1;
    if (nuevasRepeticiones === 1) {
      nuevoIntervalo = 1;
    } else if (nuevasRepeticiones === 2) {
      nuevoIntervalo = 6;
    } else {
      nuevoIntervalo = Math.round(intervalo * nuevaFacilidad);
    }
  }

  db.runSync(
    `UPDATE cards
     SET intervalo = ?, facilidad = ?, repeticiones = ?,
         proximo_repaso = datetime('now', '+' || ? || ' days')
     WHERE id = ?;`,
    [
      nuevoIntervalo,
      nuevaFacilidad,
      nuevasRepeticiones,
      nuevoIntervalo,
      cardId,
    ],
  );
}
