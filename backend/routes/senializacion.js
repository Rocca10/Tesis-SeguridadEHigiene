const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const { authRequired, requireRole } = require("../middlewares/auth");

// 🔒 Todo lo de señalización requiere estar logueado
router.use(authRequired);

// 📍 GET: obtener toda la señalización (ADMIN / TECNICO / OPERADOR)
router.get("/", (req, res) => {
  db.all("SELECT * FROM senializacion ORDER BY piso ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 📍 POST: crear señalización (solo ADMIN / TECNICO)
router.post("/", requireRole("ADMIN", "TECNICO"), (req, res) => {
  const { piso, tipo, fechaRevision } = req.body;

  db.run(
    "INSERT INTO senializacion (piso, tipo, fechaRevision) VALUES (?, ?, ?)",
    [piso, tipo, fechaRevision],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        id: this.lastID,
        piso,
        tipo,
        fechaRevision,
      });
    }
  );
});

// 📍 PUT: editar señalización (solo ADMIN / TECNICO)
router.put("/:id", requireRole("ADMIN", "TECNICO"), (req, res) => {
  const { id } = req.params;
  const { piso, tipo, fechaRevision } = req.body;

  db.run(
    "UPDATE senializacion SET piso = ?, tipo = ?, fechaRevision = ? WHERE id = ?",
    [piso, tipo, fechaRevision, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        id,
        piso,
        tipo,
        fechaRevision,
      });
    }
  );
});

// 📍 DELETE: eliminar señalización (solo ADMIN)
router.delete("/:id", requireRole("ADMIN"), (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM senializacion WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Señalización eliminada", id });
  });
});

module.exports = router;
