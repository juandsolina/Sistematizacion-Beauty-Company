// src/routes/__tests__/auth.routes.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import dotenv from 'dotenv';
import path from 'path';

// ⚠️ IMPORTANTE: Cargar .env.test ANTES de importar cualquier cosa
dotenv.config({ 
  path: path.resolve(process.cwd(), '.env.test'),
  quiet: true  // ✅ Silencia los logs de dotenv
});

import request from "supertest";
import app from '../app';
import { testPool, connectToTestDB, disconnectDB } from '../config/testDatabase';

// Variables para almacenar datos entre pruebas
let userToken: string;

// 🔇 Silenciar console.log y console.error durante los tests
const originalLog = console.log;
const originalError = console.error;

// --- HOOKS DE JEST (Versión MySQL) ---

// 1. Antes de que empiecen TODAS las pruebas
beforeAll(async () => {
  // Silenciar los logs
  console.log = jest.fn();
  console.error = jest.fn();
  
  await connectToTestDB();
}, 30000);

// 2. Antes de CADA prueba 'it()'
beforeEach(async () => {
  try {
    await testPool.query('SET FOREIGN_KEY_CHECKS = 0');
    await testPool.query('TRUNCATE TABLE usuarios');
    await testPool.query('TRUNCATE TABLE productos');
    await testPool.query('TRUNCATE TABLE carritos');
    await testPool.query('TRUNCATE TABLE pedidos');
    await testPool.query('TRUNCATE TABLE detalle_pedidos');
    await testPool.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (error) {
    originalError('❌ Error limpiando tablas:', error);
    throw error;
  }
});

// 3. Después de TODAS las pruebas
afterAll(async () => {
  try {
    await disconnectDB();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Restaurar los logs originales
    console.log = originalLog;
    console.error = originalError;
  } catch (error) {
    originalError('❌ Error en afterAll:', error);
  }
}, 30000);

// --- PRUEBAS ---
describe('Auth Routes', () => {
  describe('POST /api/auth/registro', () => {
    it('debería registrar un nuevo usuario', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          rol: 'cliente'
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.ok).toBe(true);
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('no debería registrar usuario con email duplicado', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          rol: 'cliente'
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Test User 2',
          email: 'test@example.com',
          password: 'password456',
          rol: 'cliente'
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          rol: 'cliente'
        });
    });

    it('debería hacer login con credenciales correctas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('no debería hacer login con password incorrecta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('message');
    });

    it('no debería hacer login con email inexistente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'noexiste@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('message');
    });
  });
});