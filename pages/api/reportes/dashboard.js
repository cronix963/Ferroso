import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*)::int FROM users WHERE activo = TRUE) as usuarios,
        (SELECT COUNT(*)::int FROM productos WHERE activo = TRUE) as productos,
        (SELECT COUNT(*)::int FROM clientes WHERE activo = TRUE) as clientes
    `);

    const [orders, revenue, pendingOrders, recentOrders, lowStock] = await Promise.all([
      query('SELECT COUNT(*) AS total FROM pedidos'),
      query("SELECT COALESCE(SUM(total), 0) AS total FROM ventas WHERE estado = $1", ['Completada']),
      query("SELECT COUNT(*) AS total FROM pedidos WHERE estado = $1", ['Pendiente']),
      query('SELECT * FROM pedidos ORDER BY created_at DESC LIMIT 5'),
      query('SELECT COUNT(*) AS total FROM productos WHERE activo = TRUE AND stock <= stock_minimo'),
    ]);

    return res.status(200).json({
      usuarios: stats.rows[0].usuarios,
      productos: stats.rows[0].productos,
      clientes: stats.rows[0].clientes,
      totalOrders: orders.rows[0].total,
      totalRevenue: revenue.rows[0].total,
      pendingOrders: pendingOrders.rows[0].total,
      lowStockProducts: lowStock.rows[0].total,
      recentOrders: recentOrders.rows,
    });
  } catch (err) {
    console.error('[API] Dashboard error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
