
// ---------------------------------------------
// Study deck service
// ---------------------------------------------
// Genera un mazo de estudio "virtual" a partir de uno o varios deckIds.
// No persiste nada en la base de datos: solo selecciona y ordena cartas
// ya existentes, priorizando las difíciles sobre las fáciles.

import { Card, Deck, getCardsByDeck, getDecksByIds } from "./db/cardsDB";

const DEFAULT_INCLUDE_RATIO = 0.7; // % del total de cartas a incluir
const DEFAULT_HARD_RATIO = 0.7; // % de esas cartas que deben ser difíciles

export function createStudyDeck(
  deckIds: number[],
  includeRatio: number = DEFAULT_INCLUDE_RATIO,
  hardRatio: number = DEFAULT_HARD_RATIO,
): Card[] {
  if (deckIds.length === 0) return [];

  const decks: Deck[] = getDecksByIds(deckIds);
  if (decks.length === 0) return [];

  const allCards: Card[] = decks.flatMap((deck) => getCardsByDeck(deck.id));

  const totalToTake = Math.round(allCards.length * includeRatio);
  if (totalToTake <= 0) return [];

  const hardCount = Math.round(totalToTake * hardRatio);
  const easyCount = totalToTake - hardCount;

  const byDifficultyDesc: Card[] = [...allCards].sort((a, b) => {
    if (a.easeFactor !== b.easeFactor) return a.easeFactor - b.easeFactor;
    return a.repetitions - b.repetitions;
  });

  const hardPool: Card[] = byDifficultyDesc.slice(0, hardCount);
  const hardIds = new Set(hardPool.map((c) => c.id));
  const remaining: Card[] = byDifficultyDesc.filter((c) => !hardIds.has(c.id));

  const byEaseAsc: Card[] = [...remaining].sort((a, b) => {
    if (a.easeFactor !== b.easeFactor) return b.easeFactor - a.easeFactor;
    return b.repetitions - a.repetitions;
  });
  let easyPool: Card[] = byEaseAsc.slice(0, easyCount);

  const shortfall = totalToTake - (hardPool.length + easyPool.length);
  if (shortfall > 0) {
    const usedIds = new Set([...hardPool, ...easyPool].map((c) => c.id));
    const leftovers = allCards.filter((c) => !usedIds.has(c.id));
    easyPool = [...easyPool, ...leftovers.slice(0, shortfall)];
  }

  return [...hardPool, ...easyPool];
}