import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        console.log('👤 Usuario admin cargado:', userData);
        
        if (userData.rol !== 'admin') {
          console.warn('⚠️ Usuario no es admin, redirigiendo...');
          navigate('/tienda');
        }
      } catch (error) {
        console.error('❌ Error al parsear usuario:', error);
        navigate('/login');
      }
    } else {
      console.warn('⚠️ No hay usuario en localStorage');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="admin-dashboard">
      {/* Bienvenida */}
      <div className="admin-welcome-section">
        <h1 className="admin-title">🛠️ Panel de Administración</h1>
        <p className="admin-subtitle">
          Bienvenido, <strong>{user?.nombre || 'Admin'}</strong>
        </p>
      </div>

      {/* Estadísticas */}
      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">USUARIOS</h3>
            <p className="stat-value">3</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">📦</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">PRODUCTOS</h3>
            <p className="stat-value">0</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">🛒</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">PEDIDOS</h3>
            <p className="stat-value">0</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">VENTAS</h3>
            <p className="stat-value">$0</p>
          </div>
        </div>
      </section>

      {/* Acciones Rápidas */}
      <section className="admin-section">
        <h2 className="section-title">Acciones Rápidas</h2>
        <div className="admin-actions-grid">
          <button 
            className="admin-action-card"
            onClick={() => navigate('/admin/productos')}
          >
            <span className="action-icon">📦</span>
            <span className="action-label">Gestionar Productos</span>
          </button>

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

      {/* Información del Sistema */}
      <section className="admin-section">
        <h2 className="section-title">Información del Sistema</h2>
        <div className="admin-info-card">
          <div className="info-row">
            <span className="info-label">Versión:</span>
            <span className="info-value">1.0.0</span>
          </div>
          <div className="info-row">
            <span className="info-label">Usuario actual:</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Rol:</span>
            <span className="info-value">{user?.rol}</span>
          </div>
          <div className="info-row">
            <span className="info-label">ID:</span>
            <span className="info-value">{user?.id}</span>
          </div>
        </div>
      </section>
    </div>
  );
}