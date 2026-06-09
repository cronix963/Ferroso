import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM compras ORDER BY created_at DESC');
      return res.status(200).json({ items: result.rows, total: result.rows.length });
    }
    if (req.method === 'POST') {
      const { proveedor, items, total, notas } = req.body;
      if (!proveedor) return res.status(400).json({ error: 'Proveedor es requerido' });
      const codigo = '#CO-' + Date.now();
      const result = await query(
        `INSERT INTO compras (codigo, proveedor, items, total, notas) VALUES ($1,$2,$3::jsonb,$4,$5) RETURNING id, codigo`,
        [codigo, proveedor, JSON.stringify(items||[]), total||0, notas||null]
      );
      return res.status(201).json({ message: 'Compra registrada', id: result.rows[0].id, codigo: result.rows[0].codigo });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Compras error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
