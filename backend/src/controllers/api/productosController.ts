// src/controllers/api/productosController.ts
import { Request, Response, NextFunction } from "express";
import { query } from "../../config/database";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagen: string | null;
  creado_en: string;
}

const toInt = (v: any, fb: number) => {
  const n = Number(v);
  return Number.isInteger(n) ? n : fb;
};
const toNum = (v: any, fb: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
};

export class ProductosController {
  // GET /api/productos?page=1&limit=20
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page  = Math.max(toInt(req.query.page, 1), 1);
      const limit = Math.min(Math.max(toInt(req.query.limit, 20), 1), 100);
      const offset = (page - 1) * limit;

      // ⚠️ Evitar placeholders en LIMIT/OFFSET: algunas configs de MySQL fallan con `?` aquí.
      const sql = `
        SELECT id, nombre, descripcion, precio, stock, imagen, creado_en
        FROM productos
        ORDER BY id DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      const data = await query<Producto[]>(sql);

      res.json({ success: true, page, limit, data });
    } catch (error) { next(error); }
  }

  // GET /api/productos/:id
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toInt(req.params.id, NaN);
      if (Number.isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

      const rows = await query<Producto[]>(
        `SELECT id, nombre, descripcion, precio, stock, imagen, creado_en
         FROM productos WHERE id = ?`,
        [id]
      );
      if (!rows.length) return res.status(404).json({ success: false, message: "Producto no encontrado" });

      res.json({ success: true, data: rows[0] });
    } catch (error) { next(error); }
  }

  // POST /api/productos
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre, descripcion, precio, stock, imagen } = req.body;

      if (!nombre || precio === undefined) {
        return res.status(400).json({ success: false, message: "Nombre y precio son requeridos" });
      }
      const precioNum = toNum(precio, NaN);
      const stockNum = stock === undefined ? 0 : toInt(stock, NaN);
      if (!Number.isFinite(precioNum)) return res.status(400).json({ success: false, message: "Precio inválido" });
      if (!Number.isInteger(stockNum) || stockNum < 0) return res.status(400).json({ success: false, message: "Stock inválido" });

      const result = await query<{ insertId: number }>(
        `INSERT INTO productos (nombre, descripcion, precio, stock, imagen)
         VALUES (?, ?, ?, ?, ?)`,
        [nombre, descripcion ?? null, precioNum, stockNum, imagen ?? null]
      );

      res.status(201).json({
        success: true,
        message: "Producto creado exitosamente",
        data: { id: result.insertId, nombre, descripcion: descripcion ?? null, precio: precioNum, stock: stockNum, imagen: imagen ?? null }
      });
    } catch (error) { next(error); }
  }

  // PUT /api/productos/:id  (actualización parcial o total)
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toInt(req.params.id, NaN);
      if (Number.isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

      const { nombre, descripcion, precio, stock, imagen } = req.body;

      const exists = await query<Producto[]>(`SELECT * FROM productos WHERE id = ?`, [id]);
      if (!exists.length) return res.status(404).json({ success: false, message: "Producto no encontrado" });

      const precioNum = precio === undefined ? exists[0].precio : toNum(precio, NaN);
      const stockNum  = stock  === undefined ? exists[0].stock  : toInt(stock, NaN);
      if (precio !== undefined && !Number.isFinite(precioNum)) return res.status(400).json({ success: false, message: "Precio inválido" });
      if (stock  !== undefined && (!Number.isInteger(stockNum) || stockNum < 0)) return res.status(400).json({ success: false, message: "Stock inválido" });

      await query(
        `UPDATE productos
         SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?
         WHERE id = ?`,
        [
          nombre ?? exists[0].nombre,
          descripcion ?? exists[0].descripcion,
          precioNum,
          stockNum,
          imagen ?? exists[0].imagen,
          id
        ]
      );

      res.json({ success: true, message: "Producto actualizado exitosamente" });
    } catch (error) { next(error); }
  }

  // DELETE /api/productos/:id
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toInt(req.params.id, NaN);
      if (Number.isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

      const result = await query<{ affectedRows: number }>(
        `DELETE FROM productos WHERE id = ?`, [id]
      );
      if (!result.affectedRows) return res.status(404).json({ success: false, message: "Producto no encontrado" });

      res.json({ success: true, message: "Producto eliminado exitosamente" });
    } catch (error) { next(error); }
  }

  // GET /api/productos/search?q=texto
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const q = String(req.query.q || "").trim();
      if (!q) return res.status(400).json({ success: false, message: "Parámetro de búsqueda requerido" });

      const productos = await query<Producto[]>(
        `SELECT id, nombre, descripcion, precio, stock, imagen, creado_en
         FROM productos
         WHERE nombre LIKE ? OR descripcion LIKE ?
         ORDER BY id DESC`,
        [`%${q}%`, `%${q}%`]
      );

      res.json({ success: true, data: productos });
    } catch (error) { next(error); }
  }
}
// src/controllers/api/productosController.ts