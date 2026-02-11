const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const { authRequired, requireRole } = require("../middlewares/auth");

// 🔒 Todo lo de botiquines requiere estar logueado
router.use(authRequired);

// 📍 GET: obtener todos los botiquines (ADMIN / TECNICO / OPERADOR)
router.get("/", (req, res) => {
  db.all("SELECT * FROM botiquines ORDER BY piso ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 📍 POST: crear nuevo botiquín (solo ADMIN / TECNICO)
router.post("/", requireRole("ADMIN", "TECNICO"), (req, res) => {
  const { piso, responsable, elementos, fechaRevision } = req.body;

  db.run(
    "INSERT INTO botiquines (piso, responsable, elementos, fechaRevision) VALUES (?, ?, ?, ?)",
    [piso, responsable, elementos, fechaRevision],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        id: this.lastID,
        piso,
        responsable,
        elementos,
        fechaRevision,
      });
    }
  );
});

// 📍 PUT: editar botiquín (solo ADMIN / TECNICO)
router.put("/:id", requireRole("ADMIN", "TECNICO"), (req, res) => {
  const { id } = req.params;
  const { piso, responsable, elementos, fechaRevision } = req.body;

  db.run(
    "UPDATE botiquines SET piso = ?, responsable = ?, elementos = ?, fechaRevision = ? WHERE id = ?",
    [piso, responsable, elementos, fechaRevision, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        id,
        piso,
        responsable,
        elementos,
        fechaRevision,
      });
    }
  );
});

// 📍 DELETE: eliminar botiquín (solo ADMIN)
router.delete("/:id", requireRole("ADMIN"), (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM botiquines WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Botiquín eliminado", id });
  });
});

module.exports = router;
