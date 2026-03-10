import { body, param, query, validationResult } from 'express-validator';

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

// Validaciones para usuarios
export const validateCreateUser = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username es requerido')
    .isLength({ min: 3, max: 50 }).withMessage('Username debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username solo puede contener letras, números y guiones bajos'),
  body('password')
    .notEmpty().withMessage('Password es requerido')
    .isLength({ min: 6, max: 100 }).withMessage('Password debe tener al menos 6 caracteres'),
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Status debe ser "active" o "inactive"'),
  handleValidationErrors
];

export const validateUpdateUser = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID debe ser un número entero positivo'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Username debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username solo puede contener letras, números y guiones bajos'),
  body('password')
    .optional()
    .isLength({ min: 6, max: 100 }).withMessage('Password debe tener al menos 6 caracteres'),
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Status debe ser "active" o "inactive"'),
  handleValidationErrors
];

export const validateUserId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID debe ser un número entero positivo'),
  handleValidationErrors
];

export const validateBulkUsers = [
  body('users')
    .isArray({ min: 1 }).withMessage('Debe proporcionar un array de usuarios con al menos un elemento'),
  body('users.*.username')
    .trim()
    .notEmpty().withMessage('Cada usuario debe tener username')
    .isLength({ min: 3, max: 50 }).withMessage('Username debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username solo puede contener letras, números y guiones bajos'),
  body('users.*.password')
    .notEmpty().withMessage('Cada usuario debe tener password')
    .isLength({ min: 6, max: 100 }).withMessage('Password debe tener al menos 6 caracteres'),
  body('users.*.status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Status debe ser "active" o "inactive"'),
  handleValidationErrors
];

export const validatePatchUser = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID debe ser un número entero positivo'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Username debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username solo puede contener letras, números y guiones bajos'),
  body('password')
    .optional()
    .isLength({ min: 6, max: 100 }).withMessage('Password debe tener al menos 6 caracteres'),
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Status debe ser "active" o "inactive"'),
  handleValidationErrors
];

// Validaciones para tareas
export const validateCreateTask = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name es requerido')
    .isLength({ min: 3, max: 255 }).withMessage('Name debe tener entre 3 y 255 caracteres'),
  body('done')
    .optional()
    .isBoolean().withMessage('Done debe ser un valor booleano'),
  body('user_id')
    .notEmpty().withMessage('User_id es requerido')
    .isInt({ min: 1 }).withMessage('User_id debe ser un número entero positivo'),
  handleValidationErrors
];

export const validateUpdateTask = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID debe ser un número entero positivo'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Name debe tener entre 3 y 255 caracteres'),
  body('done')
    .optional()
    .isBoolean().withMessage('Done debe ser un valor booleano'),
  body('user_id')
    .optional()
    .isInt({ min: 1 }).withMessage('User_id debe ser un número entero positivo'),
  handleValidationErrors
];

export const validateTaskId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID debe ser un número entero positivo'),
  handleValidationErrors
];

export const validateUserIdParam = [
  param('userId')
    .isInt({ min: 1 }).withMessage('User ID debe ser un número entero positivo'),
  handleValidationErrors
];

// Validaciones para paginación
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page debe ser un número entero positivo'),
  query('limit')
    .optional()
    .isIn(['5', '10', '15', '20']).withMessage('Limit debe ser 5, 10, 15 o 20'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search no puede exceder 100 caracteres'),
  query('orderBy')
    .optional()
    .isIn(['id', 'username', 'status']).withMessage('OrderBy debe ser id, username o status'),
  query('orderDir')
    .optional()
    .toUpperCase()
    .isIn(['ASC', 'DESC']).withMessage('OrderDir debe ser ASC o DESC'),
  handleValidationErrors
];

// Validaciones para autenticación
export const validateLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username es requerido'),
  body('password')
    .notEmpty().withMessage('Password es requerido'),
  handleValidationErrors
];

export const validateRegister = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username es requerido')
    .isLength({ min: 3, max: 50 }).withMessage('Username debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username solo puede contener letras, números y guiones bajos'),
  body('password')
    .notEmpty().withMessage('Password es requerido')
    .isLength({ min: 6, max: 100 }).withMessage('Password debe tener al menos 6 caracteres'),
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Status debe ser "active" o "inactive"'),
  handleValidationErrors
];
