import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM creditos ORDER BY cliente ASC');
      return res.status(200).json({ data: result.rows, total: result.rows.length });
    }
    if (req.method === 'POST') {
      const { cliente_id, cliente, limite, saldo, plazo_dias, interes_mora, estado, notas } = req.body;
      if (!cliente_id) return res.status(400).json({ error: 'Cliente es requerido' });
      const result = await query(
        `INSERT INTO creditos (cliente_id, cliente, limite, saldo, plazo_dias, interes_mora, estado, notas) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [cliente_id, cliente||'', limite||0, saldo||0, plazo_dias||30, interes_mora||0, estado||'Activo', notas||null]
      );
      return res.status(201).json({ data: result.rows[0] });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Creditos error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
