import { query } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM creditos WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Crédito no encontrado' });
      return res.status(200).json(result.rows[0]);
    }
    if (req.method === 'PUT') {
      const { cliente_id, cliente, limite, saldo, plazo_dias, interes_mora, estado, notas } = req.body;
      const result = await query(
        `UPDATE creditos SET cliente_id=$1, cliente=$2, limite=$3, saldo=$4, plazo_dias=$5, interes_mora=$6, estado=$7, notas=$8, updated_at=NOW() WHERE id=$9 RETURNING *`,
        [cliente_id, cliente, limite||0, saldo||0, plazo_dias||30, interes_mora||0, estado||'Activo', notas||null, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Crédito no encontrado' });
      return res.status(200).json({ data: result.rows[0] });
    }
    if (req.method === 'DELETE') {
      const result = await query('DELETE FROM creditos WHERE id = $1', [id]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'Crédito no encontrado' });
      return res.status(200).json({ message: 'Crédito eliminado' });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Creditos/[id] error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
