// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/logowws.png';
import './Auth.css'; // ✅ เรียกใช้ CSS ใหม่

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState(''); 
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // ฟังก์ชันจัดการเมื่อเลือกไฟล์
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('กรุณาอัปโหลดรูปภาพใบอนุญาตหรือบัตรประชาชน');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('license_number', licenseNumber);
    formData.append('file', file);

    try {
      await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('สมัครสมาชิกสำเร็จ! กรุณารอแอดมินอนุมัติก่อนเข้าใช้งาน');
      navigate('/login'); 
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ! ชื่อผู้ใช้อาจซ้ำ';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        <div className="logo-container">
          <img src={logo} alt="Logo" className="auth-logo" />
        </div>

        <h2 className="auth-title">สมัครสมาชิกใหม่</h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input 
              type="text" 
              placeholder="ชื่อผู้ใช้"
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required 
              className="auth-input"
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <span className="input-icon">🔑</span>
            <input 
              type="password" 
              placeholder="รหัสผ่าน"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="auth-input"
            />
          </div>

          {/* License Number */}
          <div className="input-group">
            <span className="input-icon">📜</span>
            <input 
              type="text" 
              placeholder="เลขที่ใบอนุญาต (ถ้ามี)"
              value={licenseNumber} 
              onChange={(e) => setLicenseNumber(e.target.value)}
              className="auth-input"
            />
          </div>

          {/* File Upload */}
          <div style={{ marginBottom: '25px', padding: '0 10px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: '#ccc', fontSize: '1rem' }}>
              รูปถ่ายเอกสารยืนยันตัวตน (บังคับ):
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              required
              style={{ color: '#fff', fontSize: '16px', width: '100%' }}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={isSubmitting} className="auth-btn">
            {isSubmitting ? 'กำลังบันทึก...' : 'REGISTER'}
          </button>
        </form>

        <p className="auth-footer">
          มีบัญชีอยู่แล้ว? 
          <Link to="/login" className="auth-link">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;