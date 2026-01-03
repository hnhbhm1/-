
import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Layers, 
  CreditCard, 
  Coins, 
  ChevronRight,
  Home,
  LogOut,
  User
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin', name: 'المنتجات', icon: Package },
    { path: '/admin/categories', name: 'الأقسام', icon: Layers },
    { path: '/admin/payments', name: 'طرق الدفع', icon: CreditCard },
    { path: '/admin/currencies', name: 'العملات', icon: Coins },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col shrink-0 sticky top-0 md:h-screen z-50">
        <div className="p-8 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <h2 className="text-xl font-black text-white">لوحة التحكم</h2>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-[1.02]' 
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-bold">{item.name}</span>
                {isActive && <ChevronRight className="mr-auto" size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-2">
          <Link to="/" className="flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-white transition-all rounded-2xl hover:bg-slate-800">
            <Home size={20} />
            <span className="font-bold">زيارة المتجر</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:text-white transition-all rounded-2xl hover:bg-red-900/20"
          >
            <LogOut size={20} />
            <span className="font-bold">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-100 h-20 px-8 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-black text-gray-800">
              {navItems.find(i => i.path === location.pathname)?.name || 'لوحة التحكم'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-left items-end">
              <span className="text-sm font-bold text-gray-900">المدير العام</span>
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">متصل الآن</span>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <User size={20} />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-grow">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 min-h-[calc(100vh-10rem)]">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
