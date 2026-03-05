# 🚀 API REST - CRUD Users & Tasks

---

## 🎓 INFORMACIÓN ACADÉMICA

**UNIVERSIDAD SIMÓN I. PATIÑO**  
**ESCUELA DE POSTGRADO**

### PROYECTO FINAL
**Sistema de Gestión de Usuarios y Tareas**

**Diplomado:** DIPLOMADO EN FULLSTACK DEVELOPER BACK END Y FRONT END  
**Módulo 4:** ARQUITECTURA DESARROLLO BACKEND CON NODEJS

**Docente:** Ing. Trigo Vargas Carlos Ariel  
**Estudiante:** Ing. Angulo Heredia Luis Fernando

**Fecha:** 7 de marzo de 2026  
**País:** Bolivia 🇧🇴

---

## 📄 Descripción del Proyecto

API REST completa para la gestión de usuarios y tareas con Node.js, Express y PostgreSQL. Proyecto desarrollado como trabajo final del Módulo 4 del Diplomado en Fullstack Developer.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Prerequisitos](#-prerequisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Documentación Swagger](#-documentación-swagger)
- [Seguridad](#-seguridad)
- [Estructura del Proyecto](#-estructura-del-proyecto)

## ✨ Características

- ✅ CRUD completo de Usuarios
- ✅ CRUD completo de Tareas
- ✅ API de paginación con búsqueda y ordenamiento
- ✅ Autenticación JWT (login/register)
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Validaciones avanzadas con express-validator
- ✅ Protección con CORS y Helmet
- ✅ Rate limiting (100 peticiones/15min)
- ✅ Logger con Pino
- ✅ Manejo centralizado de errores
- ✅ Índices en base de datos para mejor performance
- ✅ ESLint para código limpio
- ✅ Variables de entorno
- ✅ Documentación Swagger

## 🛠 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación con JSON Web Tokens
- **Bcrypt** - Encriptación de contraseñas
- **Express Validator** - Validación de datos
- **Pino** - Logger de alto rendimiento
- **Morgan** - HTTP request logger
- **CORS & Helmet** - Seguridad
- **Express Rate Limit** - Limitación de peticiones
- **ESLint** - Linter para código limpio

## 📦 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd node-base-diplomado
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Crear base de datos**
```bash
# Acceder a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE BDCrudEstudiante;

# Salir
\q
```

4. **Ejecutar script SQL**
```bash
$env:PGPASSWORD='12345678'; psql -U postgres -h localhost -d BDCrudEstudiante -f database.sql
```

## ⚙️ Configuración

1. **Copiar el archivo de variables de entorno**
```bash
cp .env.sample .env
```

2. **Configurar variables de entorno en `.env`**
```env
PORT=3000

# Database Configuration
DB_USER=postgres
DB_HOST=localhost

# JWT Configuration
JWT_SECRET=mi_clave_secreta_super_segura_2026_diplomado
JWT_EXPIRES_IN=24h
DB_NAME=BDCrudEstudiante
DB_PASSWORD=12345678
DB_PORT=5432
```

## 🚀 Uso

### Modo Desarrollo (con auto-reload)
```bash
npm run start:dev
```

### Modo Producción
```bash
npm start
```

### Lint (verificar código)
```bash
npm run lint
```

### Lint y auto-fix
```bash
npm run lint:fix
```

El servidor estará disponible en: `http://localhost:3000`

### Health Check
```bash
curl http://localhost:3000/health
```

## 📚 API Endpoints

### � Authentication

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/me` | Obtener usuario actual | Sí |

**Ejemplo de Login:**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "status": "active"
  }
}
```

**Usar el token en otras peticiones:**
```bash
GET http://localhost:3000/api/auth/me
Authorization: Bearer <tu-token-aqui>
```

### �👤 Users

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Obtener todos los usuarios |
| GET | `/api/users/:id` | Obtener usuario por ID |
| POST | `/api/users` | Crear nuevo usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |
| GET | `/api/users/list/pagination` | Listar con paginación |

### ✅ Tasks

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tasks` | Obtener todas las tareas |
| GET | `/api/tasks/:id` | Obtener tarea por ID |
| GET | `/api/tasks/user/:userId` | Obtener tareas por usuario |
| POST | `/api/tasks` | Crear nueva tarea |
| PUT | `/api/tasks/:id` | Actualizar tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea |

### 🔍 API de Paginación (30 pts)

**GET** `/api/users/list/pagination`

**Query Parameters:**

| Parámetro | Tipo | Default | Descripción | Valores Permitidos |
|-----------|------|---------|-------------|-------------------|
| `page` | integer | 1 | Número de página | - |
| `limit` | integer | 10 | Registros por página | 5, 10, 15, 20 |
| `search` | string | "" | Búsqueda por username (ILIKE) | - |
| `orderBy` | string | "id" | Campo para ordenar | id, username, status |
| `orderDir` | string | "DESC" | Dirección del orden | ASC, DESC |

**Ejemplo:**
```bash
GET http://localhost:3000/api/users/list/pagination?page=1&limit=5&search=user&orderBy=username&orderDir=DESC
```

**Respuesta:**
```json
{
  "success": true,
  "total": 20,
  "page": 1,
  "pages": 4,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "status": "active"
    }
  ]
}
```

## 📖 Documentación Swagger

Para ver la documentación completa de todas las APIs:

1. Abre el archivo `swagger.yaml`
2. Copia todo su contenido
3. Ve a https://editor.swagger.io/
4. Pega el contenido en el editor
5. Verás todas las APIs con ejemplos de request/response

## 🔒 Seguridad

Este proyecto implementa múltiples capas de seguridad:

- **JWT**: Autenticación mediante JSON Web Tokens con expiración configurable
- **Bcrypt**: Las contraseñas se encriptan con bcrypt (10 salt rounds)
- **Helmet**: Protección contra vulnerabilidades web comunes
- **CORS**: Control de acceso entre orígenes
- **Rate Limiting**: Máximo 100 peticiones por IP cada 15 minutos
- **Validación de entrada**: Validaciones robustas con express-validator
- **Sanitización**: Limpieza de datos de entrada
- **Manejo de errores**: Middleware centralizado que no expone información sensible
- **Índices en BD**: Optimización de consultas para mejor performance

## 📁 Estructura del Proyecto

```
node-base-diplomado/
├── src/
│   ├── app.js                    # Configuración de Express
│   ├── index.js                  # Punto de entrada
│   ├── config/
│   │   ├── db.js                 # Configuración de PostgreSQL
│   │   └── env.js                # Variables de entorno
│   ├── controllers/
│   │   ├── auth.controller.js    # Controladores de autenticación
│   │   ├── user.controller.js    # Controladores de usuarios
│   │   └── task.controller.js    # Controladores de tareas
│   ├── routes/
│   │   ├── auth.route.js         # Rutas de autenticación
│   │   ├── users.route.js        # Rutas de usuarios
│   │   └── tasks.route.js        # Rutas de tareas
│   ├── middlewares/
│   │   ├── auth.js               # Middleware de autenticación JWT
│   │   ├── validators.js         # Validaciones con express-validator
│   │   └── errorHandler.js       # Manejo de errores
│   └── logs/
│       └── logger.js             # Configuración de Pino
├── database.sql                   # Script de creación de BD
├── add-indexes.sql                # Script de índices
├── swagger.yaml                   # Documentación OpenAPI
├── .env                          # Variables de entorno
├── .env.sample                   # Ejemplo de variables
├── .eslintrc.json                # Configuración ESLint
├── .gitignore                    # Archivos ignorados por Git
├── package.json                  # Dependencias del proyecto
├── SCRIPTS.md                    # Comandos útiles
└── README.md                     # Este archivo
```
│   │   └── task.controller.js    # Controladores de tareas
│   ├── routes/
│   │   ├── users.route.js        # Rutas de usuarios
│   │   └── tasks.route.js        # Rutas de tareas
│   ├── middlewares/
│   │   └── errorHandler.js       # Manejo de errores
│   └── logs/
│       └── logger.js             # Configuración de Pino
├── database.sql                   # Script de creación de BD
├── swagger.yaml                   # Documentación OpenAPI
├── .env                          # Variables de entorno
├── .env.sample                   # Ejemplo de variables
├── .gitignore                    # Archivos ignorados por Git
├── package.json                  # Dependencias del proyecto
└── README.md                     # Este archivo
```

## 🧪 Ejemplos de Uso

### Crear un Usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevouser",
    "password": "password123",
    "status": "active"
  }'
```

### Crear una Tarea
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Completar proyecto",
    "done": false,
    "user_id": 1
  }'
```

### Actualizar Usuario
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'
```

## 📊 Base de Datos

### Modelo de Datos

**Tabla: users**
- `id` (SERIAL, PRIMARY KEY)
- `username` (VARCHAR, UNIQUE)
- `password` (VARCHAR, encrypted)
- `status` (VARCHAR)

**Tabla: tasks**
- `id` (SERIAL, PRIMARY KEY)
- `name` (VARCHAR)
- `done` (BOOLEAN)
- `user_id` (INTEGER, FOREIGN KEY → users.id)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia ISC.

## 👨‍💻 Autor

Diplomado Node.js - Proyecto Final

## 🎯 Evaluación

- ✅ **50 pts**: CRUD completo de Users y Tasks
- ✅ **30 pts**: API de paginación con búsqueda y ordenamiento
- ✅ **Extras Implementados**:
  - 🔐 Autenticación JWT completa
  - ✅ Validaciones avanzadas con express-validator
  - 🔒 Múltiples capas de seguridad (bcrypt, CORS, Helmet, Rate Limit)
  - 📊 Índices en base de datos para mejor performance
  - 🧹 ESLint configurado
  - 📖 Documentación completa (README + Swagger)
  - ⚙️ Manejo profesional de errores
  - 📝 Logger avanzado con Pino

**Total: 100+ puntos con mejoras profesionales**

---

⭐ Si te fue útil este proyecto, no olvides darle una estrella en GitHub!
