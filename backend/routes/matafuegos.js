const express = require("express");
const router = express.Router();
const db = require("../database/connection");

// 📍 GET: obtener todos los matafuegos
router.get("/", (req, res) => {
  db.all("SELECT * FROM matafuegos ORDER BY piso ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 📍 POST: crear nuevo matafuego
router.post("/", (req, res) => {
  const { piso, tipo, kilos, fechaVencimiento } = req.body;
  db.run(
    "INSERT INTO matafuegos (piso, tipo, kilos, fechaVencimiento) VALUES (?, ?, ?, ?)",
    [piso, tipo, kilos, fechaVencimiento],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, piso, tipo, kilos, fechaVencimiento });
    }
  );
});

// 📍 PUT: editar matafuego
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { piso, tipo, kilos, fechaVencimiento } = req.body;
  db.run(
    "UPDATE matafuegos SET piso = ?, tipo = ?, kilos = ?, fechaVencimiento = ? WHERE id = ?",
    [piso, tipo, kilos, fechaVencimiento, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, piso, tipo, kilos, fechaVencimiento });
    }
  );
});

// 📍 DELETE: eliminar matafuego
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM matafuegos WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Matafuego eliminado", id });
  });
});

module.exports = router;
