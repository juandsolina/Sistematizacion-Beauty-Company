// src/pages/Register.tsx
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

type ApiResponse = {
  status?: string;
  mensaje?: string;
  usuario?: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validaciones
    if (!email.trim() || !username.trim() || !password || !confirmPassword) {
      setErrorMessage("Por favor completa todos los campos.");
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor ingrese un email válido.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        nombre: username.trim(),
        email: email.trim(),
        password: password,
      };

      console.log('🔄 Intentando registro en:', `${API_BASE}/api/auth/register`);
      console.log('📦 Payload:', { ...payload, password: '***' });

      const { data } = await axios.post<ApiResponse>(
        `${API_BASE}/api/auth/register`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Respuesta del servidor:', data);

      if (data?.status === "success") {
        // Mostrar mensaje de éxito
        alert("✅ Registro exitoso! Ahora puedes iniciar sesión.");
        
        // Redirigir al login
        navigate("/login");
        return;
      }

      setErrorMessage(data?.mensaje || "No se pudo completar el registro.");
      
    } catch (err: any) {
      console.error("❌ REGISTER ERROR:", {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: err?.message,
      });

      let msg = "No se pudo conectar con el servidor.";

      if (err?.response) {
        if (err.response.status === 400) {
          msg = err?.response?.data?.mensaje || 
                "Error en los datos proporcionados.";
        } else if (err.response.status === 404) {
          msg = "Endpoint no encontrado. Verifica la configuración del servidor.";
        } else if (err.response.status === 500) {
          msg = "Error en el servidor. Intenta más tarde.";
        } else {
          msg = err?.response?.data?.mensaje || 
                `Error del servidor (${err.response.status})`;
        }
      } else if (err?.request) {
        msg = "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000";
      }

      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Registrarse</h2>

      <form id="register-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Correo Electrónico:</label>
        <input
          type="email"
          id="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          placeholder="ejemplo@correo.com"
        />

        <label htmlFor="username">Nombre de Usuario:</label>
        <input
          type="text"
          id="username"
          value={username}
          autoComplete="name"
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
          placeholder="Tu nombre completo"
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={loading}
          placeholder="Mínimo 6 caracteres"
        />

        <label htmlFor="confirm-password">Confirmar Contraseña:</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          autoComplete="new-password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          disabled={loading}
          placeholder="Repite tu contraseña"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>
      </form>

      {errorMessage && (
        <p id="error-message" className="error-message">
          {errorMessage}
        </p>
      )}

      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
}