// frontend/src/pages/admin/GestionarUsuarios.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

// Constante para la URL de la API
const API_URL = 'http://localhost:3000';

// Interfaz para el Usuario
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'cliente';
  fecha_registro: string;
}

// Si tu API devuelve { usuarios: [...] }
interface ApiResponse {
  usuarios: Usuario[];
}

const GestionarUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No autorizado. Token no encontrado.');
        }

        // ✅ CAMBIO AQUÍ: Agregamos la URL completa con el puerto correcto
        const response = await fetch(`${API_URL}/api/admin/usuarios`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron cargar los usuarios`);
        }

        const data: ApiResponse = await response.json();
        setUsuarios(data.usuarios);

      } catch (err: any) {
        console.error('Error al cargar usuarios:', err.message);
        setError(err.message);
        if (err.message.includes('No autorizado')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [navigate]);

  const handleEditarRol = async (id: number, nuevoRol: 'admin' | 'cliente') => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/admin/usuarios/${id}/rol`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rol: nuevoRol })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el rol');
      }

      // Actualizar la lista de usuarios
      setUsuarios(usuarios.map(u => 
        u.id === id ? { ...u, rol: nuevoRol } : u
      ));

      console.log(`Rol actualizado para usuario ${id}`);
    } catch (error) {
      console.error('Error al editar rol:', error);
      alert('Error al actualizar el rol del usuario');
    }
  };

  const handleEliminarUsuario = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/admin/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      // Eliminar el usuario de la lista
      setUsuarios(usuarios.filter(u => u.id !== id));
      console.log(`Usuario ${id} eliminado`);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar el usuario');
    }
  };

  if (loading) {
    return <div className="admin-page-container">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="admin-page-container error">Error: {error}</div>;
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Gestión de Usuarios</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Miembro desde</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <span className={`rol-${usuario.rol}`}>{usuario.rol}</span>
                  </td>
                  <td>{new Date(usuario.fecha_registro).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => {
                        const nuevoRol = usuario.rol === 'admin' ? 'cliente' : 'admin';
                        handleEditarRol(usuario.id, nuevoRol);
                      }} 
                      className="admin-btn secondary"
                    >
                      Cambiar a {usuario.rol === 'admin' ? 'Cliente' : 'Admin'}
                    </button>
                    <button 
                      onClick={() => handleEliminarUsuario(usuario.id)} 
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
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionarUsuarios;