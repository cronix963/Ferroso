import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM envios ORDER BY created_at DESC');
      return res.status(200).json({ items: result.rows, total: result.rows.length });
    }
    if (req.method === 'POST') {
      const { pedido_id, direccion, ciudad, transportista, tracking_numero, notas } = req.body;
      if (!direccion) return res.status(400).json({ error: 'Dirección es requerida' });
      const result = await query(
        `INSERT INTO envios (pedido_id, direccion, ciudad, transportista, tracking_numero, notas) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        [pedido_id||null, direccion, ciudad||null, transportista||null, tracking_numero||null, notas||null]
      );
      return res.status(201).json({ message: 'Envío registrado', id: result.rows[0].id });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Envios error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
