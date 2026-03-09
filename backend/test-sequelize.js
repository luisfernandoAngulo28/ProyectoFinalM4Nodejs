/**
 * Script de Prueba para Sequelize
 * 
 * Este script verifica que Sequelize esté configurado correctamente
 * y puede conectarse a tu base de datos PostgreSQL.
 * 
 * Uso:
 *   node test-sequelize.js
 */

import { sequelize, UserModel, TaskModel } from './src/models/index.js';
import logger from './src/logs/logger.js';

console.log('🧪 Iniciando pruebas de Sequelize...\n');

async function testSequelizeConnection() {
  try {
    console.log('1️⃣ Probando conexión a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa!\n');

    console.log('2️⃣ Verificando modelos...');
    console.log(`   - UserModel: ${UserModel.name}`);
    console.log(`   - TaskModel: ${TaskModel.name}`);
    console.log('✅ Modelos cargados correctamente!\n');

    console.log('3️⃣ Probando consulta simple...');
    const userCount = await UserModel.count();
    console.log(`✅ Usuarios en la base de datos: ${userCount}\n`);

    console.log('4️⃣ Probando consulta con relaciones...');
    const users = await UserModel.findAll({
      attributes: ['id', 'username', 'status'],
      include: [{
        model: TaskModel,
        as: 'tasks',
        attributes: ['id', 'name', 'done']
      }],
      limit: 3
    });
    console.log(`✅ Se obtuvieron ${users.length} usuarios con sus tareas\n`);

    if (users.length > 0) {
      console.log('📊 Ejemplo de datos:\n');
      users.forEach(user => {
        console.log(`   Usuario: ${user.username} (ID: ${user.id})`);
        console.log(`   Status: ${user.status}`);
        console.log(`   Tareas: ${user.tasks?.length || 0}`);
        console.log('');
      });
    }

    console.log('✅ TODAS LAS PRUEBAS PASARON EXITOSAMENTE! 🎉\n');
    console.log('📚 Ahora puedes:');
    console.log('   1. Explorar los modelos en src/models/');
    console.log('   2. Leer GUIA-APRENDIZAJE-PG-VS-SEQUELIZE.md');
    console.log('   3. Comparar con tus controladores actuales\n');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.error('\n💡 Posibles soluciones:');
    console.error('   - Verifica que PostgreSQL esté corriendo');
    console.error('   - Revisa las variables de entorno en .env');
    console.error('   - Asegúrate de que la base de datos existe');
    console.error('   - Ejecuta el script database.sql si es necesario\n');
    
    logger.error('Error en test de Sequelize:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión cerrada.\n');
  }
}

// Ejecutar pruebas
testSequelizeConnection();
