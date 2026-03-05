-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de tareas
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_done ON tasks(done);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Insertar usuarios de superhéroes DC y Marvel
-- NOTA IMPORTANTE: Las contraseñas aquí están en texto plano solo para referencia
-- Para que el login funcione, ejecuta el script: node fix-passwords.js
-- Este script hasheará las contraseñas usando bcrypt
INSERT INTO users (username, password, status) VALUES
-- DC Heroes
('superman', 'clark123', 'active'),
('batman', 'bruce123', 'active'),
('wonderwoman', 'diana123', 'active'),
('flash', 'barry123', 'active'),
('aquaman', 'arthur123', 'active'),
('greenlantern', 'hal123', 'inactive'),
('cyborg', 'victor123', 'active'),
('shazam', 'billy123', 'active'),
-- Marvel Heroes
('ironman', 'tony123', 'active'),
('spiderman', 'peter123', 'active'),
('captainamerica', 'steve123', 'active'),
('thor', 'odinson123', 'active'),
('hulk', 'bruce123', 'active'),
('blackwidow', 'natasha123', 'inactive'),
('hawkeye', 'clint123', 'active'),
('doctorstrange', 'stephen123', 'active'),
('blackpanther', 'tchalla123', 'active'),
('scarletwitch', 'wanda123', 'active'),
('vision', 'jarvis123', 'inactive'),
('antman', 'scott123', 'active')
ON CONFLICT (username) DO NOTHING;

-- Insertar tareas de ejemplo para los superhéroes
-- Nota: Los IDs de usuario pueden variar según inserciones previas
-- Se recomienda verificar los IDs con: SELECT id, username FROM users;
INSERT INTO tasks (name, done, user_id) VALUES
-- Superman tasks (ajustar user_id según corresponda)
('Salvar Metrópolis', false, (SELECT id FROM users WHERE username = 'superman')),
('Detener a Lex Luthor', false, (SELECT id FROM users WHERE username = 'superman')),
('Escribir artículo Daily Planet', true, (SELECT id FROM users WHERE username = 'superman')),
-- Batman tasks
('Patrullar Gotham City', false, (SELECT id FROM users WHERE username = 'batman')),
('Actualizar Batcomputadora', true, (SELECT id FROM users WHERE username = 'batman')),
('Entrenar con Robin', false, (SELECT id FROM users WHERE username = 'batman')),
-- Wonder Woman tasks
('Proteger Themyscira', false, (SELECT id FROM users WHERE username = 'wonderwoman')),
('Reunión Liga de la Justicia', true, (SELECT id FROM users WHERE username = 'wonderwoman')),
('Misión diplomática', false, (SELECT id FROM users WHERE username = 'wonderwoman')),
-- Flash tasks
('Detener a Reverse Flash', false, (SELECT id FROM users WHERE username = 'flash')),
('Salvar Central City', true, (SELECT id FROM users WHERE username = 'flash')),
-- Iron Man tasks
('Mejorar el Mark 50', false, (SELECT id FROM users WHERE username = 'ironman')),
('Reunión Stark Industries', true, (SELECT id FROM users WHERE username = 'ironman')),
('Desarrollar nuevo reactor Arc', false, (SELECT id FROM users WHERE username = 'ironman')),
-- Spider-Man tasks
('Patrullar Queens', false, (SELECT id FROM users WHERE username = 'spiderman')),
('Entregar pizzas', true, (SELECT id FROM users WHERE username = 'spiderman')),
('Tomar fotos Daily Bugle', false, (SELECT id FROM users WHERE username = 'spiderman')),
-- Captain America tasks
('Entrenamiento matutino', true, (SELECT id FROM users WHERE username = 'captainamerica')),
('Reunión con Fury', false, (SELECT id FROM users WHERE username = 'captainamerica')),
-- Thor tasks
('Defender Asgard', false, (SELECT id FROM users WHERE username = 'thor')),
('Buscar a Loki', false, (SELECT id FROM users WHERE username = 'thor')),
-- Black Panther tasks
('Proteger Wakanda', false, (SELECT id FROM users WHERE username = 'blackpanther')),
('Investigar vibranium', true, (SELECT id FROM users WHERE username = 'blackpanther')),
('Consejo tribal', false, (SELECT id FROM users WHERE username = 'blackpanther'))
ON CONFLICT DO NOTHING;
