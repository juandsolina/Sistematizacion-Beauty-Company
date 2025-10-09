// frontend/src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// ====== CONFIG ======
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const STORAGE = { access: "sb_access_token", refresh: "sb_refresh_token" };

// ====== TIPOS ======
export interface User {
  id: number | string;
  nombre: string;
  email: string;
  rol: "admin" | "cliente";
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ====== HELPERS FETCH SIN AXIOS ======
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json", ...(init?.headers || {}) },
    credentials: "include",
    ...init,
  });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as any) : undefined;
  if (!res.ok) {
    const msg = data?.mensaje || data?.message || res.statusText || "Error de red";
    throw new Error(msg);
  }
  return data as T;
}
function withAuth(init?: RequestInit): RequestInit {
  const token = localStorage.getItem(STORAGE.access);
  return {
    ...(init || {}),
    headers: {
      ...(init?.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": init?.body instanceof FormData ? undefined : "application/json",
    } as any,
  };
}
const setTokens = (access?: string, refresh?: string) => {
  if (access) localStorage.setItem(STORAGE.access, access);
  if (refresh) localStorage.setItem(STORAGE.refresh, refresh);
};
const clearTokens = () => {
  localStorage.removeItem(STORAGE.access);
  localStorage.removeItem(STORAGE.refresh);
};

// ====== CONTEXTO ======
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Intento de refresh opcional
  const refresh = async () => {
    const refreshToken = localStorage.getItem(STORAGE.refresh);
    if (!refreshToken) return false;
    try {
      const data = await http<{ accessToken: string; refreshToken?: string }>(
        "/auth/refresh",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      );
      setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      clearTokens();
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    const data = await http<{
      user?: User;
      usuario?: User; // compat
      accessToken: string;
      refreshToken?: string;
      mensaje?: string;
    }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const theUser = (data.user || data.usuario) as User | undefined;
    if (!theUser) throw new Error(data.mensaje || "Respuesta inválida del servidor");

    setTokens(data.accessToken, data.refreshToken);
    setUser(theUser);
  };

  const register = async (nombre: string, email: string, password: string) => {
    const data = await http<{
      user?: User;
      accessToken?: string;
      refreshToken?: string;
      mensaje?: string;
    }>("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, rol: "cliente" }),
    });

    if (data.accessToken && data.user) {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    } else {
      await login(email, password);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE.refresh);
      if (refreshToken) {
        await http<void>("/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // ignorar errores de logout
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  // Hidratar sesión al montar
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem(STORAGE.access);
        if (!token) return;

        try {
          const me = await http<User>("/auth/me", withAuth());
          setUser(me);
          return;
        } catch {
          const ok = await refresh();
          if (!ok) return;
          const me = await http<User>("/auth/me", withAuth());
          setUser(me);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.rol === "admin",
      loading,
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
