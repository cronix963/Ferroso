import { query } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM pedidos WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
      return res.status(200).json(result.rows[0]);
    }
    if (req.method === 'PUT') {
      const { estado, pago, notas, metodo_pago } = req.body;
      const result = await query('UPDATE pedidos SET estado=$1, pago=$2, notas=$3, metodo_pago=$4, updated_at=NOW() WHERE id=$5 RETURNING id',
        [estado, pago, notas, metodo_pago, id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
      return res.status(200).json({ message: 'Pedido actualizado' });
    }
    if (req.method === 'DELETE') {
      await query('DELETE FROM pedidos WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Pedido eliminado' });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Pedidos/[id] error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
