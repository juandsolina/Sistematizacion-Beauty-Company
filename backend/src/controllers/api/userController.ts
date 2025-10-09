import { Request, Response, NextFunction } from 'express';
import { query } from '../../config/database';
import { AuthRequest } from '../../middleware/auth.middleware';

export class UserController {
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users: any = await query(
        'SELECT id, nombre, email, role, created_at FROM usuarios WHERE id = ?',
        [req.userId]
      );

      if (!Array.isArray(users) || users.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      res.json({ success: true, data: users[0] });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { nombre, email } = req.body;

      await query('UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?', [nombre, email, req.userId]);

      res.json({ success: true, message: 'Perfil actualizado exitosamente' });
    } catch (error) {
      next(error);
    }
  }
}
