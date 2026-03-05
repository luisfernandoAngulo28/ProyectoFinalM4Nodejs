# 🚀 Guía de Instalación Rápida

## ⚠️ IMPORTANTE

**NO** se incluyó `node_modules` en el repositorio. Debes instalar las dependencias después de clonar.

---

## 📦 Instalación Paso a Paso

### 1. Clonar el repositorio
```bash
git clone https://github.com/luisfernandoAngulo28/ProyectoFinalM4Nodejs.git
cd ProyectoFinalM4Nodejs
```

### 2. Instalar dependencias del Backend
```bash
cd backend
npm install
```

### 3. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp .env.sample .env

# Editar .env con tus credenciales
# Usar tu editor favorito (notepad, vim, code, etc.)
notepad .env
```

Variables requeridas en `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=BDCrudEstudiante
JWT_SECRET=tu_secreto_jwt_super_seguro
```

### 4. Configurar la base de datos
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE BDCrudEstudiante;

# Conectar a la base de datos
\c BDCrudEstudiante

# Ejecutar script (ajusta la ruta según tu ubicación)
\i database.sql

# Salir
\q

# Hashear contraseñas desde la carpeta backend
node fix-passwords.js
```

### 5. Instalar dependencias del Frontend
```bash
# Desde la raíz del proyecto
cd ../frontend
npm install
```

---

## ▶️ Ejecutar el Proyecto

### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```
✅ Backend corriendo en: `http://localhost:3000`  
✅ Swagger: `http://localhost:3000/api-docs`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend corriendo en: `http://localhost:5173`

---

## 🔑 Credenciales de Prueba

Una vez que los servidores estén corriendo, abre el navegador en `http://localhost:5173` y usa:

### Usuarios DC
- **batman** / bruce123
- **superman** / clark123
- **wonderwoman** / diana123

### Usuarios Marvel
- **spiderman** / peter123
- **ironman** / tony123
- **captainamerica** / steve123

---

## 🧪 Verificar Instalación

### Test Backend
```bash
curl http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"batman","password":"bruce123"}'
```

### Test Frontend
Abre el navegador en `http://localhost:5173` y verifica que cargue la página de login.

---

## ⚡ Scripts Disponibles

### Backend
```bash
npm run start:dev  # Desarrollo con auto-reload
npm run start      # Producción
npm run lint       # Revisar código
npm run lint:fix   # Corregir errores
```

### Frontend
```bash
npm run dev        # Desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
npm run lint       # Revisar código
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"
**Solución:** Asegúrate de haber ejecutado `npm install` en ambas carpetas (backend y frontend)

### Error: "Database connection failed"
**Solución:** 
1. Verifica que PostgreSQL esté corriendo
2. Confirma las credenciales en `.env`
3. Verifica que la base de datos `BDCrudEstudiante` exista

### Error: "Port already in use"
**Solución:**
- Backend: Cambia `PORT` en `.env`
- Frontend: Vite asignará automáticamente otro puerto

### Error: "Credenciales inválidas"
**Solución:** Ejecuta `node fix-passwords.js` desde la carpeta backend

### Error: Frontend no conecta con Backend
**Solución:** Verifica que el backend esté corriendo en `http://localhost:3000`

---

## 📁 Estructura de Carpetas

```
ProyectoFinalM4Nodejs/
├── backend/
│   ├── node_modules/       # ⚠️ Generado por npm install
│   ├── src/
│   ├── database.sql
│   ├── package.json
│   └── .env               # ⚠️ Crear desde .env.sample
│
├── frontend/
│   ├── node_modules/       # ⚠️ Generado por npm install
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ✅ Checklist de Instalación

- [ ] Repositorio clonado
- [ ] Backend: `npm install` ejecutado
- [ ] Backend: `.env` configurado
- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `BDCrudEstudiante` creada
- [ ] Script `database.sql` ejecutado
- [ ] Script `fix-passwords.js` ejecutado
- [ ] Frontend: `npm install` ejecutado
- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 5173
- [ ] Login exitoso con credenciales de prueba

---

## 🎓 Documentación Adicional

- [README Principal](./README.md) - Información general del proyecto
- [Backend README](./backend/README.md) - Documentación del API
- [Backend Swagger](./backend/swagger.yaml) - Especificación OpenAPI
- [Resumen del Examen](./backend/EXAMEN-FINAL-RESUMEN.md) - Detalles del proyecto final

---

## 💡 Consejos

1. **Usa dos terminales:** Una para backend y otra para frontend
2. **No modifiques node_modules:** Se regeneran con `npm install`
3. **Mantén .env seguro:** Nunca lo subas a git
4. **Revisa los logs:** Si algo falla, revisa la consola del servidor

---

## 📞 Soporte

Si tienes problemas durante la instalación:

1. Revisa esta guía completa
2. Verifica los logs de error en la terminal
3. Consulta la documentación específica en las carpetas backend/frontend

---

**¡Listo para desarrollar!** 🎉
