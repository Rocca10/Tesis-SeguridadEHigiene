const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// 🗄️ Conexión a base de datos SQLite (archivo local)
const db = new sqlite3.Database("./seguridad.db", (err) => {
  if (err) console.error(err.message);
  console.log("✅ Conectado a la base de datos SQLite");
});

// Crear tablas si no existen
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS vencimientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    fecha TEXT,
    diasRestantes INTEGER
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS alertas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT,
    mensaje TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS matafuegos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  piso TEXT,
  cantidad INTEGER,
  fechaVencimiento TEXT
)`);

});

// Rutas API
app.get("/api/vencimientos", (req, res) => {
  db.all("SELECT * FROM vencimientos ORDER BY diasRestantes ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/vencimientos", (req, res) => {
  const { nombre, fecha, diasRestantes } = req.body;
  db.run(
    "INSERT INTO vencimientos (nombre, fecha, diasRestantes) VALUES (?, ?, ?)",
    [nombre, fecha, diasRestantes],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, nombre, fecha, diasRestantes });
    }
  );
});

app.get("/api/alertas", (req, res) => {
  db.all("SELECT * FROM alertas", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/alertas", (req, res) => {
  const { tipo, mensaje } = req.body;
  db.run(
    "INSERT INTO alertas (tipo, mensaje) VALUES (?, ?)",
    [tipo, mensaje],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, tipo, mensaje });
    }
  );
});

// 📍 GET: Obtener todos los matafuegos
app.get("/api/matafuegos", (req, res) => {
  db.all("SELECT * FROM matafuegos ORDER BY piso ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 📍 POST: Crear un matafuego
app.post("/api/matafuegos", (req, res) => {
  const { piso, cantidad, fechaVencimiento } = req.body;
  db.run(
    "INSERT INTO matafuegos (piso, cantidad, fechaVencimiento) VALUES (?, ?, ?)",
    [piso, cantidad, fechaVencimiento],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, piso, cantidad, fechaVencimiento });
    }
  );
});

// 📍 PUT: Editar un matafuego
app.put("/api/matafuegos/:id", (req, res) => {
  const { id } = req.params;
  const { piso, cantidad, fechaVencimiento } = req.body;
  db.run(
    "UPDATE matafuegos SET piso = ?, cantidad = ?, fechaVencimiento = ? WHERE id = ?",
    [piso, cantidad, fechaVencimiento, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, piso, cantidad, fechaVencimiento });
    }
  );
});

// 📍 DELETE: Eliminar un matafuego
app.delete("/api/matafuegos/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM matafuegos WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Matafuego eliminado", id });
  });
});



const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
