-- FERROTECH — Seed data for compras (purchase orders)
-- Proveedores existentes: Cemento F (id=1), Herramientas Pro (id=2), ElectroSuministros (id=3)

INSERT INTO compras (codigo, proveedor_id, proveedor, items, total, estado, notas, created_at) VALUES

('#CO-1718000001', 1, 'Cemento F',
 '[{"producto":"Cemento Portland 50kg","cantidad":50,"unidad":"pz","precio":35.00}]'::jsonb,
 1750.00, 'Recibido', 'Compra regular de cemento para stock — 50 sacos', '2026-05-28 09:00:00'),

('#CO-1718000002', 2, 'Herramientas Pro',
 '[{"producto":"Martillo Stanley 16oz","cantidad":20,"unidad":"pz","precio":48.00},{"producto":"Cinta Métrica 5m","cantidad":30,"unidad":"pz","precio":18.00}]'::jsonb,
 1500.00, 'Recibido', 'Herramientas varias para taller', '2026-05-30 11:30:00'),

('#CO-1718000003', 3, 'ElectroSuministros',
 '[{"producto":"Cable THW 2.5mm (100m)","cantidad":10,"unidad":"pz","precio":140.00}]'::jsonb,
 1400.00, 'Pendiente', 'Esperando confirmación de entrega', '2026-06-02 14:00:00'),

('#CO-1718000004', 1, 'Cemento F',
 '[{"producto":"Cemento CPN 50kg","cantidad":40,"unidad":"pz","precio":33.00}]'::jsonb,
 1320.00, 'Recibido', 'Reabastecimiento cemento CPN', '2026-06-03 08:30:00'),

('#CO-1718000005', 2, 'Herramientas Pro',
 '[{"producto":"Taladro Bosch 500W","cantidad":5,"unidad":"pz","precio":350.00},{"producto":"Disco de Corte 7\"","cantidad":50,"unidad":"pz","precio":16.00}]'::jsonb,
 2550.00, 'Recibido', 'Equipos eléctricos — promoción mayo', '2026-06-04 10:00:00'),

('#CO-1718000006', 3, 'ElectroSuministros',
 '[{"producto":"Interruptor Simple","cantidad":100,"unidad":"pz","precio":6.00},{"producto":"Foco LED 15W","cantidad":80,"unidad":"pz","precio":8.00}]'::jsonb,
 1240.00, 'En Proceso', 'Pedido grande de material eléctrico', '2026-06-06 07:45:00'),

('#CO-1718000007', 1, 'Cemento F',
 '[{"producto":"Cemento Portland 50kg","cantidad":30,"unidad":"pz","precio":35.00}]'::jsonb,
 1050.00, 'Recibido', 'Compra semanal cemento', '2026-06-07 08:00:00'),

('#CO-1718000008', 2, 'Herramientas Pro',
 '[{"producto":"Nivel de Burbuja 60cm","cantidad":15,"unidad":"pz","precio":25.00},{"producto":"Llave Inglesa 12\"","cantidad":10,"unidad":"pz","precio":40.00},{"producto":"Destornillador Set 6 pzs","cantidad":12,"unidad":"pz","precio":33.00}]'::jsonb,
 1171.00, 'Pendiente', 'Herramientas de medición y ajuste', '2026-06-09 15:30:00'),

('#CO-1718000009', 3, 'ElectroSuministros',
 '[{"producto":"Cable THW 4mm (100m)","cantidad":5,"unidad":"pz","precio":230.00}]'::jsonb,
 1150.00, 'Cancelado', 'Cancelado por cambio de especificaciones', '2026-06-08 16:00:00'),

('#CO-1718000010', 1, 'Cemento F',
 '[{"producto":"Varilla 3/8\" (12m)","cantidad":60,"unidad":"pz","precio":22.00}]'::jsonb,
 1320.00, 'Recibido', 'Varillas para proyecto puente', '2026-06-10 09:15:00')

ON CONFLICT (codigo) DO NOTHING;
