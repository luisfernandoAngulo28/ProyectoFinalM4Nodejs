# 📄 Guía de Paginación - Superhero Dashboard

## Endpoint de Paginación

```
GET /api/users/list/pagination
```

## Parámetros de Query

| Parámetro | Tipo | Valores | Por defecto | Descripción |
|-----------|------|---------|-------------|-------------|
| `page` | número | >= 1 | 1 | Número de página a consultar |
| `limit` | número | 5, 10, 15, 20 | 10 | Cantidad de registros por página |
| `search` | string | cualquier texto | "" | Busca coincidencias en username (case insensitive) |
| `status` | string | active, inactive | "" | Filtra usuarios por estado |
| `orderBy` | string | id, username, status | id | Campo por el cual ordenar |
| `orderDir` | string | ASC, DESC | DESC | Dirección del ordenamiento |

## Ejemplos de Uso

### Ejemplo 1: Primera página con 5 resultados
```
GET /api/users/list/pagination?page=1&limit=5
```

### Ejemplo 2: Búsqueda y ordenamiento
```
GET /api/users/list/pagination?page=1&limit=5&search=man&orderBy=username&orderDir=DESC
```

### Ejemplo 3: Filtrar solo usuarios activos
```
GET /api/users/list/pagination?page=1&limit=10&status=active&orderBy=username&orderDir=ASC
```

### Ejemplo 4: Filtrar usuarios inactivos con búsqueda
```
GET /api/users/list/pagination?page=1&limit=10&status=inactive&search=bat&orderBy=id&orderDir=DESC
```

## Respuesta del Servidor

```json
{
  "success": true,
  "total": 20,
  "page": 1,
  "pages": 4,
  "data": [
    {
      "id": 1,
      "username": "superman",
      "status": "active",
      "created_at": "2026-03-04T20:00:00.000Z",
      "updated_at": "2026-03-04T20:00:00.000Z"
    },
    {
      "id": 2,
      "username": "batman",
      "status": "active",
      "created_at": "2026-03-04T20:00:00.000Z",
      "updated_at": "2026-03-04T20:00:00.000Z"
    }
    // ... más registros
  ]
}
```

## Campos de la Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | boolean | Indica si la petición fue exitosa |
| `total` | número | Total de registros que coinciden con la búsqueda |
| `page` | número | Página actual |
| `pages` | número | Total de páginas disponibles |
| `data` | array | Array con los usuarios de la página actual |

## Implementación en el Frontend

### Usando Axios

```javascript
import { usersAPI } from '../services/api';

// Obtener usuarios paginados
const response = await usersAPI.getPaginated({
  page: 1,
  limit: 10,
  search: 'spider',
  orderBy: 'username',
  orderDir: 'DESC'
});

console.log(response.total);  // 20
console.log(response.page);   // 1
console.log(response.pages);  // 2
console.log(response.data);   // Array de usuarios
```

### Estado en React

```javascript
const [users, setUsers] = useState([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [total, setTotal] = useState(0);
const [limit, setLimit] = useState(10);
const [search, setSearch] = useState('');
const [orderBy, setOrderBy] = useState('id');
const [orderDir, setOrderDir] = useState('DESC');

// Cargar usuarios cuando cambien los filtros
useEffect(() => {
  loadUsers();
}, [page, limit, search, orderBy, orderDir]);
```

## Características Implementadas

### ✅ En el Frontend
- 🔍 Búsqueda en tiempo real
- 📊 Ordenamiento por columna
- 🔄 Cambio de dirección (ASC/DESC)
- 📄 Selector de resultados por página (5, 10, 15, 20)
- ⬅️➡️ Navegación entre páginas
- 📈 Contador de resultados totales

### ✅ En el Backend
- 🔒 Validación de parámetros
- 🔍 Búsqueda case-insensitive con ILIKE
- 🛡️ Inyección SQL prevenida con consultas parametrizadas
- ⚡ Consultas optimizadas con índices
- 📊 Conteo eficiente de resultados

## Validaciones

### Backend valida:
- `limit` debe ser 5, 10, 15 o 20
- `orderBy` debe ser id, username o status
- `orderDir` debe ser ASC o DESC
- `page` debe ser >= 1

## Optimizaciones

### Índices en la Base de Datos
```sql
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
```

Estos índices mejoran significativamente el rendimiento de:
- Búsquedas por username
- Ordenamiento por status
- Ordenamiento por fecha de creación

## Pruebas Manuales

### Desde el navegador
```
http://localhost:3000/api/users/list/pagination?page=1&limit=5&search=man&orderBy=username&orderDir=DESC
```

### Desde Postman
1. Método: GET
2. URL: `http://localhost:3000/api/users/list/pagination`
3. Params (Query):
   - page: 1
   - limit: 5
   - search: spider
   - orderBy: username
   - orderDir: DESC

### Desde cURL
```bash
curl "http://localhost:3000/api/users/list/pagination?page=1&limit=5&search=spider&orderBy=username&orderDir=DESC" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Error: "Limit debe ser 5, 10, 15 o 20"
**Causa:** El parámetro limit tiene un valor no permitido
**Solución:** Usa solo 5, 10, 15 o 20

### Error: "orderBy debe ser id, username o status"
**Causa:** Intentas ordenar por un campo no permitido
**Solución:** Usa solo id, username o status

### No aparecen resultados
**Causa:** El término de búsqueda no coincide con ningún usuario
**Solución:** Verifica el texto de búsqueda o déjalo vacío

### La paginación no funciona
**Causa:** Posible error en el token de autenticación
**Solución:** Verifica que el token JWT sea válido

## Próximas Mejoras

- 🔍 Búsqueda avanzada por múltiples campos
- 📁 Filtros por estado (active/inactive)
- 📅 Filtros por rango de fechas
- 💾 Exportar resultados a CSV/Excel
- 🎨 Personalización de columnas visibles
- 🔖 Guardar filtros favoritos
