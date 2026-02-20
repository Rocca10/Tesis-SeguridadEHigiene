const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const { authRequired, requirePermission } = require("../middlewares/auth");

router.use(authRequired);

// GET
router.get("/", requirePermission("ver"), (req, res) => {
  db.all("SELECT * FROM alertas ORDER BY fecha DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST
router.post("/", requirePermission("crear"), (req, res) => {
  const { tipo, mensaje, fecha } = req.body;

  db.run(
    "INSERT INTO alertas (tipo, mensaje, fecha) VALUES (?, ?, ?)",
    [tipo, mensaje, fecha],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, tipo, mensaje, fecha });
    }
  );
});

// PUT
router.put("/:id", requirePermission("editar"), (req, res) => {
  const { id } = req.params;
  const { tipo, mensaje, fecha } = req.body;

  db.run(
    "UPDATE alertas SET tipo = ?, mensaje = ?, fecha = ? WHERE id = ?",
    [tipo, mensaje, fecha, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, tipo, mensaje, fecha });
    }
  );
});

// DELETE
router.delete("/:id", requirePermission("eliminar"), (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM alertas WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Alerta eliminada", id });
  });
});

module.exports = router;