import * as SQLite from "expo-sqlite";

export const localDb = SQLite.openDatabaseSync("seguridad_local.db");

export function initLocalDb() {
  localDb.execSync(`
    CREATE TABLE IF NOT EXISTS matafuegos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      piso TEXT,
      tipo TEXT,
      kilos INTEGER,
      fechaVencimiento TEXT
    );
  `);
}