import React, { useState, useEffect } from 'react';

// Tipo para los datos del perfil que esperamos del backend
interface UserProfile {
  id: number;
  nombre: string;
  email: string;
  role: string;
}

const ClienteProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función asíncrona para cargar los datos del perfil
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No estás autenticado');
        }

        // Esta es la llamada a tu API protegida
        const response = await fetch('http://localhost:3000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar el perfil. ' + response.statusText);
        }

        const data = await response.json();
        
        if (data.success) {
          setProfile(data.data);
        } else {
          throw new Error(data.message || 'Error en la respuesta de la API');
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Un error desconocido ocurrió');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // El array vacío [] significa que esto se ejecuta 1 sola vez al cargar

  // --- Renderizado de la página ---
  if (loading) {
    return <div className="container mx-auto p-4">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      {profile ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg mb-2"><strong>Nombre:</strong> {profile.nombre}</p>
          <p className="text-lg mb-2"><strong>Email:</strong> {profile.email}</p>
          <p className="text-lg mb-2"><strong>Rol:</strong> {profile.role}</p>
          {/* Aquí podrías agregar un formulario para actualizar el perfil */}
        </div>
      ) : (
        <p>No se pudieron cargar los datos del perfil.</p>
      )}
    </div>
  );
};

export default ClienteProfile;