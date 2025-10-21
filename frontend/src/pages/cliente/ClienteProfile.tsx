import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export default function ClienteProfile() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        console.log('👤 Usuario cargado:', userData);
      } catch (error) {
        console.error('❌ Error al parsear usuario:', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    console.log('👋 Sesión cerrada');
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Información de tu cuenta</p>
        </div>

        {/* User Info */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {user?.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{user?.nombre}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {user?.rol === 'admin' ? '👑 Administrador' : '👤 Cliente'}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">ID de Usuario</p>
              <p className="text-lg font-semibold text-gray-800">{user?.id}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Tipo de Cuenta</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">{user?.rol}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Correo Electrónico</p>
              <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <p className="text-lg font-semibold text-green-600">✓ Activo</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-6">
            <button 
              onClick={() => navigate('/tienda')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ir a la Tienda
            </button>
            
            {user?.rol === 'admin' && (
              <button 
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Panel de Admin
              </button>
            )}
            
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📦 Mis Pedidos</h3>
          <p className="text-gray-600">No tienes pedidos todavía</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">❤️ Lista de Deseos</h3>
          <p className="text-gray-600">Tu lista de deseos está vacía</p>
        </div>
      </div>
    </div>
  );
}