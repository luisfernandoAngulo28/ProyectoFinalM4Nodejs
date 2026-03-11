# 🎨 Superhero Dashboard - Frontend

---

## 🎓 INFORMACIÓN ACADÉMICA

**UNIVERSIDAD SIMÓN I. PATIÑO**  
**ESCUELA DE POSTGRADO**

### PROYECTO FINAL
**Sistema de Gestión de Usuarios y Tareas - Frontend**

**Diplomado:** DIPLOMADO EN FULLSTACK DEVELOPER BACK END Y FRONT END  
**Módulo 4:** ARQUITECTURA DESARROLLO BACKEND CON NODEJS

**Docente:** Ing. Trigo Vargas Carlos Ariel  
**Estudiante:** Ing. Angulo Heredia Luis Fernando

**Fecha:** 7 de marzo de 2026  
**País:** Bolivia 🇧🇴

---

## 📄 Descripción

Dashboard web interactivo construido con React 19 y Vite para gestionar usuarios y tareas. Frontend del proyecto final del Diplomado en Fullstack Developer.

## ✨ Características

- ✅ **React 19** con Vite para desarrollo rápido
- ✅ **React Router v7** para navegación
- ✅ **Diseño moderno** con gradientes y animaciones
- ✅ **Responsive Design** para móviles y desktop
- ✅ **Paginación avanzada** con filtros y búsqueda
- ✅ **Sistema de autenticación** con JWT
- ✅ **Dashboard interactivo** con estadísticas
- ✅ **Sistema de reportes** con visualizaciones
- ✅ **CRUD completo** de usuarios y tareas
- ✅ **Axios** para llamadas a API

## 🛠 Tecnologías

- **React 19** - Biblioteca de UI
- **Vite 8** - Build tool y dev server
- **React Router DOM 7** - Enrutamiento
- **Axios** - Cliente HTTP
- **CSS3** - Estilos modernos

## 📦 Instalación

### Prerrequisitos
- Node.js >= 18
- Backend corriendo en http://localhost:3000

### Pasos

1. **Instalar dependencias:**
```bash
npm install
```

2. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

3. **Abrir el navegador:**
```
http://localhost:5173
```

## 📂 Estructura del Proyecto

```
superhero-dashboard/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/          # Recursos (imágenes, etc)
│   ├── components/      # Componentes reutilizables
│   │   └── Navbar.jsx   # Barra de navegación
│   ├── pages/           # Páginas de la aplicación
│   │   ├── Login.jsx    # Login y registro
│   │   ├── Dashboard.jsx # Dashboard principal
│   │   ├── Users.jsx    # Gestión de usuarios
│   │   ├── Tasks.jsx    # Gestión de tareas
│   │   └── Reports.jsx  # Sistema de reportes
│   ├── services/        # Servicios de API
│   │   └── api.js       # Cliente Axios
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos globales
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos base
├── index.html           # HTML principal
├── vite.config.js       # Configuración de Vite
└── package.json         # Dependencias
```

## 🎨 Páginas

### 1. Login (`/login`)
- Formulario de inicio de sesión
- Registro de nuevos usuarios
- Validación de credenciales
- Almacenamiento de token JWT

### 2. Dashboard (`/`)
- Estadísticas generales
- Total de usuarios
- Usuarios activos
- Total de tareas
- Tareas completadas

### 3. Usuarios (`/users`)
- Tabla paginada de usuarios
- Búsqueda por username
- Filtro por estado (activo/inactivo)
- Ordenamiento configurable
- CRUD completo (crear, editar, eliminar)
- Selector de registros por página (5, 10, 15, 20)

### 4. Tareas (`/tasks`)
- Listado de todas las tareas
- Filtrado y búsqueda
- Marcar como completadas
- Asignación a usuarios
- CRUD completo

### 5. Reportes (`/reports`)
- Estadísticas generales
- Ranking de usuarios
- Progreso por usuario
- Comparativas
- Usuarios inactivos

## 🔑 Credenciales de Prueba

### Usuarios DC
- 🦸 **superman** / clark123
- 🦇 **batman** / bruce123
- 👸 **wonderwoman** / diana123

### Usuarios Marvel
- 🦾 **ironman** / tony123
- 🕷️ **spiderman** / peter123
- 🛡️ **captainamerica** / steve123

## 🎨 Características de Diseño

### Paleta de Colores
- **Primario:** Gradiente Morado/Azul (#667eea → #764ba2)
- **Secundario:** Verde (#10b981)
- **Peligro:** Rojo (#ef4444)
- **Info:** Azul (#3b82f6)

### Animaciones
- Fade in al cargar páginas
- Slide up para cards
- Hover effects en botones
- Progress bars animadas
- Loading spinners

### Responsive
- Mobile: < 768px
- Tablet: 768px - 1200px
- Desktop: > 1200px

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

## 🔗 Conexión con Backend

El frontend se conecta al backend en `http://localhost:3000`.

Para cambiar la URL del backend, editar `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});
```

## 📝 Notas Técnicas

### Estado de Autenticación
El token JWT se almacena en `localStorage` con la clave `token`.

### Manejo de Errores
Todos los errores de API se capturan y muestran mensajes al usuario.

### Protección de Rutas
Las rutas protegidas redirigen a `/login` si no hay token válido.

## 🎓 Créditos

**Proyecto desarrollado por:** Ing. Angulo Heredia Luis Fernando  
**Universidad:** UNIVERSIDAD SIMÓN I. PATIÑO  
**Diplomado:** FULLSTACK DEVELOPER BACK END Y FRONT END  
**Docente:** Ing. Trigo Vargas Carlos Ariel

---

**Built with React + Vite**
# Deploy trigger
