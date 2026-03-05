import 'dotenv/config'

const env = {
  port: process.env.PORT || '3000',
  db: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'BDCrudEstudiante',
    password: process.env.DB_PASSWORD || '12345678',
    port: process.env.DB_PORT || 5432,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  }
}

export default env