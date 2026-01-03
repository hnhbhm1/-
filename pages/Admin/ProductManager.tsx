
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { Plus, Trash2, Edit2, Check, X, Phone, Globe, Image as ImageIcon } from 'lucide-react';
import { Product, ProductTier } from '../../types';
import { DEFAULT_IMAGE, DEFAULT_WHATSAPP } from '../../constants';

const ProductManager: React.FC = () => {
  const { state, updateState } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const countryCodes = [
    { code: '+967', name: 'اليمن' },
    { code: '+966', name: 'السعودية' },
    { code: '+971', name: 'الإمارات' },
    { code: '+20', name: 'مصر' },
    { code: '+962', name: 'الأردن' },
  ];

  const [countryCode, setCountryCode] = useState('+967');
  const [phoneNumber, setPhoneNumber] = useState('735670700');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    categoryId: state.categories[0]?.id || 'games',
    image: DEFAULT_IMAGE,
    hasTiers: true,
    tiers: [],
    minQuantity: 1000,
    pricePerMinUSD: 0,
    whatsappNumber: DEFAULT_WHATSAPP
  });

  const handleSave = () => {
    if (!formData.name) return alert('يرجى إدخال اسم المنتج');

    const fullWhatsApp = `${countryCode}${phoneNumber.replace(/^0+/, '')}`;

    const productPayload = {
      ...formData,
      whatsappNumber: fullWhatsApp,
    };

    if (editingId) {
      const updated = state.products.map(p => p.id === editingId ? { ...p, ...productPayload } : p);
      updateState({ products: updated as Product[] });
      setEditingId(null);
    } else {
      const newProduct = {
        ...productPayload,
        id: Math.random().toString(36).substr(2, 9),
      } as Product;
      updateState({ products: [...state.products, newProduct] });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: state.categories[0]?.id || 'games',
      image: DEFAULT_IMAGE,
      hasTiers: true,
      tiers: [],
      minQuantity: 1000,
      pricePerMinUSD: 0,
      whatsappNumber: DEFAULT_WHATSAPP
    });
    setEditingId(null);
    setCountryCode('+967');
    setPhoneNumber('735670700');
  };

  const deleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف المنتج؟')) {
      updateState({ products: state.products.filter(p => p.id !== id) });
    }
  };

  const startEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    
    const match = product.whatsappNumber.match(/^(\+\d{1,4})(\d+)$/);
    if (match) {
      setCountryCode(match[1]);
      setPhoneNumber(match[2]);
    } else {
      setPhoneNumber(product.whatsappNumber);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addTier = () => {
    const newTier: ProductTier = {
      id: Math.random().toString(36).substr(2, 5),
      name: '',
      priceUSD: 0
    };
    setFormData({ ...formData, tiers: [...(formData.tiers || []), newTier] });
  };

  const updateTier = (index: number, key: keyof ProductTier, value: string | number) => {
    const newTiers = [...(formData.tiers || [])];
    newTiers[index] = { ...newTiers[index], [key]: value };
    setFormData({ ...formData, tiers: newTiers });
  };

  const removeTier = (index: number) => {
    const newTiers = [...(formData.tiers || [])];
    newTiers.splice(index, 1);
    setFormData({ ...formData, tiers: newTiers });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white">{editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
        {editingId && (
          <button onClick={resetForm} className="text-red-500 hover:text-red-600 flex items-center gap-1 font-bold">
            <X size={18} /> إلغاء التعديل
          </button>
        )}
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] space-y-8 border border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300">اسم المنتج</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-primary-500 dark:text-white transition-all"
              placeholder="مثال: شدات ببجي"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300">القسم</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-primary-500 dark:text-white transition-all"
            >
              {state.categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300">رابط صورة المنتج</label>
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
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300">رقم واتساب الموحد</label>
            <div className="flex gap-2">
              <select 
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-1/3 p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-primary-500 dark:text-white transition-all"
              >
                {countryCodes.map(cc => (
                  <option key={cc.code} value={cc.code}>{cc.code} ({cc.name})</option>
                ))}
              </select>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-grow p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-primary-500 dark:text-white transition-all"
                placeholder="735670700"
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-6">
          <label className="flex items-center gap-4 font-black text-slate-800 dark:text-white cursor-pointer select-none text-lg">
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasTiers}
                onChange={(e) => setFormData({ ...formData, hasTiers: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </div>
            هل يحتوي المنتج على فئات شحن؟
          </label>

          {formData.hasTiers ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm font-black text-slate-500">قائمة فئات الشحن المتاحة:</span>
                <button onClick={addTier} className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-black hover:bg-primary-100 transition-all">
                  <Plus size={16} /> إضافة فئة
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.tiers?.map((tier, idx) => (
                  <div key={tier.id} className="flex gap-3 items-end bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex-grow space-y-1">
                      <label className="text-[10px] block font-black text-slate-400 uppercase">اسم الفئة</label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => updateTier(idx, 'name', e.target.value)}
                        className="w-full p-2 bg-white dark:bg-slate-800 border rounded-xl outline-none focus:border-primary-500 dark:text-white"
                        placeholder="60 شدة"
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <label className="text-[10px] block font-black text-slate-400 uppercase">السعر ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={tier.priceUSD}
                        onChange={(e) => updateTier(idx, 'priceUSD', Number(e.target.value))}
                        className="w-full p-2 bg-white dark:bg-slate-800 border rounded-xl outline-none focus:border-primary-500 dark:text-white text-center"
                      />
                    </div>
                    <button onClick={() => removeTier(idx)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300">أقل كمية للطلب</label>
                <input
                  type="number"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900/30 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-primary-500 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300">سعر الوحدة بالدولار ($)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.pricePerMinUSD}
                  onChange={(e) => setFormData({ ...formData, pricePerMinUSD: Number(e.target.value) })}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900/30 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-primary-500 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-grow bg-primary-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all flex items-center justify-center gap-3 text-lg"
          >
            {editingId ? <><Check size={24} /> حفظ جميع التعديلات</> : <><Plus size={24} /> إضافة المنتج للمتجر</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.products.map(product => (
          <div key={product.id} className="group bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="aspect-square relative overflow-hidden">
              <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button onClick={() => startEdit(product)} className="w-14 h-14 bg-white text-primary-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Edit2 size={24} />
                </button>
                <button onClick={() => deleteProduct(product.id)} className="w-14 h-14 bg-white text-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Trash2 size={24} />
                </button>
              </div>
              <div className="absolute top-6 left-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg ${product.hasTiers ? 'bg-purple-600 text-white' : 'bg-amber-500 text-white'}`}>
                  {product.hasTiers ? 'فئات' : 'كمية'}
                </span>
              </div>
            </div>
            <div className="p-8">
              <p className="text-[10px] font-black text-primary-500 uppercase mb-1 tracking-widest">
                {state.categories.find(c => c.id === product.categoryId)?.name}
              </p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">{product.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManager;
