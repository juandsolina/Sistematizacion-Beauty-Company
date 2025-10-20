import React, { useState, useEffect } from 'react';

// Tipos de datos que esperamos
interface AdminStats {
  productos: number;
  usuarios: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Función helper para hacer llamadas autenticadas de admin
  const fetchAdminData = async (url: string) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      // Si el token es inválido o no es admin, el backend dará un 401 o 403
      throw new Error(`Acceso denegado o error de servidor (${response.status})`);
    }
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    
    return data.data;
  };

  // Cargar todos los datos del dashboard al iniciar
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        // Hacemos varias llamadas en paralelo
        const [statsData] = await Promise.all([
          fetchAdminData('http://localhost:3000/api/admin/stats'),
          // Podrías añadir fetchAdminData('/api/admin/users') aquí
        ]);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <div className="container mx-auto p-4">Cargando dashboard...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>
      
      {/* --- 1. Sección de Estadísticas --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total de Productos</h2>
          <p className="text-3xl font-bold">{stats?.productos ?? '...'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total de Usuarios</h2>
          <p className="text-3xl font-bold">{stats?.usuarios ?? '...'}</p>
        </div>
      </div>

      {/* --- 2. Aquí es donde vive tu CRUD --- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Gestión de Productos</h2>
        
        {/* (C)REATE: Este botón abriría un modal o formulario */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600">
          + Crear Nuevo Producto
        </button>

        {/* (R)EAD / (U)PDATE / (D)ELETE: 
            Aquí iría una tabla que lista todos los productos.
            Cada fila tendría botones de "Editar" y "Borrar"
            que llamarían a tus rutas PUT y DELETE del API.
        */}
        <div className="border rounded p-4 text-gray-600">
          <p>Aquí irá la tabla de productos...</p>
          <p>(Esta tabla llamará a `GET /api/productos` para llenarse)</p>
          <p>(El botón 'Editar' llamará a `PUT /api/productos/:id`)</p>
          <p>(El botón 'Borrar' llamará a `DELETE /api/productos/:id`)</p>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;