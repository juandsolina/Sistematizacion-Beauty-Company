import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// 1. Definimos una función para 'leer' el estado de autenticación
// En una app real, esto estaría en un "Contexto" o "Store" global
const useAuth = () => {
  const userString = localStorage.getItem('user');
  
  if (!userString) {
    return { isLoggedIn: false, role: null };
  }

  try {
    const user = JSON.parse(userString) as { role: string };
    return { isLoggedIn: true, role: user.role };
  } catch (e) {
    // Si hay datos corruptos, los limpiamos
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return { isLoggedIn: false, role: null };
  }
};

// 2. Definimos las 'props' que recibirá nuestro guardián
interface ProtectedRouteProps {
  children: React.ReactNode; // La página que queremos proteger (ej. <AdminDashboard />)
  adminOnly?: boolean;      // ¿Esta ruta es SOLO para admins?
}

// 3. El componente Guardián
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation(); // Para saber dónde estaba el usuario

  // ----- Lógica de decisión -----

  // Caso 1: El usuario NO está logueado
  if (!isLoggedIn) {
    // Lo mandamos al login. Guardamos la 'location' para poder
    // regresarlo a donde quería ir después de iniciar sesión.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Caso 2: El usuario SÍ está logueado, pero la ruta es SOLO para admins
  if (adminOnly && role !== 'admin') {
    // El usuario es un cliente intentando entrar a /admin
    // Lo mandamos a la página de inicio (o a "acceso denegado")
    return <Navigate to="/" replace />;
  }
  
  // Caso 3: ¡Éxito! El usuario está logueado Y tiene los permisos.
  // Mostramos la página que estaba protegida.
  return <>{children}</>;
};

export default ProtectedRoute;