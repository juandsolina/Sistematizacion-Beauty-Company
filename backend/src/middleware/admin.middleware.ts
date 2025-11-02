// backend/src/middleware/admin.middleware.ts
import { Request, Response, NextFunction } from 'express';

// Extender el tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        rol: string;
      };
    }
  }
}

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // El authMiddleware ya debería haber agregado req.user
    if (!req.user) {
      res.status(401).json({
        ok: false,
        message: 'No autenticado'
      });
      return;
    }

    // Verificar que el rol sea admin
    if (req.user.rol !== 'admin') {
      res.status(403).json({
        ok: false,
        message: 'Acceso denegado. Se requiere rol de administrador.'
      });
      return;
    }

    // Si es admin, continuar
    next();
  } catch (error) {
    console.error('❌ Error en adminMiddleware:', error);
    res.status(500).json({
      ok: false,
      message: 'Error en la verificación de permisos'
    });
  }
};