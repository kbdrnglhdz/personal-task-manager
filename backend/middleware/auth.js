/**
 * Middleware de autenticación JWT
 * SPEC: Gestión de Usuarios (SPEC003)
 */

import jwt from 'jsonwebtoken';
import { findUserById } from '../db/users.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Extrae el token del header Authorization
 * @param {string} authHeader 
 * @returns {string|null}
 */
function extractToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

/**
 * Verifica el token JWT y añade el usuario a req.user
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
export function verifyToken(req, res, next) {
  const token = extractToken(req.headers.authorization);
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById(payload.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    // Remove password_hash from user object
    const { password_hash, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

/**
 * Verifica que el usuario sea administrador
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Sin permisos de administrador' });
  }
  next();
}

/**
 * Genera un token JWT
 * @param {string} userId 
 * @param {string} role 
 * @returns {string}
 */
export function generateToken(userId, role) {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}