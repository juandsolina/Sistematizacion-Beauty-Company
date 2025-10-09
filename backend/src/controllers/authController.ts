import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export default class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('📥 REGISTER - Body recibido:', req.body);
      
      const { nombre, email, password, rol } = req.body;
      
      console.log('📝 Datos extraídos:', { nombre, email, password: password ? '***' : undefined, rol });
      
      if (!nombre || !email || !password) {
        console.log('❌ Validación fallida - campos faltantes');
        return res.status(400).json({ 
          status: 'error',
          mensaje: 'Todos los campos son requeridos' 
        });
      }

      console.log('✅ Validación OK - llamando a AuthService.register');
      const user = await AuthService.register(nombre, email, password);
      
      console.log('✅ Usuario registrado:', user);
      
      return res.status(201).json({
        status: 'success',
        mensaje: 'Usuario registrado exitosamente',
        usuario: user
      });
    } catch (err: any) {
      console.error('❌ ERROR en register:', err.message);
      return res.status(400).json({
        status: 'error',
        mensaje: err.message || 'Error al registrar usuario'
      });
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('📥 LOGIN - Body recibido:', req.body);
      
      const { email, password } = req.body;
      
      console.log('📝 Datos extraídos:', { email, password: password ? '***' : undefined });
      
      if (!email || !password) {
        console.log('❌ Validación fallida - campos faltantes');
        return res.status(400).json({ 
          status: 'error',
          mensaje: 'Email y contraseña son requeridos' 
        });
      }

      console.log('✅ Validación OK - llamando a AuthService.login');
      const result = await AuthService.login(email, password);
      
      console.log('✅ Login exitoso para:', email);
      
      return res.status(200).json({ 
        status: 'success',
        mensaje: 'Login exitoso',
        usuario: result.user,
        token: result.token
      });
    } catch (err: any) {
      console.error('❌ ERROR en login:', err.message);
      return res.status(401).json({
        status: 'error',
        mensaje: err.message || 'Credenciales incorrectas'
      });
    }
  }
} 