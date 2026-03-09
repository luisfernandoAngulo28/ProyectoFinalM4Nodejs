/**
 * Utilidades para encriptación de contraseñas usando bcrypt
 * Estas funciones centralizan la lógica de hash y comparación
 */

import bcrypt from 'bcrypt';
import logger from '../logs/logger.js';

/**
 * Número de rondas de sal para bcrypt
 * Valor recomendado: entre 10 y 12
 * A mayor número, más seguro pero más lento
 */
const SALT_ROUNDS = 10;

/**
 * Encripta un texto usando bcrypt
 * @param {string} text - Texto plano a encriptar (generalmente una contraseña)
 * @returns {Promise<string>} Texto encriptado (hash)
 * @throws {Error} Si hay un error en la encriptación
 */
export const hashPassword = async (text) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(text, salt);
    return hash;
  } catch (error) {
    logger.error('Error al encriptar contraseña:', error);
    throw new Error('Error al procesar la contraseña');
  }
};

/**
 * Compara un texto plano con un hash
 * @param {string} text - Texto plano (contraseña ingresada)
 * @param {string} hash - Hash almacenado en la base de datos
 * @returns {Promise<boolean>} true si coinciden, false si no
 * @throws {Error} Si hay un error en la comparación
 */
export const comparePassword = async (text, hash) => {
  try {
    const isMatch = await bcrypt.compare(text, hash);
    return isMatch;
  } catch (error) {
    logger.error('Error al comparar contraseña:', error);
    throw new Error('Error al verificar la contraseña');
  }
};

/**
 * Verifica si un hash es válido
 * @param {string} hash - Hash a verificar
 * @returns {boolean} true si es un hash válido de bcrypt
 */
export const isValidHash = (hash) => {
  if (!hash || typeof hash !== 'string') return false;
  // Un hash de bcrypt tiene este formato: $2a$ o $2b$ seguido de 60 caracteres
  return /^\$2[ayb]\$.{56}$/.test(hash);
};

/**
 * Genera un hash sincrónico (úsalo solo si es necesario)
 * Nota: La versión asíncrona (hashPassword) es preferible
 * @param {string} text - Texto a encriptar
 * @returns {string} Hash generado
 */
export const hashPasswordSync = (text) => {
  try {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    return bcrypt.hashSync(text, salt);
  } catch (error) {
    logger.error('Error al encriptar contraseña (sync):', error);
    throw new Error('Error al procesar la contraseña');
  }
};

// Alias para compatibilidad con el proyecto base
export const encritpar = hashPassword;
export const comparar = comparePassword;

export default {
  hashPassword,
  comparePassword,
  isValidHash,
  hashPasswordSync,
  encritpar,
  comparar,
  SALT_ROUNDS
};
