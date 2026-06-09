import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM proveedores WHERE activo = TRUE ORDER BY created_at DESC');
      return res.status(200).json({ items: result.rows, total: result.rows.length });
    }
    if (req.method === 'POST') {
      const { nombre, contacto, email, telefono, direccion, ciudad, notas } = req.body;
      if (!nombre) return res.status(400).json({ error: 'Nombre es requerido' });
      const result = await query(
        `INSERT INTO proveedores (nombre, contacto, email, telefono, direccion, ciudad, notas) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [nombre, contacto||null, email||null, telefono||null, direccion||null, ciudad||null, notas||null]
      );
      return res.status(201).json({ message: 'Proveedor creado', id: result.rows[0].id });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Proveedores error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
