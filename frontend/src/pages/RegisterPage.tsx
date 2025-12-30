// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState(''); // 1. เพิ่ม State
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 2. ส่ง license_number ไปที่ Backend
      await api.post('/auth/register', { 
        username, 
        password,
        license_number: licenseNumber 
      });
      toast.success('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      navigate('/login'); // เด้งไปหน้า Login
    } catch (error) {
      toast.error('สมัครสมาชิกไม่สำเร็จ! ชื่อผู้ใช้อาจซ้ำ');
    }
  };

return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',   
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
          สมัครสมาชิกใหม่
        </h2>

        <form onSubmit={handleSubmit}>
          
          {/* --- Username Input --- */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '50px',       
            padding: '5px 8px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%',
              display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px',
              fontSize: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              👤
            </div>
            <input 
              type="text" 
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              style={{ 
                flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '16px', color: '#333'
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
            <div style={{
              width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%',
              display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px',
              fontSize: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              🔑
            </div>
            <input 
              type="password" 
              placeholder="รหัสผ่าน..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{ 
                flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '16px', color: '#333'
              }}
            />
          </div>

          {/* --- License Number Input (Added) --- */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '50px',
            padding: '5px 8px',
            marginBottom: '25px' // เว้นระยะห่างก่อนปุ่ม Register
          }}>
            <div style={{
              width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%',
              display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px',
              fontSize: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              📜
            </div>
            <input 
              type="text" 
              placeholder="เลขที่ใบอนุญาต (1-5)"
              value={licenseNumber} 
              onChange={(e) => setLicenseNumber(e.target.value)}
              style={{ 
                flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '16px', color: '#333'
              }}
            />
          </div>

          {/* --- Register Button --- */}
          <button type="submit" style={{ 
            width: '100%', 
            padding: '14px', 
            cursor: 'pointer', 
            backgroundColor: '#ffc107', // ปุ่มสีเหลืองตามธีม
            color: '#000',              
            border: 'none', 
            borderRadius: '50px',       
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 5px 15px rgba(255, 193, 7, 0.3)',
            transition: 'transform 0.2s'
          }}>
            REGISTER
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: '#aaa' }}>
          มีบัญชีอยู่แล้ว? <Link to="/login" style={{ color: '#ffc107', fontWeight: 'bold', textDecoration: 'none' }}>เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;