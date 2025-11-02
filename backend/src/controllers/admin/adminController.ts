// backend/src/controllers/admin/adminController.ts
import { Request, Response } from 'express';
import db from '../../config/database';
import { RowDataPacket } from 'mysql2';

// GET /api/admin/stats - Obtener estadísticas del dashboard
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📊 Obteniendo estadísticas para admin...');

    // Consultas en paralelo para mejor performance
    const [usuariosResult] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM usuarios'
    );

    const [productosResult] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM productos'
    );

    const [pedidosResult] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM pedidos'
    );

    const [ventasResult] = await db.query<RowDataPacket[]>(
      'SELECT COALESCE(SUM(total), 0) as total FROM pedidos WHERE estado = "completado"'
    );

    const stats = {
      usuarios: usuariosResult[0]?.total || 0,
      productos: productosResult[0]?.total || 0,
      pedidos: pedidosResult[0]?.total || 0,
      ventas: ventasResult[0]?.total || 0
    };

    console.log('✅ Estadísticas obtenidas:', stats);

    res.status(200).json(stats);
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener estadísticas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// GET /api/admin/usuarios - Obtener lista de usuarios
export const getUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('👥 Obteniendo lista de usuarios...');

    const [usuarios] = await db.query<RowDataPacket[]>(
      `SELECT id, nombre, email, rol, fecha_registro 
       FROM usuarios 
       ORDER BY fecha_registro DESC`
    );

    console.log(`✅ ${usuarios.length} usuarios obtenidos`);

    res.status(200).json({
      ok: true,
      usuarios
    });
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener usuarios',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// GET /api/admin/productos - Obtener lista de productos
export const getProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📦 Obteniendo lista de productos...');

    const [productos] = await db.query<RowDataPacket[]>(
      `SELECT id, nombre, descripcion, precio, stock, categoria, imagen 
       FROM productos 
       ORDER BY nombre ASC`
    );

    console.log(`✅ ${productos.length} productos obtenidos`);

    res.status(200).json({
      ok: true,
      productos
    });
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener productos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// GET /api/admin/pedidos - Obtener lista de pedidos
export const getPedidos = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🛒 Obteniendo lista de pedidos...');

    const [pedidos] = await db.query<RowDataPacket[]>(
      `SELECT p.id, p.usuario_id, u.nombre as usuario_nombre, 
              p.total, p.estado, p.fecha_pedido
       FROM pedidos p
       INNER JOIN usuarios u ON p.usuario_id = u.id
       ORDER BY p.fecha_pedido DESC`
    );

    console.log(`✅ ${pedidos.length} pedidos obtenidos`);

    res.status(200).json({
      ok: true,
      pedidos
    });
  } catch (error) {
    console.error('❌ Error al obtener pedidos:', error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener pedidos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};