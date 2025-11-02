// frontend/src/services/adminApi.ts

const API_BASE = '/api'; // Vite proxy redirige a localhost:3000

// Helper para obtener el token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Helper para manejar respuestas
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      message: `Error ${response.status}: ${response.statusText}` 
    }));
    throw new Error((error as { message?: string }).message || 'Error en la solicitud');
  }
  return response.json();
};

// ============= ESTADÍSTICAS =============
export interface Stats {
  usuarios: number;
  productos: number;
  pedidos: number;
  ventas: number;
}

export const fetchStats = async (): Promise<Stats> => {
  console.log('📊 Obteniendo estadísticas...');
  try {
    const response = await fetch(`${API_BASE}/admin/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response) as Stats;
    console.log('✅ Estadísticas recibidas:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    throw error;
  }
};

// ============= USUARIOS =============
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'cliente';
  fecha_registro: string;
}

export const fetchUsuarios = async (): Promise<Usuario[]> => {
  console.log('👥 Obteniendo usuarios...');
  try {
    const response = await fetch(`${API_BASE}/admin/usuarios`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response) as { ok: boolean; usuarios: Usuario[] };
    console.log('✅ Usuarios recibidos:', data);
    
    // Tu backend devuelve { ok: true, usuarios: [...] }
    return data.usuarios || [];
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    throw error;
  }
};

export const deleteUsuario = async (id: number): Promise<void> => {
  console.log(`🗑️ Eliminando usuario ID: ${id}`);
  try {
    const response = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    await handleResponse(response);
    console.log('✅ Usuario eliminado exitosamente');
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    throw error;
  }
};

// ============= PRODUCTOS =============
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria?: string;
  imagen?: string;
}

export const fetchProductos = async (): Promise<Producto[]> => {
  console.log('📦 Obteniendo productos...');
  try {
    const response = await fetch(`${API_BASE}/admin/productos`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response) as { productos: Producto[] };
    console.log('✅ Productos recibidos:', data);
    
    return data.productos || [];
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    throw error;
  }
};

// ============= PEDIDOS =============
export interface Pedido {
  id: number;
  usuario_id: number;
  usuario_nombre: string;
  total: number;
  estado: 'pendiente' | 'pagado' | 'enviado' | 'completado' | 'cancelado';
  fecha_pedido: string;
}

export const fetchPedidos = async (): Promise<Pedido[]> => {
  console.log('🛒 Obteniendo pedidos...');
  try {
    const response = await fetch(`${API_BASE}/admin/pedidos`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response) as { pedidos: Pedido[] };
    console.log('✅ Pedidos recibidos:', data);
    
    return data.pedidos || [];
  } catch (error) {
    console.error('❌ Error al obtener pedidos:', error);
    return [];
  }
};