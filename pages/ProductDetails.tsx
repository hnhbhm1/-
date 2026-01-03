
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { ArrowRight, MessageCircle, Calculator, CreditCard, User, AlertCircle, Copy, Check, Globe, Plus, Minus } from 'lucide-react';
import { STORE_NAME } from '../constants';

const ProductDetails: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { state, formatPrice, activeCurrency, setActiveCurrency } = useApp();
  const product = state.products.find(p => p.id === productId);
  const category = state.categories.find(c => c.id === product?.categoryId);

  const [accountId, setAccountId] = useState('');
  const [selectedTierId, setSelectedTierId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      if (product.hasTiers && product.tiers?.length) {
        setSelectedTierId(product.tiers[0].id);
      } else if (product.minQuantity) {
        setQuantity(product.minQuantity);
      }
      
      const activePayments = state.payments.filter(p => p.isActive);
      if (activePayments.length > 0) {
        setPaymentMethodId(activePayments[0].id);
      }
    }
  }, [product, state.payments]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center dark:text-white">
        <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
        <button onClick={() => navigate('/')} className="text-primary-600 font-bold hover:underline">العودة للرئيسية</button>
      </div>
    );
  }

  const selectedTier = product.tiers?.find(t => t.id === selectedTierId);
  const selectedPayment = state.payments.find(p => p.id === paymentMethodId);
  
  const totalPriceUSD = product.hasTiers 
    ? (selectedTier?.priceUSD || 0)
    : (quantity * (product.pricePerMinUSD || 0) / (product.minQuantity || 1));

  const copyToClipboard = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleBuy = () => {
    if (!accountId.trim()) {
      alert('يرجى إدخال ID الحساب لإتمام الطلب');
      return;
    }

    if (!product.hasTiers && (!quantity || quantity < (product.minQuantity || 1))) {
      alert(`أقل كمية مسموحة هي ${product.minQuantity}`);
      return;
    }

    let message = `*${STORE_NAME}*\n`;
    message += `--------------------------\n`;
    
    if (category?.id === 'games') {
      message += `💎 القسم: شحن الألعاب\n`;
      message += `🎮 اسم المنتج: ${product.name}\n`;
      if (product.hasTiers) {
        message += `📦 الفئة المختارة: ${selectedTier?.name}\n`;
      } else {
        message += `🔢 الكمية: ${quantity}\n`;
      }
    } else if (category?.id === 'apps') {
      message += `📱 القسم: شحن البرامج\n`;
      message += `🏷️ اسم المنتج: ${product.name}\n`;
      message += `🔢 الكمية: ${quantity}\n`;
    } else {
      message += `📁 القسم: ${category?.name || 'عام'}\n`;
      message += `🏷️ اسم المنتج: ${product.name}\n`;
      message += `🔢 الكمية: ${product.hasTiers ? selectedTier?.name : quantity}\n`;
    }

    message += `💰 السعر: ${formatPrice(totalPriceUSD)}\n`;
    message += `💳 وسيلة الدفع: ${selectedPayment?.name || 'غير محددة'}\n`;
    message += `🆔 ID الحساب: ${accountId}\n`;
    message += `--------------------------\n`;
    message += `يرجى مراجعة طلبي وتأكيد الشحن.`;

    const encodedMessage = encodeURIComponent(message);
    const cleanedWhatsApp = product.whatsappNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanedWhatsApp}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const adjustQuantity = (amount: number) => {
    setQuantity(prev => {
      const step = category?.id === 'apps' ? 1000 : 1;
      const newVal = Math.max(product.minQuantity || 1, prev + amount * step);
      return newVal;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to={`/category/${product.categoryId}`} className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 group transition-colors">
        <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">العودة إلى {category?.name || 'القسم'}</span>
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2">
        {/* Product Image Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-12 flex items-center justify-center border-b md:border-b-0 md:border-l border-slate-100 dark:border-slate-700">
          <div className="relative group w-full max-w-sm">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105" 
            />
          </div>
        </div>

        {/* Purchase Options Section */}
        <div className="p-8 md:p-12">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">{product.name}</h1>
              <span className="inline-block px-4 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-bold border border-primary-100 dark:border-primary-800">
                {category?.name}
              </span>
            </div>
            {/* Quick Currency Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              {state.currencies.filter(c => c.isActive).map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCurrency(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    activeCurrency.id === c.id 
                    ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* Tiers or Quantity */}
            {product.hasTiers ? (
              <div>
                <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
                  <CreditCard size={18} className="text-primary-600" />
                  اختر فئة الشحن
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.tiers?.map(tier => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`p-5 rounded-3xl border-2 transition-all text-right flex flex-col gap-1 ${
                        selectedTierId === tier.id 
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-lg shadow-primary-200/20 scale-[1.02]' 
                        : 'border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400'
                      }`}
                    >
                      <span className="font-black text-lg">{tier.name}</span>
                      <span className="text-sm font-bold opacity-70">{formatPrice(tier.priceUSD)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
                  <Calculator size={18} className="text-primary-600" />
                  حدد الكمية المطلوبة
                </label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => adjustQuantity(-1)}
                    className="w-14 h-14 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  >
                    <Minus size={24} />
                  </button>
                  <input
                    type="number"
                    min={product.minQuantity}
                    step={category?.id === 'apps' ? 1000 : 1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="flex-grow p-5 bg-slate-50 dark:bg-slate-900/30 border-2 border-slate-100 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 outline-none transition-all font-black text-xl dark:text-white text-center"
                  />
                  <button 
                    onClick={() => adjustQuantity(1)}
                    className="w-14 h-14 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-bold">الحد الأدنى للطلب: {product.minQuantity}</p>
              </div>
            )}

            {/* Account ID Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
                <User size={18} className="text-primary-600" />
                أدخل معرف الحساب (ID)
              </label>
              <input
                type="text"
                placeholder="مثال: 123456789"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full p-5 bg-slate-50 dark:bg-slate-900/30 border-2 border-slate-100 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 outline-none transition-all font-black text-lg dark:text-white"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
                <CreditCard size={18} className="text-primary-600" />
                اختر طريقة الدفع
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {state.payments.filter(p => p.isActive).map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethodId(method.id)}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                      paymentMethodId === method.id 
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                      : 'border-slate-100 dark:border-slate-700 hover:border-primary-100 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-900/30 dark:text-slate-400'
                    }`}
                  >
                    {method.name}
                  </button>
                ))}
              </div>

              {/* Detailed Payment Info */}
              {selectedPayment && (
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <h4 className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm">
                    <AlertCircle size={16} /> معلومات التحويل لـ {selectedPayment.name}
                  </h4>
                  
                  {selectedPayment.recipientName && (
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] block text-slate-400 font-black uppercase">اسم المستلم</span>
                        <span className="font-bold dark:text-white">{selectedPayment.recipientName}</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(selectedPayment.recipientName!, 'name')}
                        className={`p-2 rounded-lg transition-all ${copiedField === 'name' ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-primary-600'}`}
                      >
                        {copiedField === 'name' ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  )}

                  {selectedPayment.accountNumber && (
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] block text-slate-400 font-black uppercase">رقم الحساب</span>
                        <span className="font-bold dark:text-white">{selectedPayment.accountNumber}</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(selectedPayment.accountNumber!, 'acc')}
                        className={`p-2 rounded-lg transition-all ${copiedField === 'acc' ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-primary-600'}`}
                      >
                        {copiedField === 'acc' ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  )}

                  {selectedPayment.transferNumber && (
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] block text-slate-400 font-black uppercase">رقم التحويل</span>
                        <span className="font-bold dark:text-white">{selectedPayment.transferNumber}</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(selectedPayment.transferNumber!, 'trans')}
                        className={`p-2 rounded-lg transition-all ${copiedField === 'trans' ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-primary-600'}`}
                      >
                        {copiedField === 'trans' ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Final Price and Buy Button */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-700 mt-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="text-center sm:text-right">
                  <p className="text-sm text-slate-400 font-black mb-1 uppercase tracking-widest">إجمالي المبلغ:</p>
                  <p className="text-4xl font-black text-primary-600 tracking-tight">
                    {formatPrice(totalPriceUSD)}
                  </p>
                </div>
                <button
                  onClick={handleBuy}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-black py-5 px-10 rounded-3xl flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-green-200 dark:shadow-none border-b-4 border-green-800"
                >
                  <MessageCircle size={28} />
                  <span className="text-xl">طلب عبر واتساب</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
