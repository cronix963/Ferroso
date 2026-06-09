import { query } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM proveedores WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Proveedor no encontrado' });
      return res.status(200).json(result.rows[0]);
    }
    if (req.method === 'PUT') {
      const { nombre, contacto, email, telefono, direccion, ciudad, notas, activo } = req.body;
      const result = await query('UPDATE proveedores SET nombre=$1, contacto=$2, email=$3, telefono=$4, direccion=$5, ciudad=$6, notas=$7, activo=$8 WHERE id=$9 RETURNING id',
        [nombre, contacto, email, telefono, direccion, ciudad, notas, activo !== undefined ? activo : true, id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Proveedor no encontrado' });
      return res.status(200).json({ message: 'Proveedor actualizado' });
    }
    if (req.method === 'DELETE') {
      await query('UPDATE proveedores SET activo = FALSE WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Proveedor eliminado' });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Proveedores/[id] error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
