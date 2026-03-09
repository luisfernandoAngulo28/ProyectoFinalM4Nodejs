/**
 * Índice de Modelos Sequelize
 * Aquí se definen las relaciones entre los modelos
 */

import { sequelize } from './sequelize.config.js';
import UserModel from './user.model.js';
import TaskModel from './task.model.js';

// Definir relaciones entre modelos
// Un usuario tiene muchas tareas
UserModel.hasMany(TaskModel, {
  foreignKey: 'user_id',
  as: 'tasks'
});

// Una tarea pertenece a un usuario
TaskModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user'
});

// Función para sincronizar modelos con la base de datos
// ⚠️ NOTA: Usar solo en desarrollo, no en producción
export const syncModels = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error);
    throw error;
  }
};

export { sequelize, UserModel, TaskModel };
export default { sequelize, UserModel, TaskModel, syncModels };
