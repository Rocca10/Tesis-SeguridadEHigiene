const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const { authRequired, requireRole } = require("../middlewares/auth");

// 🔒 Todo lo de matafuegos requiere estar logueado
router.use(authRequired);

// 📍 GET: obtener todos los matafuegos (ADMIN / TECNICO / OPERADOR)
router.get("/", (req, res) => {
  db.all("SELECT * FROM matafuegos ORDER BY piso ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 📍 POST: crear nuevo matafuego (solo ADMIN / TECNICO)
router.post("/", requireRole("ADMIN", "TECNICO"), (req, res) => {
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

// 📍 PUT: editar matafuego (solo ADMIN / TECNICO)
router.put("/:id", requireRole("ADMIN", "TECNICO"), (req, res) => {
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

// 📍 DELETE: eliminar matafuego (solo ADMIN)
router.delete("/:id", requireRole("ADMIN"), (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM matafuegos WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Matafuego eliminado", id });
  });
});

module.exports = router;
