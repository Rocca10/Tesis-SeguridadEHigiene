const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const { authRequired, requireRole } = require("../middlewares/auth");

// 🔒 Todo lo de alertas requiere estar logueado
router.use(authRequired);

// 📍 GET: obtener todas las alertas (ADMIN / TECNICO / OPERADOR)
router.get("/", (req, res) => {
  db.all("SELECT * FROM alertas ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 📍 POST: crear alerta (solo ADMIN / TECNICO)
router.post("/", requireRole("ADMIN", "TECNICO"), (req, res) => {
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

// 📍 PUT: editar alerta (solo ADMIN / TECNICO)
router.put("/:id", requireRole("ADMIN", "TECNICO"), (req, res) => {
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

// 📍 DELETE: eliminar alerta (solo ADMIN)
router.delete("/:id", requireRole("ADMIN"), (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM alertas WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Alerta eliminada", id });
  });
});

module.exports = router;
