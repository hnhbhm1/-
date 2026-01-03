
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { Plus, Trash2, Edit2, Check, X, Layers, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types';
import { DEFAULT_IMAGE } from '../../constants';

const CategoryManager: React.FC = () => {
  const { state, updateState } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: DEFAULT_IMAGE
  });

  const handleSave = () => {
    if (!formData.name) return;

    if (editingId) {
      const updated = state.categories.map(c => c.id === editingId ? { ...c, ...formData } : c);
      updateState({ categories: updated });
    } else {
      const newCat: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        image: formData.image || DEFAULT_IMAGE
      };
      updateState({ categories: [...state.categories, newCat] });
    }
    setFormData({ name: '', image: DEFAULT_IMAGE });
    setEditingId(null);
  };

  const deleteCategory = (id: string) => {
    if (confirm('سيتم حذف القسم وجميع المنتجات المرتبطة به. متأكد؟')) {
      updateState({
        categories: state.categories.filter(c => c.id !== id),
        products: state.products.filter(p => p.categoryId !== id)
      });
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, image: cat.image });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-slate-800 dark:text-white">إدارة الأقسام</h2>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300">اسم القسم</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-primary-500 dark:text-white transition-all"
              placeholder="مثال: شحن تطبيقات"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300">رابط صورة القسم</label>
            <div className="relative">
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-4 pr-12 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-primary-500 dark:text-white transition-all"
                placeholder="رابط الصورة المباشر"
              />
              <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-grow bg-primary-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
          >
            {editingId ? <><Check size={20} /> حفظ التعديلات</> : <><Plus size={20} /> إضافة قسم جديد</>}
          </button>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setFormData({ name: '', image: DEFAULT_IMAGE }); }}
              className="px-8 py-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
            >
              إلغاء
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.categories.map(cat => (
          <div key={cat.id} className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="aspect-video relative overflow-hidden">
              <img src={cat.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => startEdit(cat)} className="w-12 h-12 bg-white text-primary-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Edit2 size={20} />
                </button>
                <button onClick={() => deleteCategory(cat.id)} className="w-12 h-12 bg-white text-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Layers className="text-primary-500" size={20} />
                {cat.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
