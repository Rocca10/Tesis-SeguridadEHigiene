const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/connection");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_cambialo";
const JWT_EXPIRES = "2h";

// 📍 LOGIN
router.post("/login", (req, res) => {
  const { usuario, password } = req.body || {};
  if (!usuario || !password) {
    return res.status(400).json({ message: "Falta usuario o password" });
  }

  db.get(
    "SELECT id, usuario, password_hash, rol, activo FROM usuarios WHERE usuario = ?",
    [usuario],
    async (err, row) => {
      if (err) return res.status(500).json({ message: "Error DB", err });
      if (!row) return res.status(401).json({ message: "Credenciales inválidas" });
      if (!row.activo) return res.status(403).json({ message: "Usuario inactivo" });

      const ok = await bcrypt.compare(password, row.password_hash);
      if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

      const token = jwt.sign(
        { id: row.id, usuario: row.usuario, rol: row.rol },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
      );

      res.json({
        token,
        user: { id: row.id, usuario: row.usuario, rol: row.rol },
      });
    }
  );
});

// 📍 REGISTRO (nuevo)
router.post("/register", async (req, res) => {
  const { usuario, password } = req.body || {};

  // Validaciones
  if (!usuario || !password ) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
  }

  // Verificar si el usuario ya existe
  db.get(
    "SELECT id FROM usuarios WHERE usuario = ?",
    [usuario],
    async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ message: "Error al verificar usuario" });
      }

      if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario (por defecto OPERADOR)
      db.run(
        `INSERT INTO usuarios (usuario, password_hash,  rol, activo) 
         VALUES (?, ?, ?, 1)`,
        [usuario, hashedPassword, "OPERADOR"],
        function (err) {
          if (err) {
            return res.status(500).json({ message: "Error al crear usuario" });
          }

          res.json({
            message: "Usuario creado correctamente",
            id: this.lastID,
            usuario: usuario,
            rol: "OPERADOR"
          });
        }
      );
    }
  );
});

module.exports = router;