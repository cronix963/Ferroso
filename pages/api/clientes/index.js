import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM clientes WHERE activo = TRUE ORDER BY created_at DESC');
      return res.status(200).json({ items: result.rows, total: result.rows.length });
    }
    if (req.method === 'POST') {
      const { nombre, email, telefono, direccion, ciudad, nit, empresa } = req.body;
      if (!nombre) return res.status(400).json({ error: 'Nombre es requerido' });
      const result = await query(
        `INSERT INTO clientes (nombre, email, telefono, direccion, ciudad, nit, empresa) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [nombre, email||null, telefono||null, direccion||null, ciudad||null, nit||null, empresa||null]
      );
      return res.status(201).json({ message: 'Cliente creado', id: result.rows[0].id });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Clientes error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
