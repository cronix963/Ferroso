import bcrypt from 'bcryptjs';
import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { email, password, nombre, rol } = req.body;
    if (!email || !password || !nombre) return res.status(400).json({ error: 'Email, password y nombre son requeridos' });
    if (password.length < 6) return res.status(400).json({ error: 'El password debe tener al menos 6 caracteres' });

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'El email ya está registrado' });

    const password_hash = await bcrypt.hash(password, 10);
    const userRol = rol || 'cliente';

    const result = await query(
      `INSERT INTO users (email, password_hash, nombre, rol, provider, activo) VALUES ($1, $2, $3, $4, 'credentials', TRUE) RETURNING id`,
      [email, password_hash, nombre, userRol]
    );

    return res.status(201).json({ message: 'Usuario creado exitosamente', user: { id: result.rows[0].id, email, nombre, rol: userRol } });
  } catch (err) {
    console.error('[API] Register error:', err);
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
}
