import pkg from 'pg';
const { Pool } = pkg;
import env from './env.js';
import logger from '../logs/logger.js';

const pool = new Pool({
  user: env.db.user,
  host: env.db.host,
  database: env.db.database,
  password: env.db.password,
  port: env.db.port,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    logger.error('Error connecting to the database:', err.stack);
    return;
  }
  logger.info('Database connected successfully');
  release();
});

export default pool;
