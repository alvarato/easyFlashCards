import {
  createCardsFromCSV,
  createDeck,
  getCardsByDeck,
  getDeckById,
} from "../db/cardsDB";

type CSVRow = { front: string; back: string };

type ParsedCSV = {
  detectedTitle: string | null;
  rows: CSVRow[];
};

/**
 * Parses the CSV text and separates the title (if the first row is "title,DeckName")
 * from the card rows. Doesn't create anything in the database yet.
 */
export function parseCSV(csvText: string): ParsedCSV {
  const lines = csvText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.split(","));

  let detectedTitle: string | null = null;
  let rawRows = lines;

  // If the first row is "title,DeckName", it's taken as the automatic title
  const firstRow = lines[0];
  if (firstRow && firstRow[0]?.trim().toLowerCase() === "title") {
    detectedTitle = firstRow[1]?.trim() ?? null;
    rawRows = lines.slice(1);
  }

  const rows = rawRows
    .filter((cols) => cols[0]?.trim() && cols[1]?.trim())
    .map((cols) => ({
      front: cols[0].trim(),
      back: cols[1].trim(),
    }));

  return { detectedTitle, rows };
}

/**
 * Creates the deck + cards from an already-parsed CSV.
 * If the CSV had a "title" row, manualName is ignored (you can pass undefined).
 * If it didn't, manualName is required.
 */
export function csvToDeck(csvText: string, manualName?: string): number {
  const { detectedTitle, rows } = parseCSV(csvText);

  const finalName = detectedTitle ?? manualName;
  if (!finalName) {
    throw new Error(
      "The CSV has no automatic title. You must provide a name for the deck.",
    );
  }

  const deckId = createDeck(finalName);
  createCardsFromCSV(deckId, rows);

  return deckId;
}

/**
 * Converts a deck's cards into a CSV string.
 * The first row contains: title, <deckName>
 */
export function deckToCsv(deckId: number): string | null {
  const deck = getDeckById(deckId);
  if (!deck) return null;

  const cards = getCardsByDeck(deckId);

  // Header row with the deck's title
  const lines = [`title,${deck.name}`];

  // Rows with front and back of each card
  for (const card of cards) {
    lines.push(`${card.front},${card.back}`);
  }

  return lines.join("\n");
}