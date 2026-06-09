export default function FacturaModal({ order, onClose }) {
  if (!order) return null;

  const items = order.items || [];
  const subtotal = order.subtotal || order.total || 0;
  const impuesto = order.impuesto || 0;
  const total = order.total || subtotal + impuesto;

  return (
    <div className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-5" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-[500px] w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="text-center px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="text-2xl font-extrabold text-primary tracking-wider">FERROTECH</div>
          <div className="text-[0.65rem] text-gray-400 uppercase tracking-widest">Factura de Venta</div>
        </div>

        {/* Order Info */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Pedido:</span><span className="font-bold">{order.codigo}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Fecha:</span><span>{new Date().toLocaleDateString('es-BO')}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Cliente:</span><span>{order.cliente}</span>
          </div>
          {order.email && (
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Email:</span><span>{order.email}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-gray-600">
            <span>Método de pago:</span><span className="font-semibold">{order.metodo_pago}</span>
          </div>
        </div>

        {/* Items */}
        <div className="px-6 py-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-500 font-semibold">Producto</th>
                <th className="text-center py-2 text-gray-500 font-semibold">Cant.</th>
                <th className="text-right py-2 text-gray-500 font-semibold">Precio</th>
                <th className="text-right py-2 text-gray-500 font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 text-gray-700">{item.nombre}</td>
                  <td className="py-2 text-center text-gray-700">{item.cantidad}</td>
                  <td className="py-2 text-right text-gray-700">Bs{Number(item.precio).toFixed(2)}</td>
                  <td className="py-2 text-right text-gray-700 font-medium">Bs{(item.cantidad * item.precio).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 pb-4">
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Subtotal:</span><span>Bs{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>IVA (13%):</span><span>Bs{impuesto.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-primary border-t border-gray-200 pt-2">
              <span>TOTAL:</span><span>Bs{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Confirmation Badge */}
        <div className="px-6 pb-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-semibold border border-green-200">
            ✅ Pago Confirmado
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-2">
          <button onClick={() => window.print()} className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-primary text-white border-0 cursor-pointer hover:bg-primary-light transition-all">
            🖨 Imprimir
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-white text-gray-600 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
