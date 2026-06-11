import { query } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  try {
    await query(`CREATE TABLE IF NOT EXISTS creditos (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL,
  cliente VARCHAR(255) NOT NULL,
  limite NUMERIC(12,2) NOT NULL DEFAULT 0,
  saldo NUMERIC(12,2) NOT NULL DEFAULT 0,
  plazo_dias INTEGER NOT NULL DEFAULT 30,
  interes_mora NUMERIC(5,2) NOT NULL DEFAULT 0,
  estado VARCHAR(50) NOT NULL DEFAULT 'Activo',
  notas TEXT,
  creado_por INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (creado_por) REFERENCES users(id)
)`);

    await query('CREATE INDEX IF NOT EXISTS IX_creditos_cliente ON creditos(cliente_id)');
    await query('CREATE INDEX IF NOT EXISTS IX_creditos_estado ON creditos(estado)');

    await query(`INSERT INTO creditos (cliente_id, cliente, limite, saldo, plazo_dias, estado, notas) VALUES
(1, 'Constructora Los Andes', 50000, 0, 45, 'Activo', 'Crédito aprobado para obras grandes'),
(2, 'Ingeniería Santa Cruz', 25000, 1548.75, 30, 'Activo', 'Tiene venta pendiente de cobro'),
(3, 'Distribuidora Norte', 15000, 1463.70, 30, 'Activo', 'Tiene venta pendiente de cobro')
ON CONFLICT DO NOTHING`);

    return res.status(200).json({ message: 'Migración de créditos ejecutada correctamente' });
  } catch (err) {
    console.error('[Migration] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
