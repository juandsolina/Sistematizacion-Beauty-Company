// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config(); // carga por defecto si hay .env en CWD

// Fallbacks de ruta para cuando se compila a dist/
const CANDIDATE_ENVS = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../.env"),
];
for (const p of CANDIDATE_ENVS) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

export interface Config {
  port: number;
  nodeEnv: string;
  jwt: { secret: string; expiresIn: string };
  email: { host: string; port: number; user: string; password: string };
  db: { host: string; user: string; password: string; name: string; port: number };
}

const isProd = (process.env.NODE_ENV || "development") === "production";
const num = (v: string | undefined, fb: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
};
const requireIfProd = (name: string): string | undefined => {
  const v = process.env[name];
  if (isProd && (!v || v.trim() === "")) {
    throw new Error(`${name} debe estar configurada en producción`);
  }
  return v;
};

export const config: Config = {
  port: num(process.env.PORT, 3000),
  nodeEnv: process.env.NODE_ENV || "development",

  jwt: {
    secret: requireIfProd("JWT_SECRET") || "dev_only_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  email: {
    host: process.env.EMAIL_HOST || "smtp.example.com",
    port: num(process.env.EMAIL_PORT, 587),
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
  },

  // Defaults alineados con tu docker-compose (db/user/pass123/tienda:3306)
  db: {
    host: process.env.DB_HOST || "db",
    user: process.env.DB_USER || "user",
    password: requireIfProd("DB_PASSWORD") || "pass123",
    name: process.env.DB_NAME || "tienda",
    port: num(process.env.DB_PORT, 3306),
  },
};

export default config;
// src/config/config.ts