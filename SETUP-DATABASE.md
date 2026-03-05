# 🔧 Guía de Configuración de la Base de Datos

## Problema de Contraseñas

Si tienes problemas para iniciar sesión y ves el mensaje "Credenciales inválidas", es probable que las contraseñas en la base de datos no estén hasheadas correctamente.

## Solución Rápida

Ejecuta el siguiente comando desde la raíz del proyecto:

```bash
node fix-passwords.js
```

Este script:
- ✅ Hashea todas las contraseñas usando bcrypt
- ✅ Actualiza automáticamente todos los usuarios en la base de datos
- ✅ Permite que el sistema de autenticación funcione correctamente

## Configuración Inicial

### 1. Crear la base de datos

```bash
psql -U postgres
CREATE DATABASE BDCrudEstudiante;
\c BDCrudEstudiante
\i database.sql
```

### 2. Hashear las contraseñas

```bash
node fix-passwords.js
```

### 3. Verificar configuración

Asegúrate de que tu archivo `.env` tenga la configuración correcta:

```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=BDCrudEstudiante
DB_PASSWORD=tu_password
DB_PORT=5432
JWT_SECRET=mi_clave_secreta_super_segura_2026_diplomado
JWT_EXPIRES_IN=24h
```

## Usuarios de Prueba

Después de ejecutar `fix-passwords.js`, puedes usar estos usuarios:

### DC Heroes
- 🦸 superman / clark123
- 🦇 batman / bruce123
- 👸 wonderwoman / diana123
- ⚡ flash / barry123
- 🔱 aquaman / arthur123
- 💚 greenlantern / hal123 (inactivo)
- 🤖 cyborg / victor123
- ⚡ shazam / billy123

### Marvel Heroes
- 🦾 ironman / tony123
- 🕷️ spiderman / peter123
- 🛡️ captainamerica / steve123
- 🔨 thor / odinson123
- 💪 hulk / bruce123
- 🕷️ blackwidow / natasha123 (inactivo)
- 🏹 hawkeye / clint123
- 🔮 doctorstrange / stephen123
- 🐆 blackpanther / tchalla123
- 🔴 scarletwitch / wanda123
- 🤖 vision / jarvis123 (inactivo)
- 🐜 antman / scott123

## Notas Importantes

- ⚠️ Las contraseñas en `database.sql` están en texto plano solo para referencia
- ✅ El script `fix-passwords.js` debe ejecutarse después de insertar usuarios
- 🔒 En producción, nunca almacenes contraseñas en texto plano
- 🔑 El sistema usa bcrypt con 10 salt rounds para hashear contraseñas

## Troubleshooting

### Error: "Credenciales inválidas"
**Solución:** Ejecuta `node fix-passwords.js`

### Error: "Usuario inactivo"
**Causa:** El usuario tiene status 'inactive' en la base de datos
**Solución:** Cambia el status a 'active' en la base de datos o usa otro usuario

### Error de conexión a base de datos
**Solución:** Verifica que PostgreSQL esté corriendo y que las credenciales en `.env` sean correctas

## Comandos Útiles

```bash
# Iniciar el servidor en modo desarrollo
npm run start:dev

# Iniciar el servidor en producción
npm start

# Verificar usuarios en la base de datos
psql -U postgres -d BDCrudEstudiante -c "SELECT id, username, status FROM users;"
```
