import pool from '../config/db.js';
import logger from '../logs/logger.js';
import bcrypt from 'bcrypt';

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, status FROM users ORDER BY id ASC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error getting all users:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, username, status FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error getting user by id:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

// CREATE USER
const createUser = async (req, res) => {
  try {
    const { username, password, status } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username y password son requeridos'
      });
    }
    
    // Encriptar password con bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const result = await pool.query(
      'INSERT INTO users (username, password, status) VALUES ($1, $2, $3) RETURNING id, username, status',
      [username, hashedPassword, status || 'active']
    );
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({
        success: false,
        message: 'El username ya existe'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, status } = req.body;
    
    // Build dynamic query
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (username !== undefined) {
      updates.push(`username = $${paramCount}`);
      values.push(username);
      paramCount++;
    }
    if (password !== undefined) {
      // Encriptar password con bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updates.push(`password = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar'
      });
    }
    
    values.push(id);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, username, status`;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'El username ya existe'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, username', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

// GET USERS WITH PAGINATION
const getUsersPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const orderBy = req.query.orderBy || 'id';
    const orderDir = req.query.orderDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const status = req.query.status || ''; // Filtro por status
    
    // Validate limit
    if (![5, 10, 15, 20].includes(limit)) {
      return res.status(400).json({
        success: false,
        message: 'Limit debe ser 5, 10, 15 o 20'
      });
    }
    
    // Validate orderBy
    if (!['id', 'username', 'status'].includes(orderBy)) {
      return res.status(400).json({
        success: false,
        message: 'orderBy debe ser id, username o status'
      });
    }
    
    // Validate status if provided
    if (status && !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'status debe ser active o inactive'
      });
    }
    
    const offset = (page - 1) * limit;
    
    // Build query
    const whereClauses = [];
    const queryParams = [];
    let paramCount = 1;
    
    if (search) {
      whereClauses.push(`username ILIKE $${paramCount}`);
      queryParams.push(`%${search}%`);
      paramCount++;
    }
    
    if (status) {
      whereClauses.push(`status = $${paramCount}`);
      queryParams.push(status);
      paramCount++;
    }
    
    const whereClause = whereClauses.length > 0 
      ? 'WHERE ' + whereClauses.join(' AND ') 
      : '';
    
    // Count total records
    const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);
    
    // Get paginated data
    const dataQuery = `
      SELECT id, username, status, created_at, updated_at
      FROM users 
      ${whereClause} 
      ORDER BY ${orderBy} ${orderDir} 
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    queryParams.push(limit, offset);
    
    const dataResult = await pool.query(dataQuery, queryParams);
    
    const pages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      total,
      page,
      pages,
      data: dataResult.rows
    });
  } catch (error) {
    logger.error('Error getting users pagination:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios paginados',
      error: error.message
    });
  }
};

// GET USER WITH TASKS
const getUserWithTasks = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user
    const userResult = await pool.query(
      'SELECT id, username, status FROM users WHERE id = $1',
      [id]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    const user = userResult.rows[0];
    
    // Get user tasks
    const tasksResult = await pool.query(
      'SELECT name, done FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [id]
    );
    
    res.json({
      success: true,
      username: user.username,
      tasks: tasksResult.rows
    });
  } catch (error) {
    logger.error('Error getting user with tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario con tareas',
      error: error.message
    });
  }
};

// CREATE BULK USERS - Crear múltiples usuarios
const createBulkUsers = async (req, res) => {
  try {
    const { users } = req.body;
    
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un array de usuarios'
      });
    }
    
    // Validar cada usuario
    for (const user of users) {
      if (!user.username || !user.password) {
        return res.status(400).json({
          success: false,
          message: 'Cada usuario debe tener username y password'
        });
      }
    }
    
    const createdUsers = [];
    const errors = [];
    
    // Procesar cada usuario
    for (const user of users) {
      try {
        const { username, password, status } = user;
        
        // Encriptar password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const result = await pool.query(
          'INSERT INTO users (username, password, status) VALUES ($1, $2, $3) RETURNING id, username, status',
          [username, hashedPassword, status || 'active']
        );
        
        createdUsers.push(result.rows[0]);
      } catch (error) {
        if (error.code === '23505') {
          errors.push({
            username: user.username,
            error: 'El username ya existe'
          });
        } else {
          errors.push({
            username: user.username,
            error: error.message
          });
        }
      }
    }
    
    res.status(201).json({
      success: true,
      message: `${createdUsers.length} usuarios creados exitosamente`,
      data: createdUsers,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    logger.error('Error creating bulk users:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuarios',
      error: error.message
    });
  }
};

// PATCH USER - Actualizar parcialmente un usuario
const patchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, status } = req.body;
    
    // Build dynamic query
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (username !== undefined) {
      updates.push(`username = $${paramCount}`);
      values.push(username);
      paramCount++;
    }
    if (password !== undefined) {
      // Encriptar password con bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updates.push(`password = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar'
      });
    }
    
    values.push(id);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, username, status`;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error patching user:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'El username ya existe'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersPagination,
  getUserWithTasks,
  createBulkUsers,
  patchUser
};