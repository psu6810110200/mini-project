import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  
  // เรียกใช้ hook เพื่อเช็คหน้าปัจจุบัน
  const location = useLocation();

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  // สร้างตัวแปรเช็คว่า "ตอนนี้อยู่หน้า Login หรือ Register"
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">Gun Shop</Link>

        <div className="navbar-menu">
          {auth?.isAuthenticated && !isAuthPage ? (
            // กรณี Login แล้ว และไม่อยู่หน้า Login
            <>

              {/* [เพิ่ม] แสดงลิงก์ Admin เฉพาะถ้าเป็น Admin */}
              {auth.user?.role === 'admin' && (
                <Link to="/admin" className="navbar-item" style={{ marginRight: '15px', fontWeight: 'bold', color: '#ff4d4d' }}>
                  ⚙️ Admin Dashboard
                </Link>
              )}
              
              <span className="navbar-user">
                สวัสดี, <strong>{auth.user?.username}</strong> ({auth.user?.role})
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
               {!isAuthPage && ( <>
                    <Link to="/login" className="navbar-item">Login</Link>
                    <Link to="/register" className="navbar-item">Register</Link>
                  </>
               )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;