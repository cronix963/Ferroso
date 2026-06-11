import { useEffect, useState } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { useCreditosStore } from '../../stores/creditos.store';
import LoadingSpinner from '../LoadingSpinner';
import ErrorBanner from '../ErrorBanner';
import EmptyState from '../EmptyState';
import FormModal from '../FormModal';
import ConfirmModal from '../ConfirmModal';
import { formatPrice } from '../../lib/price';

const badge = (s) => ({
  'Activo':'bg-[#C6F6D5] text-[#22543D]',
  'Suspendido':'bg-[#FED7AA] text-[#7B341E]',
  'Cancelado':'bg-[#FED7D7] text-[#9B2C2C]',
}[s]||'bg-[#FEFCBF] text-[#744210]');

export default function CreditosView() {
  const { items, loading, error, fetchAll, addItem, updateItem, removeItem, search } = useCreditosStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState('');
  const [q, setQ] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clientes, setClientes] = useState([]);

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    fetch('/api/clientes?limit=200')
      .then(r => r.json())
      .then(j => setClientes(j.data || []))
      .catch(() => {});
  }, []);

  const filtered = q ? search(q) : items;

  const openNewForm = () => { setEditing(null); setFormData({ cliente_id: '', limite: '', plazo_dias: 30, interes_mora: 0, estado: 'Activo', notas: '' }); setFormError(''); setShowForm(true); };
  const openEditForm = (record) => { setEditing(record); setFormData({ ...record }); setFormError(''); setShowForm(true); };

  if (loading && items.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error} onRetry={fetchAll} />;
  if (!loading && items.length === 0) return <EmptyState message="No hay créditos registrados" onCreate={openNewForm} />;

  const handleSave = async () => {
    if (!formData.cliente_id && !formData.cliente?.trim()) {
      setFormError('Seleccioná un cliente');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const selectedCliente = clientes.find(c => c.id === Number(formData.cliente_id));
      const payload = {
        cliente_id: Number(formData.cliente_id),
        cliente: selectedCliente?.nombre || formData.cliente,
        limite: parseFloat(formData.limite) || 0,
        saldo: editing ? (formData.saldo || 0) : 0,
        plazo_dias: parseInt(formData.plazo_dias) || 30,
        interes_mora: parseFloat(formData.interes_mora) || 0,
        estado: formData.estado || 'Activo',
        notas: formData.notas || null,
      };
      if (editing) await updateItem(editing.id, payload);
      else await addItem(payload);
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      setFormError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="module-view">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-xl text-primary flex items-center gap-2">💳 Gestión de Créditos <span className="text-[0.65rem] font-normal text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">Sebastian</span></h2>
        <div className="flex gap-2">
          <button onClick={openNewForm}
            className="inline-flex items-center gap-1 px-4 py-2 bg-accent text-white border-0 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap transition-all duration-200 hover:brightness-110"><FiPlus size={14} /> Nuevo Crédito</button>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-4">Líneas de crédito, saldos y plazos por cliente</p>

      <div className="flex justify-between items-center gap-2.5 mb-3.5 flex-wrap">
        <div className="flex items-center bg-white border border-gray-200 rounded-md px-2.5 min-w-[200px] flex-1 max-w-[320px] focus-within:border-primary-light">
          <FiSearch className="text-gray-400 shrink-0" />
          <input placeholder="Buscar por cliente..." value={q} onChange={e=>setQ(e.target.value)} className="border-0 bg-transparent py-2 pl-1.5 text-xs outline-none w-full text-gray-700 placeholder:text-gray-400" />
        </div>
        <div className="text-xs text-gray-500">Total disponible: <span className="font-semibold text-primary">{formatPrice(items.reduce((s, c) => s + c.disponible, 0))}</span></div>
      </div>

      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden border border-gray-200">
        <thead className="bg-primary">
          <tr>
            <th className="text-white font-semibold text-[0.68rem] uppercase tracking-wider px-3 py-2.5 text-left">CLIENTE</th>
            <th className="text-white font-semibold text-[0.68rem] uppercase tracking-wider px-3 py-2.5 text-right">LÍMITE</th>
            <th className="text-white font-semibold text-[0.68rem] uppercase tracking-wider px-3 py-2.5 text-right">SALDO</th>
            <th className="text-white font-semibold text-[0.68rem] uppercase tracking-wider px-3 py-2.5 text-right">DISPONIBLE</th>
            <th className="text-white font-semibold text-[0.68rem] uppercase tracking-wider px-3 py-2.5 text-center">PLAZO</th>
            <th className="text-white font-semibold text-[0.68rem] uppercase tracking-wider px-3 py-2.5 text-left">ESTADO</th>
            <th className="text-white font-semibold text-[0.68rem] uppercase tracking-wider px-3 py-2.5 text-center w-24">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr className="border-b border-gray-100"><td colSpan={7} className="px-7 py-7 text-center text-gray-400 text-xs">No se encontraron créditos</td></tr>
          ) : filtered.map(c => (
            <tr key={c.id} className="border-b border-gray-100 even:bg-gray-50 hover:bg-primary-100 transition-colors duration-100">
              <td className="px-3 py-2 text-xs text-gray-700 font-medium">{c.cliente}</td>
              <td className="px-3 py-2 text-xs text-gray-700 font-semibold text-right">{formatPrice(c.limite)}</td>
              <td className={`px-3 py-2 text-xs font-semibold text-right ${c.saldo > 0 ? 'text-warning' : 'text-gray-700'}`}>{formatPrice(c.saldo)}</td>
              <td className={`px-3 py-2 text-xs font-semibold text-right ${c.disponible > 0 ? 'text-success' : 'text-danger'}`}>{formatPrice(c.disponible)}</td>
              <td className="px-3 py-2 text-xs text-gray-700 text-center">{c.plazo_dias} días</td>
              <td className="px-3 py-2 text-xs"><span className={`inline-flex px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ${badge(c.estado)}`}>{c.estado}</span></td>
              <td className="px-3 py-2 text-xs text-center">
                <button onClick={() => openEditForm(c)} className="text-primary hover:underline text-xs mr-3">Editar</button>
                <button onClick={() => {
                  setDeleteTarget({ id: c.id, nombre: c.cliente });
                  setShowDeleteModal(true);
                }} className="text-danger hover:underline text-xs">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <FormModal title={editing ? 'Editar Crédito' : 'Nuevo Crédito'} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); setFormError(''); }} loading={saving}>
          <div className="space-y-3">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-md px-3 py-2">{formError}</div>
            )}
            <label className="block">
              <span className="text-gray-600 text-sm">Cliente <span className="text-danger">*</span></span>
              {editing ? (
                <input type="text" value={formData.cliente || ''} disabled className="w-full border rounded px-3 py-2 text-sm mt-1 bg-gray-50 text-gray-500" />
              ) : (
                <select value={formData.cliente_id || ''} onChange={e => {
                  const cliente = clientes.find(c => c.id === Number(e.target.value));
                  setFormData({...formData, cliente_id: e.target.value, cliente: cliente?.nombre || ''});
                }} className="w-full border rounded px-3 py-2 text-sm mt-1" required>
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              )}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-gray-600 text-sm">Límite (Bs) <span className="text-danger">*</span></span>
                <input type="number" step="0.01" min="0" value={formData.limite ?? ''} onChange={e => setFormData({...formData, limite: e.target.value})} className="w-full border rounded px-3 py-2 text-sm mt-1" placeholder="0.00" required />
              </label>
              <label className="block">
                <span className="text-gray-600 text-sm">Plazo (días)</span>
                <input type="number" min="1" value={formData.plazo_dias ?? 30} onChange={e => setFormData({...formData, plazo_dias: parseInt(e.target.value) || 30})} className="w-full border rounded px-3 py-2 text-sm mt-1" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {editing && (
                <label className="block">
                  <span className="text-gray-600 text-sm">Saldo Actual (Bs)</span>
                  <input type="number" step="0.01" min="0" value={formData.saldo ?? 0} onChange={e => setFormData({...formData, saldo: parseFloat(e.target.value) || 0})} className="w-full border rounded px-3 py-2 text-sm mt-1" />
                </label>
              )}
              <label className="block">
                <span className="text-gray-600 text-sm">Interés Mora (%)</span>
                <input type="number" step="0.1" min="0" value={formData.interes_mora ?? 0} onChange={e => setFormData({...formData, interes_mora: parseFloat(e.target.value) || 0})} className="w-full border rounded px-3 py-2 text-sm mt-1" placeholder="0" />
              </label>
              <label className="block">
                <span className="text-gray-600 text-sm">Estado</span>
                <select value={formData.estado || 'Activo'} onChange={e => setFormData({...formData, estado: e.target.value})} className="w-full border rounded px-3 py-2 text-sm mt-1">
                  <option value="Activo">Activo</option>
                  <option value="Suspendido">Suspendido</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-gray-600 text-sm">Notas</span>
              <textarea value={formData.notas || ''} onChange={e => setFormData({...formData, notas: e.target.value})} className="w-full border rounded px-3 py-2 text-sm mt-1" placeholder="Observaciones (opcional)" />
            </label>
          </div>
        </FormModal>
      )}

      {showDeleteModal && deleteTarget && (
        <ConfirmModal
          show={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
          onConfirm={async () => {
            setDeleting(true);
            await removeItem(deleteTarget.id);
            setShowDeleteModal(false);
            setDeleteTarget(null);
            setDeleting(false);
          }}
          title="Eliminar Crédito"
          message={`¿Eliminar crédito de "${deleteTarget.nombre}"?`}
          loading={deleting}
        />
      )}
    </div>
  );
}
