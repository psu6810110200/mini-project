// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ยิง API Register
      await api.post('/auth/register', { username, password });
      toast.success('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      navigate('/login'); // เด้งไปหน้า Login
    } catch (error) {
      toast.error('สมัครสมาชิกไม่สำเร็จ! ชื่อผู้ใช้อาจซ้ำ');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center' }}>สมัครสมาชิกใหม่</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={{ marginTop: '20px', backgroundColor: '#28a745' }}>REGISTER</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;