import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware';
import { query } from '../config/database';

const router = Router();

router.use(authenticateToken);
router.use(isAdmin);

router.get('/stats', async (req, res, next) => {
  try {
    const totalProductos: any = await query('SELECT COUNT(*) as total FROM productos');
    const totalUsuarios: any = await query('SELECT COUNT(*) as total FROM usuarios');
    
    res.json({
      success: true,
      data: {
        productos: totalProductos[0].total,
        usuarios: totalUsuarios[0].total
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await query('SELECT id, nombre, email, role, created_at FROM usuarios ORDER BY id DESC');
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.json({ success: true, message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
});

export default router;
