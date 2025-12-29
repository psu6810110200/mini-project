// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import React from 'react';

// สร้าง Component เพื่อป้องกันหน้า Home (ถ้ายังไม่ Login ให้เด้งไป Login)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children as React.ReactElement;
};

// หน้า Home ง่ายๆ (เอาไว้เทสว่า Login ผ่านไหม)
const HomePage = () => {
  const auth = useContext(AuthContext);
  return (
    <div className="container">
      <h1>ยินดีต้อนรับ, {auth?.user?.username} ({auth?.user?.role})</h1>
      <p>นี่คือหน้าร้านขายอาวุธ (สำหรับสมาชิกเท่านั้น)</p>
      <button onClick={auth?.logout} style={{ width: 'auto', backgroundColor: 'red' }}>Logout</button>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* หน้า Home ต้อง Login ก่อนถึงจะเข้าได้ */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
      </Routes>
      
      {/* ตัวแสดงผลแจ้งเตือน */}
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;