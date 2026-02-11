const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Conexión a la BD (crea tablas y abre conexión)
require("./database/connection");

// 🗄️ Importar rutas
const alertasRoutes = require("./routes/alertas");
const matafuegosRoutes = require("./routes/matafuegos");
const vencimientosRoutes = require("./routes/vencimientos");
const botiquinesRoutes = require("./routes/botiquines");
const senializacionRoutes = require("./routes/senializacion");
const authRoutes = require("./routes/auth");


// 🧭 Registrar rutas
app.use("/api/alertas", alertasRoutes);
app.use("/api/matafuegos", matafuegosRoutes);
app.use("/api/vencimientos", vencimientosRoutes);
app.use("/api/botiquines", botiquinesRoutes);
app.use("/api/senializacion", senializacionRoutes);
app.use("/auth", authRoutes);

// 🚀 Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
