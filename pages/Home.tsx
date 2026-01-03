
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { ChevronLeft, Gamepad2, Smartphone, CreditCard } from 'lucide-react';

const Home: React.FC = () => {
  const { state } = useApp();

  const getIcon = (id: string) => {
    switch (id) {
      case 'games': return <Gamepad2 size={24} />;
      case 'apps': return <Smartphone size={24} />;
      case 'cards': return <CreditCard size={24} />;
      default: return <Gamepad2 size={24} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          أهلاً بك في <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">ترند كارد</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          بوابتك الرقمية الأفضل لشحن الألعاب والبرامج والبطاقات الإلكترونية بأسعار منافسة وسرعة فائقة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {state.categories.map((cat, index) => (
          <Link
            key={cat.id}
            to={`/category/${cat.id}`}
            className="group relative flex flex-col h-full bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-200 dark:hover:shadow-primary-900/20 overflow-hidden animate-in fade-in slide-in-from-bottom-8"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl">
                {getIcon(cat.id)}
              </div>
            </div>
            <div className="p-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{cat.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">استعرض المنتجات المتاحة</p>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 p-4 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                <ChevronLeft size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
