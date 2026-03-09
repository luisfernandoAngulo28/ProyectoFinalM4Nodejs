/**
 * Configuración de Sequelize ORM
 * Este archivo proporciona una alternativa al driver pg nativo
 * para trabajar con PostgreSQL usando el ORM Sequelize
 */

import { Sequelize } from 'sequelize';
import env from '../config/env.js';
import logger from '../logs/logger.js';

// Configuración de Sequelize (alternativa al driver pg nativo)
export const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: (msg) => logger.info(msg),
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' 
          ? { rejectUnauthorized: false } 
          : false
      }
    })
  : new Sequelize(
      env.db.database,
      env.db.user,
      env.db.password,
      {
        host: env.db.host,
        port: env.db.port,
        dialect: 'postgres',
        logging: (msg) => logger.info(msg),
      }
    );

// Test de conexión
try {
  await sequelize.authenticate();
  logger.info('✅ Sequelize: Conexión a la base de datos establecida exitosamente');
} catch (error) {
  logger.error('❌ Sequelize: Error al conectar a la base de datos:', error);
}

export default sequelize;
