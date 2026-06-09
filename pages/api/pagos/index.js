import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM pagos_cobros ORDER BY created_at DESC');
      return res.status(200).json({ data: result.rows, total: result.rows.length });
    }
    if (req.method === 'POST') {
      const { tipo, referencia_id, referencia_tipo, monto, metodo, concepto } = req.body;
      if (!tipo || !monto || !metodo) return res.status(400).json({ error: 'Tipo, monto y método son requeridos' });
      const result = await query(
        `INSERT INTO pagos_cobros (tipo, referencia_id, referencia_tipo, monto, metodo, concepto) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [tipo, referencia_id||null, referencia_tipo||null, monto, metodo, concepto||null]
      );
      return res.status(201).json({ data: result.rows[0] });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Pagos error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
