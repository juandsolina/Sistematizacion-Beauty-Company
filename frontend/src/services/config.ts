// Configuración base del backend
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export const ASSET_BASE = API_BASE.replace(/\/api\/?$/, "");

/**
 * POST JSON
 * Hace una solicitud POST al backend enviando JSON y devolviendo la respuesta tipada.
 */
export async function postJSON<T>(path: string, payload: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error ${res.status}: ${msg || res.statusText}`);
  }

  return res.json();
}

/**
 * GET JSON
 * Hace una solicitud GET al backend y devuelve la respuesta tipada.
 */
export async function getJSON<T>(path: string, p0: { signal: AbortSignal | undefined; }): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error ${res.status}: ${msg || res.statusText}`);
  }

  return res.json();
}

/**
 * PUT JSON
 * Para actualizaciones completas.
 */
export async function putJSON<T>(path: string, payload: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error ${res.status}: ${msg || res.statusText}`);
  }

  return res.json();
}

/**
 * DELETE JSON
 * Para eliminar registros del backend.
 */
export async function deleteJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: "DELETE" });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error ${res.status}: ${msg || res.statusText}`);
  }

  return res.json();
}
