/**
 * Modelo de Usuario usando Sequelize ORM
 * Este es un ejemplo de cómo usar Sequelize para definir modelos
 * en lugar de usar queries SQL directas con el driver pg
 */

import { DataTypes } from 'sequelize';
import { sequelize } from './sequelize.config.js';
import bcrypt from 'bcrypt';

export const UserModel = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'El username es obligatorio',
      },
      notEmpty: {
        msg: 'El username no puede estar vacío',
      },
      len: {
        args: [3, 100],
        msg: 'El username debe tener entre 3 y 100 caracteres',
      }
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'La contraseña es obligatoria',
      },
      notEmpty: {
        msg: 'La contraseña no puede estar vacía',
      },
    },
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'active',
    validate: {
      isIn: {
        args: [['active', 'inactive']],
        msg: 'El status debe ser "active" o "inactive"',
      }
    },
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'users',
  // Hooks para encriptar contraseña automáticamente
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Método de instancia para verificar contraseña
UserModel.prototype.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método de instancia para ocultar contraseña en JSON
UserModel.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

export default UserModel;
