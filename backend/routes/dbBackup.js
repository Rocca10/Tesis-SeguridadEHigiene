const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// ✅ Ruta real a tu DB del backend
const DB_PATH = path.resolve(__dirname, "..", "seguridad.db");

// Subimos a una carpeta temporal
const upload = multer({ dest: path.resolve(__dirname, "..", "uploads") });

// ✅ EXPORTAR: descarga el archivo seguridad.db
router.get("/export", (req, res) => {
  if (!fs.existsSync(DB_PATH)) {
    return res.status(404).json({ message: "DB no encontrada", path: DB_PATH });
  }
  res.download(DB_PATH, "seguridad.db");
});

// ✅ IMPORTAR: sube un .db y reemplaza el actual
router.post("/import", upload.single("db"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No se recibió archivo" });

    const tempPath = req.file.path;

    // Reemplazo simple
    fs.copyFileSync(tempPath, DB_PATH);
    fs.unlinkSync(tempPath);

    // ⚠️ Lo más simple: pedir reinicio del backend (nodemon lo hace fácil)
    return res.json({
      ok: true,
      message: "DB importada. Reiniciá el backend para que tome la nueva base.",
      dbPath: DB_PATH,
    });
  } catch (e) {
    console.error("Error import:", e);
    return res.status(500).json({ message: "Error importando DB" });
  }
});

module.exports = router;