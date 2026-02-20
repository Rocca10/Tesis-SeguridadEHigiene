const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_cambialo";

// ✅ Definición de permisos por rol
const PERMISOS = {
  ADMIN: {
    crear: true,
    editar: true,
    eliminar: true,
    ver: true,
    exportar: true,
    importar: true,
  },
  TECNICO: {
    crear: true,
    editar: false,  // ← CAMBIO: Ya no puede editar
    eliminar: false, // ← CAMBIO: Ya no puede eliminar
    ver: true,
    exportar: false,
    importar: false,
  },
  OPERADOR: {
    crear: false,
    editar: false,
    eliminar: false,
    ver: true,      // ← Solo lectura
    exportar: false,
    importar: false,
  }
};

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
      return res.status(403).json({ message: "Sin permisos para este rol" });
    }
    next();
  };
}

// ✅ NUEVO: Middleware para verificar permiso específico
function requirePermission(action) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    
    const userRole = req.user.rol;
    
    if (!PERMISOS[userRole]) {
      return res.status(403).json({ message: "Rol inválido" });
    }
    
    if (!PERMISOS[userRole][action]) {
      return res.status(403).json({ 
        message: `No tenés permisos para ${action}`,
        requiredPermission: action,
        userRole: userRole
      });
    }
    
    next();
  };
}

// ✅ NUEVO: Función helper para verificar permisos desde el frontend
function canUserPerform(rol, action) {
  return PERMISOS[rol] && PERMISOS[rol][action];
}

module.exports = { 
  authRequired, 
  requireRole, 
  requirePermission,
  canUserPerform,
  PERMISOS
};