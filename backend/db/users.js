/**
 * Schema de usuarios para la base de datos SQLite
 * SPEC: Gestión de Usuarios (SPEC003)
 */

import db from './database.js';

/**
 * Crea la tabla de usuarios si no existe
 */
export function createUsersTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  
  // Crear índice para búsqueda por email
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
  `);
}

/**
 * Busca un usuario por email
 * @param {string} email 
 * @returns {object|null}
 */
export function findUserByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
}

/**
 * Busca un usuario por ID
 * @param {string} id 
 * @returns {object|null}
 */
export function findUserById(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
}

/**
 * Crea un nuevo usuario
 * @param {object} user - { id, email, password_hash, name, role }
 * @returns {object}
 */
export function createUser(user) {
  const stmt = db.prepare(`
    INSERT INTO users (id, email, password_hash, name, role)
    VALUES (@id, @email, @password_hash, @name, @role)
  `);
  
  return stmt.run(user);
}

/**
 * Actualiza un usuario
 * @param {string} id 
 * @param {object} updates - { name?, email? }
 * @returns {object}
 */
export function updateUser(id, updates) {
  const fields = [];
  const values = { id };
  
  if (updates.name !== undefined) {
    fields.push('name = @name');
    values.name = updates.name;
  }
  
  if (updates.email !== undefined) {
    fields.push('email = @email');
    values.email = updates.email;
  }
  
  fields.push("updated_at = datetime('now')");
  
  const stmt = db.prepare(`
    UPDATE users SET ${fields.join(', ')} WHERE id = @id
  `);
  
  return stmt.run(values);
}

/**
 * Elimina un usuario por ID
 * @param {string} id 
 * @returns {object}
 */
export function deleteUser(id) {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  return stmt.run(id);
}

/**
 * Lista usuarios con paginación
 * @param {number} page 
 * @param {number} limit 
 * @returns {object} { users, total }
 */
export function listUsers(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  const countStmt = db.prepare('SELECT COUNT(*) as total FROM users');
  const total = countStmt.get().total;
  
  const stmt = db.prepare('SELECT * FROM users LIMIT ? OFFSET ?');
  const users = stmt.all(limit, offset);
  
  // Remove password_hash from results
  const sanitizedUsers = users.map(({ password_hash, ...user }) => user);
  
  return { users: sanitizedUsers, total };
}

// Inicializar tabla al importar
createUsersTable();