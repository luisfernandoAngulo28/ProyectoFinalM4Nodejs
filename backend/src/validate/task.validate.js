/**
 * Validadores para Tareas usando Joi
 * Ajustado para la estructura real de la base de datos: name, done
 */

import Joi from 'joi';

/**
 * Schema de validación para crear tarea
 */
export const taskCreateSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'string.empty': 'El nombre no puede estar vacío',
      'string.min': 'El nombre debe tener al menos 1 carácter',
      'string.max': 'El nombre no puede exceder 255 caracteres',
      'any.required': 'El nombre es obligatorio'
    }),
  done: Joi.boolean()
    .optional()
    .default(false)
    .messages({
      'boolean.base': 'El campo done debe ser verdadero o falso'
    }),
  user_id: Joi.number()
    .integer()
    .positive()
    .optional() // Puede venir del token JWT
    .messages({
      'number.base': 'El user_id debe ser un número',
      'number.integer': 'El user_id debe ser un número entero',
      'number.positive': 'El user_id debe ser positivo'
    })
});

/**
 * Schema de validación para actualizar tarea
 */
export const taskUpdateSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(255)
    .optional()
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'string.min': 'El nombre debe tener al menos 1 carácter',
      'string.max': 'El nombre no puede exceder 255 caracteres',
    }),
  done: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'El campo done debe ser verdadero o falso'
    })
}).min(1); // Al menos un campo debe estar presente

export default {
  taskCreateSchema,
  taskUpdateSchema
};
