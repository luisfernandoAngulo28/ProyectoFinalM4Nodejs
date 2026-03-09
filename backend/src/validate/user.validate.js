/**
 * Validadores usando Joi
 * Joi es una librería poderosa para validación de datos en Node.js
 * Es una alternativa a express-validator
 * Ajustado para la estructura real de la base de datos
 */

import Joi from 'joi';

/**
 * Schema de validación para registro de usuario
 */
export const userRegisterSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El username debe ser un texto',
      'string.empty': 'El username no puede estar vacío',
      'string.min': 'El username debe tener al menos 3 caracteres',
      'string.max': 'El username no puede exceder 100 caracteres',
      'string.alphanum': 'El username solo puede contener letras y números',
      'any.required': 'El username es obligatorio'
    }),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
    .messages({
      'string.base': 'La contraseña debe ser un texto',
      'string.empty': 'La contraseña no puede estar vacía',
      'string.pattern.base': 'La contraseña debe tener entre 3 y 30 caracteres alfanuméricos',
      'any.required': 'La contraseña es obligatoria'
    })
});

/**
 * Schema de validación para login
 */
export const userLoginSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      'string.empty': 'El username no puede estar vacío',
      'any.required': 'El username es obligatorio'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'La contraseña no puede estar vacía',
      'any.required': 'La contraseña es obligatoria'
    })
});

/**
 * Schema de validación para actualización de usuario
 */
export const userUpdateSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(100)
    .optional()
    .messages({
      'string.base': 'El username debe ser un texto',
      'string.min': 'El username debe tener al menos 3 caracteres',
      'string.max': 'El username no puede exceder 100 caracteres',
      'string.alphanum': 'El username solo puede contener letras y números',
    }),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .optional()
    .messages({
      'string.pattern.base': 'La contraseña debe tener entre 3 y 30 caracteres alfanuméricos',
    }),
  status: Joi.string()
    .valid('active', 'inactive')
    .optional()
    .messages({
      'any.only': 'El status debe ser "active" o "inactive"'
    })
}).min(1); // Al menos un campo debe estar presente

export default {
  userRegisterSchema,
  userLoginSchema,
  userUpdateSchema
};
