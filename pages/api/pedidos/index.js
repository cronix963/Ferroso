import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM pedidos ORDER BY created_at DESC');
      return res.status(200).json({ items: result.rows, total: result.rows.length });
    }
    if (req.method === 'POST') {
      const { cliente, email, telefono, direccion, items, total, subtotal, impuesto, tipo, metodo_pago, notas, estado, pago } = req.body;
      if (!cliente) return res.status(400).json({ error: 'Cliente es requerido' });
      const codigo = '#P-' + Date.now();
      const sub = subtotal || total || 0;
      const imp = impuesto || 0;
      const tot = total || sub + imp;
      const result = await query(
        `INSERT INTO pedidos (codigo, cliente, email, telefono, direccion, items, subtotal, impuesto, total, tipo, metodo_pago, notas, estado, pago) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id, codigo`,
        [codigo, cliente, email||null, telefono||null, direccion||null, JSON.stringify(items||[]), sub, imp, tot, tipo||'tienda', metodo_pago||'Efectivo', notas||null, estado||'Pendiente', pago||'Pendiente']
      );
      return res.status(201).json({ message: 'Pedido creado', id: result.rows[0].id, codigo: result.rows[0].codigo });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Pedidos error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
