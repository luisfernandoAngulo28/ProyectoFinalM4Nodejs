import pool from '../config/db.js';
import logger from '../logs/logger.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

// LOGIN - Autenticación de usuario
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username y password son requeridos'
      });
    }
    
    // Buscar usuario en la base de datos
    const result = await pool.query(
      'SELECT id, username, password, status FROM users WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    const user = result.rows[0];
    
    // Verificar si el usuario está activo
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }
    
    // Comparar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        status: user.status
      },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );
    
    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        status: user.status
      }
    });
  } catch (error) {
    logger.error('Error in login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// REGISTER - Registro de nuevo usuario (equivalente a createUser pero retorna token)
const register = async (req, res) => {
  try {
    const { username, password, status } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username y password son requeridos'
      });
    }
    
    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }
    
    // Encriptar password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const result = await pool.query(
      'INSERT INTO users (username, password, status) VALUES ($1, $2, $3) RETURNING id, username, status',
      [username, hashedPassword, status || 'active']
    );
    
    const user = result.rows[0];
    
    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        status: user.status
      },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user
    });
  } catch (error) {
    logger.error('Error in register:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'El username ya existe'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

// GET CURRENT USER - Obtener información del usuario autenticado
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      'SELECT id, username, status FROM users WHERE id = $1',
      [userId]
    );
    
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
    logger.error('Error getting current user:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario actual',
      error: error.message
    });
  }
};

export default {
  login,
  register,
  getCurrentUser
};
