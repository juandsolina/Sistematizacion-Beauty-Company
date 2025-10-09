// frontend/src/services/crud.ts
import { getJSON, postJSON, putJSON, deleteJSON } from "./config";

export type Id = string | number;

export function qs(params?: Record<string, string | number | boolean | undefined>) {
  if (!params) return "";
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return q ? `?${q}` : "";
}

export function createCRUD<T extends { id?: Id }>(basePath: string) {
  const base = basePath.startsWith("/") ? basePath : `/${basePath}`;

  return {
    list: (
      params?: Record<string, string | number | boolean | undefined>,
      options?: { signal?: AbortSignal }
    ) =>
      getJSON<T[]>(`${base}${qs(params)}`, { signal: options?.signal }),

    get: (id: Id, options?: { signal?: AbortSignal }) =>
      getJSON<T>(`${base}/${id}`, { signal: options?.signal }),

    create: (payload: Partial<T>) => postJSON<T>(base, payload),

    update: (id: Id, payload: Partial<T>) => putJSON<T>(`${base}/${id}`, payload),

    remove: (id: Id) => deleteJSON<void>(`${base}/${id}`),
  };
}
