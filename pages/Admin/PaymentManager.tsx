
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
/* Added Phone to the lucide-react imports to fix 'Cannot find name Phone' error */
import { Plus, Trash2, Edit2, Check, ToggleRight, ToggleLeft, User, CreditCard, Hash, Phone } from 'lucide-react';
import { PaymentMethod } from '../../types';

const PaymentManager: React.FC = () => {
  const { state, updateState } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PaymentMethod>>({
    name: '',
    isActive: true,
    recipientName: '',
    accountNumber: '',
    transferNumber: ''
  });

  const handleSave = () => {
    if (!formData.name) return;
    if (editingId) {
      const updated = state.payments.map(p => p.id === editingId ? { ...p, ...formData } : p);
      updateState({ payments: updated as PaymentMethod[] });
    } else {
      const newMethod: PaymentMethod = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        isActive: true
      } as PaymentMethod;
      updateState({ payments: [...state.payments, newMethod] });
    }
    setFormData({ name: '', isActive: true, recipientName: '', accountNumber: '', transferNumber: '' });
    setEditingId(null);
  };

  const toggleStatus = (id: string) => {
    const updated = state.payments.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
    updateState({ payments: updated });
  };

  const deletePayment = (id: string) => {
    if (confirm('هل أنت متأكد من حذف وسيلة الدفع هذه؟')) {
      updateState({ payments: state.payments.filter(p => p.id !== id) });
    }
  };

  const startEdit = (method: PaymentMethod) => {
    setEditingId(method.id);
    setFormData(method);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-slate-800 dark:text-white">إدارة طرق الدفع</h2>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] space-y-8 border border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300">اسم وسيلة الدفع</label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 pr-12 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-primary-500 dark:text-white"
                placeholder="كريمي، النجم، بايير..."
              />
              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300">اسم المستلم</label>
            <div className="relative">
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                className="w-full p-4 pr-12 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-primary-500 dark:text-white"
                placeholder="الاسم الكامل للتحويل"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300">رقم الحساب</label>
            <div className="relative">
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full p-4 pr-12 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-primary-500 dark:text-white"
                placeholder="رقم الحساب البنكي أو المحفظة"
              />
              <Hash className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300">رقم التحويل (للشركات)</label>
            <div className="relative">
              <input
                type="text"
                value={formData.transferNumber}
                onChange={(e) => setFormData({ ...formData, transferNumber: e.target.value })}
                className="w-full p-4 pr-12 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-primary-500 dark:text-white"
                placeholder="رقم الهاتف أو المعرف للتحويل"
              />
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleSave} 
          className="w-full bg-primary-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all flex items-center justify-center gap-3 text-lg"
        >
          {editingId ? <><Check size={24} /> تحديث وسيلة الدفع</> : <><Plus size={24} /> إضافة وسيلة دفع جديدة</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.payments.map(method => (
          <div key={method.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-8 rounded-[2rem] flex items-center justify-between shadow-sm hover:shadow-xl transition-all group">
            <div className="space-y-1">
              <span className="text-2xl font-black text-slate-800 dark:text-white">{method.name}</span>
              <div className="flex gap-4">
                {method.accountNumber && <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg text-slate-500 font-bold">حساب: {method.accountNumber}</span>}
                {method.transferNumber && <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg text-slate-500 font-bold">تحويل: {method.transferNumber}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleStatus(method.id)} className={`transition-all ${method.isActive ? 'text-green-600' : 'text-slate-300'}`}>
                {method.isActive ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
              </button>
              <button onClick={() => startEdit(method)} className="p-3 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors">
                <Edit2 size={24} />
              </button>
              <button onClick={() => deletePayment(method.id)} className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentManager;
