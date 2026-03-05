import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import logger from '../logs/logger.js';

// Middleware para verificar token JWT
export const verifyToken = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado. Acceso denegado.'
      });
    }

    // Formato esperado: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, env.jwt.secret);
    
    // Agregar información del usuario al request
    req.user = decoded;
    
    next();
  } catch (error) {
    logger.error('Error verifying token:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error al verificar token'
    });
  }
};

// Middleware opcional - no requiere token pero lo valida si existe
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, env.jwt.secret);
        req.user = decoded;
      }
    }
    
    next();
  } catch (error) {
    // Si hay error, continua sin usuario
    next();
  }
};

// Alias para compatibilidad
export const protect = verifyToken;
