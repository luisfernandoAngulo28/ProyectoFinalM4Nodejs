import pool from '../config/db.js';
import logger from '../logs/logger.js';

// REPORTE 1: Resumen general del sistema
const getGeneralStats = async (req, res) => {
  try {
    // Total de usuarios
    const totalUsers = await pool.query('SELECT COUNT(*) as count FROM users');
    
    // Usuarios activos vs inactivos
    const usersByStatus = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM users 
      GROUP BY status
    `);
    
    // Total de tareas
    const totalTasks = await pool.query('SELECT COUNT(*) as count FROM tasks');
    
    // Tareas completadas vs pendientes
    const tasksByStatus = await pool.query(`
      SELECT done, COUNT(*) as count 
      FROM tasks 
      GROUP BY done
    `);
    
    // Promedio de tareas por usuario
    const avgTasksPerUser = await pool.query(`
      SELECT AVG(task_count)::numeric(10,2) as avg
      FROM (
        SELECT user_id, COUNT(*) as task_count
        FROM tasks
        GROUP BY user_id
      ) as user_tasks
    `);

    res.json({
      success: true,
      data: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        usersByStatus: usersByStatus.rows,
        totalTasks: parseInt(totalTasks.rows[0].count),
        tasksByStatus: tasksByStatus.rows,
        avgTasksPerUser: parseFloat(avgTasksPerUser.rows[0].avg) || 0
      }
    });
  } catch (error) {
    logger.error('Error getting general stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas generales',
      error: error.message
    });
  }
};

// REPORTE 2: Top usuarios con más tareas
const getTopUsersByTasks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.status,
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.done = true THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN t.done = false THEN 1 ELSE 0 END) as pending_tasks,
        ROUND(
          (SUM(CASE WHEN t.done = true THEN 1 ELSE 0 END)::numeric / 
          NULLIF(COUNT(t.id), 0) * 100), 2
        ) as completion_percentage
      FROM users u
      LEFT JOIN tasks t ON u.id = t.user_id
      GROUP BY u.id, u.username, u.status
      ORDER BY total_tasks DESC, completion_percentage DESC
      LIMIT $1
    `, [limit]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error getting top users by tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ranking de usuarios',
      error: error.message
    });
  }
};

// REPORTE 3: Estadísticas de tareas
const getTasksStats = async (req, res) => {
  try {
    // Total de tareas por usuario
    const tasksByUser = await pool.query(`
      SELECT 
        u.username,
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.done = true THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN t.done = false THEN 1 ELSE 0 END) as pending
      FROM users u
      LEFT JOIN tasks t ON u.id = t.user_id
      WHERE u.status = 'active'
      GROUP BY u.id, u.username
      HAVING COUNT(t.id) > 0
      ORDER BY total_tasks DESC
    `);

    // Tareas más recientes
    const recentTasks = await pool.query(`
      SELECT 
        t.id,
        t.name,
        t.done,
        u.username,
        t.created_at
      FROM tasks t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        tasksByUser: tasksByUser.rows,
        recentTasks: recentTasks.rows
      }
    });
  } catch (error) {
    logger.error('Error getting tasks stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de tareas',
      error: error.message
    });
  }
};

// REPORTE 4: Progreso por usuario
const getUserProgress = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.status,
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.done = true THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN t.done = false THEN 1 ELSE 0 END) as pending_tasks,
        CASE 
          WHEN COUNT(t.id) = 0 THEN 0
          ELSE ROUND(
            (SUM(CASE WHEN t.done = true THEN 1 ELSE 0 END)::numeric / 
            COUNT(t.id) * 100), 2
          )
        END as completion_percentage
      FROM users u
      LEFT JOIN tasks t ON u.id = t.user_id
      GROUP BY u.id, u.username, u.status
      ORDER BY completion_percentage DESC, total_tasks DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error getting user progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener progreso de usuarios',
      error: error.message
    });
  }
};

// REPORTE 5: Tendencias por fecha
const getTrendsByDate = async (req, res) => {
  try {
    // Usuarios registrados por fecha
    const userTrends = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);

    // Tareas creadas por fecha
    const taskTrends = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        SUM(CASE WHEN done = true THEN 1 ELSE 0 END) as completed
      FROM tasks
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);

    res.json({
      success: true,
      data: {
        userTrends: userTrends.rows,
        taskTrends: taskTrends.rows
      }
    });
  } catch (error) {
    logger.error('Error getting trends by date:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tendencias',
      error: error.message
    });
  }
};

// REPORTE 6: Usuarios inactivos (sin tareas)
const getInactiveUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.status,
        u.created_at,
        COUNT(t.id) as total_tasks
      FROM users u
      LEFT JOIN tasks t ON u.id = t.user_id
      GROUP BY u.id, u.username, u.status, u.created_at
      HAVING COUNT(t.id) = 0
      ORDER BY u.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error getting inactive users:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios inactivos',
      error: error.message
    });
  }
};

// REPORTE 7: Comparativa entre usuarios
const getUsersComparison = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.username,
        u.status,
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.done = true THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN t.done = false THEN 1 ELSE 0 END) as pending,
        ROUND(
          CASE 
            WHEN COUNT(t.id) = 0 THEN 0
            ELSE (SUM(CASE WHEN t.done = true THEN 1 ELSE 0 END)::numeric / 
                  COUNT(t.id) * 100)
          END, 2
        ) as completion_rate
      FROM users u
      LEFT JOIN tasks t ON u.id = t.user_id
      WHERE u.status = 'active'
      GROUP BY u.id, u.username, u.status
      ORDER BY total_tasks DESC
      LIMIT 15
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error getting users comparison:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener comparativa de usuarios',
      error: error.message
    });
  }
};

export default {
  getGeneralStats,
  getTopUsersByTasks,
  getTasksStats,
  getUserProgress,
  getTrendsByDate,
  getInactiveUsers,
  getUsersComparison
};
