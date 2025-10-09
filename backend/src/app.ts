// src/app.ts
import express, { Application } from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import apiRoutes from "./routes/api.routes";
import adminRoutes from "./routes/admin.routes";
import { errorHandler } from "./middleware/errorHandler"; 

const app: Application = express();
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// --- Paths (válidos en dev y en dist) ---
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const UPLOADS_DIR = path.join(ROOT_DIR, "uploads");

// --- Middlewares (antes de las rutas) ---
app.use(
  cors({
    origin: true, // o ['http://localhost:5173']
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Archivos estáticos ---
app.use("/uploads", express.static(UPLOADS_DIR)); // servir imágenes
app.use(express.static(PUBLIC_DIR));

// --- Rutas ---
app.get("/", (_req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/admin", adminRoutes);

// --- 404 API ---
app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "Recurso no encontrado" });
});

// --- Error handler ---
app.use(errorHandler);

export default app;
