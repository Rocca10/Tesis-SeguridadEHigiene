const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const { authRequired, requireRole } = require("../middlewares/auth");

// 🔒 Todo lo de vencimientos requiere estar logueado
router.use(authRequired);

// 📍 GET: obtener todos los vencimientos (ADMIN / TECNICO / OPERADOR)
router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM vencimientos ORDER BY diasRestantes ASC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

// 📍 POST: crear nuevo vencimiento (solo ADMIN / TECNICO)
router.post("/", requireRole("ADMIN", "TECNICO"), (req, res) => {
  const { nombre, fecha, diasRestantes } = req.body;

  db.run(
    "INSERT INTO vencimientos (nombre, fecha, diasRestantes) VALUES (?, ?, ?)",
    [nombre, fecha, diasRestantes],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, nombre, fecha, diasRestantes });
    },
  );
});

// 📍 PUT: editar vencimiento (solo ADMIN / TECNICO)

router.put("/:id", requireRole("ADMIN", "TECNICO"), (req, res) => {
  const { id } = req.params;
  const { nombre, fecha, diasRestantes } = req.body;

  db.run(
    "UPDATE vencimientos SET nombre = ?, fecha = ?, diasRestantes = ? WHERE id = ?",
    [nombre, fecha, diasRestantes, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, nombre, fecha, diasRestantes });
    },
  );
});

// 📍 DELETE: eliminar vencimiento (solo ADMIN)

router.delete("/:id", requireRole("ADMIN"), (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM vencimientos WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Vencimiento eliminado", id });
  });
});

module.exports = router;
