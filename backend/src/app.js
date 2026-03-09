import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.route.js';
import usersRoutes from './routes/users.route.js';
import tasksRoutes from './routes/tasks.route.js';
import reportsRoutes from './routes/reports.route.js';
import testSequelizeRoutes from './routes/test.sequelize.route.js'; // 🆕 Rutas de prueba con Sequelize
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import './config/db.js'; // Initialize database connection

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDocument = YAML.load(join(__dirname, '../swagger.yaml'));

const app = express();

// Security Middlewares
app.use(helmet()); // Protect against common web vulnerabilities

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || '*'  // URL de Vercel en producción
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
};
app.use(cors(corsOptions)); // Enable CORS

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/reports', reportsRoutes);

// 🆕 Rutas de prueba con Sequelize ORM (opcional - para comparar con pg)
// Estas rutas están en /api/v2/test/ y NO interfieren con tus rutas actuales
app.use('/api/v2/test', testSequelizeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middlewares (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
