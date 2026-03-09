# 🧪 Guía de Prueba: Endpoints con Sequelize

## 🎯 Introducción

Has agregado exitosamente endpoints de prueba usando **Sequelize ORM** en tu proyecto. Estos endpoints están en `/api/v2/test/` y **NO interfieren** con tus rutas actuales.

---

## 🚀 Cómo Usar

### 1. **Iniciar el servidor**
```bash
npm run start:dev
```

El servidor debería iniciar en `http://localhost:3000`

---

## 📋 Endpoints Disponibles

### 🏠 **Información General**
```http
GET http://localhost:3000/api/v2/test
```

Muestra todos los endpoints disponibles y ejemplos.

---

### 👥 **Listar Usuarios (últimos 10)**
```http
GET http://localhost:3000/api/v2/test/users
```

**Compara con:** `GET /api/users` (tu versión actual con pg)

**Respuesta ejemplo:**
```json
{
  "success": true,
  "message": "Usuarios obtenidos con Sequelize ORM",
  "count": 10,
  "data": [
    {
      "id": 48,
      "username": "Fernando",
      "status": "active",
      "created_at": "2026-03-08T..."
    }
  ]
}
```

---

### 🔍 **Obtener Usuario por ID**
```http
GET http://localhost:3000/api/v2/test/users/8
```

Prueba con el ID de superman (8) o batman (9).

**Respuesta ejemplo:**
```json
{
  "success": true,
  "message": "Usuario obtenido con Sequelize ORM",
  "data": {
    "id": 8,
    "username": "superman",
    "status": "active",
    "created_at": "2026-03-08T...",
    "updated_at": "2026-03-08T..."
  }
}
```

---

### 📝 **Usuario con sus Tareas (JOIN automático)**
```http
GET http://localhost:3000/api/v2/test/users/8/tasks
```

Este endpoint es muy útil para ver el poder de Sequelize. Hace un JOIN automático sin escribir SQL.

**Respuesta ejemplo:**
```json
{
  "success": true,
  "message": "Usuario con tareas obtenido usando Sequelize JOIN",
  "data": {
    "user": {
      "id": 8,
      "username": "superman",
      "status": "active"
    },
    "tasks": [
      {
        "id": 1,
        "name": "Salvar Metrópolis",
        "done": false,
        "created_at": "2026-03-08T..."
      },
      {
        "id": 2,
        "name": "Detener a Lex Luthor",
        "done": false,
        "created_at": "2026-03-08T..."
      }
    ],
    "totalTasks": 4
  }
}
```

**✨ Ventaja de Sequelize:** El JOIN se hace automáticamente con `include`, no necesitas escribir la query SQL.

---

### 🔎 **Buscar Usuarios**
```http
GET http://localhost:3000/api/v2/test/search?q=super
```

Busca usuarios que contengan "super" en el username (case-insensitive).

**Otros ejemplos:**
- `?q=man` → encuentra "superman", "batman", "ironman", etc.
- `?q=bat` → encuentra "batman"

**Respuesta ejemplo:**
```json
{
  "success": true,
  "message": "Búsqueda usando Sequelize Op.iLike",
  "query": "super",
  "count": 1,
  "data": [
    {
      "id": 8,
      "username": "superman",
      "status": "active"
    }
  ]
}
```

---

### ✅ **Usuarios Activos**
```http
GET http://localhost:3000/api/v2/test/active-users
```

Solo usuarios con `status = 'active'`.

---

### ⏳ **Tareas Pendientes**
```http
GET http://localhost:3000/api/v2/test/tasks/pending
```

Todas las tareas con `done = false`, incluyendo información del usuario.

**Respuesta ejemplo:**
```json
{
  "success": true,
  "message": "Tareas pendientes con información de usuario (JOIN)",
  "count": 15,
  "data": [
    {
      "id": 1,
      "name": "Salvar Metrópolis",
      "done": false,
      "created_at": "2026-03-08T...",
      "user": {
        "id": 8,
        "username": "superman"
      }
    }
  ]
}
```

---

### 📊 **Estadísticas**
```http
GET http://localhost:3000/api/v2/test/stats
```

Resumen de usuarios y tareas usando agregaciones de Sequelize.

**Respuesta ejemplo:**
```json
{
  "success": true,
  "message": "Estadísticas usando Sequelize count()",
  "data": {
    "users": {
      "total": 22,
      "active": 19,
      "inactive": 3
    },
    "tasks": {
      "total": 25,
      "completed": 10,
      "pending": 15
    }
  }
}
```

---

## 🧪 Probar con PowerShell

### Usando `Invoke-RestMethod`

```powershell
# 1. Información general
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test" | ConvertTo-Json -Depth 5

# 2. Listar usuarios
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test/users" | ConvertTo-Json -Depth 3

# 3. Usuario específico
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test/users/8" | ConvertTo-Json -Depth 3

# 4. Usuario con tareas (el más interesante)
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test/users/8/tasks" | ConvertTo-Json -Depth 5

# 5. Buscar usuarios
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test/search?q=super" | ConvertTo-Json -Depth 3

# 6. Usuarios activos
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test/active-users" | ConvertTo-Json -Depth 3

# 7. Tareas pendientes
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test/tasks/pending" | ConvertTo-Json -Depth 4

# 8. Estadísticas
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test/stats" | ConvertTo-Json -Depth 3
```

---

## 🔄 Comparación con tus Rutas Actuales

| Concepto | Actual (pg) | Nuevo (Sequelize) |
|----------|-------------|-------------------|
| **Ruta base** | `/api/users` | `/api/v2/test/users` |
| **Queries** | SQL manual | Métodos ORM |
| **JOINs** | JOIN manual en SQL | `include` automático |
| **Búsqueda** | ILIKE en SQL | `Op.iLike` |
| **Agregaciones** | COUNT(*) en SQL | `Model.count()` |

---

## 💡 Ejercicios Sugeridos

### Ejercicio 1: Comparar Respuestas
Llama a tu endpoint actual y al de prueba:
```powershell
# Tu endpoint actual
Invoke-RestMethod -Uri "http://localhost:3000/api/users" | ConvertTo-Json -Depth 3

# Endpoint de prueba con Sequelize
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test/users" | ConvertTo-Json -Depth 3
```

**Pregunta:** ¿Qué diferencias notas en las respuestas?

### Ejercicio 2: Ver los Logs
Observa los logs en la consola cuando llamas a los endpoints. Verás:
- Las queries SQL que Sequelize genera automáticamente
- Cómo hace los JOINs

### Ejercicio 3: Buscar Superhéroes
Prueba buscar diferentes superhéroes:
```powershell
# Buscar "man"
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test/search?q=man"

# Buscar "captain"
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test/search?q=captain"

# Buscar "bat"
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test/search?q=bat"
```

### Ejercicio 4: Ver Tareas de un Usuario
Prueba con diferentes superhéroes:
```powershell
# Superman (probablemente ID 8)
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test/users/8/tasks"

# Batman (probablemente ID 9)
Invoke-RestMethod -Uri "http://localhost:3000/api/v2/test/users/9/tasks"
```

---

## 📝 Código Clave para Aprender

### JOIN Automático con Sequelize
```javascript
// En lugar de escribir:
// SELECT u.*, t.* FROM users u LEFT JOIN tasks t ON u.id = t.user_id

// Con Sequelize:
const user = await UserModel.findByPk(id, {
  include: [{
    model: TaskModel,
    as: 'tasks'
  }]
});
```

### Búsqueda con Operadores
```javascript
// En lugar de:
// SELECT * FROM users WHERE username ILIKE '%search%'

// Con Sequelize:
const users = await UserModel.findAll({
  where: {
    username: {
      [Op.iLike]: `%${search}%`
    }
  }
});
```

### Agregaciones
```javascript
// En lugar de:
// SELECT COUNT(*) FROM users WHERE status = 'active'

// Con Sequelize:
const count = await UserModel.count({
  where: { status: 'active' }
});
```

---

## ❓ FAQ

**P: ¿Estos endpoints reemplazan mis rutas actuales?**  
R: No, son solo para prueba y comparación. Tus rutas en `/api/*` siguen funcionando igual.

**P: ¿Puedo usar estos endpoints en producción?**  
R: Sí, pero están pensados como ejemplos. Si decides usar Sequelize, adapta los controladores a tus necesidades.

**P: ¿Cómo desactivo estos endpoints?**  
R: En `src/app.js`, comenta la línea: `app.use('/api/v2/test', testSequelizeRoutes);`

**P: ¿Por qué veo queries SQL en los logs?**  
R: Sequelize las muestra para que veas qué SQL genera. Puedes desactivarlo en `sequelize.config.js`.

---

## 🎯 Siguiente Paso

Después de probar estos endpoints, lee:
- [GUIA-APRENDIZAJE-PG-VS-SEQUELIZE.md](./GUIA-APRENDIZAJE-PG-VS-SEQUELIZE.md) para entender las diferencias
- [CARACTERISTICAS-AGREGADAS.md](./CARACTERISTICAS-AGREGADAS.md) para ver todo lo agregado

---

**¡Diviértete probando Sequelize! 🚀**
