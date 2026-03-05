# Instrucciones del Proyecto

**NOTA:** Para ver todas las APIs por Swagger, descargar el archivo `swagger.yaml` e ir a la página https://editor.swagger.io/ donde debe pegar el contenido y ahí podrá ver todas las APIs como deben ser enviadas y las respuestas de cada una.

## Evaluación

### 1. 50 pts: Completar el proyecto
Como se realizó en clases.

### 2. 30 pts: API para investigar

#### GET dominio/api/users/list/pagination

**Query Parameters:**

| # | Param | Default | Comentario | Valores |
|---|-------|---------|------------|---------|
| 1 | page | 1 | Número de la página | - |
| 2 | limit | 10 | Cantidad de registros a mostrar | 5, 10, 15, 20 |
| 3 | search | - | Búsqueda de username que tengan dicha palabra (ILIKE) si no existe search mostrar todos | - |
| 4 | orderBy | id | Valor por ordenar (id, username, status) | id, username, status |
| 5 | orderDir | DESC | Dirección por ordenar | ASC, DESC |

**Ejemplo:**
```
dominio/api/users/list/pagination?page=1&limit=5&search=use&orderBy=username&orderDir=DESC
```

**Respuesta:**

| # | Campo | Comentario | Ejemplo |
|---|-------|------------|---------|
| 1 | total | Total de registros | 20 |
| 2 | page | Número de página | 1 |
| 3 | pages | Páginas en total | 2 |
| 4 | data | json de la respuesta (id, username, status) | |

---

**Suerte.**
