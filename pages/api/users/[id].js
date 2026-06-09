import { query } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      return res.status(200).json(result.rows[0]);
    }
    if (req.method === 'PUT') {
      const { nombre, email, rol, activo } = req.body;
      const result = await query('UPDATE users SET nombre=$1, email=$2, rol=$3, activo=$4, updated_at=NOW() WHERE id=$5 RETURNING *', [nombre, email, rol, activo !== undefined ? activo : true, id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      return res.status(200).json({ data: result.rows[0] });
    }
    if (req.method === 'DELETE') {
      await query('UPDATE users SET activo = FALSE, updated_at = NOW() WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Usuario eliminado' });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Users/[id] error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
