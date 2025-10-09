import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

type ApiResponse = {
  ok: boolean;
  status?: "success" | "error";
  mensaje?: string;
  token?: string;
  usuario?: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validación ANTES de hacer la petición
    if (!email.trim() || !password) {
      setErrorMessage("Por favor completa todos los campos.");
      return;
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor ingrese un email válido.");
      return;
    }

    try {
      setLoading(true);

      // Payload simplificado - solo envía lo necesario
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
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Respuesta del servidor:', data);

      // Verificar respuesta exitosa
      if (data?.status === "success" || data?.ok) {
        // Guardar token si existe
        if (data?.token) {
          localStorage.setItem("access_token", data.token);
          console.log('🔑 Token guardado');
        }

        // Guardar datos del usuario si existen
        if (data?.usuario) {
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
          localStorage.setItem("user_id", data.usuario.id.toString());
          localStorage.setItem("user_name", data.usuario.nombre);
          localStorage.setItem("user_rol", data.usuario.rol);
          console.log('👤 Usuario guardado:', data.usuario.nombre);
        }

        // Redirigir según el rol o a página principal
        if (data?.usuario?.rol === "admin") {
          navigate("/admin");
        } else {
          navigate("/tienda");
        }
        return;
      }

      // Si llegamos aquí, algo salió mal
      setErrorMessage(data?.mensaje || "Credenciales incorrectas.");
      
    } catch (err: any) {
      console.error("❌ LOGIN ERROR:", {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: err?.message,
      });

      let msg = "No se pudo conectar con el servidor.";

      if (err?.response) {
        // El servidor respondió con un error
        if (err.response.status === 401) {
          msg = err?.response?.data?.mensaje || 
                err?.response?.data?.error || 
                "Credenciales incorrectas. Verifica tu email y contraseña.";
        } else if (err.response.status === 404) {
          msg = "Endpoint no encontrado. Verifica la configuración del servidor.";
        } else if (err.response.status === 500) {
          msg = "Error en el servidor. Intenta más tarde.";
        } else {
          msg = err?.response?.data?.mensaje || 
                err?.response?.data?.error || 
                `Error del servidor (${err.response.status})`;
        }
      } else if (err?.request) {
        // La petición se hizo pero no hubo respuesta
        msg = "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000";
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