
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Moon, Sun } from 'lucide-react';
import { useApp } from '../AppContext';

const Navbar: React.FC = () => {
  const { state, activeCurrency, setActiveCurrency, isDarkMode, toggleDarkMode } = useApp();

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center group">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary-200 dark:shadow-none transition-transform group-hover:scale-110">
                T
              </div>
              <span className="text-2xl font-black text-gray-900 dark:text-white mr-3 hidden sm:block">ترند كارد</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-3 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-2xl border border-gray-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm"
              title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Currency Selector */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-800 border-2 border-transparent dark:border-slate-700 rounded-2xl text-sm font-bold hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm">
                <Globe size={18} className="text-primary-600" />
                <span className="text-gray-700 dark:text-gray-200">{activeCurrency.name} ({activeCurrency.symbol})</span>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-2xl hidden group-hover:block overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2">
                <div className="p-2 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase text-center">
                  اختر العملة
                </div>
                {state.currencies.filter(c => c.isActive).map(curr => (
                  <button
                    key={curr.id}
                    onClick={() => setActiveCurrency(curr)}
                    className={`w-full text-right px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                      activeCurrency.id === curr.id 
                        ? 'bg-primary-600 text-white font-bold' 
                        : 'hover:bg-primary-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{curr.name}</span>
                    <span className="opacity-70">{curr.symbol}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
