// src/pages/LoginPage.tsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/logowws.png';
import './Auth.css'; // ✅ เรียกใช้ CSS ใหม่

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // 1. State สำหรับ Remember Me
  const [rememberMe, setRememberMe] = useState(false);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // จัดการเมื่อกดปุ่ม Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      // ยิง API
      const response = await api.post('/auth/login', { username, password });
      
      // ดึงข้อมูล
      const { access_token, user } = response.data;

      // 2. ส่งค่า rememberMe ไปที่ Context
      auth?.login(access_token, user, rememberMe);

      toast.success('ยินดีต้อนรับเข้าสู่ระบบค้าอาวุธ!');
      navigate('/'); 
    } catch (error: any) {
      console.error(error);
      toast.error('เข้าสู่ระบบไม่สำเร็จ! กรุณาเช็คชื่อผู้ใช้หรือรหัสผ่าน');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="auth-logo" />
        </div>

        <h2 className="auth-title">WAR WEAPON SHOP</h2>

        <form onSubmit={handleSubmit}>
          
          {/* Username Input */}
          <div className="input-group">
            <div className="input-icon">👤</div>
            <input 
              type="text" 
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              className="auth-input"
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <div className="input-icon">🔑</div>
            <input 
              type="password" 
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="auth-input"
            />
          </div>

          {/* Checkbox Remember Me */}
          <div className="checkbox-container">
            <input 
              type="checkbox" 
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="custom-checkbox"
            />
            <label htmlFor="rememberMe" className="checkbox-label">
              จดจำฉันไว้ในระบบ (Remember Me)
            </label>
          </div>

          {/* Login Button */}
          <button type="submit" className="auth-btn">
            LOGIN
          </button>
        </form>

        <p className="auth-footer">
          ยังไม่มีบัญชี? 
          <Link to="/register" className="auth-link">สมัครสมาชิกที่นี่</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;