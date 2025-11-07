// src/routes/__tests__/productos.routes.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import dotenv from 'dotenv';
import path from 'path';

// Cargar .env.test ANTES de importar
dotenv.config({ path: path.resolve(process.cwd(), '.env.test'), quiet: true });

import request from "supertest";
import app from '../app';
import { testPool, connectToTestDB, disconnectDB } from '../config/testDatabase';

// Silenciar logs durante tests
const originalLog = console.log;
const originalError = console.error;

let authToken: string;
let testProductId: number;

// --- HOOKS DE JEST ---

beforeAll(async () => {
  console.log = jest.fn();
  console.error = jest.fn();
  
  await connectToTestDB();
  
  // Crear un usuario admin para los tests que lo requieren
  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send({
      nombre: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      rol: 'admin'
    });
  
  // Hacer login para obtener el token
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@test.com',
      password: 'admin123'
    });
  
  authToken = loginResponse.body.token;
}, 30000);

beforeEach(async () => {
  try {
    await testPool.query('SET FOREIGN_KEY_CHECKS = 0');
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

afterAll(async () => {
  try {
    await disconnectDB();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log = originalLog;
    console.error = originalError;
  } catch (error) {
    originalError('❌ Error en afterAll:', error);
  }
}, 30000);

// --- PRUEBAS ---

describe('Productos Routes', () => {
  
  describe('POST /api/productos', () => {
    it('debería crear un producto exitosamente', async () => {
      const response = await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Producto Test',
          descripcion: 'Descripción de prueba',
          precio: 99.99,
          stock: 10,
          imagen: 'test.jpg'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Producto creado exitosamente');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.nombre).toBe('Producto Test');
      expect(response.body.data.precio).toBe(99.99);
      
      testProductId = response.body.data.id;
    });

    it('no debería crear producto sin nombre', async () => {
      const response = await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          descripcion: 'Sin nombre',
          precio: 50
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Nombre y precio son requeridos');
    });

    it('no debería crear producto con precio inválido', async () => {
      const response = await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Producto Test',
          precio: 'invalido'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Precio inválido');
    });
  });

  describe('GET /api/productos', () => {
    beforeEach(async () => {
      // Crear productos de prueba
      await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Producto 1',
          descripcion: 'Descripción 1',
          precio: 100,
          stock: 5
        });
      
      await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Producto 2',
          descripcion: 'Descripción 2',
          precio: 200,
          stock: 10
        });
    });

    it('debería obtener todos los productos', async () => {
      const response = await request(app)
        .get('/api/productos');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
    });

    it('debería obtener productos con paginación', async () => {
      const response = await request(app)
        .get('/api/productos?page=1&limit=1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(1);
      expect(response.body.data.length).toBeLessThanOrEqual(1);
    });
  });

  describe('GET /api/productos/:id', () => {
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Producto Específico',
          precio: 150,
          stock: 8
        });
      
      testProductId = createResponse.body.data.id;
    });

    it('debería obtener un producto por ID', async () => {
      const response = await request(app)
        .get(`/api/productos/${testProductId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', testProductId);
      expect(response.body.data).toHaveProperty('nombre', 'Producto Específico');
    });

    it('debería retornar 404 si el producto no existe', async () => {
      const response = await request(app)
        .get('/api/productos/99999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Producto no encontrado');
    });
  });

  describe('PUT /api/productos/:id', () => {
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Producto Original',
          precio: 100,
          stock: 5
        });
      
      testProductId = createResponse.body.data.id;
    });

    it('debería actualizar un producto exitosamente', async () => {
      const response = await request(app)
        .put(`/api/productos/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Producto Actualizado',
          precio: 150,
          stock: 20
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Producto actualizado exitosamente');
    });

    it('debería retornar 404 al actualizar producto inexistente', async () => {
      const response = await request(app)
        .put('/api/productos/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'No existe',
          precio: 100
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Producto no encontrado');
    });
  });

  describe('DELETE /api/productos/:id', () => {
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Producto a Eliminar',
          precio: 100,
          stock: 5
        });
      
      testProductId = createResponse.body.data.id;
    });

    it('debería eliminar un producto exitosamente', async () => {
      const response = await request(app)
        .delete(`/api/productos/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Producto eliminado exitosamente');

      // Verificar que realmente se eliminó
      const checkResponse = await request(app)
        .get(`/api/productos/${testProductId}`);
      
      expect(checkResponse.status).toBe(404);
    });

    it('debería retornar 404 al eliminar producto inexistente', async () => {
      const response = await request(app)
        .delete('/api/productos/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Producto no encontrado');
    });
  });

  describe('GET /api/productos/search', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Laptop HP',
          descripcion: 'Computadora portátil',
          precio: 1000,
          stock: 3
        });
      
      await request(app)
        .post('/api/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Mouse Logitech',
          descripcion: 'Periférico inalámbrico',
          precio: 50,
          stock: 15
        });
    });

    it('debería buscar productos por nombre', async () => {
      const response = await request(app)
        .get('/api/productos/search?q=Laptop');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].nombre).toContain('Laptop');
    });

    it('debería retornar error sin parámetro de búsqueda', async () => {
      const response = await request(app)
        .get('/api/productos/search');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Parámetro de búsqueda requerido');
    });
  });
});