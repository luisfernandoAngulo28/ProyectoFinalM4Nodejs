/**
 * Modelo de Tarea usando Sequelize ORM
 * Este es un ejemplo de cómo usar Sequelize para definir modelos
 * con relaciones (belongsTo)
 */

import { DataTypes } from 'sequelize';
import { sequelize } from './sequelize.config.js';

export const TaskModel = sequelize.define('tasks', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El nombre de la tarea es obligatorio',
      },
      notEmpty: {
        msg: 'El nombre no puede estar vacío',
      },
      len: {
        args: [1, 255],
        msg: 'El nombre debe tener entre 1 y 255 caracteres',
      }
    },
  },
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'El user_id es obligatorio',
      }
    }
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'tasks'
});

export default TaskModel;
