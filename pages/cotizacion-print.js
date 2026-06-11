import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CotizacionPrint() {
  const router = useRouter();
  const { codigo, cliente, cliente_id, items, subtotal, impuesto, total, validez_dias, notas, estado, created_at } = router.query;

  const parsedItems = items ? JSON.parse(decodeURIComponent(items)) : [];
  const subNum = parseFloat(subtotal) || 0;
  const impNum = parseFloat(impuesto) || 0;
  const totalNum = parseFloat(total) || 0;

  useEffect(() => {
    // Auto-print when loaded if query param is set
    if (router.query.print === 'true') {
      setTimeout(() => window.print(), 500);
    }
  }, [router.query.print]);

  const fecha = created_at
    ? new Date(decodeURIComponent(created_at)).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' });

  const vence = new Date();
  vence.setDate(vence.getDate() + (parseInt(validez_dias) || 30));
  const venceStr = vence.toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' });

  const estadoBadge = {
    'Pendiente': { bg: '#FEFCBF', text: '#744210', label: 'Pendiente' },
    'Aprobada': { bg: '#C6F6D5', text: '#22543D', label: 'Aprobada' },
    'Rechazada': { bg: '#FED7D7', text: '#9B2C2C', label: 'Rechazada' },
    'Revisión': { bg: '#FED7AA', text: '#7B341E', label: 'En Revisión' },
    'Vencida': { bg: '#E2E8F0', text: '#4A5568', label: 'Vencida' },
  }[estado] || { bg: '#FEFCBF', text: '#744210', label: estado || 'Pendiente' };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl max-w-[500px] w-full shadow-xl p-8" id="cotizacion-print">
        {/* Header */}
        <div className="text-center mb-6">
          <img src="/images/ferrotech_logo.svg" alt="FERROTECH" className="h-14 w-auto mx-auto" />
          <div className="text-[0.65rem] text-gray-400 uppercase tracking-widest mt-1">Cotización</div>
        </div>

        {/* Info */}
        <div className="space-y-1 text-xs text-gray-600 mb-4 border-b border-gray-100 pb-4">
          <div className="flex justify-between"><span>N° Cotización:</span><span className="font-bold">{codigo || 'N/A'}</span></div>
          <div className="flex justify-between"><span>Fecha Emisión:</span><span>{fecha}</span></div>
          <div className="flex justify-between"><span>Validez:</span><span>{validez_dias || 30} días (hasta {venceStr})</span></div>
          <div className="flex justify-between"><span>Cliente:</span><span className="font-semibold">{cliente || 'N/A'}</span></div>
        </div>

        {/* Estado badge */}
        <div className="text-center mb-4">
          <span style={{
            display: 'inline-flex',
            padding: '4px 16px',
            borderRadius: '9999px',
            fontSize: '0.7rem',
            fontWeight: 600,
            backgroundColor: estadoBadge.bg,
            color: estadoBadge.text,
            border: `1px solid ${estadoBadge.text}20`,
          }}>
            {estadoBadge.label}
          </span>
        </div>

        {/* Items table */}
        <table className="w-full text-xs mb-4">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-500 font-semibold">Producto</th>
              <th className="text-center py-2 text-gray-500 font-semibold">Cant.</th>
              <th className="text-right py-2 text-gray-500 font-semibold">P.U.</th>
              <th className="text-right py-2 text-gray-500 font-semibold">Subt.</th>
            </tr>
          </thead>
          <tbody>
            {parsedItems.length === 0 ? (
              <tr><td colSpan={4} className="py-6 text-center text-gray-400">Sin items</td></tr>
            ) : parsedItems.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2 text-gray-700">{item.nombre}</td>
                <td className="py-2 text-center text-gray-700">{item.cantidad}</td>
                <td className="py-2 text-right text-gray-700">Bs{(Number(item.precio) || 0).toFixed(2)}</td>
                <td className="py-2 text-right font-medium text-gray-700">Bs{((item.cantidad || 0) * (Number(item.precio) || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="border-t border-gray-200 pt-3 space-y-1 text-xs">
          <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span>Bs{subNum.toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-600"><span>IVA (13%):</span><span>Bs{impNum.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm font-bold text-primary border-t border-gray-200 pt-2"><span>TOTAL:</span><span>Bs{totalNum.toFixed(2)}</span></div>
        </div>

        {/* Notas */}
        {notas && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-[0.6rem] text-gray-400 uppercase tracking-wider font-semibold mb-1">Notas</div>
            <div className="text-xs text-gray-600">{decodeURIComponent(notas)}</div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-[0.55rem] text-gray-400">FERROTECH © {new Date().getFullYear()} — Esta cotización es una estimación y no constituye una factura.</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-6">
          <button onClick={() => window.print()} className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-primary text-white border-0 cursor-pointer hover:brightness-110">🖨 Imprimir / PDF</button>
          <button onClick={() => router.back()} className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-white text-gray-600 border border-gray-200 cursor-pointer hover:bg-gray-50">Volver</button>
        </div>
      </div>

      <style jsx>{`
        @media print {
          button { display: none !important; }
          #cotizacion-print { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
        }
      `}</style>
    </div>
  );
}
