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
import ProfilePage from './pages/ProfilePage'; // ✅ Import เข้ามา

// Route Guard: ต้อง Login ก่อน
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);

  if (!auth || auth.loading) {
    return <div style={{color:'white', textAlign:'center', marginTop:'20px'}}>Loading System...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children as React.ReactElement;
};

// Route Guard: ต้องเป็น Admin เท่านั้น
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  
  if (!auth || auth.loading) {
    return <div style={{color:'white', textAlign:'center', marginTop:'20px'}}>Checking Clearance...</div>;
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

  // ซ่อน Navbar ในหน้า Login/Register
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

          {/* ✅ เพิ่ม Route Profile */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;