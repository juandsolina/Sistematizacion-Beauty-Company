// frontend/src/pages/admin/VerPedidos.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

// Interfaz para el Pedido
interface Pedido {
  id: number;
  cliente_nombre: string;
  fecha: string;
  total: number;
  estado: 'pendiente' | 'enviado' | 'completado' | 'cancelado';
}

interface ApiResponse {
  pedidos: Pedido[];
}

// ✅ FUNCIÓN HELPER PARA FORMATEAR FECHAS DE FORMA SEGURA
const formatearFecha = (fecha: string | null | undefined): string => {
  // Si la fecha es null, undefined o vacía
  if (!fecha) {
    return 'Sin fecha';
  }

  try {
    const date = new Date(fecha);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }

    // Formatear la fecha en español
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Error en fecha';
  }
};

const VerPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No autorizado. Token no encontrado.');
        }

        const response = await fetch('/api/admin/pedidos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron cargar los pedidos`);
        }

        const data: ApiResponse = await response.json();
        
        // 🐛 DEBUG: Ver qué datos llegan del backend
        console.log('📦 Pedidos recibidos:', data.pedidos);
        
        setPedidos(data.pedidos);

      } catch (err: any) {
        console.error('Error al cargar pedidos:', err.message);
        setError(err.message);
        if (err.message.includes('No autorizado')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [navigate]);

  const handleVerDetalles = (id: number) => {
    console.log(`Ver detalles del pedido con ID: ${id}`);
    // navigate(`/admin/pedidos/${id}`);
  };

  const handleActualizarEstado = (id: number) => {
    console.log(`Actualizar estado del pedido con ID: ${id}`);
  };

  if (loading) {
    return <div className="admin-page-container">Cargando pedidos...</div>;
  }

  if (error) {
    return <div className="admin-page-container error">Error: {error}</div>;
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Ver Pedidos</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length > 0 ? (
              pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td>{pedido.cliente_nombre || 'Cliente desconocido'}</td>
                  {/* ✅ AQUÍ ESTÁ LA CORRECCIÓN */}
                  <td>{formatearFecha(pedido.fecha)}</td>
                  <td>${pedido.total?.toLocaleString() || '0'}</td>
                  <td>
                    <span className={`estado-${pedido.estado}`}>
                      {pedido.estado || 'pendiente'}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleVerDetalles(pedido.id)} 
                      className="admin-btn secondary"
                    >
                      Ver Detalles
                    </button>
                    <button 
                      onClick={() => handleActualizarEstado(pedido.id)} 
                      className="admin-btn primary"
                    >
                      Actualizar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>
                  No se encontraron pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerPedidos;