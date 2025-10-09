import app from './app';
import dotenv from 'dotenv';
import path from 'path'; 

// Cargar .env desde la raíz del backend
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 🔍 DEBUG: Verificar variables de entorno
console.log('🔍 Variables de entorno cargadas:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***configurada***' : 'VACÍA o NO DEFINIDA');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('---');

function parsePort(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const PORT = parsePort(process.env.PORT, 3000);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

function express() {
  throw new Error('Function not implemented.');
}
