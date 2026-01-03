// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/logowws.png';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState(''); 
  const [file, setFile] = useState<File | null>(null); // State สำหรับเก็บไฟล์
  const [isSubmitting, setIsSubmitting] = useState(false); // กัน User กดรัวๆ
  
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

    // สร้าง FormData object
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('license_number', licenseNumber);
    formData.append('file', file); // key 'file' ต้องตรงกับ Backend @UseInterceptors(FileInterceptor('file'))

    try {
      await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // สำคัญมาก
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
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',   
    }}>
      <div className="card" style={{ 
        width: '100%', maxWidth: '450px', padding: '40px', 
        backgroundColor: '#1a1a1a', color: '#ffffff', 
        borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid #333'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <img src={logo} alt="Logo" style={{ width: '120px', height: 'auto', objectFit: 'contain' }} />
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#ffc107', fontWeight: 'bold' }}>
          สมัครสมาชิกใหม่
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={inputGroupStyle}>
            <span style={iconStyle}>👤</span>
            <input 
              type="text" placeholder="ชื่อผู้ใช้"
              value={username} onChange={(e) => setUsername(e.target.value)}
              required style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={inputGroupStyle}>
            <span style={iconStyle}>🔑</span>
            <input 
              type="password" placeholder="รหัสผ่าน"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required style={inputStyle}
            />
          </div>

          {/* License Number */}
          <div style={inputGroupStyle}>
            <span style={iconStyle}>📜</span>
            <input 
              type="text" placeholder="เลขที่ใบอนุญาต (ถ้ามี)"
              value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* File Upload (เพิ่มใหม่) */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '0.9rem' }}>
              รูปถ่ายเอกสารยืนยันตัวตน (บังคับ):
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              required
              style={{ color: '#fff' }}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={isSubmitting} style={{ 
            width: '100%', padding: '14px', cursor: isSubmitting ? 'not-allowed' : 'pointer', 
            backgroundColor: isSubmitting ? '#ccc' : '#ffc107', 
            color: '#000', border: 'none', borderRadius: '50px', 
            fontSize: '18px', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(255, 193, 7, 0.3)',
            transition: '0.3s'
          }}>
            {isSubmitting ? 'กำลังบันทึก...' : 'REGISTER'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: '#aaa' }}>
          มีบัญชีอยู่แล้ว? <Link to="/login" style={{ color: '#ffc107', fontWeight: 'bold', textDecoration: 'none' }}>เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
};

// Styles เพื่อความสะอาดของโค้ด
const inputGroupStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', backgroundColor: '#f0f0f0', 
  borderRadius: '50px', padding: '5px 8px', marginBottom: '20px'
};

const iconStyle: React.CSSProperties = {
  width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%',
  display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px',
  fontSize: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', userSelect: 'none'
};

const inputStyle: React.CSSProperties = {
  flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '16px', color: '#333'
};

export default RegisterPage;