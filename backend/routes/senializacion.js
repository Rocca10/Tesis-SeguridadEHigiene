const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const { authRequired, requirePermission } = require("../middlewares/auth");

router.use(authRequired);

// GET - ver
router.get("/", requirePermission("ver"), (req, res) => {
  db.all("SELECT * FROM senializacion ORDER BY piso ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST - crear
router.post("/", requirePermission("crear"), (req, res) => {
  const { piso, tipo, ubicacion, estado, fechaVencimiento } = req.body;

  db.run(
    "INSERT INTO senializacion (piso, tipo, ubicacion, estado, fechaVencimiento) VALUES (?, ?, ?, ?, ?)",
    [piso, tipo, ubicacion, estado, fechaVencimiento],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, piso, tipo, ubicacion, estado, fechaVencimiento });
    }
  );
});

// PUT - editar
router.put("/:id", requirePermission("editar"), (req, res) => {
  const { id } = req.params;
  const { piso, tipo, ubicacion, estado, fechaVencimiento } = req.body;

  db.run(
    "UPDATE senializacion SET piso = ?, tipo = ?, ubicacion = ?, estado = ?, fechaVencimiento = ? WHERE id = ?",
    [piso, tipo, ubicacion, estado, fechaVencimiento, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, piso, tipo, ubicacion, estado, fechaVencimiento });
    }
  );
});

// DELETE - eliminar
router.delete("/:id", requirePermission("eliminar"), (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM senializacion WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Señalización eliminada", id });
  });
});

module.exports = router;