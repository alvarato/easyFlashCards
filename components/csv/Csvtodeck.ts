import {
  crearCardsDesdeCSV,
  crearDeck,
  obtenerCardsPorDeck,
  obtenerDeckPorId,
} from "../db/cardsDB";

type FilaCSV = { frente: string; reverso: string };

type CSVParseado = {
  tituloDetectado: string | null;
  filas: FilaCSV[];
};

/**
 * Parsea el texto CSV y separa el título (si la primera fila es "title,NombreDeck")
 * de las filas de cards. No crea nada en la base de datos todavía.
 */
export function parsearCSV(csvTexto: string): CSVParseado {
  const lineas = csvTexto
    .split("\n")
    .map((linea) => linea.trim())
    .filter((linea) => linea.length > 0)
    .map((linea) => linea.split(","));

  let tituloDetectado: string | null = null;
  let filasCrudas = lineas;

  // Si la primera fila es "title,NombreDelDeck", se toma como título automático
  const primeraFila = lineas[0];
  if (primeraFila && primeraFila[0]?.trim().toLowerCase() === "title") {
    tituloDetectado = primeraFila[1]?.trim() ?? null;
    filasCrudas = lineas.slice(1);
  }

  const filas = filasCrudas
    .filter((cols) => cols[0]?.trim() && cols[1]?.trim())
    .map((cols) => ({
      frente: cols[0].trim(),
      reverso: cols[1].trim(),
    }));

  return { tituloDetectado, filas };
}

/**
 * Crea el deck + cards a partir del CSV ya parseado.
 * Si el CSV traía "title", nombreManual se ignora (podés pasar undefined).
 * Si no traía "title", nombreManual es obligatorio.
 */
export function csvToDeck(csvTexto: string, nombreManual?: string): number {
  const { tituloDetectado, filas } = parsearCSV(csvTexto);

  const nombreFinal = tituloDetectado ?? nombreManual;
  if (!nombreFinal) {
    throw new Error(
      "El CSV no tiene título automático. Debés indicar un nombre para el deck.",
    );
  }

  const deckId = crearDeck(nombreFinal);
  crearCardsDesdeCSV(deckId, filas);

  return deckId;
}

/**
 * Convierte las cartas de un deck a un string CSV.
 * La primera fila contiene: title, <nombreDeck>
 */
export function deckToCsv(deckId: number): string | null {
  const deck = obtenerDeckPorId(deckId);
  if (!deck) return null;

  const cards = obtenerCardsPorDeck(deckId);

  // Fila de encabezado con el título del deck
  const lineas = [`title,${deck.nombre}`];

  // Filas con frente y reverso de cada carta
  for (const card of cards) {
    lineas.push(`${card.frente},${card.reverso}`);
  }

  return lineas.join("\n");
}
