import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Tipos
interface UserRow extends RowDataPacket {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: string;
  creado_en?: string;
}

interface LoginResult {
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
  token: string;
}

class AuthService {
  
  async register(nombre: string, email: string, password: string, rol: string = 'cliente') {
    try {
      // Verificar si el usuario ya existe
      const [existingUsers] = await pool.query<UserRow[]>(
        'SELECT id FROM usuarios WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        throw new Error('El email ya está registrado');
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar usuario
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
        [nombre, email, hashedPassword, rol]
      );

      return {
        id: result.insertId,
        nombre,
        email,
        rol
      };
    } catch (error: any) {
      console.error('Error en AuthService.register:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<LoginResult> {
    try {
      console.log('🔍 Buscando usuario:', email);

      const [users] = await pool.query<UserRow[]>(
        'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?',
        [email]
      );

      console.log('📊 Usuarios encontrados:', users.length);

      if (users.length === 0) {
        throw new Error('Credenciales incorrectas');
      }

      const user = users[0];
      
      console.log('👤 Usuario encontrado:', {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      });

      // Verificar contraseña
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        throw new Error('Credenciales incorrectas');
      }

      // Generar token JWT
      const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          rol: user.rol
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('✅ Token generado para:', user.email, '| Rol:', user.rol);

      return {
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol
        },
        token
      };
    } catch (error: any) {
      console.error('❌ Error en AuthService.login:', error);
      throw error;
    }
  }
}

// Instancia del servicio
const authService = new AuthService();

// Controladores
export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        status: 'error',
        ok: false,
        message: 'Nombre, email y password son requeridos' 
      });
    }

    const userData = await authService.register(nombre, email, password, rol);

    res.status(201).json({
      status: 'success',
      ok: true,
      message: 'Usuario registrado exitosamente',
      user: userData
    });
  } catch (error: any) {
    console.error('Error en register controller:', error);
    res.status(400).json({ 
      status: 'error',
      ok: false,
      message: error.message || 'Error al registrar usuario' 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log('📥 Login request para:', email);

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error',
        ok: false,
        message: 'Email y password son requeridos' 
      });
    }

    const result = await authService.login(email, password);

    console.log('✅ Login exitoso para:', result.user.email, '| Rol:', result.user.rol);

    // ✅ RESPUESTA ESTANDARIZADA
    res.json({
      status: 'success',
      ok: true,
      message: 'Login exitoso',
      user: result.user,
      token: result.token
    });
  } catch (error: any) {
    console.error('❌ Error en login controller:', error);
    res.status(401).json({ 
      status: 'error',
      ok: false,
      message: error.message || 'Credenciales incorrectas' 
    });
  }
};