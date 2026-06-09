import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { search, categoria } = req.query;
      let sqlStr = `SELECT p.*, c.nombre AS categoria_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.activo = TRUE`;
      const params = [];
      let pi = 1;
      if (search) { sqlStr += ` AND (p.nombre ILIKE $${pi} OR p.descripcion ILIKE $${pi} OR p.codigo_barras ILIKE $${pi})`; params.push(`%${search}%`); pi++; }
      if (categoria) { sqlStr += ` AND (p.categoria = $${pi} OR c.nombre = $${pi})`; params.push(categoria); pi++; }
      sqlStr += ` ORDER BY p.created_at DESC`;
      const result = await query(sqlStr, params);
      return res.status(200).json({ items: result.rows, total: result.rows.length });
    }
    if (req.method === 'POST') {
      const { nombre, descripcion, categoria_id, categoria, precio, precio_compra, stock, stock_minimo, unidad, codigo_barras, codigo_interno, proveedor_id, icono, imagen } = req.body;
      if (!nombre || precio === undefined) return res.status(400).json({ error: 'Nombre y precio son requeridos' });
      const result = await query(
        `INSERT INTO productos (nombre, descripcion, categoria_id, categoria, precio, precio_compra, stock, stock_minimo, unidad, codigo_barras, codigo_interno, proveedor_id, icono, imagen, activo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,TRUE) RETURNING id`,
        [nombre, descripcion||null, categoria_id||null, categoria||null, precio, precio_compra||0, stock||0, stock_minimo||5, unidad||'unidad', codigo_barras||null, codigo_interno||null, proveedor_id||null, icono||'📦', imagen||null]
      );
      return res.status(201).json({ message: 'Producto creado exitosamente', id: result.rows[0].id });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('[API] Productos error:', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
