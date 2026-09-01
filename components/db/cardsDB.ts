import * as SQLite from "expo-sqlite";

// ---------------------------------------------
// Database connection
// ---------------------------------------------
export const db = SQLite.openDatabaseSync("easyflashcards.db");

// ---------------------------------------------
// Migrations
// ---------------------------------------------
// Every time you change the schema, add a new "if (version < N)" block
// and bump LATEST_VERSION. Never modify existing blocks.
const LATEST_VERSION = 1;

// ---------------------------------------------
// Types
// ---------------------------------------------
export type Deck = {
  id: number;
  name: string;
  createdAt: string;
};

export interface DeckObject {
  id: number;
  name: string;
  createdAt: string;
}

export type Card = {
  id: number;
  deckId: number;
  front: string;
  back: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: string;
  createdAt: string;
};

// Rating the user gives a card during review
export type Rating = "again" | "hard" | "good" | "easy";

// ---------------------------------------------
// Decks: CRUD
// ---------------------------------------------
export function createDeck(name: string): number {
  const result = db.runSync("INSERT INTO decks (name) VALUES (?);", [name]);
  return result.lastInsertRowId;
}

export function getDecks(): Deck[] {
  return db.getAllSync<Deck>("SELECT * FROM decks ORDER BY createdAt DESC;");
}

export function getDeckById(deckId: number): Deck | null {
  return db.getFirstSync<Deck>("SELECT * FROM decks WHERE id = ?;", [deckId]);
}

export function renameDeck(deckId: number, newName: string) {
  db.runSync("UPDATE decks SET name = ? WHERE id = ?;", [
    newName,
    deckId,
  ]);
}

export function deleteDeck(deckId: number) {
  // Thanks to ON DELETE CASCADE, the deck's cards are removed automatically
  db.runSync("DELETE FROM decks WHERE id = ?;", [deckId]);
}

export function searchDecksByTitle(query: string): Deck[] {
  return db.getAllSync<Deck>(
    "SELECT * FROM decks WHERE name LIKE ? ORDER BY createdAt DESC;",
    [`%${query}%`],
  );
}

// ---------------------------------------------
// Cards: CRUD
// ---------------------------------------------
export function createCard(
  deckId: number,
  front: string,
  back: string,
): number {
  const result = db.runSync(
    "INSERT INTO cards (deckId, front, back) VALUES (?, ?, ?);",
    [deckId, front, back],
  );
  return result.lastInsertRowId;
}

export function getCardsByDeck(deckId: number): Card[] {
  return db.getAllSync<Card>(
    "SELECT * FROM cards WHERE deckId = ? ORDER BY id ASC;",
    [deckId],
  );
}

export function deleteCard(cardId: number) {
  db.runSync("DELETE FROM cards WHERE id = ?;", [cardId]);
}

export function rateCardSimple(cardId: number, correct: boolean) {
  if (!correct) {
    rateCard(cardId, "again");
    return;
  }

  const card = db.getFirstSync<Card>("SELECT * FROM cards WHERE id = ?;", [
    cardId,
  ]);

  // If it already had repetitions (was being answered correctly), bump it to "easy"
  const rating = card && card.repetitions > 0 ? "easy" : "good";
  rateCard(cardId, rating);
}

export function editCard(
  cardId: number,
  newFront: string,
  newBack: string,
) {
  db.runSync("UPDATE cards SET front = ?, back = ? WHERE id = ?;", [
    newFront,
    newBack,
    cardId,
  ]);
}

// Insert several cards at once (ideal for CSV import)
export function createCardsFromCSV(
  deckId: number,
  rows: { front: string; back: string }[],
) {
  db.withTransactionSync(() => {
    for (const row of rows) {
      db.runSync(
        "INSERT INTO cards (deckId, front, back) VALUES (?, ?, ?);",
        [deckId, row.front, row.back],
      );
    }
  });
}

// ---------------------------------------------
// Study: spaced repetition (simplified SM-2)
// ---------------------------------------------

// Cards that are due for review today (or earlier)
export function getCardsToReview(deckId: number): Card[] {
  return db.getAllSync<Card>(
    `SELECT * FROM cards
     WHERE deckId = ? AND nextReview <= datetime('now')
     ORDER BY nextReview ASC;`,
    [deckId],
  );
}

// Applies the SM-2 algorithm and saves the result on the card
export function rateCard(cardId: number, rating: Rating) {
  const card = db.getFirstSync<Card>("SELECT * FROM cards WHERE id = ?;", [
    cardId,
  ]);
  if (!card) return;

  const { interval, easeFactor, repetitions } = card;

  const scores: Record<Rating, number> = {
    again: 0,
    hard: 3,
    good: 4,
    easy: 5,
  };
  const q = scores[rating];

  let newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  let newRepetitions: number;
  let newInterval: number;

  if (q < 3) {
    // Failure: reset the count, review again soon
    newRepetitions = 0;
    newInterval = 1;
  } else {
    newRepetitions = repetitions + 1;
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }
  }

  db.runSync(
    `UPDATE cards
     SET interval = ?, easeFactor = ?, repetitions = ?,
         nextReview = datetime('now', '+' || ? || ' days')
     WHERE id = ?;`,
    [
      newInterval,
      newEaseFactor,
      newRepetitions,
      newInterval,
      cardId,
    ],
  );
}