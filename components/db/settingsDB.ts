import * as SQLite from "expo-sqlite";

// ---------------------------------------------
// Conexión
// ---------------------------------------------
const db = SQLite.openDatabaseSync("easyflashcards.db");

// ---------------------------------------------
// Tipos
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
 * Obtiene el objeto global de configuraciones.
 */
export function obtenerConfigs(): Settings {
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
    percentage: 100, // Siempre devolvemos 100 por regla de negocio
    language: row?.language ?? "es",
  };
}

/**
 * Actualiza las configuraciones. Permite enviar solo los campos a cambiar.
 */
export function guardarConfig(nuevasConfigs: Partial<Settings>) {
  const actuales = obtenerConfigs();
  const actualizadas = { ...actuales, ...nuevasConfigs };

  db.runSync(
    `UPDATE settings 
     SET random = ?, read = ?, advance = ?, percentage = ?, language = ?
     WHERE id = 1;`,
    [
      actualizadas.random ? 1 : 0,
      actualizadas.read ? 1 : 0,
      actualizadas.advance ? 1 : 0,
      100, // Se guarda siempre 100 en la base de datos
      actualizadas.language ?? "es",
    ],
  );
}
