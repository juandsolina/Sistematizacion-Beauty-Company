// src/routes/test.routes.ts
import { Router, Request, Response } from 'express';
import { pool } from '../config/database';
import { RowDataPacket } from 'mysql2';

const router = Router();

interface UserRow extends RowDataPacket {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  creado_en?: string;
}

// Endpoint para ver todos los usuarios y sus roles
router.get('/usuarios', async (req: Request, res: Response) => {
  try {
    const [users] = await pool.query<UserRow[]>(
      'SELECT id, nombre, email, rol, creado_en FROM usuarios'
    );

    console.log('📊 Usuarios en la base de datos:');
    users.forEach(user => {
      console.log(`👤 ${user.nombre} (${user.email}) - Rol: ${user.rol}`);
    });

    res.json({
      total: users.length,
      usuarios: users.map(u => ({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        rol: u.rol,
        creado_en: u.creado_en
      }))
    });
  } catch (error: any) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para verificar un usuario específico
router.get('/usuario/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const [users] = await pool.query<UserRow[]>(
      'SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];

    console.log('🔍 Usuario encontrado:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nombre: ${user.nombre}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Rol: ${user.rol}`);
    console.log(`   Tipo de rol: ${typeof user.rol}`);
    console.log(`   Es admin?: ${user.rol === 'admin'}`);

    res.json({
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        creado_en: user.creado_en
      },
      verificacion: {
        rolDetectado: user.rol,
        tipoRol: typeof user.rol,
        esAdmin: user.rol === 'admin',
        esCliente: user.rol === 'cliente'
      }
    });
  } catch (error: any) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;