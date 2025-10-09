import { Router } from 'express';
import { ProductosController } from '../controllers/api/productosController';
import { UserController } from '../controllers/api/userController';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/productos', ProductosController.getAll);
router.get('/productos/search', ProductosController.search);
router.get('/productos/:id', ProductosController.getById);

router.post('/productos', authenticateToken, ProductosController.create);
router.put('/productos/:id', authenticateToken, ProductosController.update);
router.delete('/productos/:id', authenticateToken, ProductosController.delete);

router.get('/user/profile', authenticateToken, UserController.getProfile);
router.put('/user/profile', authenticateToken, UserController.updateProfile);

export default router;