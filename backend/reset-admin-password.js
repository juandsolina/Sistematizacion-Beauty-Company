require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function resetAdminPassword() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'pass123',
    database: process.env.DB_NAME || 'tienda',
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('🔐 Reseteando contraseña del admin...');
    
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    console.log('📝 Hash generado:', hashedPassword.substring(0, 20) + '...');
    
    const [result] = await connection.execute(
      'UPDATE usuarios SET password = ? WHERE email = ?',
      [hashedPassword, 'admin@tienda.com']
    );
    
    if (result.affectedRows > 0) {
      console.log('✅ Contraseña actualizada exitosamente');
      console.log('📧 Email: admin@tienda.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('⚠️  No se encontró el usuario admin@tienda.com');
    }
    
    const [rows] = await connection.execute(
      'SELECT password FROM usuarios WHERE email = ?',
      ['admin@tienda.com']
    );
    
    if (rows.length > 0) {
      const isValid = await bcrypt.compare(plainPassword, rows[0].password);
      console.log('🧪 Verificación del hash:', isValid ? '✅ OK' : '❌ FALLO');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

resetAdminPassword();