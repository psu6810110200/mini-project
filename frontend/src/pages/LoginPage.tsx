// src/pages/LoginPage.tsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // 1. [เพิ่ม] State สำหรับเก็บค่า Checkbox Remember Me
  const [rememberMe, setRememberMe] = useState(false);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // จัดการเมื่อกดปุ่ม Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      // ยิง API ไปที่ Backend
      const response = await api.post('/auth/login', { username, password });
      
      // ดึงข้อมูลที่ได้มา (Token, User)
      const { access_token, user } = response.data;

      // 2. [แก้ไข] ส่งค่า rememberMe ไปที่ Context ด้วย
      // ถ้า true -> เก็บ localStorage, ถ้า false -> เก็บ sessionStorage
      auth?.login(access_token, user, rememberMe);

      toast.success('ยินดีต้อนรับเข้าสู่ระบบค้าอาวุธ!');
      navigate('/'); // เด้งไปหน้าแรก
    } catch (error: any) {
      console.error(error);
      toast.error('เข้าสู่ระบบไม่สำเร็จ! กรุณาเช็คชื่อผู้ใช้หรือรหัสผ่าน');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      {/* ปรับ Style Card นิดหน่อยให้สวยขึ้น */}
      <div className="card" style={{ width: '400px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>เข้าสู่ระบบ (Weapon Shop)</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          {/* 3. [เพิ่ม] Checkbox Remember Me UI */}
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ marginRight: '8px', cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="rememberMe" style={{ cursor: 'pointer', userSelect: 'none' }}>
              (Remember Me)
            </label>
          </div>

          <button type="submit" style={{ width: '100%', padding: '10px', marginTop: '10px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px' }}>
            LOGIN
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          ยังไม่มีบัญชี? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>สมัครสมาชิกที่นี่</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;