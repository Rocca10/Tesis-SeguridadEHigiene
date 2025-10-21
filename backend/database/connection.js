const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ✅ Ruta correcta a la base de datos
const dbPath = path.resolve(__dirname, "seguridad.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ Error al conectar con SQLite:", err.message);
  else console.log("✅ Conectado a la base de datos SQLite en", dbPath);
});

// Crear tablas si no existen
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS matafuegos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    piso TEXT,
    tipo TEXT,
    kilos INTEGER,
    fechaVencimiento TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS alertas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT,
    mensaje TEXT,
    icono TEXT,
    color TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS vencimientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    fecha TEXT,
    diasRestantes INTEGER
  )`);
});

module.exports = db;
