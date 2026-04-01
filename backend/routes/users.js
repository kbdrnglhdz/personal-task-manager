/**
 * Rutas de usuarios
 * SPEC: Gestión de Usuarios (SPEC003)
 */

import { Router } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  listUsers
} from '../db/users.js';
import { verifyToken, requireAdmin, generateToken } from '../middleware/auth.js';

const router = Router();
const BCRYPT_ROUNDS = 10;

/**
 * Validar email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validar password (mínimo 8 caracteres)
 */
function isValidPassword(password) {
  return password && password.length >= 8;
}

/**
 * Validar name (obligatorio, máximo 100 caracteres)
 */
function isValidName(name) {
  return name && name.trim().length > 0 && name.length <= 100;
}

// POST /api/users/register - Registrar nuevo usuario
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  // Validaciones
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  
  if (!password || !isValidPassword(password)) {
    return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
  }
  
  if (!isValidName(name)) {
    return res.status(400).json({ error: 'Nombre es requerido (máximo 100 caracteres)' });
  }
  
  // Verificar email único
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }
  
  try {
    // Hash password
    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    
    // Crear usuario
    const user = {
      id: uuidv4(),
      email,
      password_hash,
      name: name.trim(),
      role: 'user'
    };
    
    createUser(user);
    
    // Retornar sin password_hash
    const { password_hash: _, ...userWithoutPassword } = user;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// POST /api/users/login - Iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }
  
  // Buscar usuario
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }
  
  // Verificar password
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }
  
  // Generar token
  const token = generateToken(user.id, user.role);
  
  // Retornar sin password_hash
  const { password_hash: _, ...userWithoutPassword } = user;
  
  res.json({ token, user: userWithoutPassword });
});

// GET /api/users/me - Obtener perfil actual (requiere auth)
router.get('/me', verifyToken, (req, res) => {
  res.json(req.user);
});

// PUT /api/users/me - Actualizar perfil actual
router.put('/me', verifyToken, async (req, res) => {
  const { name, email } = req.body;
  
  // Validaciones
  if (email !== undefined && !isValidEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  
  if (name !== undefined && !isValidName(name)) {
    return res.status(400).json({ error: 'Nombre inválido' });
  }
  
  // Verificar email único (si cambia)
  if (email && email !== req.user.email) {
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está en uso' });
    }
  }
  
  const updates = {};
  if (name) updates.name = name.trim();
  if (email) updates.email = email;
  
  const updatedUser = updateUser(req.user.id, updates);
  
  if (!updatedUser) {
    return res.status(500).json({ error: 'Error al actualizar usuario' });
  }
  
  // Obtener usuario actualizado
  const user = findUserById(req.user.id);
  const { password_hash: _, ...userWithoutPassword } = user;
  
  res.json(userWithoutPassword);
});

// DELETE /api/users/me - Eliminar cuenta actual
router.delete('/me', verifyToken, (req, res) => {
  // TODO: Eliminación en cascada de tareas y comentarios
  
  deleteUser(req.user.id);
  
  res.status(204).send();
});

// GET /api/users - Listar usuarios (solo admin)
router.get('/', verifyToken, requireAdmin, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const { users, total } = listUsers(page, limit);
  
  res.json({ users, total, page, limit });
});

// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete('/:id', verifyToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  
  const user = findUserById(id);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  // No permitir que un admin se elimine a sí mismo
  if (id === req.user.id) {
    return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
  }
  
  // TODO: Eliminación en cascada de tareas y comentarios
  
  deleteUser(id);
  
  res.status(204).send();
});

export default router;