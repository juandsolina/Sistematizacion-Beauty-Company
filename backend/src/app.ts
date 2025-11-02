// backend/src/app.ts
import express, { Application } from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import apiRoutes from "./routes/api.routes";
import adminRoutes from "./routes/admin.routes";
import { errorHandler } from "./middleware/errorHandler"; 
import testRoutes from './routes/test.routes';

const app: Application = express();

// --- Paths ---
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const UPLOADS_DIR = path.join(ROOT_DIR, "uploads");

// --- Middlewares ---
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Archivos estáticos ---
app.use("/uploads", express.static(UPLOADS_DIR));
app.use(express.static(PUBLIC_DIR));

// --- Rutas ---
app.get("/", (_req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de testing
app.use("/api/test", testRoutes);

// Rutas de admin (DEBE IR ANTES de las rutas generales de /api)
app.use("/api/admin", adminRoutes); // ✅ CAMBIO: /admin → /api/admin

// Rutas generales de API
app.use("/api", apiRoutes);

// --- Error handler ---
app.use(errorHandler);

export default app;