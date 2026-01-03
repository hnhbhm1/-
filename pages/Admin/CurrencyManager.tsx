
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { Plus, Trash2, Edit2, Check, X, ToggleRight, ToggleLeft } from 'lucide-react';
import { Currency } from '../../types';

const CurrencyManager: React.FC = () => {
  const { state, updateState } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Currency>>({
    name: '',
    code: '',
    symbol: '',
    rate: 1,
    isActive: true
  });

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.rate) return alert('أكمل جميع البيانات');

    if (editingId) {
      const updated = state.currencies.map(c => c.id === editingId ? { ...c, ...formData } : c);
      updateState({ currencies: updated as Currency[] });
      setEditingId(null);
    } else {
      const newCurr: Currency = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Currency;
      updateState({ currencies: [...state.currencies, newCurr] });
    }
    setFormData({ name: '', code: '', symbol: '', rate: 1, isActive: true });
  };

  const toggleStatus = (id: string) => {
    const updated = state.currencies.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
    updateState({ currencies: updated });
  };

  const deleteCurrency = (id: string) => {
    if (id === '1' || state.currencies.find(c => c.id === id)?.code === 'USD') {
      return alert('لا يمكن حذف العملة الأساسية (USD)');
    }
    updateState({ currencies: state.currencies.filter(c => c.id !== id) });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">إدارة العملات</h2>

      <div className="bg-gray-50 p-6 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs mb-1">الاسم</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded-lg"
            placeholder="ريال سعودي"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">الكود</label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full p-2 border rounded-lg"
            placeholder="SAR"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">الرمز</label>
          <input
            type="text"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            className="w-full p-2 border rounded-lg"
            placeholder="ر.س"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">سعر الصرف مقابل 1 USD</label>
          <input
            type="number"
            step="0.01"
            value={formData.rate}
            onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="md:col-span-4 flex justify-end gap-2">
          <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
            {editingId ? 'تحديث' : 'إضافة'}
          </button>
          {editingId && <button onClick={() => { setEditingId(null); setFormData({ name: '', code: '', symbol: '', rate: 1, isActive: true }); }} className="bg-gray-200 px-4 py-2 rounded-lg">إلغاء</button>}
        </div>
      </div>

      <div className="space-y-3">
        {state.currencies.map(curr => (
          <div key={curr.id} className="bg-white border p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold">{curr.name} ({curr.symbol})</p>
              <p className="text-sm text-gray-500">1 USD = {curr.rate} {curr.code}</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => toggleStatus(curr.id)} className={`flex items-center gap-1 ${curr.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                {curr.isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
              <button onClick={() => { setEditingId(curr.id); setFormData(curr); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Edit2 size={18} />
              </button>
              {curr.code !== 'USD' && (
                <button onClick={() => deleteCurrency(curr.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrencyManager;
