import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM cotizaciones ORDER BY created_at DESC');
      return res.status(200).json({ items: result.rows, total: result.rows.length });
    }
    if (req.method === 'POST') {
      const { cliente, items, subtotal, impuesto, total, notas } = req.body;
      if (!cliente) return res.status(400).json({ error: 'Cliente es requerido' });
      const codigo = '#C-' + Date.now();
      const result = await query(
        `INSERT INTO cotizaciones (codigo, cliente, items, subtotal, impuesto, total, notas) VALUES ($1,$2,$3::jsonb,$4,$5,$6,$7) RETURNING id, codigo`,
        [codigo, cliente, JSON.stringify(items||[]), subtotal||0, impuesto||0, total||0, notas||null]
      );
      return res.status(201).json({ message: 'Cotización creada', id: result.rows[0].id, codigo: result.rows[0].codigo });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Cotizaciones error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
