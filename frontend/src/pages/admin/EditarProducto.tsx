// frontend/src/pages/admin/EditarProducto.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/admin.css';

interface ProductoInput {
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagen: string | null; // <-- CAMBIADO DE 'categoria'
}

// Interfaz para la respuesta de TU API (getById)
interface ApiProductResponse {
  message: string;
  success: boolean;
  data: ProductoInput; // <-- CAMBIADO DE 'producto'
}

export default function EditarProducto() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductoInput>({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen: '', // <-- CAMBIADO DE 'categoria'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducto = async () => {
      if (!id) {
        setError("ID de producto no encontrado.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autorizado');
        
        const response = await fetch(`/api/productos/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data: ApiProductResponse = await response.json(); // Tu API responde con JSON
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'No se pudo encontrar el producto');
        }

        setFormData(data.data); // <-- CAMBIADO DE data.producto

      } catch (err: any) {
        setError(err.message);
        navigate('/admin/productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');
      
      // Tu backend 'update' maneja campos 'undefined', así que no necesitamos
      // enviar el objeto completo, solo lo que cambió.
      // Pero para simplicidad, enviaremos todo el formulario.
      const response = await fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData) // Tu backend es lo bastante inteligente
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al actualizar el producto');
      }

      navigate('/admin/productos');

    } catch (err: any) {
      console.error('Error en handleSubmit:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.nombre) {
    return <div className="admin-page-container">Cargando datos del producto...</div>;
  }
  
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Editar Producto (ID: {id})</h1>
        <button onClick={() => navigate('/admin/productos')} className="admin-btn secondary">
          Cancelar y Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-info-card">
        
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Producto</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion || ''} // Maneja null
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="precio">Precio</label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              step="1"
              required
            />
          </div>
        </div>

        {/* --- CAMBIADO --- */}
        <div className="form-group">
          <label htmlFor="imagen">Imagen (URL)</label>
          <input
            type="text"
            id="imagen"
            name="imagen"
            value={formData.imagen || ''} // Maneja null
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="admin-btn primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Actualizar Producto'}
          </button>
          
          {error && <p className="form-error">{error}</p>}
        </div>

      </form>
    </div>
  );
}