import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { type Weapon, WeaponCategory } from '../types';
import './HomePage.css'; // อย่าลืม import CSS

const HomePage = () => {
  const auth = useContext(AuthContext);
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
        <p style={{ color: '#ffffffff'}}>
          <h1>คลังแสง (Weapon Catalog)</h1>
        </p>
      </div>

      {/* แสดงรายการสินค้า */}
      <div className="weapon-grid">
        {weapons.map((weapon) => (
          <div key={weapon.id} className={`weapon-card ${getCardClass(weapon.category)}`}>
            {/* Badge แสดงหมวดหมู่ */}
            <span className="badge">{weapon.category}</span>
            
            <h3>{weapon.name}</h3>
            <p style={{ color: '#555', minHeight: '40px' }}>{weapon.description}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: '15px' }}>
              <div>
                <div className="price">฿{weapon.price.toLocaleString()}</div>
                <div className="stock">คงเหลือ: {weapon.stock} ชิ้น</div>
              </div>
              
              <button style={{ width: 'auto', padding: '8px 15px' }}>
                สั่งซื้อ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;