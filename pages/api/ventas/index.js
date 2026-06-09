import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM ventas ORDER BY created_at DESC');
      return res.status(200).json({ data: result.rows, total: result.rows.length });
    }
    if (req.method === 'POST') {
      const { pedido_id, vendedor_id, cliente_id, total, metodo_pago, notas } = req.body;
      const result = await query(
        `INSERT INTO ventas (pedido_id, vendedor_id, cliente_id, total, metodo_pago, notas) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [pedido_id||null, vendedor_id||null, cliente_id||null, total||0, metodo_pago||null, notas||null]
      );
      return res.status(201).json({ data: result.rows[0] });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Ventas error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
