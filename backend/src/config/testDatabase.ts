// src/config/testDatabase.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno de prueba (silenciosamente)
const envPath = path.resolve(process.cwd(), '.env.test');
dotenv.config({ path: envPath, quiet: true });

// Pool de conexiones para PRUEBAS (inicializado inmediatamente)
export const testPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_test',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 5, // Reducido para tests
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Función para conectar a la DB de prueba
export const connectToTestDB = async () => {
  try {
    const connection = await testPool.getConnection();
    // Solo descomentar para debugging si es necesario
    // console.log('✅ Conectado a la base de datos de PRUEBA');
    connection.release();
  } catch (error: any) {
    console.error('❌ Error al conectar a la DB de prueba:', error.message);
    console.error('💡 Verifica que MySQL esté corriendo y las credenciales sean correctas');
    throw error;
  }
};

// Función para desconectar de la DB de prueba
export const disconnectDB = async () => {
  try {
    if (testPool) {
      await testPool.end();
      // Solo descomentar para debugging si es necesario
      // console.log('✅ Desconectado de la base de datos de PRUEBA');
    }
  } catch (error) {
    console.error('❌ Error al desconectar:', error);
    throw error;
  }
};

export default testPool;