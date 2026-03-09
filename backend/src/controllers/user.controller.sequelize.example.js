/**
 * EJEMPLO: Controlador de Usuarios usando Sequelize ORM
 * 
 * Este archivo es un EJEMPLO educativo para comparar con el controlador
 * actual que usa el driver pg nativo (user.controller.js)
 * 
 * ⚠️ NO REEMPLAZA el controlador actual, es solo para aprendizaje
 * 
 * Ventajas de Sequelize:
 * - Sintaxis más limpia y orientada a objetos
 * - Validaciones automáticas en el modelo
 * - Menos código SQL manual
 * - Migraciones y seeders incluidos
 * - Relaciones entre modelos más fáciles
 * 
 * Ventajas del driver pg nativo:
 * - Mayor control sobre las queries
 * - Mejor rendimiento en queries complejas
 * - Menos overhead y dependencias
 * - Más flexible para optimizaciones
 */

import { UserModel, TaskModel } from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../logs/logger.js';

/**
 * Obtener todos los usuarios con paginación
 * Compara con: user.controller.js -> getAllUsers()
 */
export const getAllUsersSequelize = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status;

    // Construcción de condiciones WHERE
    const whereCondition = {};

    if (search) {
      whereCondition.username = {
        [Op.iLike]: `%${search}%` // Búsqueda case-insensitive
      };
    }

    if (status) {
      whereCondition.status = status;
    }

    // Sequelize: findAndCountAll es similar a COUNT(*) + SELECT
    const { rows: users, count: total } = await UserModel.findAndCountAll({
      attributes: ['id', 'username', 'status', 'created_at', 'updated_at'],
      where: whereCondition,
      order: [['id', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        pages: totalPages,
        limit
      }
    });

  } catch (error) {
    logger.error('Error al obtener usuarios (Sequelize):', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

/**
 * Obtener un usuario por ID
 * Compara con: user.controller.js -> getUserById()
 */
export const getUserByIdSequelize = async (req, res) => {
  try {
    const { id } = req.params;

    // Sequelize: findByPk es equivalente a WHERE id = ?
    const user = await UserModel.findByPk(id, {
      attributes: ['id', 'username', 'status', 'created_at', 'updated_at']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    logger.error('Error al obtener usuario (Sequelize):', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

/**
 * Crear un nuevo usuario
 * Compara con: user.controller.js -> createUser()
 */
export const createUserSequelize = async (req, res) => {
  try {
    const { username, password, status = 'active' } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ where: { username } });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe'
      });
    }

    // Sequelize: create es equivalente a INSERT INTO
    // La contraseña se encripta automáticamente en el hook beforeCreate
    const newUser = await UserModel.create({
      username,
      password,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: newUser // toJSON() oculta la contraseña automáticamente
    });

  } catch (error) {
    logger.error('Error al crear usuario (Sequelize):', error);
    
    // Sequelize maneja errores de validación de forma especial
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

/**
 * Actualizar un usuario
 * Compara con: user.controller.js -> updateUser()
 */
export const updateUserSequelize = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Buscar el usuario
    const user = await UserModel.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Sequelize: update actualiza el registro
    // La contraseña se encripta automáticamente en el hook beforeUpdate
    await user.update(updates);

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user
    });

  } catch (error) {
    logger.error('Error al actualizar usuario (Sequelize):', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

/**
 * Eliminar un usuario
 * Compara con: user.controller.js -> deleteUser()
 */
export const deleteUserSequelize = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el usuario
    const user = await UserModel.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Sequelize: destroy es equivalente a DELETE FROM
    await user.destroy();

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    logger.error('Error al eliminar usuario (Sequelize):', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

/**
 * Obtener tareas de un usuario
 * Compara con: user.controller.js -> getUserTasks()
 */
export const getUserTasksSequelize = async (req, res) => {
  try {
    const { id } = req.params;

    // Sequelize: include es equivalente a JOIN
    const user = await UserModel.findByPk(id, {
      attributes: ['id', 'username'],
      include: [{
        model: TaskModel,
        as: 'tasks',
        attributes: ['id', 'name', 'done', 'created_at']
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    logger.error('Error al obtener tareas del usuario (Sequelize):', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tareas',
      error: error.message
    });
  }
};

/**
 * Crear usuarios de forma masiva
 * Compara con: user.controller.js -> bulkCreateUsers()
 */
export const bulkCreateUsersSequelize = async (req, res) => {
  try {
    const { count, usernamePrefix, password } = req.body;

    const usersData = [];
    for (let i = 1; i <= count; i++) {
      usersData.push({
        username: `${usernamePrefix}${i}`,
        password,
        status: 'active'
      });
    }

    // Sequelize: bulkCreate inserta múltiples registros
    const users = await UserModel.bulkCreate(usersData, {
      validate: true, // Validar cada registro
      individualHooks: true // Ejecutar hooks para cada registro (encriptación)
    });

    res.status(201).json({
      success: true,
      message: `${users.length} usuarios creados exitosamente`,
      data: users
    });

  } catch (error) {
    logger.error('Error al crear usuarios masivamente (Sequelize):', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuarios',
      error: error.message
    });
  }
};

export default {
  getAllUsersSequelize,
  getUserByIdSequelize,
  createUserSequelize,
  updateUserSequelize,
  deleteUserSequelize,
  getUserTasksSequelize,
  bulkCreateUsersSequelize
};
