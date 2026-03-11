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
import authController from './controllers/auth.controller.js';
import { validateLogin } from './middlewares/validators.js';
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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://proyecto-final-m4-nodejs.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
// Login endpoint directly under /api (without /auth prefix)
app.post('/api/login', validateLogin, authController.login);

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/reports', reportsRoutes);

// 🆕 Rutas de prueba con Sequelize ORM (opcional - para comparar con pg)
// Estas rutas están en /api/v2/test/ y NO interfieren con tus rutas actuales
app.use('/api/v2/test', testSequelizeRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    version: '1.0.0',
    endpoints: {
      docs: '/api-docs',
      health: '/health',
      api: '/api'
    }
  });
});

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
