// Configuración base del backend
const envApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const API_BASE = `${envApiUrl}/api`;
export const ASSET_BASE = envApiUrl;

/**
 * POST JSON
 */
export async function postJSON<T>(path: string, payload: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
    },
    credentials: "include", // 👈 Para cookies/sesiones
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
 */
export async function getJSON<T>(
  path: string, 
  options?: { signal?: AbortSignal }
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    credentials: "include", // 👈 Agregado
    signal: options?.signal,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error ${res.status}: ${msg || res.statusText}`);
  }

  return res.json();
}

/**
 * PUT JSON
 */
export async function putJSON<T>(path: string, payload: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
    },
    credentials: "include", // 👈 Agregado
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
 */
export async function deleteJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { 
    method: "DELETE",
    credentials: "include", // 👈 Agregado
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error ${res.status}: ${msg || res.statusText}`);
  }

  return res.json();
}