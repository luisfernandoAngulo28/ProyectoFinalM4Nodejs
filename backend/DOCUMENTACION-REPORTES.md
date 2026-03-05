# 📊 Sistema de Reportes - Superhero Dashboard

## Descripción General

Sistema completo de reportes y estadísticas que proporciona análisis detallados sobre usuarios y tareas del sistema. Incluye visualizaciones interactivas, métricas clave y comparativas.

## 🎯 Reportes Implementados

### 1. 📈 Reporte General
**Endpoint:** `GET /api/reports/general`

Muestra un resumen ejecutivo del sistema con métricas clave.

**Métricas incluidas:**
- Total de usuarios en el sistema
- Total de tareas registradas
- Promedio de tareas por usuario
- Distribución de usuarios por estado (activo/inactivo)
- Distribución de tareas por estado (completadas/pendientes)

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 21,
    "usersByStatus": [
      { "status": "active", "count": 18 },
      { "status": "inactive", "count": 3 }
    ],
    "totalTasks": 24,
    "tasksByStatus": [
      { "done": true, "count": 8 },
      { "done": false, "count": 16 }
    ],
    "avgTasksPerUser": 1.14
  }
}
```

---

### 2. 🏆 Top Usuarios con Más Tareas
**Endpoint:** `GET /api/reports/top-users?limit=10`

Ranking de usuarios ordenados por cantidad de tareas, mostrando su nivel de productividad.

**Parámetros:**
- `limit` (opcional): Número de usuarios a mostrar (default: 10)

**Métricas por usuario:**
- Total de tareas
- Tareas completadas
- Tareas pendientes
- Porcentaje de completitud

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "superman",
      "status": "active",
      "total_tasks": 3,
      "completed_tasks": 1,
      "pending_tasks": 2,
      "completion_percentage": 33.33
    }
  ]
}
```

---

### 3. 📊 Estadísticas de Tareas
**Endpoint:** `GET /api/reports/tasks-stats`

Análisis detallado de las tareas del sistema.

**Incluye:**
- Tareas por usuario (solo usuarios activos con tareas)
- Últimas 10 tareas creadas
- Distribución de tareas completadas vs pendientes

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": {
    "tasksByUser": [
      {
        "username": "batman",
        "total_tasks": 3,
        "completed": 1,
        "pending": 2
      }
    ],
    "recentTasks": [
      {
        "id": 24,
        "name": "Consejo tribal",
        "done": false,
        "username": "blackpanther",
        "created_at": "2026-03-04T20:00:00.000Z"
      }
    ]
  }
}
```

---

### 4. 📊 Progreso por Usuario
**Endpoint:** `GET /api/reports/user-progress`

Muestra el progreso de TODOS los usuarios, incluyendo aquellos sin tareas.

**Métricas por usuario:**
- Total de tareas
- Tareas completadas
- Tareas pendientes
- Porcentaje de completitud
- Estado del usuario

**Ordenamiento:** Por porcentaje de completitud (descendente) y total de tareas

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "username": "batman",
      "status": "active",
      "total_tasks": 3,
      "completed_tasks": 1,
      "pending_tasks": 2,
      "completion_percentage": 33.33
    },
    {
      "id": 15,
      "username": "antman",
      "status": "active",
      "total_tasks": 0,
      "completed_tasks": 0,
      "pending_tasks": 0,
      "completion_percentage": 0
    }
  ]
}
```

---

### 5. 📅 Tendencias por Fecha
**Endpoint:** `GET /api/reports/trends`

Analiza tendencias de registro y actividad en los últimos 30 días.

**Incluye:**
- Usuarios registrados por fecha
- Tareas creadas por fecha
- Tareas completadas por fecha

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": {
    "userTrends": [
      {
        "date": "2026-03-04",
        "count": 21
      }
    ],
    "taskTrends": [
      {
        "date": "2026-03-04",
        "count": 24,
        "completed": 8
      }
    ]
  }
}
```

---

### 6. 😴 Usuarios Inactivos (Sin Tareas)
**Endpoint:** `GET /api/reports/inactive-users`

Lista de usuarios que NO tienen tareas asignadas.

**Útil para:**
- Identificar usuarios sin actividad
- Asignar tareas a nuevos usuarios
- Detectar cuentas sin uso

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 20,
      "username": "antman",
      "status": "active",
      "created_at": "2026-03-04T20:00:00.000Z",
      "total_tasks": 0
    }
  ]
}
```

---

### 7. ⚖️ Comparativa entre Usuarios
**Endpoint:** `GET /api/reports/users-comparison`

Comparativa visual de los 15 usuarios más activos.

**Métricas:**
- Total de tareas
- Tareas completadas
- Tareas pendientes
- Tasa de completitud

**Solo incluye:** Usuarios activos con tareas

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "username": "superman",
      "status": "active",
      "total_tasks": 3,
      "completed": 1,
      "pending": 2,
      "completion_rate": 33.33
    }
  ]
}
```

---

## 🎨 Interfaz de Usuario

### Navegación por Pestañas

La página de reportes cuenta con 5 pestañas principales:

1. **📈 General**: Vista general del sistema
2. **🏆 Ranking**: Top usuarios con más tareas
3. **📊 Progreso**: Progreso de todos los usuarios
4. **⚖️ Comparativa**: Comparación visual entre usuarios
5. **😴 Inactivos**: Usuarios sin tareas

### Características de la UI

- ✅ Barras de progreso animadas con colores diferenciados
- ✅ Badges de estado (activo/inactivo, completado/pendiente)
- ✅ Tablas responsivas con ordenamiento visual
- ✅ Tarjetas de comparación con hover effects
- ✅ Diseño adaptable a móviles y tablets
- ✅ Botón de actualización manual de reportes
- ✅ Loading spinner durante carga de datos

### Código de Colores

- 🟢 **Verde**: Usuarios activos, tareas completadas, progreso positivo
- 🟡 **Amarillo**: Usuarios inactivos, advertencias
- 🔵 **Azul**: Tareas pendientes, información general
- 🔴 **Rojo**: Errores, alertas importantes

---

## 🚀 Uso desde el Frontend

### Importar el servicio
```javascript
import { reportsAPI } from '../services/api';
```

### Obtener reportes
```javascript
// Reporte general
const general = await reportsAPI.getGeneralStats();

// Top usuarios (con límite personalizado)
const topUsers = await reportsAPI.getTopUsers(15);

// Progreso de usuarios
const progress = await reportsAPI.getUserProgress();

// Comparativa
const comparison = await reportsAPI.getUsersComparison();

// Usuarios inactivos
const inactive = await reportsAPI.getInactiveUsers();

// Tendencias
const trends = await reportsAPI.getTrends();

// Estadísticas de tareas
const tasksStats = await reportsAPI.getTasksStats();
```

---

## 🔒 Seguridad

Todos los endpoints de reportes están protegidos por autenticación JWT:

```javascript
router.use(protect); // Middleware de autenticación
```

**Requieren:** Token JWT válido en el header `Authorization: Bearer <token>`

---

## 📝 Consultas SQL Optimizadas

Todas las consultas están optimizadas con:
- ✅ **Índices en columnas clave** (username, status, created_at)
- ✅ **Agregaciones eficientes** (COUNT, SUM, AVG)
- ✅ **JOINs optimizados** (LEFT JOIN para incluir usuarios sin tareas)
- ✅ **CASE statements** para cálculos condicionales
- ✅ **GROUP BY** para agrupaciones
- ✅ **ORDER BY** para ordenamientos relevantes

---

## 🎯 Casos de Uso

### Para Gerentes/Administradores:
- Monitorear el rendimiento general del equipo
- Identificar usuarios más productivos
- Detectar usuarios sin actividad
- Analizar tendencias de productividad

### Para Supervisores:
- Comparar rendimiento entre usuarios
- Ver progreso individual de cada usuario
- Asignar tareas a usuarios sin carga de trabajo

### Para Análisis:
- Generar reportes periódicos
- Exportar datos para presentaciones
- Identificar patrones de uso

---

## 🔧 Personalización

### Agregar nuevos reportes

**1. Crear función en el controlador:**
```javascript
// src/controllers/reports.controller.js
const getMyCustomReport = async (req, res) => {
  try {
    const result = await pool.query('SELECT ...');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};
```

**2. Agregar ruta:**
```javascript
// src/routes/reports.route.js
router.get('/my-report', reportsController.getMyCustomReport);
```

**3. Agregar servicio en frontend:**
```javascript
// src/services/api.js
export const reportsAPI = {
  // ... otros métodos
  getMyReport: async () => {
    const response = await api.get('/reports/my-report');
    return response.data;
  }
};
```

---

## 📊 Métricas Clave

| Métrica | Descripción | Cálculo |
|---------|-------------|---------|
| **Tasa de Completitud** | Porcentaje de tareas completadas | (Completadas / Total) × 100 |
| **Promedio Tareas/Usuario** | Tareas promedio por usuario | Total Tareas / Total Usuarios |
| **Usuarios Activos %** | Porcentaje de usuarios activos | (Activos / Total) × 100 |
| **Productividad** | Tareas completadas por usuario activo | Completadas / Usuarios Activos |

---

## 🐛 Troubleshooting

### Error: "Error al obtener reportes"
**Causa:** Token JWT inválido o expirado  
**Solución:** Volver a iniciar sesión

### Reportes vacíos
**Causa:** No hay datos suficientes en la base de datos  
**Solución:** Crear usuarios y tareas de prueba

### Carga lenta
**Causa:** Gran cantidad de datos  
**Solución:** Agregar paginación a los reportes grandes

---

## 🔮 Mejoras Futuras

- [ ] Exportar reportes a PDF/Excel
- [ ] Gráficos con Chart.js o Recharts
- [ ] Filtros por rango de fechas
- [ ] Reportes programados por email
- [ ] Dashboard en tiempo real con WebSockets
- [ ] Comparación entre periodos
- [ ] Reportes personalizados por usuario

---

## 📚 Referencias

- **Backend:** `/src/controllers/reports.controller.js`
- **Rutas:** `/src/routes/reports.route.js`
- **Frontend:** `/src/pages/Reports.jsx`
- **Servicios:** `/src/services/api.js`
- **Estilos:** `/src/App.css` (sección de Tabs y Reports)

---

## ✅ Checklist de Implementación

- [x] Controlador de reportes en backend
- [x] Rutas protegidas con autenticación
- [x] Servicios API en frontend
- [x] Página de reportes con tabs
- [x] Visualizaciones con barras de progreso
- [x] Diseño responsivo
- [x] Manejo de errores
- [x] Loading states
- [x] Estilos modernos
- [x] Documentación completa

---

## 🎉 ¡Listo para usar!

Accede a los reportes desde:
```
http://localhost:5173/reports
```

O haz clic en el botón **📊 Reportes** en la barra de navegación.
