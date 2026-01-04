
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import DashboardLayout from './pages/Admin/DashboardLayout';
import ProductManager from './pages/Admin/ProductManager';
import CategoryManager from './pages/Admin/CategoryManager';
import CurrencyManager from './pages/Admin/CurrencyManager';
import PaymentManager from './pages/Admin/PaymentManager';
import AdminLogin from './pages/Login';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans">
          <Routes>
            {/* Storefront Routes */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route index element={<Home />} />
                      <Route path="category/:categoryId" element={<CategoryPage />} />
                      <Route path="product/:productId" element={<ProductDetails />} />
                    </Routes>
                  </main>
                  <footer className="bg-slate-900 text-white py-8 text-center mt-12">
                    <p className="mb-2">ترند كارد - جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
                    <p className="text-slate-400 text-sm">تم التطوير لتسهيل عمليات شحن الألعاب والخدمات الإلكترونية</p>
                  </footer>
                </>
              }
            />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Dashboard Routes - Protected */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProductManager />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="currencies" element={<CurrencyManager />} />
              <Route path="payments" element={<PaymentManager />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
