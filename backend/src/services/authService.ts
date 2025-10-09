import { query } from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash';
const jwt = require('jsonwebtoken');
import { config } from '../config/config';
import crypto from 'crypto';

export class AuthService {
  static async register(nombre: string, email: string, password: string) {
    const existingUser: any = await query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      throw new Error('El email ya está registrado');
    }

    const hashedPassword = await hashPassword(password);

    const result: any = await query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, 'cliente']
    );

    return {
      id: result.insertId,
      nombre,
      email,
      rol: 'cliente'
    };
  }
  
  static async login(email: string, password: string) {
    const users: any = await query(
      'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?',
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      throw new Error('Credenciales inválidas');
    }

    const user = users[0];
    const isValid = await comparePassword(password, user.password);
    
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      },
      token
    };
  }

  static async requestPasswordReset(email: string) {
    throw new Error('Funcionalidad no disponible - la tabla no tiene campos reset_token/reset_expires');
  }

  static async resetPassword(token: string, newPassword: string) {
    throw new Error('Funcionalidad no disponible - la tabla no tiene campos reset_token/reset_expires');
  }
}