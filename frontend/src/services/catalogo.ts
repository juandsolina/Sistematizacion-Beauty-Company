// frontend/src/services/catalogo.ts
import { getJSON, postJSON, putJSON, deleteJSON } from "./config";
import type { Id } from "./crud";

export type Producto = {
  id: string | number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  imagen?: string | null;
  categoria?: string | null;
  stock?: number | null;
  destacado?: boolean | null;
};

export type Paginated<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type GetProductosParams = {
  q?: string;
  page?: number;
  pageSize?: number;
  categoria?: string;
  destacado?: boolean;
  signal?: AbortSignal;
};

function qs(params?: Record<string, string | number | boolean | null | undefined>) {
  if (!params) return "";
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return q ? `?${q}` : "";
}

// ✅ CAMBIO: Removido el /api porque ya está en API_BASE
const BASE = "/productos";

/** Listar con filtros/paginación */
export function getProductos(params?: GetProductosParams) {
  const { signal, ...queryParams } = params || {};
  return getJSON<Paginated<Producto>>(`${BASE}${qs(queryParams)}`, { signal });
}

/** Obtener uno por id */
export function getProducto(id: Id, signal?: AbortSignal) {
  return getJSON<Producto>(`${BASE}/${id}`, { signal });
}

/** Crear producto */
export function createProducto(producto: Omit<Producto, "id">) {
  return postJSON<Producto>(BASE, producto);
}

/** Actualizar producto */
export function updateProducto(id: Id, producto: Partial<Producto>) {
  return putJSON<Producto>(`${BASE}/${id}`, producto);
}

/** Eliminar producto */
export function deleteProducto(id: Id) {
  return deleteJSON<Producto>(`${BASE}/${id}`);
}