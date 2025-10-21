// frontend/src/pages/Login.tsx
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

type User = {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "user" | string;
};

type ApiResponse = {
  ok: boolean;
  status?: "success" | "error";
  message?: string;
  token?: string;
  user?: User;
  usuario?: User; // ✅ Acepta también 'usuario' del backend
};

// ✅ CORREGIDO: Sin /api duplicado
const API_BASE = import.meta.env.VITE_API_URL || "";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Por favor completa todos los campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor ingrese un email válido.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: email.trim(),
        password: password,
      };

      console.log('🔄 Intentando login en:', `${API_BASE}/api/auth/login`);
      console.log('📦 Payload:', { email: payload.email, password: '***' });

      const { data } = await axios.post<ApiResponse>(
        `${API_BASE}/api/auth/login`,
        payload,
        { 
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Respuesta del servidor:', data);

      if (data?.status === "success" || data?.ok) {
        
        if (data?.token) {
          localStorage.setItem("token", data.token);
          console.log('🔑 Token guardado');
        }

        // ✅ Acepta tanto 'user' como 'usuario'
        const userData = data?.user || data?.usuario;

        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
          console.log('👤 Usuario guardado:', userData.nombre, '| Rol:', userData.rol);
          
          // Redirección según rol
          const userRole = userData.rol.trim().toLowerCase();
          
          if (userRole === "admin") {
            console.log('🔄 Redirigiendo a /admin...');
            // Usar replace: true para que no se pueda volver atrás con el botón
            setTimeout(() => {
              navigate("/admin", { replace: true });
            }, 100);
          } else {
            console.log('🔄 Redirigiendo a /tienda...');
            setTimeout(() => {
              navigate("/tienda", { replace: true });
            }, 100);
          }
          return;
        } else {
          setErrorMessage("No se recibió información del usuario.");
        }
      } else {
        setErrorMessage(data?.message || "Credenciales incorrectas.");
      }
      
    } catch (err: any) {
      console.error("❌ LOGIN ERROR:", err.response || err);

      let msg = "No se pudo conectar con el servidor.";

      if (err?.response) {
        const serverMsg = err.response.data?.message || 
                        err.response.data?.error;

        if (err.response.status === 401) {
          msg = serverMsg || "Credenciales incorrectas. Verifica tu email y contraseña.";
        } else if (err.response.status === 404) {
          msg = serverMsg || "Endpoint no encontrado. Verifica la configuración del servidor.";
        } else if (err.response.status === 500) {
          msg = serverMsg || "Error en el servidor. Intenta más tarde.";
        } else {
          msg = serverMsg || `Error del servidor (${err.response.status})`;
        }
      } else if (err?.request) {
        msg = "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.";
      }

      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>

      <form id="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Correo Electrónico:</label>
        <input
          type="email"
          id="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Iniciar Sesión"}
        </button>
      </form>

      {errorMessage && (
        <p id="error-message" className="error-message">
          {errorMessage}
        </p>
      )}

      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
}