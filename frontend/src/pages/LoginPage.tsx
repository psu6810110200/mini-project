// src/pages/LoginPage.tsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // แจ้งเตือนสวยๆ

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // จัดการเมื่อกดปุ่ม Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // กันหน้าเว็บ Refresh เอง
    try {
      // ยิง API ไปที่ Backend
      const response = await api.post('/auth/login', { username, password });
      
      // ดึงข้อมูลที่ได้มา (Token, User)
      const { access_token, user } = response.data;

      // เรียกใช้ฟังก์ชัน login ใน Context เพื่อเก็บค่า
      auth?.login(access_token, user);

      toast.success('ยินดีต้อนรับเข้าสู่ระบบค้าอาวุธ!');
      navigate('/'); // เด้งไปหน้าแรก
    } catch (error: any) {
      toast.error('เข้าสู่ระบบไม่สำเร็จ! กรุณาเช็คชื่อผู้ใช้หรือรหัสผ่าน');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center' }}>เข้าสู่ระบบ (Weapon Shop)</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" style={{ marginTop: '20px' }}>LOGIN</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิกที่นี่</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;