// src/controllers/admin/authController.ts
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

// Controladores
export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, rol } = req.body;

    console.log('📥 Register request:', { nombre, email, rol: rol || 'cliente' });

    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        status: 'error',
        ok: false,
        message: 'Nombre, email y password son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const [existingUsers] = await pool.query<UserRow[]>(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        status: 'error',
        ok: false,
        message: 'El email ya está registrado'
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, rol || 'cliente']
    );

    const userData = {
      id: result.insertId,
      nombre,
      email,
      rol: rol || 'cliente'
    };

    console.log('✅ Usuario registrado:', userData);

    res.status(201).json({
      status: 'success',
      ok: true,
      message: 'Usuario registrado exitosamente',
      user: userData
    });
  } catch (error: any) {
    console.error('❌ Error en register controller:', error);
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

    // Buscar usuario
    const [users] = await pool.query<UserRow[]>(
      'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?',
      [email]
    );

    console.log('📊 Usuarios encontrados:', users.length);

    if (users.length === 0) {
      return res.status(401).json({
        status: 'error',
        ok: false,
        message: 'Credenciales incorrectas'
      });
    }

    const user = users[0];
    
    console.log('👤 Usuario encontrado:', {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      passwordHash: user.password.substring(0, 20) + '...'
    });

    // Verificar contraseña
    console.log('🔐 Comparando contraseñas...');
    const validPassword = await bcrypt.compare(password, user.password);
    
    console.log('✅ Resultado de comparación:', validPassword);

    if (!validPassword) {
      return res.status(401).json({
        status: 'error',
        ok: false,
        message: 'Credenciales incorrectas'
      });
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

    console.log('✅ Login exitoso para:', user.email, '| Rol:', user.rol);

    res.json({
      status: 'success',
      ok: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      },
      token
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