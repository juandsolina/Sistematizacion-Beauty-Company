// src/config/database.ts
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const num = (v: string | undefined, fb: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
};

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "tienda",
  port: num(process.env.DB_PORT, 3306),
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",          // ✅ asegura UTF-8 real (tildes/ñ/emojis)
  supportBigNumbers: true,
  decimalNumbers: true,
});

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  try {
    const useParams = Array.isArray(params) && params.length > 0;
    const [rows] = useParams ? await pool.execute(sql, params!) : await pool.query(sql);
    return rows as T;
  } catch (err: any) {
    console.error("SQL ERROR →", { sql, params, message: err?.message });
    throw err;
  }
}

export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T[]>(sql, params);
  return rows.length ? rows[0] : null;
}

// Test e inicialización de sesión
pool
  .getConnection()
  .then(async (c) => {
    await c.query("SET NAMES utf8mb4");
    console.log("✅ Conexión a base de datos exitosa");
    c.release();
  })
  .catch((err) => console.error("❌ Error conectando a la base de datos:", err));
