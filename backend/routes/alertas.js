const express = require("express");
const router = express.Router();
const db = require("../database/connection");

// 📍 GET: obtener todas las alertas
router.get("/", (req, res) => {
  db.all("SELECT * FROM alertas ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 📍 POST: crear alerta
router.post("/", (req, res) => {
  const { tipo, mensaje, icono, color } = req.body;
  db.run(
    "INSERT INTO alertas (tipo, mensaje, icono, color) VALUES (?, ?, ?, ?)",
    [tipo, mensaje, icono, color],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, tipo, mensaje, icono, color });
    }
  );
});

// 📍 PUT: editar alerta
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { tipo, mensaje, icono, color } = req.body;
  db.run(
    "UPDATE alertas SET tipo = ?, mensaje = ?, icono = ?, color = ? WHERE id = ?",
    [tipo, mensaje, icono, color, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, tipo, mensaje, icono, color });
    }
  );
});

// 📍 DELETE: eliminar alerta
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM alertas WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Alerta eliminada", id });
  });
});

module.exports = router;
