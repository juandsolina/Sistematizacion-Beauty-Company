// backend/src/routes/admin.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware';
import db from '../config/database';
import { RowDataPacket } from 'mysql2';

const router = Router();

router.use(authenticateToken);
router.use(isAdmin);

interface StatsRow extends RowDataPacket {
  total: number;
}

// GET /api/admin/stats - Estadísticas del dashboard
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('📊 Obteniendo estadísticas para admin...');

    const [productosRows] = await db.query<StatsRow[]>(
      'SELECT COUNT(*) as total FROM productos'
    );
    
    const [usuariosRows] = await db.query<StatsRow[]>(
      'SELECT COUNT(*) as total FROM usuarios'
    );
    
    let totalPedidos = 0;
    let totalVentas = 0;
    
    try {
      const [pedidosRows] = await db.query<StatsRow[]>(
        'SELECT COUNT(*) as total FROM pedidos'
      );
      totalPedidos = pedidosRows[0]?.total || 0;
      
      const [ventasRows] = await db.query<StatsRow[]>(
        'SELECT COALESCE(SUM(total), 0) as total FROM pedidos WHERE estado = "completado"'
      );
      totalVentas = ventasRows[0]?.total || 0;
    } catch (error) {
      console.warn('⚠️ Tabla pedidos no existe aún, usando valores por defecto');
    }

    const stats = {
      usuarios: usuariosRows[0]?.total || 0,
      productos: productosRows[0]?.total || 0,
      pedidos: totalPedidos,
      ventas: totalVentas
    };

    console.log('✅ Estadísticas obtenidas:', stats);

    res.json(stats);
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    next(error);
  }
});

// GET /api/admin/usuarios - Lista de usuarios
router.get('/usuarios', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('👥 Obteniendo lista de usuarios...');
    
    // ✅ CAMBIO AQUÍ: Usar creado_en y renombrarlo como fecha_registro
    const [usuarios] = await db.query<RowDataPacket[]>(
      'SELECT id, nombre, email, rol, creado_en as fecha_registro FROM usuarios ORDER BY id DESC'
    );
    
    console.log(`✅ ${usuarios.length} usuarios obtenidos`);
    
    res.json({ 
      ok: true, 
      usuarios 
    });
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    next(error);
  }
});

// GET /api/admin/productos - Lista de productos
router.get('/productos', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('📦 Obteniendo lista de productos...');
    
    const [productos] = await db.query<RowDataPacket[]>(
      'SELECT id, nombre, descripcion, precio, stock, imagen FROM productos ORDER BY nombre ASC'
    );
    
    console.log(`✅ ${productos.length} productos obtenidos`);
    
    res.json({ 
      ok: true, 
      productos 
    });
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    next(error);
  }
});

// GET /api/admin/pedidos - Lista de pedidos
router.get('/pedidos', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🛒 Obteniendo lista de pedidos...');
    
    const [pedidos] = await db.query<RowDataPacket[]>(`
      SELECT p.id, p.usuario_id, u.nombre as usuario_nombre, 
             p.total, p.estado, p.creado_en as fecha_pedido
      FROM pedidos p
      INNER JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.creado_en DESC
    `);
    
    console.log(`✅ ${pedidos.length} pedidos obtenidos`);
    
    res.json({ 
      ok: true, 
      pedidos 
    });
  } catch (error) {
    console.error('❌ Error al obtener pedidos:', error);
    res.json({ 
      ok: true, 
      pedidos: [],
      message: 'Tabla de pedidos no disponible aún'
    });
  }
});

// DELETE /api/admin/usuarios/:id - Eliminar usuario (corregida la ruta)
router.delete('/usuarios/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando usuario ID: ${id}`);
    
    await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    
    console.log('✅ Usuario eliminado exitosamente');
    
    res.json({ 
      success: true, 
      message: 'Usuario eliminado exitosamente' 
    });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    next(error);
  }
});

// PUT /api/admin/usuarios/:id/rol - Cambiar rol de usuario
router.put('/usuarios/:id/rol', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;
    
    console.log(`🔄 Cambiando rol del usuario ID: ${id} a ${rol}`);
    
    await db.query('UPDATE usuarios SET rol = ? WHERE id = ?', [rol, id]);
    
    console.log('✅ Rol actualizado exitosamente');
    
    res.json({ 
      success: true, 
      message: 'Rol actualizado exitosamente' 
    });
  } catch (error) {
    console.error('❌ Error al actualizar rol:', error);
    next(error);
  }
});

export default router;