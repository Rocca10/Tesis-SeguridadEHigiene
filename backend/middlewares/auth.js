const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_cambialo";

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "No autenticado" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, usuario, rol }
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o vencido" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "No autenticado" });
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ message: "Sin permisos" });
    }
    next();
  };
}

module.exports = { authRequired, requireRole };
