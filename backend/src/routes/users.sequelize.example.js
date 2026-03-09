/**
 * EJEMPLO: Rutas usando Sequelize + Joi
 * 
 * Este archivo muestra cómo crear rutas usando:
 * - Sequelize ORM para consultas
 * - Joi para validaciones
 * - Controllers con Sequelize
 * 
 * ⚠️ Este es un EJEMPLO educativo, no reemplaces tus rutas actuales
 * 
 * Para probarlo, puedes agregar estas rutas en app.js:
 * import sequelizeExampleRoutes from './routes/users.sequelize.example.js';
 * app.use('/api/v2', sequelizeExampleRoutes);
 */

import express from 'express';
import validate from '../validate/validate.middleware.js';
import { userRegisterSchema, userLoginSchema, userUpdateSchema } from '../validate/user.validate.js';
import { verifyToken } from '../middlewares/auth.js';

// Importar controladores de ejemplo con Sequelize
import {
  getAllUsersSequelize,
  getUserByIdSequelize,
  createUserSequelize,
  updateUserSequelize,
  deleteUserSequelize,
  getUserTasksSequelize,
  bulkCreateUsersSequelize
} from '../controllers/user.controller.sequelize.example.js';

const router = express.Router();

// ==========================================
// RUTAS DE USUARIOS CON SEQUELIZE ORM
// ==========================================

/**
 * @route   GET /api/v2/users
 * @desc    Obtener todos los usuarios (con paginación, búsqueda, filtros)
 * @access  Público
 * @query   page, limit, search, status
 * 
 * Ejemplo: GET /api/v2/users?page=1&limit=10&search=john&status=active
 */
router.get('/users', getAllUsersSequelize);

/**
 * @route   GET /api/v2/users/:id
 * @desc    Obtener un usuario por ID
 * @access  Privado (requiere token)
 * 
 * Ejemplo: GET /api/v2/users/1
 */
router.get('/users/:id', verifyToken, getUserByIdSequelize);

/**
 * @route   POST /api/v2/users
 * @desc    Crear un nuevo usuario
 * @access  Público
 * @body    username, password
 * 
 * Ejemplo: POST /api/v2/users
 * {
 *   "username": "johndoe",
 *   "password": "secure123"
 * }
 * 
 * Nota: La validación con Joi se ejecuta automáticamente
 */
router.post('/users', 
  validate(userRegisterSchema), // <- Validación con Joi
  createUserSequelize
);

/**
 * @route   PUT /api/v2/users/:id
 * @desc    Actualizar un usuario
 * @access  Privado (requiere token)
 * @body    username, password, status (todos opcionales)
 * 
 * Ejemplo: PUT /api/v2/users/1
 * {
 *   "username": "johndoe2",
 *   "status": "inactive"
 * }
 */
router.put('/users/:id',
  verifyToken,
  validate(userUpdateSchema), // <- Validación con Joi
  updateUserSequelize
);

/**
 * @route   DELETE /api/v2/users/:id
 * @desc    Eliminar un usuario
 * @access  Privado (requiere token)
 * 
 * Ejemplo: DELETE /api/v2/users/1
 */
router.delete('/users/:id', verifyToken, deleteUserSequelize);

/**
 * @route   GET /api/v2/users/:id/tasks
 * @desc    Obtener todas las tareas de un usuario
 * @access  Privado (requiere token)
 * 
 * Ejemplo: GET /api/v2/users/1/tasks
 * 
 * Responde con el usuario y sus tareas (JOIN automático con Sequelize)
 */
router.get('/users/:id/tasks', verifyToken, getUserTasksSequelize);

/**
 * @route   POST /api/v2/users/bulk
 * @desc    Crear múltiples usuarios de forma masiva
 * @access  Privado (requiere token)
 * @body    count, usernamePrefix, password
 * 
 * Ejemplo: POST /api/v2/users/bulk
 * {
 *   "count": 10,
 *   "usernamePrefix": "testuser",
 *   "password": "test123"
 * }
 * 
 * Crea: testuser1, testuser2, ..., testuser10
 */
router.post('/users/bulk', 
  verifyToken,
  bulkCreateUsersSequelize
);

// ==========================================
// COMPARACIÓN CON RUTAS ACTUALES
// ==========================================

/*
  RUTAS ACTUALES (pg driver):    /api/users
  RUTAS EJEMPLO (Sequelize):     /api/v2/users
  
  Ambas pueden coexistir sin problema!
  
  Ventajas de este enfoque con Sequelize + Joi:
  ✅ Validaciones más expresivas y reutilizables
  ✅ Menos código SQL manual
  ✅ Relaciones automáticas (include)
  ✅ Hooks para lógica automática
  ✅ Migraciones y seeders incluidos
  
  Tu código actual sigue funcionando igual!
*/

export default router;
