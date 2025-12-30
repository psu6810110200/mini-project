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
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',   // ให้ Card ลอยกลางจอในแนวตั้งด้วย
      
    }}>
      
      {/* Card: ธีมดำ-เหลือง มุมมน เงาฟุ้ง */}
      <div className="card" style={{ 
        width: '100%',
        maxWidth: '420px', 
        padding: '40px', 
        backgroundColor: '#1a1a1a', // พื้นหลัง Card สีดำ
        color: '#ffffff',           // ตัวหนังสือสีขาว
        borderRadius: '20px',       // มุมมน
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)', // เงาฟุ้งๆ นุ่มๆ
        border: '1px solid #333'
      }}>
        
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#ffc107', // หัวข้อสีเหลือง
          fontWeight: 'bold'
        }}>
          WAR WEAPON SHOP
        </h2>

        <form onSubmit={handleSubmit}>
          
          {/* --- Username Input --- */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: '#f0f0f0', // พื้นหลัง input สีเทาอ่อน
            borderRadius: '50px',       // ทรงแคปซูล
            padding: '5px 8px',
            marginBottom: '20px'
          }}>
            {/* Icon Circle */}
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '10px',
              fontSize: '20px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              👤
            </div>
            {/* Input Field */}
            <input 
              type="text" 
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              style={{ 
                flex: 1, 
                border: 'none', 
                outline: 'none', 
                backgroundColor: 'transparent', 
                fontSize: '16px',
                color: '#333'
              }}
            />
          </div>

          {/* --- Password Input --- */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '50px',
            padding: '5px 8px',
            marginBottom: '20px'
          }}>
            {/* Icon Circle */}
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '10px',
              fontSize: '20px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              🔑
            </div>
            {/* Input Field */}
            <input 
              type="password" 
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{ 
                flex: 1, 
                border: 'none', 
                outline: 'none', 
                backgroundColor: 'transparent', 
                fontSize: '16px',
                color: '#333'
              }}
            />
          </div>

          {/* --- Checkbox Remember Me --- */}
          <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
            <input 
              type="checkbox" 
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ 
                marginRight: '10px', 
                cursor: 'pointer', 
                width: '18px', 
                height: '18px',
                accentColor: '#ffc107' // สี Checkbox เป็นสีเหลือง
              }}
            />
            <label htmlFor="rememberMe" style={{ cursor: 'pointer', userSelect: 'none', color: '#ccc', fontSize: '0.9rem' }}>
              จดจำฉันไว้ในระบบ (Remember Me)
            </label>
          </div>

          {/* --- Login Button --- */}
          <button type="submit" style={{ 
            width: '100%', 
            padding: '14px', 
            cursor: 'pointer', 
            backgroundColor: '#ffc107', // ปุ่มสีเหลือง
            color: '#000',              // ตัวหนังสือสีดำ
            border: 'none', 
            borderRadius: '50px',       // ปุ่มกลมมน
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 5px 15px rgba(255, 193, 7, 0.3)', // เงาสีเหลืองเรืองแสง
            transition: 'transform 0.2s'
          }}>
            LOGIN
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: '#aaa' }}>
          ยังไม่มีบัญชี? <Link to="/register" style={{ color: '#ffc107', fontWeight: 'bold', textDecoration: 'none' }}>สมัครสมาชิกที่นี่</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;