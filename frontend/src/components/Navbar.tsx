// src/components/Navbar.tsx
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import logo from '../assets/logowws.png';
import './Navbar.css';

const Navbar = () => {
  const auth = useContext(AuthContext);
  const cart = useContext(CartContext);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const user = auth?.user;

  const handleLogout = () => {
    if (auth?.logout) {
      auth.logout();
      navigate('/login');
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

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
    <nav className="navbar">
      {/* 1. LOGO (จะถูกดันไปซ้ายสุดด้วย CSS margin-right: auto) */}
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="Logo" className="brand-logo" />
        <span className="brand-text">WAR WEAPON SHOP</span>
      </Link>

      {/* 2. MENU LINKS (จะถูกดันไปขวา ไปกองรวมกับ Profile) */}
      <div className={`navbar-center-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
          <span>🏠</span> หน้าหลัก
        </Link>
        
        <Link to="/cart" className="nav-link" style={{ position: 'relative' }} onClick={() => setIsMobileMenuOpen(false)}>
          <span>🛒</span> ตะกร้า
          {cart && cart.totalItems > 0 && (
            <span className="cart-badge">{cart.totalItems}</span>
          )}
        </Link>
        
        {user?.role === 'admin' && (
           <Link to="/admin" className="nav-link admin-link" onClick={() => setIsMobileMenuOpen(false)}>
             ⚙️ Admin Dashboard
           </Link>
        )}
      </div>

      {/* 3. RIGHT ACTIONS (Profile & Hamburger) */}
      <div className="navbar-right-actions">
        
        {/* Profile Dropdown */}
        <div className="profile-container" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="profile-trigger"
          >
            <div className="profile-avatar">
              {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
          </div>

          {/* Dropdown Content */}
          {isDropdownOpen && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-header">
                <strong>{user?.username}</strong>
                <div className="dropdown-role">{user?.role}</div>
              </div>
              <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>👤 ข้อมูลส่วนตัว</Link>
              <Link to="/orders" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>📜 ประวัติการสั่งซื้อ</Link>
              <div onClick={handleLogout} className="dropdown-item logout">
                🚪 ออกจากระบบ
              </div>
            </div>
          )}
        </div>

        {/* ปุ่ม Hamburger (โชว์เฉพาะมือถือ) */}
        <button 
          className="hamburger-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✖' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;