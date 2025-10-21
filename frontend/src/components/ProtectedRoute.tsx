import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean; // Si es true, solo admins pueden acceder
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // Si no hay token, redirigir a login
  if (!token) {
    console.log('❌ No hay token, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  // Si no hay información del usuario, redirigir a login
  if (!userStr) {
    console.log('❌ No hay usuario en localStorage, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    console.log('🔍 ProtectedRoute - Usuario:', user);
    console.log('🔍 ProtectedRoute - adminOnly:', adminOnly);
    console.log('🔍 ProtectedRoute - Rol del usuario:', user.rol);
    
    // Verificar que el usuario tenga un rol
    if (!user.rol) {
      console.warn('⚠️ Usuario sin rol detectado');
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }

    const userRol = user.rol.trim().toLowerCase();
    
    // Si se requiere que sea admin
    if (adminOnly) {
      if (userRol !== 'admin') {
        console.log(`❌ Acceso denegado a ruta de admin. Usuario es: ${user.rol}`);
        return <Navigate to="/tienda" replace />;
      }
      console.log('✅ Acceso autorizado a ruta de admin');
    } else {
      // Para rutas que requieren login pero no necesariamente admin
      console.log(`✅ Acceso autorizado para usuario: ${user.nombre} (${user.rol})`);
    }

    return <>{children}</>;
    
  } catch (error) {
    console.error('❌ Error al parsear usuario:', error);
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
}