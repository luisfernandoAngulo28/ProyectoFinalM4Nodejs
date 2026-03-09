# 🚀 Proyecto Final - Sistema de Gestión de Usuarios y Tareas

<div align="center">

[![Frontend - Vercel](https://img.shields.io/badge/Frontend-Live%20on%20Vercel-black?style=for-the-badge&logo=vercel)](https://proyecto-final-m4-nodejs.vercel.app)
[![Backend - Render](https://img.shields.io/badge/Backend-Live%20on%20Render-46E3B7?style=for-the-badge&logo=render)](https://proyectofinalm4nodejs.onrender.com/api-docs)
[![Database - Neon](https://img.shields.io/badge/Database-Neon%20PostgreSQL-00E699?style=for-the-badge&logo=postgresql)](https://neon.tech)

### 🌐 Aplicación Desplegada y Funcionando

**Frontend:** [https://proyecto-final-m4-nodejs.vercel.app](https://proyecto-final-m4-nodejs.vercel.app)  
**Backend API:** [https://proyectofinalm4nodejs.onrender.com](https://proyectofinalm4nodejs.onrender.com)  
**Documentación:** [https://proyectofinalm4nodejs.onrender.com/api-docs](https://proyectofinalm4nodejs.onrender.com/api-docs)

</div>

---

## 🎓 INFORMACIÓN ACADÉMICA

**UNIVERSIDAD SIMÓN I. PATIÑO**  
**ESCUELA DE POSTGRADO**

### PROYECTO FINAL
**Sistema de Gestión de Usuarios y Tareas - Fullstack**

**Diplomado:** DIPLOMADO EN FULLSTACK DEVELOPER BACK END Y FRONT END  
**Módulo 4:** ARQUITECTURA DESARROLLO BACKEND CON NODEJS

**Docente:** Ing. Trigo Vargas Carlos Ariel  
**Estudiante:** Ing. Angulo Heredia Luis Fernando

**Fecha de Entrega:** 7 de marzo de 2026  
**País:** Bolivia 🇧🇴

---

## 📄 Descripción del Proyecto

Aplicación web fullstack completa para la gestión de usuarios y tareas, desarrollada como proyecto final del Módulo 4 del Diplomado en Fullstack Developer. El sistema implementa una API REST robusta con Node.js y Express, complementada con un dashboard moderno en React.

## 🏗️ Estructura del Monorepo

```
ProyectoFinalM4Nodejs/
├── backend/                 # API REST con Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── config/         # Configuración DB y variables entorno
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middlewares/    # Autenticación y validaciones
│   │   ├── routes/         # Definición de rutas
│   │   └── logs/           # Sistema de logging
│   ├── database.sql        # Schema y datos iniciales
│   ├── swagger.yaml        # Documentación API
│   └── package.json
│
├── frontend/               # Dashboard React + Vite
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Cliente API (Axios)
│   │   └── App.jsx
│   └── package.json
│
├── README.md               # Este archivo
└── EXAMEN-FINAL-RESUMEN.md # Documentación completa del examen
```

---

## ✨ Características Principales

### 🔧 Backend (Node.js + Express)

- ✅ **API REST completa** con arquitectura MVC
- ✅ **CRUD** de Usuarios y Tareas
- ✅ **Autenticación JWT** (login/register)
- ✅ **API de paginación** con búsqueda, filtros y ordenamiento
- ✅ **Sistema de reportes** con 7 endpoints analytics
- ✅ **Seguridad:** Bcrypt, Helmet, CORS, Rate Limiting
- ✅ **Validaciones** con express-validator
- ✅ **Base de datos PostgreSQL** optimizada con índices
- ✅ **Logging** con Pino
- ✅ **Documentación Swagger**

### 🎨 Frontend (React + Vite)

- ✅ **React 19** con Vite para desarrollo rápido
- ✅ **Dashboard interactivo** con estadísticas
- ✅ **Gestión completa** de usuarios y tareas
- ✅ **Paginación avanzada** con filtros en tiempo real
- ✅ **Sistema de reportes** con visualizaciones
- ✅ **Diseño moderno** con gradientes y animaciones
- ✅ **Responsive design** para móviles y desktop
- ✅ **Autenticación** con manejo de tokens JWT

---

## 🛠 Tecnologías Utilizadas

### Backend
- **Node.js** v24+
- **Express** v5
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas
- **Pino** - Logging
- **Express Validator** - Validaciones
- **Swagger UI** - Documentación

### Frontend
- **React** 19
- **Vite** 8
- **React Router** v7
- **Axios** - Cliente HTTP
- **CSS3** - Estilos modernos

### Cloud & Deployment
- **Vercel** - Hosting del frontend
- **Render** - Hosting del backend (Node.js)
- **Neon** - Base de datos PostgreSQL serverless
- **GitHub** - Control de versiones y CI/CD

---

## 📦 Instalación y Configuración

### Prerrequisitos

```bash
Node.js >= 18
PostgreSQL >= 14
Git
```

### 1. Clonar el repositorio

```bash
git clone https://github.com/luisfernandoAngulo28/ProyectoFinalM4Nodejs.git
cd ProyectoFinalM4Nodejs
```

### 2. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.sample .env
```

Editar el archivo `.env` con tus credenciales:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=BDCrudEstudiante
JWT_SECRET=tu_secreto_jwt_super_seguro
```

### 3. Configurar la Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE BDCrudEstudiante;

# Conectar a la base de datos
\c BDCrudEstudiante

# Ejecutar script de base de datos
\i database.sql

# Salir de PostgreSQL
\q

# Hashear contraseñas (ejecutar desde la carpeta backend)
node fix-passwords.js
```

### 4. Configurar el Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install
```

---

## 🚀 Ejecución del Proyecto

### Opción 1: Ejecutar ambos proyectos (recomendado)

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
El backend estará corriendo en: `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
El frontend estará corriendo en: `http://localhost:5173`

### Opción 2: Ejecutar solo el Backend

```bash
cd backend
npm run start:dev
```

Acceder a Swagger: `http://localhost:3000/api-docs`

### Opción 3: Ejecutar solo el Frontend (requiere backend corriendo)

```bash
cd frontend
npm run dev
```

---

## 🔑 Credenciales de Prueba

### Usuarios DC Comics
- 🦸 **superman** / clark123
- 🦇 **batman** / bruce123
- 👸 **wonderwoman** / diana123
- ⚡ **flash** / barry123
- 🌊 **aquaman** / arthur123

### Usuarios Marvel
- 🦾 **ironman** / tony123
- 🕷️ **spiderman** / peter123
- 🛡️ **captainamerica** / steve123
- 🔨 **thor** / odinson123
- 💚 **hulk** / bruce123

> **Nota:** Estas credenciales funcionan tanto en localhost como en la aplicación desplegada en producción.

---

## 🌐 Despliegue en la Nube

El proyecto está completamente desplegado y funcionando en producción:

### 📦 Servicios Utilizados

- **Frontend (Vercel):** [proyecto-final-m4-nodejs.vercel.app](https://proyecto-final-m4-nodejs.vercel.app)
  - Despliegue automático desde GitHub
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`

- **Backend (Render):** [proyectofinalm4nodejs.onrender.com](https://proyectofinalm4nodejs.onrender.com)
  - Free tier con auto-sleep después de 15 minutos
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Root Directory: `backend`

- **Base de Datos (Neon):**
  - PostgreSQL serverless
  - Free tier con 0.5GB de almacenamiento
  - Conexión directa desde Render

### ⚙️ Variables de Entorno Configuradas

**En Vercel (Frontend):**
```env
VITE_API_URL=https://proyectofinalm4nodejs.onrender.com/api
```

**En Render (Backend):**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=...
FRONTEND_URL=https://proyecto-final-m4-nodejs.vercel.app
```

### 📝 Archivos de Configuración

- `frontend/vercel.json` - Configuración para routing SPA en Vercel
- Ver guías completas en `DEPLOY-VERCEL-RENDER.md` y `DEPLOY-RAILWAY.md`

---

## 📊 API Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Usuario actual (protegido)

### Usuarios
- `GET /api/users` - Listar todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `GET /api/users/:id/tasks` - Usuario con sus tareas
- `GET /api/users/list/pagination` - **Paginación con filtros** ⭐
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Tareas
- `GET /api/tasks` - Listar todas las tareas
- `GET /api/tasks/:id` - Obtener tarea por ID
- `GET /api/tasks/user/:userId` - Tareas de un usuario
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Reportes (Extra)
- `GET /api/reports/general` - Estadísticas generales
- `GET /api/reports/top-users` - Ranking de usuarios
- `GET /api/reports/user-progress` - Progreso por usuario
- `GET /api/reports/users-comparison` - Comparativa
- `GET /api/reports/inactive-users` - Usuarios sin tareas

---

## 🎯 API de Paginación (Requisito del Examen)

### Endpoint:
```
GET /api/users/list/pagination
```

### Parámetros:
- `page`: Número de página (default: 1)
- `limit`: Registros por página - 5, 10, 15, 20 (default: 10)
- `search`: Búsqueda por username (case insensitive)
- `status`: Filtro por estado - active, inactive
- `orderBy`: Campo de ordenamiento - id, username, status (default: id)
- `orderDir`: Dirección - ASC, DESC (default: DESC)

### Ejemplo de uso:
```bash
curl "http://localhost:3000/api/users/list/pagination?page=1&limit=10&search=man&status=active&orderBy=username&orderDir=ASC" \
  -H "Authorization: Bearer TU_TOKEN"
```

### Respuesta:
```json
{
  "success": true,
  "total": 18,
  "page": 1,
  "pages": 2,
  "data": [
    {
      "id": 10,
      "username": "spiderman",
      "status": "active",
      "created_at": "2026-03-04T20:00:00.000Z",
      "updated_at": "2026-03-04T20:00:00.000Z"
    }
  ]
}
```

---

## 📚 Documentación Completa

El proyecto incluye documentación exhaustiva:

- **[backend/README.md](./backend/README.md)** - Documentación detallada del backend
- **[backend/EXAMEN-FINAL-RESUMEN.md](./backend/EXAMEN-FINAL-RESUMEN.md)** - Resumen ejecutivo del examen
- **[backend/DOCUMENTACION-PAGINACION.md](./backend/DOCUMENTACION-PAGINACION.md)** - Guía de la API de paginación
- **[backend/DOCUMENTACION-REPORTES.md](./backend/DOCUMENTACION-REPORTES.md)** - Sistema de reportes
- **[backend/SETUP-DATABASE.md](./backend/SETUP-DATABASE.md)** - Configuración de base de datos
- **[backend/swagger.yaml](./backend/swagger.yaml)** - Especificación OpenAPI 3.0
- **[frontend/README.md](./frontend/README.md)** - Documentación del frontend

---

## 🎓 Requisitos del Examen Cumplidos

### ✅ 50 puntos - Proyecto Completo
- Backend con Node.js + Express
- Frontend con React + Vite
- Base de datos PostgreSQL
- Autenticación JWT
- CRUD completo
- Validaciones
- Seguridad
- Documentación

### ✅ 30 puntos - API de Paginación Investigada
- Endpoint `/api/users/list/pagination`
- Paginación (page, limit)
- Búsqueda (search)
- Filtro por estado (status)
- Ordenamiento (orderBy, orderDir)
- Validaciones completas
- Frontend implementado

### 🌟 Características Extra (50+ puntos)
- Sistema de reportes completo (7 endpoints)
- Frontend paginado con filtros
- Endpoint usuario con tareas
- Seguridad avanzada
- Base de datos optimizada
- Documentación exhaustiva

**Puntuación esperada: 130+ puntos** (de 80 requeridos)

---

## 🧪 Testing

### Backend - Pruebas manuales

```bash
cd backend

# Test de login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"batman","password":"bruce123"}'

# Test de paginación
curl "http://localhost:3000/api/users/list/pagination?page=1&limit=5" \
  -H "Authorization: Bearer TU_TOKEN"
```

### Frontend - Pruebas en navegador

1. Abrir `http://localhost:5173`
2. Iniciar sesión con: **batman** / **bruce123**
3. Navegar por el dashboard
4. Probar la página de usuarios con filtros
5. Verificar el sistema de reportes

---

## 🐛 Troubleshooting

### Error: "Credenciales inválidas"
**Solución:** Ejecutar `node fix-passwords.js` en la carpeta backend

### Error: "Database connection failed"
**Solución:** Verificar credenciales en `.env` y que PostgreSQL esté corriendo

### Frontend no carga datos
**Solución:** Verificar que el backend esté corriendo en puerto 3000

### Puerto en uso
**Solución:** Cambiar el puerto en las variables de entorno o matar el proceso

---

## 📁 Scripts Útiles

### Backend
```bash
npm run start:dev  # Modo desarrollo con auto-reload
npm run start      # Modo producción
npm run lint       # Revisar código
npm run lint:fix   # Corregir errores de linting
```

### Frontend
```bash
npm run dev        # Modo desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
npm run lint       # Revisar código
```

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 salt rounds)
- ✅ Autenticación JWT con expiración
- ✅ Rate limiting (100 requests/15min)
- ✅ Helmet para headers seguros
- ✅ CORS configurado
- ✅ Validación de todos los inputs
- ✅ Protección contra SQL injection
- ✅ Variables de entorno para secretos

---

## 📈 Performance

- ✅ 6 índices en base de datos para queries optimizadas
- ✅ Paginación en servidor (no carga todos los registros)
- ✅ Logging estructurado con Pino
- ✅ Queries SQL parametrizadas
- ✅ Vite para build rápido del frontend

---

## 🎨 Características de UI/UX

- ✅ Diseño moderno con gradientes morado/azul
- ✅ Animaciones suaves (fade in, slide up)
- ✅ Responsive design (móvil, tablet, desktop)
- ✅ Loading states y spinners
- ✅ Feedback visual de acciones
- ✅ Tablas interactivas con hover effects
- ✅ Modal forms para crear/editar
- ✅ Progress bars animadas en reportes

---

## 🤝 Contribución

Este es un proyecto académico desarrollado para el Diplomado en Fullstack Developer. El código está disponible para fines educativos.

---

## 📄 Licencia

ISC

---

## 👨‍🎓 Autor

**Ing. Angulo Heredia Luis Fernando**

- **Universidad:** UNIVERSIDAD SIMÓN I. PATIÑO
- **Diplomado:** FULLSTACK DEVELOPER BACK END Y FRONT END
- **Módulo:** MÓDULO 4: ARQUITECTURA DESARROLLO BACKEND CON NODEJS
- **Docente:** Ing. Trigo Vargas Carlos Ariel

---

## 🔗 Enlaces Útiles

- **Repositorio:** https://github.com/luisfernandoAngulo28/ProyectoFinalM4Nodejs
- **Repositorio Base:** https://github.com/ctrigo10/node-base-diplomado
- **Swagger Editor:** https://editor.swagger.io/
- **Documento del Proyecto:** [Google Docs](https://docs.google.com/document/d/1lfWP7jfguLLh1PLFF_OvBse25SeM1z9RI759D-_qNv4/edit)

---

## ⭐ Agradecimientos

Agradecimiento especial al Ing. Carlos Ariel Trigo Vargas por su dedicación y enseñanza durante el módulo de Backend con Node.js.

---

**Fecha de completado:** 4 de Marzo, 2026  
**Fecha de entrega:** 7 de Marzo, 2026  
**Estado:** ✅ COMPLETO Y LISTO PARA ENTREGA

---

## 🚀 ¡Comienza ahora!

```bash
# Clonar el repositorio
git clone https://github.com/luisfernandoAngulo28/ProyectoFinalM4Nodejs.git

# Backend
cd ProyectoFinalM4Nodejs/backend
npm install
npm run start:dev

# Frontend (en otra terminal)
cd ProyectoFinalM4Nodejs/frontend
npm install
npm run dev
```

**¡Visita http://localhost:5173 y comienza a usar el sistema!** 🎉
