// frontend/src/pages/admin/VerPedidos.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

// Interfaz para el Pedido
interface Pedido {
  id: number;
  cliente_nombre: string; // O cliente_id
  fecha: string;
  total: number;
  estado: 'pendiente' | 'enviado' | 'completado' | 'cancelado';
}

// Si tu API devuelve { pedidos: [...] }
interface ApiResponse {
  pedidos: Pedido[];
}

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

        // Endpoint de tu backend para obtener pedidos (DEBES CREARLO)
        const response = await fetch('/api/admin/pedidos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron cargar los pedidos`);
        }

        const data: ApiResponse = await response.json();
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
    // Lógica para navegar a una página de detalle
    // navigate(`/admin/pedidos/${id}`);
  };

  const handleActualizarEstado = (id: number) => {
    console.log(`Actualizar estado del pedido con ID: ${id}`);
    // Lógica para mostrar un <select> o modal y actualizar el estado
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
                  <td>{pedido.cliente_nombre}</td>
                  <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                  <td>${pedido.total.toLocaleString()}</td>
                  <td>
                    <span className={`estado-${pedido.estado}`}>{pedido.estado}</span>
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