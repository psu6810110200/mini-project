// src/components/Navbar.tsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import logo from '../assets/logowws.png'; // ✅ 1. Import รูปโลโก้เข้ามา

const Navbar = () => {
  const auth = useContext(AuthContext);
  const cart = useContext(CartContext);
  const navigate = useNavigate();

  if (!auth?.isAuthenticated) return null;

  return (
    <nav style={{ 
      backgroundColor: 'black', 
      padding: '15px 20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      color: 'white',
      borderBottom: '1px solid #333'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* ✅ 2. เพิ่มรูป Logo ไว้ด้านหน้า (ปรับ flex เพื่อให้ตรงกับตัวหนังสือ) */}
        <Link to="/" style={{ color: '#ffc107', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} alt="Logo" style={{ height: '45px', objectFit: 'contain' }} /> 
          WAR WEAPON SHOP
        </Link>
        
        {auth.user?.role === 'admin' && (
          <Link to="/admin" style={{ color: '#dc3545', textDecoration: 'none', fontWeight: 'bold' }}>
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
              padding: '2px 8px', 
              fontSize: '0.8rem', 
              fontWeight: 'bold' 
            }}>
              {cart.totalItems}
            </span>
          )}
        </Link>

        <Link to="/orders" style={{ textDecoration: 'none', color: '#ccc', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '1.2rem' }}>📜</span>
          <span>ประวัติ</span>
        </Link>
        
        <div style={{ borderLeft: '1px solid #555', height: '25px', margin: '0 5px' }}></div>

        <span>สวัสดี, <strong>{auth.user?.username}</strong></span>
        <button 
          onClick={auth.logout} 
          style={{ backgroundColor: '#333', border: '1px solid #555', color: '#ccc', padding: '5px 10px', width: 'auto', fontSize: '0.8rem' }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;