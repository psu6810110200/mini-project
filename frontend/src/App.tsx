// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import React from 'react';
import Navbar from './components/Navbar'; // [เพิ่ม] import Navbar
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';

// สร้าง Component เพื่อป้องกันหน้า Home (ถ้ายังไม่ Login ให้เด้งไป Login)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children as React.ReactElement;
};

// [เพิ่ม] เช็คว่าเป็น Admin หรือไม่
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
  return (
    <AuthProvider>
      {/* [เพิ่ม] ใส่ Navbar ตรงนี้ เพื่อให้แสดงทุกหน้า และเข้าถึง AuthContext ได้ */}
    <Navbar/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* หน้า Home ต้อง Login ก่อนถึงจะเข้าได้ */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Routes>
      
      {/* ตัวแสดงผลแจ้งเตือน */}
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;