const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const { authRequired, requirePermission } = require("../middlewares/auth");

router.use(authRequired);

// GET - ver
router.get("/", requirePermission("ver"), (req, res) => {
  db.all(
    "SELECT * FROM vencimientos ORDER BY diasRestantes ASC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// POST - crear
router.post("/", requirePermission("crear"), (req, res) => {
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

// PUT - editar
router.put("/:id", requirePermission("editar"), (req, res) => {
  const { id } = req.params;
  const { nombre, fecha, diasRestantes } = req.body;

  db.run(
    "UPDATE vencimientos SET nombre = ?, fecha = ?, diasRestantes = ? WHERE id = ?",
    [nombre, fecha, diasRestantes, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, nombre, fecha, diasRestantes });
    }
  );
});

// DELETE - eliminar
router.delete("/:id", requirePermission("eliminar"), (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM vencimientos WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Vencimiento eliminado", id });
  });
});

module.exports = router;