import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { type Weapon, WeaponCategory } from '../types';
import './HomePage.css'; 
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลอาวุธเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        const response = await api.get('/weapons');
        setWeapons(response.data);
      } catch (error) {
        console.error('Error fetching weapons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeapons();
  }, []);

  // ฟังก์ชันช่วยเลือก Class สีตามประเภท
  const getCardClass = (category: WeaponCategory) => {
    switch (category) {
      case WeaponCategory.LIGHT: return 'card-light';
      case WeaponCategory.HEAVY: return 'card-heavy';
      case WeaponCategory.EXPLOSIVE: return 'card-explosive';
      default: return '';
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading weapons...</div>;

  return (
    <div className="container">
      {/* ส่วนหัวแสดงชื่อ User และปุ่ม Logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ color: '#ffffffff'}}>
          <h1>คลังแสง (Weapon Catalog)</h1>
        </div>
      </div>

      {/* แสดงรายการสินค้า */}
      <div className="weapon-grid">
      {weapons.map((weapon) => (
        <div key={weapon.id} className={`weapon-card ${getCardClass(weapon.category)}`}>
          
          {/* 1. ย้ายชื่อสินค้ามาไว้บนสุด */}
          <h3 style={{ marginTop: '0', marginBottom: '10px' }}>{weapon.name}</h3>

          {/* 2. ใส่รูปภาพตรงกลาง (ถ้าไม่มีรูปจะแสดง Placeholder สีเทา) */}
          <div style={{ 
            width: '100%', 
            height: '180px', // กำหนดความสูงรูป
            backgroundColor: '#eee', 
            marginBottom: '10px', 
            borderRadius: '4px', 
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
             <img 
               src={weapon.image || "https://placehold.co/400x300?text=No+Image"} 
               alt={weapon.name}
               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
               onError={(e) => {
                 // ถ้าโหลดรูปไม่ได้ ให้เปลี่ยนเป็น Placeholder
                 (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Image+Error";
               }}
             />
          </div>

          {/* 3. ประเภทสินค้าอยู่ใต้รูป */}
          <div style={{ marginBottom: '10px' }}>
             <span className="badge">{weapon.category}</span>
          </div>
          
          <p style={{ color: '#555', minHeight: '40px' }}>{weapon.description}</p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: '15px' }}>
            <div>
              <div className="price">฿{weapon.price.toLocaleString()}</div>
              <div className="stock">คงเหลือ: {weapon.stock} ชิ้น</div>
            </div>
            
            <button 
              onClick={() => navigate(`/product/${weapon.id}`)} 
              style={{ width: 'auto', padding: '8px 15px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              ดูรายละเอียด
            </button>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;