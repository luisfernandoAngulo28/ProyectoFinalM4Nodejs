/**
 * Rutas de Prueba con Sequelize ORM
 * 
 * Estas rutas están en /api/v2/test/ para no interferir con tus rutas actuales
 * Puedes comparar la funcionalidad con las rutas actuales que usan pg
 * 
 * INSTALACIÓN:
 * En src/app.js, agrega:
 * import testSequelizeRoutes from './routes/test.sequelize.route.js';
 * app.use('/api/v2/test', testSequelizeRoutes);
 */

import express from 'express';
import {
  testGetAllUsers,
  testGetUserById,
  testGetUserWithTasks,
  testSearchUsers,
  testGetActiveUsers,
  testGetPendingTasks,
  testGetStats
} from '../controllers/test.sequelize.controller.js';

const router = express.Router();

// ==========================================
// RUTAS DE PRUEBA CON SEQUELIZE ORM
// ==========================================

/**
 * @route   GET /api/v2/test/users
 * @desc    Obtener todos los usuarios (últimos 10)
 * @access  Público
 * 
 * COMPARAR CON: GET /api/users (versión con pg)
 * 
 * Ejemplo: GET http://localhost:3000/api/v2/test/users
 */
router.get('/users', testGetAllUsers);

/**
 * @route   GET /api/v2/test/users/:id
 * @desc    Obtener un usuario específico por ID
 * @access  Público
 * 
 * COMPARAR CON: GET /api/users/:id (versión con pg)
 * 
 * Ejemplo: GET http://localhost:3000/api/v2/test/users/8
 */
router.get('/users/:id', testGetUserById);

/**
 * @route   GET /api/v2/test/users/:id/tasks
 * @desc    Obtener usuario con todas sus tareas (JOIN automático)
 * @access  Público
 * 
 * Este endpoint muestra el poder de Sequelize para hacer JOINs
 * sin escribir SQL manualmente
 * 
 * COMPARAR CON: GET /api/users/:id/tasks (si existe con pg)
 * 
 * Ejemplo: GET http://localhost:3000/api/v2/test/users/8/tasks
 */
router.get('/users/:id/tasks', testGetUserWithTasks);

/**
 * @route   GET /api/v2/test/search
 * @desc    Buscar usuarios por username (ILIKE - case insensitive)
 * @access  Público
 * @query   q - texto a buscar
 * 
 * Muestra el uso de operadores de Sequelize (Op.iLike)
 * 
 * Ejemplo: GET http://localhost:3000/api/v2/test/search?q=super
 */
router.get('/search', testSearchUsers);

/**
 * @route   GET /api/v2/test/active-users
 * @desc    Obtener solo usuarios activos
 * @access  Público
 * 
 * Muestra filtrado simple con WHERE en Sequelize
 * 
 * Ejemplo: GET http://localhost:3000/api/v2/test/active-users
 */
router.get('/active-users', testGetActiveUsers);

/**
 * @route   GET /api/v2/test/tasks/pending
 * @desc    Obtener todas las tareas pendientes (done = false)
 * @access  Público
 * 
 * Muestra JOIN inverso (de tasks a users)
 * 
 * Ejemplo: GET http://localhost:3000/api/v2/test/tasks/pending
 */
router.get('/tasks/pending', testGetPendingTasks);

/**
 * @route   GET /api/v2/test/stats
 * @desc    Obtener estadísticas generales (count, aggregations)
 * @access  Público
 * 
 * Muestra funciones de agregación de Sequelize
 * 
 * Ejemplo: GET http://localhost:3000/api/v2/test/stats
 */
router.get('/stats', testGetStats);

// ==========================================
// DOCUMENTACIÓN Y AYUDA
// ==========================================

/**
 * @route   GET /api/v2/test
 * @desc    Información sobre los endpoints de prueba disponibles
 * @access  Público
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Endpoints de Prueba con Sequelize ORM',
    description: 'Estos endpoints usan Sequelize en lugar del driver pg nativo',
    baseUrl: '/api/v2/test',
    endpoints: [
      {
        method: 'GET',
        path: '/users',
        description: 'Listar usuarios (últimos 10)',
        example: 'GET /api/v2/test/users'
      },
      {
        method: 'GET',
        path: '/users/:id',
        description: 'Obtener usuario por ID',
        example: 'GET /api/v2/test/users/8'
      },
      {
        method: 'GET',
        path: '/users/:id/tasks',
        description: 'Usuario con sus tareas (JOIN)',
        example: 'GET /api/v2/test/users/8/tasks'
      },
      {
        method: 'GET',
        path: '/search',
        description: 'Buscar usuarios por username',
        example: 'GET /api/v2/test/search?q=super'
      },
      {
        method: 'GET',
        path: '/active-users',
        description: 'Solo usuarios activos',
        example: 'GET /api/v2/test/active-users'
      },
      {
        method: 'GET',
        path: '/tasks/pending',
        description: 'Tareas pendientes (done=false)',
        example: 'GET /api/v2/test/tasks/pending'
      },
      {
        method: 'GET',
        path: '/stats',
        description: 'Estadísticas generales',
        example: 'GET /api/v2/test/stats'
      }
    ],
    comparison: {
      current: 'Tus rutas actuales en /api/* usan el driver pg nativo',
      test: 'Estas rutas en /api/v2/test/* usan Sequelize ORM',
      benefit: 'Puedes comparar ambos enfoques lado a lado'
    }
  });
});

export default router;
