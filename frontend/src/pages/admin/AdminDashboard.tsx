// src/pages/admin/AdminDashboard.tsx

// Tus imports (sin cambios)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

// Tu interfaz (sin cambios)
interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

// Nueva interfaz para las estadísticas
interface AdminStats {
  usuarios: number;
  productos: number;
  pedidos: number;
  ventas: number; // O string si ya viene formateado
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    usuarios: 0,
    productos: 0,
    pedidos: 0,
    ventas: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true); // Estado de carga
  const navigate = useNavigate();

  // 1. Hook de Efecto para Autenticación (casi sin cambios)
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Validamos el rol antes de guardar el usuario
        if (userData.rol !== 'admin') {
          console.warn('⚠️ Usuario no es admin, redirigiendo...');
          navigate('/tienda');
          return; // Cortamos la ejecución
        }
        setUser(userData);
        console.log('👤 Usuario admin cargado:', userData);
      } catch (error) {
        console.error('❌ Error al parsear usuario:', error);
        navigate('/login');
      }
    } else {
      console.warn('⚠️ No hay usuario en localStorage');
      navigate('/login');
    }
  }, [navigate]);

  // 2. NUEVO Hook de Efecto para Cargar Estadísticas
  // Este hook se ejecuta *después* de que el usuario ha sido verificado.
  useEffect(() => {
    // Solo se ejecuta si 'user' existe y es 'admin'
    if (user && user.rol === 'admin') {
      const fetchStats = async () => {
        setLoadingStats(true);
        try {
          // Asumimos que guardas un token para autenticar las peticiones
          const token = localStorage.getItem('token'); // O como lo llames

          // Este es el endpoint que DEBES crear en tu backend (Node.js)
          const response = await fetch('/api/admin/stats', {
            headers: {
              'Content-Type': 'application/json',
              // Enviamos el token para que el backend sepa quién soy
              'Authorization': `Bearer ${token}` 
            }
          });

          if (!response.ok) {
            throw new Error('No se pudieron cargar las estadísticas');
          }

          const data: AdminStats = await response.json();
          setStats(data); // Actualizamos el estado con los datos reales

        } catch (error) {
          console.error('❌ Error cargando estadísticas:', error);
          // Podrías mostrar un error en la UI
        } finally {
          setLoadingStats(false); // Terminamos la carga
        }
      };

      fetchStats();
    }
  }, [user]); // Este efecto DEPENDE del estado 'user'

  // El JSX actualizado para mostrar los datos del estado
  return (
    <div className="admin-dashboard">
      {/* Bienvenida (sin cambios) */}
      <div className="admin-welcome-section">
        <h1 className="admin-title">🛠️ Panel de Administración</h1>
        <p className="admin-subtitle">
          Bienvenido, <strong>{user?.nombre || 'Admin'}</strong>
        </p>
      </div>

      {/* Estadísticas (AHORA ES DINÁMICO) */}
      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">USUARIOS</h3>
            <p className="stat-value">
              {loadingStats ? '...' : stats.usuarios}
            </p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">📦</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">PRODUCTOS</h3>
            <p className="stat-value">
              {loadingStats ? '...' : stats.productos}
            </p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">🛒</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">PEDIDOS</h3>
            <p className="stat-value">
              {loadingStats ? '...' : stats.pedidos}
            </p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">VENTAS</h3>
            <p className="stat-value">
              {/* Formateamos las ventas como moneda */}
              {loadingStats ? '...' : `$${stats.ventas.toLocaleString()}`}
            </p>
          </div>
        </div>
      </section>

      {/* Acciones Rápidas (sin cambios) */}
      <section className="admin-section">
        <h2 className="section-title">Acciones Rápidas</h2>
        <div className="admin-actions-grid">
          {/* ... tus 4 botones ... */}
           <button 
             className="admin-action-card"
             onClick={() => navigate('/admin/productos')}
           >
             <span className="action-icon">📦</span>
             <span className="action-label">Gestionar Productos</span>
           </button>
           {/* ... los otros 3 botones ... */}
           <button 
             className="admin-action-card"
             onClick={() => navigate('/admin/usuarios')}
           >
             <span className="action-icon">👥</span>
             <span className="action-label">Gestionar Usuarios</span>
           </button>
 
           <button 
             className="admin-action-card"
             onClick={() => navigate('/admin/pedidos')}
           >
             <span className="action-icon">📋</span>
             <span className="action-label">Ver Pedidos</span>
           </button>
 
           <button 
             className="admin-action-card"
             onClick={() => navigate('/admin/reportes')}
           >
             <span className="action-icon">📊</span>
             <span className="action-label">Reportes</span>
           </button>
        </div>
      </section>

      {/* Información del Sistema (sin cambios) */}
      <section className="admin-section">
       {/* ... tu sección de info ... */}
      </section>
    </div>
  );
}