# Railway Deployment Guide

## 🚂 Desplegar en Railway

### Requisitos
- Cuenta en Railway.app (gratis con GitHub)
- Proyecto en GitHub

### Paso 1: Preparar el proyecto

Tu proyecto ya está listo con la estructura de monorepo:
```
ProyectoFinalM4Nodejs/
├── backend/
└── frontend/
```

### Paso 2: Deploy desde GitHub

1. **Ir a Railway.app**
   - https://railway.app
   - Login con GitHub

2. **Crear Nuevo Proyecto**
   - Click en "New Project"
   - Seleccionar "Deploy from GitHub repo"
   - Elegir: `luisfernandoAngulo28/ProyectoFinalM4Nodejs`

3. **Configurar Backend**
   - Click en el servicio creado
   - Settings → Root Directory: `backend`
   - Settings → Build Command: `npm install`
   - Settings → Start Command: `npm start`

4. **Agregar PostgreSQL**
   - En el dashboard del proyecto
   - Click "+ New"
   - Seleccionar "Database" → "PostgreSQL"
   - Railway auto-conectará la DB con variables de entorno

5. **Configurar Variables de Entorno**
   
   En el servicio backend, agregar variables:
   ```
   PORT=3000
   JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar
   NODE_ENV=production
   ```
   
   Railway automáticamente agrega:
   ```
   DATABASE_URL=postgresql://...
   PGHOST=...
   PGPORT=...
   PGUSER=...
   PGPASSWORD=...
   PGDATABASE=...
   ```

6. **Configurar Frontend**
   - Click "+ New" → "Empty Service"
   - Settings → Root Directory: `frontend`
   - Settings → Build Command: `npm install && npm run build`
   - Settings → Start Command: `npx vite preview --port $PORT`
   - Variables de entorno:
     ```
     VITE_API_URL=https://tu-backend.railway.app
     ```

7. **Ejecutar Script de Base de Datos**
   
   En Railway, ir a PostgreSQL → Connect → PostgreSQL
   
   Copiar el comando de conexión y ejecutar localmente:
   ```bash
   psql postgresql://usuario:password@host:puerto/dbname < backend/database.sql
   ```

### Paso 3: Actualizar código del frontend

En `frontend/src/services/api.js`, cambiar:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});
```

### Paso 4: Deploy automático

Railway automáticamente re-deploya cuando haces push a `main`:
```bash
git add .
git commit -m "Configurar para Railway deploy"
git push origin main
```

---

## 🎯 URLs del Proyecto

Una vez desplegado, Railway te dará URLs como:
- Backend: https://tu-backend-production.up.railway.app
- Frontend: https://tu-frontend-production.up.railway.app

---

## 💰 Costos

- **Tier Gratis**: $5 de crédito mensual
- Tu proyecto consume ~$3-4/mes
- Suficiente para el proyecto del diplomado

---

## 🔧 Solución de Problemas

### Backend no inicia
- Verifica que el `Start Command` sea `npm start`
- Asegura que `backend/package.json` tenga el script `start`

### Frontend no conecta con Backend
- Verifica la variable `VITE_API_URL`
- Debe apuntar a la URL del backend de Railway

### Database connection failed
- Railway automáticamente inyecta las variables de DB
- Verifica que `backend/src/config/db.js` use las variables correctas

### Scripts de DB no ejecutados
- Conéctate manualmente y ejecuta `database.sql`
- Luego ejecuta `fix-passwords.js` (modificar para usar DB_URL)

---

## 📱 Probar el Deploy

1. Ir a la URL del frontend
2. Intentar login con: batman / bruce123
3. Verificar que cargue el dashboard
4. Probar todas las funcionalidades

---

## 🔄 Actualizar el Deploy

Cada vez que hagas cambios:
```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Railway automáticamente re-deploya en ~2-3 minutos.

---

## ✅ Checklist de Deploy

- [ ] Proyecto en GitHub actualizado
- [ ] Cuenta de Railway creada
- [ ] Backend desplegado y corriendo
- [ ] PostgreSQL agregado y configurado
- [ ] Script database.sql ejecutado
- [ ] Variables de entorno configuradas
- [ ] Frontend desplegado y corriendo
- [ ] frontend/api.js actualizado con URL del backend
- [ ] Login funcional desde URL pública
- [ ] Todas las funcionalidades probadas

---

## 📚 Documentación Oficial

- Railway Docs: https://docs.railway.app
- Railway Templates: https://railway.app/templates
- Railway CLI: https://docs.railway.app/develop/cli

---

## 🎓 Para el Examen

Incluye en tu documentación:
- URLs públicas del proyecto
- Screenshots del proyecto funcionando
- Guía de deploy seguida
- Variables de entorno usadas (sin secretos)
