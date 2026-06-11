import { create } from 'zustand';

const searchableFields = ['cliente'];

const mapRecord = (record) => ({
  id: record.id,
  cliente_id: record.cliente_id,
  cliente: record.cliente || '',
  limite: parseFloat(record.limite) || 0,
  saldo: parseFloat(record.saldo) || 0,
  plazo_dias: record.plazo_dias || 30,
  interes_mora: parseFloat(record.interes_mora) || 0,
  estado: record.estado || 'Activo',
  notas: record.notas || '',
  created_at: record.created_at,
  updated_at: record.updated_at,
  disponible: (parseFloat(record.limite) || 0) - (parseFloat(record.saldo) || 0),
});

const API_ENDPOINT = '/api/creditos';

export const useCreditosStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_ENDPOINT);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al cargar créditos');
      set({ items: json.data.map(mapRecord), loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addItem: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al crear crédito');
      set((s) => ({ items: [...s.items, mapRecord(json.data)], loading: false }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  updateItem: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al actualizar crédito');
      set((s) => ({
        items: s.items.map((i) => (i.id === id ? { ...i, ...mapRecord(json.data) } : i)),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  removeItem: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_ENDPOINT}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar crédito');
      set((s) => ({ items: s.items.filter((i) => i.id !== id), loading: false }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  getById: (id) => get().items.find((i) => i.id === id),

  search: (query) => {
    const q = query.toLowerCase();
    return get().items.filter((i) =>
      searchableFields.some((field) => String(i[field]).toLowerCase().includes(q)),
    );
  },
}));
