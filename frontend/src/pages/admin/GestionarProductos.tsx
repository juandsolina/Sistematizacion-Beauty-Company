import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css'; 

interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagen: string | null;
}

interface ApiResponse {
  message: string;
  success: boolean;
  page: number;
  limit: number;
  data: Producto[];
}

export default function GestionarProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No autorizado. Token no encontrado.');
        }

        const response = await fetch('/api/productos', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron cargar los productos`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data && data.success) {
          setProductos(data.data);
        } else {
          throw new Error(data.message || 'Error al parsear productos');
        }
        
      } catch (err: any) {
        console.error('Error al cargar productos:', err.message);
        setError(err.message);
        if (err.message.includes('No autorizado')) {
          navigate('/login'); 
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [navigate]); 
  
  const handleEditar = (id: number) => {
    navigate(`/admin/productos/editar/${id}`);
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return; 
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      const response = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'No se pudo eliminar el producto');
      }

      setProductos(prevProductos => 
        prevProductos.filter(producto => producto.id !== id)
      );

    } catch (err: any) {
      console.error('Error al eliminar producto:', err.message);
      setError(err.message); 
    }
  };

  const handleNuevoProducto = () => {
    navigate('/admin/productos/nuevo');
  };

  if (loading) {
    return <div className="admin-page-container">Cargando productos...</div>;
  }

  if (error) {
    return <div className="admin-page-container error">Error: {error}</div>;
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Gestión de Productos</h1>
        <button onClick={handleNuevoProducto} className="admin-btn primary">
          + Añadir Nuevo Producto
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Imagen (URL)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>${producto.precio.toLocaleString()}</td>
                  <td>{producto.stock}</td>
                  <td>{producto.imagen || 'N/A'}</td>
                  <td>
                    <button 
                      onClick={() => handleEditar(producto.id)} 
                      className="admin-btn secondary"
                    >
                      Editar
                    </button>
                    {' '}
                    <button 
                      onClick={() => handleEliminar(producto.id)} 
                      className="admin-btn danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}