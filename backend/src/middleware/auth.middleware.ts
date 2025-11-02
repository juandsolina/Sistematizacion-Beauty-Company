import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('❌ No se proporcionó token');
    return res.status(401).json({ 
      success: false, 
      message: 'Token no proporcionado' 
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    
    // 🔍 Debug: Ver qué viene en el token
    console.log('🔍 Token decodificado:', decoded);
    
    req.userId = decoded.id;
    
    // ✅ IMPORTANTE: Usar "rol" (español) en lugar de "role" (inglés)
    req.userRole = decoded.rol || decoded.role;
    
    console.log('✅ Usuario autenticado:', decoded.email, '- Rol:', req.userRole);
    next();
  } catch (error) {
    console.log('❌ Token inválido:', error);
    return res.status(403).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  console.log('🔍 Verificando rol admin. Rol actual:', req.userRole);
  
  if (req.userRole !== 'admin') {
    console.log('⚠️ Acceso denegado. Rol requerido: admin, Rol actual:', req.userRole);
    return res.status(403).json({ 
      success: false, 
      message: 'Acceso denegado. Se requiere rol de administrador' 
    });
  }
  
  console.log('✅ Acceso admin autorizado');
  next();
};