// src/App.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; // [แก้ไข] เพิ่ม useLocation
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

// สร้าง Component เพื่อป้องกันหน้า Home (ถ้ายังไม่ Login ให้เด้งไป Login)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children as React.ReactElement;
};

// เช็คว่าเป็น Admin หรือไม่
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  
  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (auth.user?.role !== 'admin') {
    return <Navigate to="/" />; // ถ้าไม่ใช่ Admin ให้เด้งไปหน้า Home
  }

  return children as React.ReactElement;
};

function App() {
  const location = useLocation(); // [แก้ไข] รับค่า Path ปัจจุบัน

  // [แก้ไข] กำหนดรายการหน้าที่ไม่ต้องการให้แสดง Navbar
  const hideNavbarRoutes = ['/login', '/register']; 
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <CartProvider> 
        {/* [แก้ไข] แสดง Navbar เฉพาะหน้าที่ไม่อยู่ในเงื่อนไขซ่อน */}
        {shouldShowNavbar && <Navbar />}
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* หน้า Home */}
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />

          {/* Route สำหรับหน้า Detail */}
          <Route path="/product/:id" element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          } />

          {/* หน้า Admin */}
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
          
          {/* ลบ Route /cart อันที่ซ้ำออกแล้ว */}
          
          <Route path="/success" element={<OrderSuccessPage />} />

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