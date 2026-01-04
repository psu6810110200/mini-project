// src/components/Navbar.tsx
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; // ✅ อย่าลืม Import CartContext
import logo from '../assets/logowws.png'; 

const Navbar = () => {
  const auth = useContext(AuthContext);
  const cart = useContext(CartContext); // ✅ ดึงข้อมูลตะกร้ามาใช้
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const user = auth?.user;

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    if (auth?.logout) {
      auth.logout();
      navigate('/login');
    }
  };

  // ปิด Dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!auth?.isAuthenticated) return null; 

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 30px',
      backgroundColor: '#000000', // ปรับเป็นดำสนิทตามสไตล์ร้านปืน
      borderBottom: '1px solid #333',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
    }}>
      
      {/* --- LEFT: LOGO --- */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '12px' }}>
        <img 
          src={logo} 
          alt="Logo" 
          style={{ height: '45px', objectFit: 'contain', filter: 'drop-shadow(0 0 5px rgba(255, 193, 7, 0.3))' }} 
        />
        <span style={{ 
          color: '#ffc107', 
          fontSize: '2.3rem', 
          fontWeight: '1200', 
          letterSpacing: '1px',
          textTransform: 'uppercase',
          fontFamily: 'Impact, sans-serif' // เปลี่ยนฟอนต์ให้ดูดุดัน (ถ้ามี)
        }}>
          WAR WEAPON SHOP
        </span>
      </Link>

      {/* --- RIGHT: MENU & PROFILE --- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>

        {/* 1. ปุ่ม Home (แต่งใหม่) */}
        <Link to="/" style={navLinkStyle}>
          <span style={{ fontSize: '1.2rem' }}>🏠</span>
          <span>หน้าหลัก</span>
        </Link>
        
        {/* 2. ปุ่ม Cart (แต่งใหม่ + Badge) */}
        <Link to="/cart" style={{ ...navLinkStyle, position: 'relative' }}>
          <span style={{ fontSize: '1.2rem' }}>🛒</span>
          <span>ตะกร้า</span>
          
          {/* Badge แสดงจำนวนสินค้า */}
          {cart && cart.totalItems > 0 && (
            <span style={{ 
              position: 'absolute',
              top: '-8px',
              right: '-10px',
              backgroundColor: '#dc3545', 
              color: 'white', 
              borderRadius: '50%', 
              padding: '2px 6px', 
              fontSize: '0.75rem', 
              fontWeight: 'bold',
              minWidth: '18px', 
              textAlign: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
              border: '1px solid #fff'
            }}>
              {cart.totalItems}
            </span>
          )}
        </Link>
        
        {/* 3. ปุ่ม Admin Dashboard (ตามโค้ดที่คุณขอ) */}
        {user?.role === 'admin' && (
           <Link to="/admin" style={{ 
             color: '#dc3545', 
             textDecoration: 'none', 
             fontWeight: 'bold', 
             border: '1px solid #dc3545', 
             padding: '6px 12px', 
             borderRadius: '5px',
             display: 'flex',
             alignItems: 'center',
             gap: '5px',
             transition: 'all 0.3s'
           }}>
             ⚙️ Admin Dashboard
           </Link>
        )}

        {/* เส้นคั่นแนวตั้ง */}
        <div style={{ borderLeft: '1px solid #444', height: '35px', margin: '0 5px' }}></div>

        {/* 4. USER PROFILE (Dropdown) */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              padding: '5px 8px',
              borderRadius: '50px',
              transition: 'background 0.2s',
              border: isDropdownOpen ? '1px solid #ffc107' : '1px solid transparent'
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#333',
              border: '2px solid #ffc107',
              color: '#ffc107',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
          </div>

          {/* --- Dropdown Body --- */}
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '55px',
              right: '0',
              width: '260px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #444',
              borderRadius: '10px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              overflow: 'hidden',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              zIndex: 1100
            }}>
              {/* Header: User Info */}
              <div style={{ padding: '5px 10px 15px 10px', borderBottom: '1px solid #333', marginBottom: '5px' }}>
                <p style={{ margin: 0, color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>{user?.username}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                  <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Role: {user?.role}</span>
                  
                  {/* แสดง Verified/Pending ใน Dropdown */}
                  {user?.is_verified ? (
                    <span style={{ color: '#28a745', fontSize: '0.75rem', border: '1px solid #28a745', padding: '1px 5px', borderRadius: '4px' }}>✓ Verified</span>
                  ) : (
                    <span style={{ color: '#ffc107', fontSize: '0.75rem', border: '1px solid #ffc107', padding: '1px 5px', borderRadius: '4px' }}>⏳ Pending</span>
                  )}
                </div>
              </div>

              {/* Menus */}
              <Link to="/settings" style={menuItemStyle}>⚙️ ตั้งค่าบัญชี (Settings)</Link>
              <Link to="/orders" style={menuItemStyle}>📜 ประวัติการสั่งซื้อ (Orders)</Link>

              {/* Logout */}
              <div 
                onClick={handleLogout}
                style={{
                  ...menuItemStyle,
                  color: '#dc3545',
                  fontWeight: 'bold',
                  marginTop: '5px',
                  borderTop: '1px solid #333',
                  paddingTop: '12px'
                }}
              >
                🚪 ออกจากระบบ
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

// --- CSS STYLES (Inline) ---

// สไตล์สำหรับปุ่ม Home และ Cart
const navLinkStyle: React.CSSProperties = {
  textDecoration: 'none', 
  color: '#e0e0e0', 
  fontWeight: '500', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px',
  padding: '8px 12px',
  borderRadius: '8px',
  transition: 'all 0.2s ease-in-out',
};

// สไตล์สำหรับรายการใน Dropdown
const menuItemStyle: React.CSSProperties = {
  display: 'block',
  padding: '10px 12px',
  color: '#ccc',
  textDecoration: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.95rem',
  transition: 'background-color 0.2s',
};

export default Navbar;