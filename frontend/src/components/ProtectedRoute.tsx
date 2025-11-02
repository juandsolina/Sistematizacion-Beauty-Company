// frontend/src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode; // ✅ NECESARIO porque usas <ProtectedRoute><Component /></ProtectedRoute>
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // 1. Si no hay token, redirigir a login
  if (!token) {
    console.log('❌ No hay token, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  // 2. Si no hay información del usuario, redirigir a login
  if (!userStr) {
    console.log('❌ No hay usuario en localStorage, redirigiendo a /login');
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 3. Validar el rol del usuario
  try {
    const user = JSON.parse(userStr);
    
    // Verificar que el usuario tenga un rol
    if (!user.rol) {
      console.warn('⚠️ Usuario sin rol detectado');
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }

    const userRol = user.rol.trim().toLowerCase();
    
    // 4. Lógica de ADMIN
    if (adminOnly) {
      if (userRol !== 'admin') {
        console.log(`❌ Acceso denegado a ruta de admin. Usuario es: ${user.rol}`);
        return <Navigate to="/tienda" replace />;
      }
      console.log('✅ Acceso autorizado a ruta de admin');
    } else {
      // 5. Lógica de CLIENTE (o cualquier usuario logueado)
      console.log(`✅ Acceso autorizado para usuario: ${user.nombre} (${user.rol})`);
    }

    // ✅ Acceso concedido - Renderizar el componente hijo
    return <>{children}</>;
    
  } catch (error) {
    // 6. Si el JSON del usuario está corrupto
    console.error('❌ Error al parsear usuario:', error);
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
}