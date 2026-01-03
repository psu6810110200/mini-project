// src/components/Navbar.tsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import logo from '../assets/logowws.png';

const Navbar = () => {
  const auth = useContext(AuthContext);
  const cart = useContext(CartContext);
  const navigate = useNavigate();

  // ถ้ายังไม่ Login ไม่ต้องแสดง Navbar (หรือจะแสดงแบบอื่นก็ได้ตามดีไซน์)
  if (!auth?.isAuthenticated) return null;

  return (
    <nav style={{ 
      backgroundColor: 'black', 
      padding: '10px 20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      color: 'white',
      borderBottom: '1px solid #333',
      position: 'sticky', top: 0, zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ color: '#ffc107', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} alt="Logo" style={{ height: '45px', objectFit: 'contain' }} /> 
          WAR WEAPON SHOP
        </Link>
        
        {auth.user?.role === 'admin' && (
          <Link to="/admin" style={{ color: '#dc3545', textDecoration: 'none', fontWeight: 'bold', border: '1px solid #dc3545', padding: '5px 10px', borderRadius: '5px' }}>
            ⚙️ Admin Dashboard
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        <Link to="/cart" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '1.2rem' }}>🛒</span>
          <span>ตะกร้า</span>
          {cart && cart.totalItems > 0 && (
            <span style={{ 
              backgroundColor: '#dc3545', 
              color: 'white', 
              borderRadius: '50%', 
              padding: '2px 6px', 
              fontSize: '0.75rem', 
              fontWeight: 'bold',
              minWidth: '18px', textAlign: 'center'
            }}>
              {cart.totalItems}
            </span>
          )}
        </Link>

        <Link to="/orders" style={{ textDecoration: 'none', color: '#ccc', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '1.2rem' }}>📜</span>
          <span>ประวัติ</span>
        </Link>
        
        <div style={{ borderLeft: '1px solid #555', height: '30px', margin: '0 5px' }}></div>

        {/* --- ส่วนโปรไฟล์ที่ปรับแก้ --- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Badge แสดงสถานะ */}
          {auth.user?.is_verified ? (
            <span style={{ 
              backgroundColor: 'rgba(40, 167, 69, 0.2)', color: '#28a745', border: '1px solid #28a745',
              padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' 
            }}>
              ✓ Verified
            </span>
          ) : (
            <span style={{ 
              backgroundColor: 'rgba(255, 193, 7, 0.2)', color: '#ffc107', border: '1px solid #ffc107',
              padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' 
            }}>
              ⏳ Pending
            </span>
          )}

          {/* ไอคอนโปรไฟล์ (ใช้อักษรตัวแรกของชื่อ) */}
          <div title={`User: ${auth.user?.username}`} style={{ 
            width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#333', border: '1px solid #555',
            display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: 'bold',
            cursor: 'default'
          }}>
            {auth.user?.username?.charAt(0).toUpperCase()}
          </div>

          <button 
            onClick={auth.logout} 
            style={{ 
              backgroundColor: 'transparent', border: '1px solid #dc3545', color: '#dc3545', 
              padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem',
              transition: '0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;