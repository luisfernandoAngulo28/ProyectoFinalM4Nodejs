# Ejemplos de PowerShell para probar las APIs

## Health Check
Invoke-RestMethod -Uri "http://localhost:3000/health"

## ========= AUTENTICACIÓN =========

## Registrar nuevo usuario
$registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"username":"testjwt","password":"password123"}'

$registerResponse

## Login
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"admin123"}'

$loginResponse

# Guardar token en variable
$token = $loginResponse.token
Write-Host "Token guardado: $token"

## Obtener usuario actual (requiere token)
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" `
  -Method GET `
  -Headers $headers

## ========= USUARIOS =========

## Obtener todos los usuarios
Invoke-RestMethod -Uri "http://localhost:3000/api/users"

## Crear usuario con validación
Invoke-RestMethod -Uri "http://localhost:3000/api/users" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"username":"validuser","password":"securepass123","status":"active"}'

## Intentar crear usuario con datos inválidos (debe fallar)
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/users" `
      -Method POST `
      -ContentType "application/json" `
      -Body '{"username":"ab","password":"123"}'
} catch {
    Write-Host "Error esperado (validación): $_"
}

## Paginación con búsqueda
Invoke-RestMethod -Uri "http://localhost:3000/api/users/list/pagination?page=1&limit=5&search=user&orderBy=username&orderDir=DESC"

## Actualizar usuario
Invoke-RestMethod -Uri "http://localhost:3000/api/users/1" `
  -Method PUT `
  -ContentType "application/json" `
  -Body '{"status":"inactive"}'

## ========= TAREAS =========

## Obtener todas las tareas
Invoke-RestMethod -Uri "http://localhost:3000/api/tasks"

## Crear tarea
Invoke-RestMethod -Uri "http://localhost:3000/api/tasks" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"Probar JWT y validaciones","done":false,"user_id":1}'

## Actualizar tarea
Invoke-RestMethod -Uri "http://localhost:3000/api/tasks/1" `
  -Method PUT `
  -ContentType "application/json" `
  -Body '{"done":true}'

## Obtener tareas por usuario
Invoke-RestMethod -Uri "http://localhost:3000/api/tasks/user/1"

## ========= PRUEBAS DE SEGURIDAD =========

## Intentar acceder a ruta protegida sin token (debe fallar)
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" -Method GET
} catch {
    Write-Host "Error esperado (sin token): $_"
}

## Intentar con token inválido (debe fallar)
try {
    $badHeaders = @{
        "Authorization" = "Bearer token_invalido"
    }
    Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" `
      -Method GET `
      -Headers $badHeaders
} catch {
    Write-Host "Error esperado (token inválido): $_"
}

## ========= VALIDACIONES =========

## Intentar crear task sin campos requeridos
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/tasks" `
      -Method POST `
      -ContentType "application/json" `
      -Body '{}'
} catch {
    Write-Host "Error esperado (campos requeridos): $_"
}

## Intentar crear usuario con username corto
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/users" `
      -Method POST `
      -ContentType "application/json" `
      -Body '{"username":"ab","password":"password123"}'
} catch {
    Write-Host "Error esperado (username muy corto): $_"
}

Write-Host "`n=== Todas las pruebas completadas ===" -ForegroundColor Green
