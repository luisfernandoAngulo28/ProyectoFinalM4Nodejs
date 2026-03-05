# Deploy en Vercel + Render + Neon

## 🎨 Frontend en Vercel (Gratis e ilimitado)

### Paso 1: Instalar Vercel CLI

```bash
npm i -g vercel
```

### Paso 2: Deploy del Frontend

```bash
cd C:\modulo4\node-base-diplomado\frontend
vercel
```

Responde las preguntas:
```
? Set up and deploy "frontend"? Yes
? Which scope? tu-usuario
? Link to existing project? No
? What's your project's name? superhero-dashboard
? In which directory is your code located? ./
? Want to override the settings? No
```

### Paso 3: Configurar Variable de Entorno

En https://vercel.com:
1. Ve a tu proyecto
2. Settings → Environment Variables
3. Agregar:
   ```
   Name: VITE_API_URL
   Value: https://tu-backend.onrender.com/api
   ```
4. Redeploy: Deployments → Latest → Redeploy

---

## 🔧 Backend en Render (Gratis con limitaciones)

### Paso 1: Crear Web Service

1. Ve a https://render.com
2. New → Web Service
3. Connect tu repositorio de GitHub
4. Configuración:
   - **Name**: superhero-api
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Paso 2: Variables de Entorno

En Render, agregar:
```
PORT=3000
JWT_SECRET=tu_secreto_super_seguro
NODE_ENV=production
DATABASE_URL=postgresql://... (de Neon)
```

---

## 🗄️ Base de Datos en Neon (Gratis)

### Paso 1: Crear proyecto en Neon

1. Ve a https://neon.tech
2. Sign up con GitHub
3. Create a project:
   - **Project name**: superhero-db
   - **Region**: US East (más cercano)
   - **PostgreSQL version**: 16

### Paso 2: Obtener Connection String

En el dashboard de Neon:
1. Copy connection string
2. Se ve así: `postgresql://usuario:password@host/dbname?sslmode=require`

### Paso 3: Ejecutar Script de DB

#### Opción A: Desde SQL Editor de Neon

1. En Neon → SQL Editor
2. Copiar todo el contenido de `backend/database.sql`
3. Pegar y ejecutar

#### Opción B: Desde tu computadora

```bash
# Instalar psql si no lo tienes
# Windows: https://www.postgresql.org/download/windows/

# Conectar
psql "postgresql://usuario:password@host/dbname?sslmode=require"

# Ejecutar script
\i backend/database.sql

# Salir
\q
```

### Paso 4: Hashear Passwords

Modificar `backend/fix-passwords.js` para usar DATABASE_URL:

```javascript
import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;

// Usar DATABASE_URL de la variable de entorno
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ... resto del código igual
```

Luego ejecutar:
```bash
cd backend
DATABASE_URL="postgresql://..." node fix-passwords.js
```

---

## 🔄 Actualizar Backend para usar DATABASE_URL

Editar `backend/src/config/db.js`:

```javascript
import pg from 'pg';

const { Pool } = pg;

// Usar DATABASE_URL si existe (producción), sino usar variables individuales (desarrollo)
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

export default pool;
```

---

## 📝 Configurar CORS para Producción

Editar `backend/src/app.js`:

```javascript
import cors from 'cors';

// Permitir el origen de Vercel
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://superhero-dashboard.vercel.app', 'https://tu-frontend.vercel.app']
    : 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
```

---

## 🚀 Proceso Completo de Deploy

### 1. Preparar y Commitear Cambios

```bash
cd C:\modulo4\node-base-diplomado

git add .
git commit -m "Preparar para deploy: agregar soporte para DATABASE_URL y variables de entorno"
git push origin main
```

### 2. Deploy en Orden

1. **Primero la Base de Datos (Neon)**
   - Crear proyecto
   - Ejecutar database.sql
   - Ejecutar fix-passwords.js
   - Copiar DATABASE_URL

2. **Luego el Backend (Render)**
   - Conectar repositorio
   - Configurar root directory: `backend`
   - Agregar DATABASE_URL y demás variables
   - Deploy

3. **Finalmente el Frontend (Vercel)**
   - Deploy con Vercel CLI o conectar repo
   - Agregar VITE_API_URL con URL de Render
   - Redeploy

### 3. Probar la Aplicación

1. Ir a la URL de Vercel
2. Intentar login: batman / bruce123
3. Verificar todas las funcionalidades

---

## 💰 Costos

| Servicio | Plan Gratis | Limitaciones |
|----------|-------------|--------------|
| **Vercel** | Ilimitado | Proyectos personales |
| **Render** | 750 horas/mes | Se duerme tras 15min inactividad |
| **Neon** | 1 proyecto | 10GB storage |

**Total: $0 / mes** (con limitaciones)

---

## ⚠️ Limitaciones del Plan Gratis

### Render Free Tier:
- El servidor se "duerme" tras 15 minutos de inactividad
- Primera petición después de dormirse tarda ~30-60 segundos
- 750 horas de servicio al mes (suficiente para demos)

### Neon Free Tier:
- 1 proyecto
- 10 GB de storage
- Suficiente para el proyecto

---

## 🔧 Solución de Problemas

### Frontend no conecta con Backend
1. Verifica `VITE_API_URL` en Vercel
2. Debe incluir `/api` al final
3. Debe ser HTTPS

### Backend no inicia en Render
1. Verifica Build Command: `npm install`
2. Verifica Start Command: `npm start`
3. Revisa los logs en Render

### Database connection failed
1. Verifica que DATABASE_URL esté configurada
2. Debe incluir `?sslmode=require`
3. Verifica que db.js use DATABASE_URL correctamente

### CORS errors
1. Agregar la URL de Vercel a corsOptions
2. Usar HTTPS, no HTTP

---

## 📱 URLs de Ejemplo

Después del deploy tendrás:
- Frontend: https://superhero-dashboard.vercel.app
- Backend: https://superhero-api.onrender.com
- Database: host.neon.tech

---

## ✅ Checklist

- [ ] Código actualizado para usar DATABASE_URL
- [ ] Código actualizado para VITE_API_URL
- [ ] CORS configurado para producción
- [ ] Neon: Base de datos creada
- [ ] Neon: database.sql ejecutado
- [ ] Neon: fix-passwords.js ejecutado
- [ ] Render: Backend desplegado
- [ ] Render: Variables de entorno configuradas
- [ ] Vercel: Frontend desplegado
- [ ] Vercel: VITE_API_URL configurada
- [ ] Probado login desde URL pública
- [ ] Todas las funcionalidades verificadas

---

## 🎓 Para el Examen

Documenta:
- URLs públicas
- Capturas de pantalla funcionando
- Servicios utilizados
- Variables de entorno (sin valores secretos)
