import pool from '../config/db.js';
import logger from '../logs/logger.js';

// GET ALL TASKS
const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.id, t.name, t.done, t.user_id, u.username 
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.id ASC
    `);
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error getting all tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tareas',
      error: error.message
    });
  }
};

// GET TASK BY ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT t.id, t.name, t.done, t.user_id, u.username 
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error getting task by id:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tarea',
      error: error.message
    });
  }
};

// GET TASKS BY USER ID
const getTasksByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT t.id, t.name, t.done, t.user_id, u.username 
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.user_id = $1
      ORDER BY t.id ASC
    `, [userId]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error getting tasks by user id:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tareas del usuario',
      error: error.message
    });
  }
};

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const { name, done, user_id } = req.body;
    
    if (!name || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Name y user_id son requeridos'
      });
    }
    
    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    const result = await pool.query(
      'INSERT INTO tasks (name, done, user_id) VALUES ($1, $2, $3) RETURNING *',
      [name, done || false, user_id]
    );
    
    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear tarea',
      error: error.message
    });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, done, user_id } = req.body;
    
    // Build dynamic query
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    if (done !== undefined) {
      updates.push(`done = $${paramCount}`);
      values.push(done);
      paramCount++;
    }
    if (user_id !== undefined) {
      // Check if user exists
      const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
      if (userCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      updates.push(`user_id = $${paramCount}`);
      values.push(user_id);
      paramCount++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar'
      });
    }
    
    values.push(id);
    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar tarea',
      error: error.message
    });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar tarea',
      error: error.message
    });
  }
};

export default {
  getAllTasks,
  getTaskById,
  getTasksByUserId,
  createTask,
  updateTask,
  deleteTask
};
