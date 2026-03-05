import bcrypt from 'bcrypt';
import pool from './src/config/db.js';
import logger from './src/logs/logger.js';

const users = [
  { username: 'superman', password: 'clark123' },
  { username: 'batman', password: 'bruce123' },
  { username: 'wonderwoman', password: 'diana123' },
  { username: 'flash', password: 'barry123' },
  { username: 'aquaman', password: 'arthur123' },
  { username: 'greenlantern', password: 'hal123' },
  { username: 'cyborg', password: 'victor123' },
  { username: 'shazam', password: 'billy123' },
  { username: 'ironman', password: 'tony123' },
  { username: 'spiderman', password: 'peter123' },
  { username: 'captainamerica', password: 'steve123' },
  { username: 'thor', password: 'odinson123' },
  { username: 'hulk', password: 'bruce123' },
  { username: 'blackwidow', password: 'natasha123' },
  { username: 'hawkeye', password: 'clint123' },
  { username: 'doctorstrange', password: 'stephen123' },
  { username: 'blackpanther', password: 'tchalla123' },
  { username: 'scarletwitch', password: 'wanda123' },
  { username: 'vision', password: 'jarvis123' },
  { username: 'antman', password: 'scott123' }
];

async function fixPasswords() {
  try {
    logger.info('🔧 Iniciando proceso de hasheo de contraseñas...');
    
    for (const user of users) {
      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Actualizar en la base de datos
      const result = await pool.query(
        'UPDATE users SET password = $1 WHERE username = $2',
        [hashedPassword, user.username]
      );
      
      if (result.rowCount > 0) {
        logger.info(`✅ Contraseña actualizada para: ${user.username}`);
      } else {
        logger.warn(`⚠️  Usuario no encontrado: ${user.username}`);
      }
    }
    
    logger.info('✨ Proceso completado exitosamente');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error al actualizar contraseñas:', error);
    process.exit(1);
  }
}

fixPasswords();
