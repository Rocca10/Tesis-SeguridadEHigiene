const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");

// Ruta donde voy a crear la base de datos
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

  db.run(`CREATE TABLE IF NOT EXISTS botiquines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    piso TEXT,
    responsable TEXT,
    elementos TEXT,
    fechaRevision TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS senializacion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    piso TEXT,
    tipo TEXT,
    fechaRevision TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('ADMIN', 'TECNICO', 'OPERADOR')),
    activo INTEGER NOT NULL DEFAULT 1,
    creado_en TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
});

async function seedUsers() {
  const users = [
    { usuario: "admin", password: "Admin123", rol: "ADMIN" },
    { usuario: "tecnico", password: "Tecnico123", rol: "TECNICO" },
    { usuario: "operador", password: "Operador123", rol: "OPERADOR" },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);

    db.run(
      "INSERT OR IGNORE INTO usuarios (usuario, password_hash, rol, activo) VALUES (?, ?, ?, 1)",
      [u.usuario, hash, u.rol]
    );
  }
}

seedUsers();

module.exports = db;
