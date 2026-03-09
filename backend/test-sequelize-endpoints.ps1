# ================================
# Script de Prueba: Endpoints Sequelize
# ================================
# Este script prueba todos los endpoints de Sequelize
# creados en /api/v2/test/
#
# USO:
#   .\test-sequelize-endpoints.ps1
#
# REQUISITOS:
#   - El servidor debe estar corriendo en localhost:3000
#   - Ejecutar: npm run start:dev
# ================================

$baseUrl = "http://localhost:3000/api/v2/test"

Write-Host "`n🧪 ======================================" -ForegroundColor Cyan
Write-Host "   PRUEBA DE ENDPOINTS SEQUELIZE ORM" -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

# Función para hacer requests y mostrar resultados
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "`n📌 $Name" -ForegroundColor Yellow
    Write-Host "   Descripción: $Description" -ForegroundColor Gray
    Write-Host "   URL: $Url" -ForegroundColor Gray
    Write-Host "`n👉 Resultado:" -ForegroundColor Green
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method Get -ErrorAction Stop
        $response | ConvertTo-Json -Depth 5 -Compress:$false | Write-Host
    }
    catch {
        Write-Host "   ❌ Error: $_" -ForegroundColor Red
        if ($_.Exception.Response.StatusCode.value__ -eq 404) {
            Write-Host "   💡 Asegúrate de que el servidor esté corriendo: npm run start:dev" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n" + ("-" * 80) -ForegroundColor DarkGray
}

# Verificar que el servidor esté corriendo
Write-Host "🔍 Verificando conexión al servidor..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get -ErrorAction Stop
    Write-Host "✅ Servidor corriendo correctamente`n" -ForegroundColor Green
}
catch {
    Write-Host "❌ ERROR: No se puede conectar al servidor" -ForegroundColor Red
    Write-Host "💡 Ejecuta: npm run start:dev" -ForegroundColor Yellow
    Write-Host "💡 Asegúrate de estar en el directorio backend/`n" -ForegroundColor Yellow
    exit 1
}

# Test 0: Información general
Test-Endpoint `
    -Name "0. INFO GENERAL" `
    -Url "$baseUrl" `
    -Description "Lista todos los endpoints disponibles"

# Test 1: Listar usuarios
Test-Endpoint `
    -Name "1. LISTAR USUARIOS" `
    -Url "$baseUrl/users" `
    -Description "Obtener últimos 10 usuarios con Sequelize"

# Test 2: Usuario específico
Test-Endpoint `
    -Name "2. USUARIO POR ID" `
    -Url "$baseUrl/users/8" `
    -Description "Obtener superman (ID 8) usando findByPk"

# Test 3: Usuario con tareas (el más interesante)
Test-Endpoint `
    -Name "3. USUARIO CON TAREAS (JOIN)" `
    -Url "$baseUrl/users/8/tasks" `
    -Description "Superman con sus tareas usando include (JOIN automático)"

# Test 4: Buscar usuarios
Test-Endpoint `
    -Name "4. BUSCAR USUARIOS" `
    -Url "$baseUrl/search?q=super" `
    -Description "Buscar usuarios que contengan 'super' (Op.iLike)"

# Test 5: Usuarios activos
Test-Endpoint `
    -Name "5. USUARIOS ACTIVOS" `
    -Url "$baseUrl/active-users" `
    -Description "Solo usuarios con status = 'active'"

# Test 6: Tareas pendientes
Test-Endpoint `
    -Name "6. TAREAS PENDIENTES" `
    -Url "$baseUrl/tasks/pending" `
    -Description "Tareas con done = false (incluye información de usuario)"

# Test 7: Estadísticas
Test-Endpoint `
    -Name "7. ESTADÍSTICAS" `
    -Url "$baseUrl/stats" `
    -Description "Conteo de usuarios y tareas usando Sequelize count()"

# Resumen final
Write-Host "`n`n✅ ======================================" -ForegroundColor Green
Write-Host "   PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host "======================================`n" -ForegroundColor Green

Write-Host "📊 RESUMEN:" -ForegroundColor Cyan
Write-Host "   - Se probaron 8 endpoints con Sequelize ORM" -ForegroundColor White
Write-Host "   - Todos en la ruta: /api/v2/test/" -ForegroundColor White
Write-Host "`n📚 COMPARACIÓN:" -ForegroundColor Cyan
Write-Host "   - Tus rutas actuales: /api/users (con pg driver)" -ForegroundColor White
Write-Host "   - Rutas de prueba: /api/v2/test/users (con Sequelize)" -ForegroundColor White
Write-Host "`n📖 SIGUIENTE PASO:" -ForegroundColor Cyan
Write-Host "   Lee: GUIA-APRENDIZAJE-PG-VS-SEQUELIZE.md" -ForegroundColor White
Write-Host "   Para entender las diferencias entre pg y Sequelize`n" -ForegroundColor White

Write-Host "🎯 EJERCICIO:" -ForegroundColor Yellow
Write-Host "   Compara las respuestas de:" -ForegroundColor White
Write-Host "   1. GET /api/users (tu código actual)" -ForegroundColor Gray
Write-Host "   2. GET /api/v2/test/users (Sequelize)" -ForegroundColor Gray
Write-Host "`n   Invoke-RestMethod -Uri 'http://localhost:3000/api/users'" -ForegroundColor DarkGray
Write-Host "   Invoke-RestMethod -Uri 'http://localhost:3000/api/v2/test/users'`n" -ForegroundColor DarkGray
