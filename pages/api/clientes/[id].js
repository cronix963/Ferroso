import { query } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM clientes WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
      return res.status(200).json(result.rows[0]);
    }
    if (req.method === 'PUT') {
      const { nombre, email, telefono, direccion, ciudad, nit, empresa, activo } = req.body;
      const result = await query('UPDATE clientes SET nombre=$1, email=$2, telefono=$3, direccion=$4, ciudad=$5, nit=$6, empresa=$7, activo=$8, updated_at=NOW() WHERE id=$9 RETURNING id',
        [nombre, email, telefono, direccion, ciudad, nit, empresa, activo !== undefined ? activo : true, id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
      return res.status(200).json({ message: 'Cliente actualizado' });
    }
    if (req.method === 'DELETE') {
      await query('UPDATE clientes SET activo = FALSE, updated_at = NOW() WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Cliente eliminado' });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Clientes/[id] error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
