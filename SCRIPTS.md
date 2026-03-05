# Scripts Útiles

Este archivo contiene comandos útiles para el proyecto.

## Comandos de Base de Datos

### Crear base de datos
```bash
psql -U postgres -c "CREATE DATABASE BDCrudEstudiante;"
```

### Ejecutar script SQL
```bash
# Windows PowerShell
$env:PGPASSWORD='12345678'; psql -U postgres -h localhost -d BDCrudEstudiante -f database.sql

# Linux/Mac
PGPASSWORD=12345678 psql -U postgres -h localhost -d BDCrudEstudiante -f database.sql
```

### Conectarse a la base de datos
```bash
psql -U postgres -h localhost -d BDCrudEstudiante
```

### Ver tablas
```sql
\dt
```

### Ver datos de usuarios
```sql
SELECT id, username, status FROM users;
```

### Ver datos de tareas
```sql
SELECT * FROM tasks;
```

### Encriptar contraseñas existentes (desde Node.js)

Si ya tienes usuarios con contraseñas sin encriptar, puedes ejecutar este script:

```javascript
import bcrypt from 'bcrypt';
import pool from './src/config/db.js';

async function encryptExistingPasswords() {
  try {
    const users = await pool.query('SELECT id, password FROM users');
    
    for (const user of users.rows) {
      // Solo encriptar si la contraseña no está ya encriptada
      if (!user.password.startsWith('$2b$')) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
        console.log(`Password encrypted for user ID: ${user.id}`);
      }
    }
    
    console.log('All passwords encrypted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

encryptExistingPasswords();
```

## Comandos npm

### Instalar todas las dependencias
```bash
npm install
```

### Modo desarrollo (con auto-reload)
```bash
npm run start:dev
```

### Modo producción
```bash
npm start
```

## Testing de APIs

### Health Check
```bash
curl http://localhost:3000/health
```

### GET Todos los usuarios
```bash
curl http://localhost:3000/api/users
```

### GET Usuario por ID
```bash
curl http://localhost:3000/api/users/1
```

### POST Crear usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123","status":"active"}'
```

### PUT Actualizar usuario
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"inactive"}'
```

### DELETE Eliminar usuario
```bash
curl -X DELETE http://localhost:3000/api/users/5
```

### GET API de paginación
```bash
curl "http://localhost:3000/api/users/list/pagination?page=1&limit=5&search=user&orderBy=username&orderDir=DESC"
```

### GET Todas las tareas
```bash
curl http://localhost:3000/api/tasks
```

### POST Crear tarea
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"name":"Nueva tarea","done":false,"user_id":1}'
```

## Git Commands

### Inicializar repositorio
```bash
git init
git add .
git commit -m "Initial commit"
```

### Push a GitHub
```bash
git remote add origin <url-del-repositorio>
git branch -M main
git push -u origin main
```

## Solución de Problemas

### Error: Puerto 3000 en uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Error de conexión a PostgreSQL
1. Verificar que PostgreSQL esté corriendo
2. Verificar credenciales en .env
3. Verificar que la base de datos exista

### Reinstalar dependencias
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## Variables de Entorno

Asegúrate de tener configurado tu archivo `.env`:

```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=BDCrudEstudiante
DB_PASSWORD=12345678
DB_PORT=5432
```
