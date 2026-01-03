
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { ShoppingCart, ArrowRight, Tag, Zap } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams();
  const { state, formatPrice } = useApp();

  const category = state.categories.find(c => c.id === categoryId);
  const products = state.products.filter(p => p.categoryId === categoryId);

  if (!category) return (
    <div className="p-20 text-center dark:text-white animate-in fade-in duration-500">
      <Tag size={64} className="mx-auto mb-6 text-slate-200 dark:text-slate-800" />
      <h2 className="text-3xl font-black mb-4">القسم غير موجود</h2>
      <Link to="/" className="text-primary-600 font-bold hover:underline px-8 py-3 bg-primary-50 dark:bg-primary-900/30 rounded-2xl transition-colors">العودة للرئيسية</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className="p-4 bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl dark:hover:bg-slate-700 rounded-3xl transition-all border border-slate-100 dark:border-slate-700 group"
            title="العودة للرئيسية"
          >
            <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform text-slate-900 dark:text-white" />
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{category.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold mt-2">استعرض أفضل العروض والخدمات المتوفرة حصرياً</p>
          </div>
        </div>
        
        <div className="hidden lg:flex bg-primary-50 dark:bg-primary-900/20 px-8 py-4 rounded-[2rem] border border-primary-100 dark:border-primary-800 items-center gap-4">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200 dark:shadow-none">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <span className="block text-primary-900 dark:text-primary-100 font-black text-lg">تسليم فوري</span>
            <span className="block text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest">تأكيد تلقائي للطلبات</span>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-[3rem] shadow-xl shadow-slate-200/30 dark:shadow-none border border-slate-100 dark:border-slate-700">
          <Tag className="mx-auto text-slate-100 dark:text-slate-700 mb-8" size={80} />
          <p className="text-slate-500 dark:text-slate-400 text-2xl font-black">لا توجد منتجات في هذا القسم حالياً</p>
          <Link to="/" className="mt-8 inline-block px-10 py-4 bg-primary-600 text-white font-black rounded-2xl shadow-lg shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all">العودة للتسوق</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {products.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group bg-white dark:bg-slate-800 rounded-[3rem] shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-primary-200 dark:hover:shadow-primary-900/20 transition-all duration-500 border border-slate-50 dark:border-slate-700 flex flex-col overflow-hidden hover:-translate-y-3 animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="aspect-square relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Availability Badge */}
                <div className="absolute top-6 left-6">
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-sm border border-white/20 dark:border-white/5">
                    <span className="text-[11px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">متوفر الآن</span>
                  </div>
                </div>
              </div>
              
              {/* Details Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-black text-2xl text-slate-900 dark:text-white mb-6 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 min-h-[4rem] leading-tight">
                  {product.name}
                </h3>
                
                <div className="mt-auto flex items-end justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">
                      {product.hasTiers ? 'يبدأ السعر من' : 'سعر الشحن'}
                    </span>
                    <span className="text-primary-600 dark:text-primary-400 font-black text-2xl tracking-tight">
                      {product.hasTiers 
                        ? formatPrice(Math.min(...(product.tiers?.map(t => t.priceUSD) || [0])))
                        : formatPrice(product.pricePerMinUSD || 0)
                      }
                    </span>
                  </div>
                  
                  {/* Action Button */}
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-[1.5rem] shadow-xl shadow-primary-200 dark:shadow-none group-hover:bg-primary-700 group-hover:scale-110 group-hover:rotate-6 transition-all active:scale-95 flex items-center justify-center">
                    <ShoppingCart size={28} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
