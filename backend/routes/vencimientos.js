const express = require("express");
const router = express.Router();
const db = require("../database/connection");

// 📍 GET: obtener todos los vencimientos
router.get("/", (req, res) => {
  db.all("SELECT * FROM vencimientos ORDER BY diasRestantes ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 📍 POST: crear nuevo vencimiento
router.post("/", (req, res) => {
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

module.exports = router;
