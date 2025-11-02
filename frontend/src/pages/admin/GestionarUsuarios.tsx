// frontend/src/pages/admin/GestionarUsuarios.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

// Interfaz para el Usuario
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'cliente'; // O los roles que manejes
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

        // Endpoint de tu backend para obtener usuarios (DEBES CREARLO)
        const response = await fetch('/api/admin/usuarios', {
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

  const handleEditarRol = (id: number) => {
    console.log(`Editar rol del usuario con ID: ${id}`);
    // Lógica para cambiar el rol (ej. un modal o un <select>)
  };

  const handleEliminarUsuario = (id: number) => {
    console.log(`Eliminar usuario con ID: ${id}`);
    // Lógica para llamar al endpoint de DELETE
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
                      onClick={() => handleEditarRol(usuario.id)} 
                      className="admin-btn secondary"
                    >
                      Editar Rol
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