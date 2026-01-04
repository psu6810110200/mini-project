// src/App.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import React from 'react';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// ----------------------------------------------------------------------
// ✅ 1. แก้ไข ProtectedRoute ให้เช็ค loading ก่อน
// ----------------------------------------------------------------------
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);

  // ถ้า Context ยังไม่พร้อม หรือกำลังโหลดข้อมูลจาก Storage อยู่ ให้ return null (หรือ Loading Spinner) ไปก่อน
  if (!auth || auth.loading) {
    return <div>Loading...</div>; // หรือใส่ Component Loading สวยๆ ตรงนี้
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children as React.ReactElement;
};

// ----------------------------------------------------------------------
// ✅ 2. แก้ไข AdminRoute ให้เช็ค loading ก่อนเช่นกัน
// ----------------------------------------------------------------------
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  
  // รอโหลดเสร็จก่อนค่อยเช็คเงื่อนไข
  if (!auth || auth.loading) {
    return <div>Loading...</div>; 
  }
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (auth.user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children as React.ReactElement;
};

function App() {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/register']; 
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <CartProvider> 
        {shouldShowNavbar && <Navbar />}
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />

          <Route path="/product/:id" element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
          
          <Route path="/order-success" element={
            <ProtectedRoute>
               <OrderSuccessPage />
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          } />
          
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;