/**
 * Middleware de validación usando Joi
 * Este middleware puede validar body, query, params, etc.
 */

/**
 * Middleware genérico de validación con Joi
 * @param {Object} schema - Schema de Joi para validar
 * @param {string} target - Objetivo de validación ('body', 'query', 'params', etc.)
 * @returns {Function} Middleware de Express
 */
function validate(schema, target = 'body') {
  return (req, res, next) => {
    const data = req[target]; // body, query, params, etc.

    // Paso 1: Verificar que existan datos
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: `El ${target} no puede estar vacío`,
      });
    }

    // Paso 2: Validar contra el schema con opciones
    const { error, value } = schema.validate(data, {
      abortEarly: false, // No detenerse en el primer error, mostrar todos
      stripUnknown: true, // Eliminar campos no definidos en el schema
      convert: true, // Convertir tipos automáticamente
    });

    // Paso 3: Si hay errores de validación, devolver 400 con mensajes claros
    if (error) {
      return res.status(400).json({
        success: false,
        message: `Error de validación en ${target}`,
        errors: error.details.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        })),
      });
    }

    // Paso 4: Reemplazar el objeto original con los datos validados y limpios
    req[target] = value;

    next();
  };
}

/**
 * Middleware para validar arrays de datos
 * Útil para operaciones bulk/masivas
 */
export function validateArray(schema, target = 'body') {
  return (req, res, next) => {
    const data = req[target];

    if (!Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        message: `El ${target} debe ser un array`,
      });
    }

    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        message: `El ${target} no puede estar vacío`,
      });
    }

    const errors = [];
    const validatedData = [];

    // Validar cada elemento del array
    data.forEach((item, index) => {
      const { error, value } = schema.validate(item, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
      });

      if (error) {
        errors.push({
          index,
          errors: error.details.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      } else {
        validatedData.push(value);
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación en algunos elementos',
        errors
      });
    }

    req[target] = validatedData;
    next();
  };
}

export default validate;
