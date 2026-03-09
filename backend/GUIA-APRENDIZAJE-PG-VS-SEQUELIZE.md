# 📚 Guía de Aprendizaje: Driver pg vs Sequelize ORM

## 🎯 Introducción

Este documento explica las diferencias entre usar el **driver pg nativo** (tu implementación actual) y **Sequelize ORM** (agregado del proyecto base para aprendizaje).

**⚠️ IMPORTANTE:** Los archivos de Sequelize agregados son **EJEMPLOS EDUCATIVOS**. Tu proyecto actual sigue funcionando con el driver pg nativo sin cambios.

---

## 📂 Archivos Agregados

### 1. **Modelos Sequelize** (`src/models/`)
```
src/models/
├── sequelize.config.js    # Configuración de Sequelize
├── user.model.js          # Modelo de Usuario
├── task.model.js          # Modelo de Tarea
└── index.js               # Exportación y relaciones
```

### 2. **Validadores Joi** (`src/validate/`)
```
src/validate/
├── user.validate.js       # Schemas de validación para usuarios
├── task.validate.js       # Schemas de validación para tareas
└── validate.middleware.js # Middleware de validación con Joi
```

### 3. **Utilidades Comunes** (`src/common/`)
```
src/common/
├── bcrypt.utils.js        # Funciones para hash de contraseñas
└── index.js               # Exportaciones
```

### 4. **Ejemplos de Controladores**
```
src/controllers/
└── user.controller.sequelize.example.js  # Ejemplos con Sequelize
```

---

## 🔄 Comparación: Driver pg vs Sequelize

### **Enfoque Actual: Driver pg Nativo**

#### ✅ Ventajas:
- Mayor control sobre las queries SQL
- Mejor rendimiento en queries complejas
- Menos overhead y dependencias
- Más flexible para optimizaciones
- Query directo sin abstracción

#### Ejemplo actual (user.controller.js):
```javascript
// Consulta con driver pg
const result = await pool.query(
  'SELECT id, username, status FROM users WHERE id = $1',
  [id]
);
const user = result.rows[0];
```

---

### **Nuevo: Sequelize ORM**

#### ✅ Ventajas:
- Sintaxis más limpia y orientada a objetos
- Validaciones automáticas en el modelo
- Menos código SQL manual
- Migraciones y seeders incluidos
- Relaciones entre modelos más fáciles
- Hooks para lógica automática (ej: encriptar contraseñas)

#### Ejemplo con Sequelize:
```javascript
// Consulta con Sequelize
const user = await UserModel.findByPk(id, {
  attributes: ['id', 'username', 'status']
});
```

---

## 📖 Ejemplos Prácticos

### 1. **Obtener todos los usuarios con búsqueda**

#### Con pg (actual):
```javascript
const query = `
  SELECT id, username, status, created_at 
  FROM users 
  WHERE username ILIKE $1
  ORDER BY id DESC
  LIMIT $2 OFFSET $3
`;
const result = await pool.query(query, [`%${search}%`, limit, offset]);
const users = result.rows;
```

#### Con Sequelize:
```javascript
const users = await UserModel.findAll({
  attributes: ['id', 'username', 'status', 'created_at'],
  where: {
    username: {
      [Op.iLike]: `%${search}%`
    }
  },
  order: [['id', 'DESC']],
  limit,
  offset
});
```

---

### 2. **Crear un usuario**

#### Con pg (actual):
```javascript
// Encriptar contraseña manualmente
const hashedPassword = await bcrypt.hash(password, 10);

// Insertar con SQL
const query = `
  INSERT INTO users (username, password, status) 
  VALUES ($1, $2, $3) 
  RETURNING id, username, status
`;
const result = await pool.query(query, [username, hashedPassword, 'activo']);
const newUser = result.rows[0];
```

#### Con Sequelize:
```javascript
// La contraseña se encripta automáticamente en el hook beforeCreate
const newUser = await UserModel.create({
  username,
  password,
  status: 'activo'
});
// toJSON() oculta automáticamente la contraseña
```

---

### 3. **Obtener usuario con sus tareas (JOIN)**

#### Con pg (actual):
```javascript
const query = `
  SELECT u.id, u.username, 
         json_agg(json_build_object(
           'id', t.id, 
           'title', t.title,
           'status', t.status
         )) as tasks
  FROM users u
  LEFT JOIN tasks t ON t.user_id = u.id
  WHERE u.id = $1
  GROUP BY u.id
`;
const result = await pool.query(query, [userId]);
const userWithTasks = result.rows[0];
```

#### Con Sequelize:
```javascript
const userWithTasks = await UserModel.findByPk(userId, {
  attributes: ['id', 'username'],
  include: [{
    model: TaskModel,
    as: 'tasks',
    attributes: ['id', 'title', 'status']
  }]
});
```

---

### 4. **Validaciones**

#### Con express-validator (actual):
```javascript
import { body, validationResult } from 'express-validator';

// En la ruta
router.post('/users', [
  body('username').isAlphanumeric().isLength({ min: 3, max: 50 }),
  body('password').isLength({ min: 3 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Continuar...
});
```

#### Con Joi (nuevo):
```javascript
import validate from '../validate/validate.middleware.js';
import { userRegisterSchema } from '../validate/user.validate.js';

// En la ruta
router.post('/users', validate(userRegisterSchema), createUser);

// Schema definido en user.validate.js
export const userRegisterSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required()
});
```

---

## 🚀 Cómo Probar Sequelize

### Paso 1: Instalar dependencias
```bash
cd backend
npm install
```

Las dependencias ya están agregadas en `package.json`:
- `sequelize`: ^6.37.7
- `pg-hstore`: ^2.3.4
- `joi`: ^18.0.2

### Paso 2: Probar conexión de Sequelize
Crea un archivo de prueba `test-sequelize.js`:

```javascript
import { sequelize } from './src/models/sequelize.config.js';

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión con Sequelize exitosa');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
```

Ejecuta:
```bash
node test-sequelize.js
```

### Paso 3: Ver ejemplos de controladores
Abre: `src/controllers/user.controller.sequelize.example.js`

Compara cada función con su equivalente en `src/controllers/user.controller.js`

---

## 📊 Cuándo usar cada uno

### Usa **Driver pg Nativo** cuando:
- Necesitas queries SQL muy complejas
- Requieres máximo rendimiento
- Prefieres control total sobre las queries
- El proyecto es pequeño y simple
- Quieres menos dependencias

### Usa **Sequelize ORM** cuando:
- El proyecto tiene muchas relaciones complejas
- Quieres desarrollo más rápido
- Necesitas migraciones de base de datos
- El equipo prefiere POO sobre SQL
- Quieres validaciones automáticas

---

## 🔧 Integración Opcional

Si quieres usar Sequelize en tu proyecto actual (sin romper nada):

### 1. Crear una ruta alternativa
```javascript
// En app.js o un nuevo archivo de rutas
import { getAllUsersSequelize } from './controllers/user.controller.sequelize.example.js';

// Ruta con Sequelize (ejemplo)
router.get('/api/v2/users', getAllUsersSequelize);

// Rutas actuales siguen funcionando
router.get('/api/users', getAllUsers); // Con pg nativo
```

### 2. Usar ambos enfoques en paralelo
Tu proyecto actual:
- `/api/users` → usa pg nativo (actual)
  
Nuevas rutas de prueba:
- `/api/v2/users` → usa Sequelize (opcional)

---

## 📝 Ejercicios de Aprendizaje

### Ejercicio 1: Conversión Simple
Convierte esta query pg a Sequelize:
```javascript
// pg
const result = await pool.query(
  'SELECT * FROM users WHERE status = $1',
  ['activo']
);

// Tu respuesta con Sequelize:
// const users = await UserModel.findAll({ ... });
```

<details>
<summary>Ver solución</summary>

```javascript
const users = await UserModel.findAll({
  where: { status: 'activo' }
});
```
</details>

### Ejercicio 2: Validación con Joi
Crea un schema para validar creación de tareas con:
- title (requerido, 3-200 caracteres)
- description (opcional, máx 1000 caracteres)
- status (opcional, valores: 'pendiente', 'en proceso', 'completada')

<details>
<summary>Ver solución</summary>

```javascript
import Joi from 'joi';

export const taskCreateSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(1000).optional().allow(''),
  status: Joi.string().valid('pendiente', 'en proceso', 'completada').optional()
});
```
</details>

---

## 🎓 Recursos de Aprendizaje

### Sequelize
- Documentación oficial: https://sequelize.org/docs/v6/
- Guía de modelos: https://sequelize.org/docs/v6/core-concepts/model-basics/
- Consultas: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/

### Joi
- Documentación oficial: https://joi.dev/api/
- Validaciones comunes: https://joi.dev/api/?v=17.9.1#string

---

## ❓ FAQ

**P: ¿Debo migrar mi proyecto actual a Sequelize?**
R: No necesariamente. Tu proyecto funciona bien con pg. Estos archivos son solo para aprender.

**P: ¿Puedo usar ambos en el mismo proyecto?**
R: Sí, pero no es recomendable mezclarlos para las mismas tablas. Elige uno.

**P: ¿Cuál es mejor?**
R: Depende del proyecto. Para aplicaciones empresariales grandes, Sequelize. Para microservicios pequeños, pg nativo.

**P: ¿Los archivos nuevos afectan mi proyecto?**
R: No. Solo agregan dependencias al package.json. Tu código actual no tiene cambios.

---

## 📌 Próximos Pasos

1. ✅ Lee esta guía completa
2. ✅ Explora los archivos en `src/models/` y `src/validate/`
3. ✅ Compara `user.controller.js` con `user.controller.sequelize.example.js`
4. ✅ Prueba la conexión de Sequelize
5. ✅ Intenta crear un endpoint de prueba con Sequelize
6. ✅ Decide qué enfoque prefieres para futuros proyectos

---

¿Tienes preguntas? Consulta los archivos de ejemplo o la documentación oficial.

**Autor de la guía:** GitHub Copilot  
**Fecha:** Marzo 2026
