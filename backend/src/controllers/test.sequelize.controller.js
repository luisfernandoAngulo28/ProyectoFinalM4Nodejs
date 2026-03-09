/**
 * Controlador de Prueba usando Sequelize ORM
 * 
 * Este controlador contiene endpoints de prueba simples para comparar
 * el enfoque de Sequelize con el driver pg nativo.
 * 
 * Endpoints disponibles en /api/v2/test/
 */

import { UserModel, TaskModel } from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../logs/logger.js';

/**
 * GET /api/v2/test/users
 * Obtener todos los usuarios (versión simple con Sequelize)
 */
export const testGetAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: ['id', 'username', 'status', 'created_at'],
      order: [['id', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      message: 'Usuarios obtenidos con Sequelize ORM',
      count: users.length,
      data: users
    });

  } catch (error) {
    logger.error('Error en testGetAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

/**
 * GET /api/v2/test/users/:id
 * Obtener un usuario por ID con Sequelize
 */
export const testGetUserById = async (req, res) => {
  try {
    const { id } = req.params;

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
      message: 'Usuario obtenido con Sequelize ORM',
      data: user
    });

  } catch (error) {
    logger.error('Error en testGetUserById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

/**
 * GET /api/v2/test/users/:id/tasks
 * Obtener usuario con sus tareas usando JOIN de Sequelize
 * Compara con: /api/users/:id/tasks (versión con pg)
 */
export const testGetUserWithTasks = async (req, res) => {
  try {
    const { id } = req.params;

    // Sequelize: include hace el JOIN automáticamente
    const user = await UserModel.findByPk(id, {
      attributes: ['id', 'username', 'status'],
      include: [{
        model: TaskModel,
        as: 'tasks',
        attributes: ['id', 'name', 'done', 'created_at'],
        order: [['created_at', 'DESC']]
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
      message: 'Usuario con tareas obtenido usando Sequelize JOIN',
      data: {
        user: {
          id: user.id,
          username: user.username,
          status: user.status
        },
        tasks: user.tasks,
        totalTasks: user.tasks.length
      }
    });

  } catch (error) {
    logger.error('Error en testGetUserWithTasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario con tareas',
      error: error.message
    });
  }
};

/**
 * GET /api/v2/test/search
 * Búsqueda de usuarios con Sequelize (ILIKE)
 */
export const testSearchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Parámetro de búsqueda "q" es requerido'
      });
    }

    // Sequelize: Op.iLike para búsqueda case-insensitive
    const users = await UserModel.findAll({
      attributes: ['id', 'username', 'status'],
      where: {
        username: {
          [Op.iLike]: `%${q}%`
        }
      },
      limit: 10
    });

    res.json({
      success: true,
      message: `Búsqueda usando Sequelize Op.iLike`,
      query: q,
      count: users.length,
      data: users
    });

  } catch (error) {
    logger.error('Error en testSearchUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Error en búsqueda',
      error: error.message
    });
  }
};

/**
 * GET /api/v2/test/active-users
 * Obtener solo usuarios activos
 */
export const testGetActiveUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: ['id', 'username', 'created_at'],
      where: {
        status: 'active'
      },
      order: [['username', 'ASC']]
    });

    res.json({
      success: true,
      message: 'Usuarios activos obtenidos con Sequelize WHERE',
      count: users.length,
      data: users
    });

  } catch (error) {
    logger.error('Error en testGetActiveUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios activos',
      error: error.message
    });
  }
};

/**
 * GET /api/v2/test/tasks/pending
 * Obtener todas las tareas pendientes (done = false)
 */
export const testGetPendingTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.findAll({
      attributes: ['id', 'name', 'done', 'created_at'],
      where: {
        done: false
      },
      include: [{
        model: UserModel,
        as: 'user',
        attributes: ['id', 'username']
      }],
      order: [['created_at', 'DESC']],
      limit: 20
    });

    res.json({
      success: true,
      message: 'Tareas pendientes con información de usuario (JOIN)',
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    logger.error('Error en testGetPendingTasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tareas pendientes',
      error: error.message
    });
  }
};

/**
 * GET /api/v2/test/stats
 * Estadísticas usando Sequelize aggregations
 */
export const testGetStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.count();
    const activeUsers = await UserModel.count({ where: { status: 'active' } });
    const inactiveUsers = await UserModel.count({ where: { status: 'inactive' } });
    
    const totalTasks = await TaskModel.count();
    const completedTasks = await TaskModel.count({ where: { done: true } });
    const pendingTasks = await TaskModel.count({ where: { done: false } });

    res.json({
      success: true,
      message: 'Estadísticas usando Sequelize count()',
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers
        },
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks
        }
      }
    });

  } catch (error) {
    logger.error('Error en testGetStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

export default {
  testGetAllUsers,
  testGetUserById,
  testGetUserWithTasks,
  testSearchUsers,
  testGetActiveUsers,
  testGetPendingTasks,
  testGetStats
};
