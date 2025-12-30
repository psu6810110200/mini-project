// src/pages/HomePage.tsx
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
  
  // --- State สำหรับการกรองและค้นหา ---
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [priceSort, setPriceSort] = useState<string>('default');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  
  // State สำหรับกรองระดับใบอนุญาต
  const [requiredLicense, setRequiredLicense] = useState<number>(0);

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

  // --- Logic การกรองข้อมูล ---
  const filteredAndSortedWeapons = weapons
    .filter(w => 
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      w.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(w => selectedCategory === 'ALL' || w.category.toLowerCase() === selectedCategory.toLowerCase())
    .filter(w => w.price >= minPrice && w.price <= maxPrice)
    .filter(w => requiredLicense === 0 || w.required_license_level === requiredLicense)
    .sort((a, b) => {
      if (priceSort === 'low-to-high') return a.price - b.price;
      if (priceSort === 'high-to-low') return b.price - a.price;
      return 0;
    });

  const getCardClass = (category: WeaponCategory) => {
    switch (category) {
      case WeaponCategory.LIGHT: return 'card-light';
      case WeaponCategory.HEAVY: return 'card-heavy';
      case WeaponCategory.EXPLOSIVE: return 'card-explosive';
      default: return '';
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#ffc107' }}>Loading weapons...</div>;

  return (
    <div className="container">
      <div style={{ color: '#ffc107', marginBottom: '20px', textShadow: '0 0 10px rgba(255, 193, 7, 0.3)' }}>
        <h1>คลังแสง</h1>
      </div>

      {/* --- Filter & Search Bar --- */}
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '25px', 
        borderRadius: '12px', 
        marginBottom: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '1px solid #333',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
      }}>
        
        {/* ค้นหาชื่อ/รายละเอียด */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#ffc107', fontSize: '0.9rem', fontWeight: 'bold' }}>ค้นหาอาวุธ</label>
          <input 
            type="text"
            placeholder="ชื่อปืน หรือ สเปก..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #444', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end' }}>
          {/* ประเภท */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 'bold' }}>ประเภท</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['ALL', 'LIGHT', 'HEAVY', 'EXPLOSIVE'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 15px', borderRadius: '20px', border: selectedCategory === cat ? 'none' : '1px solid #444', 
                    cursor: 'pointer',
                    backgroundColor: selectedCategory === cat ? '#ffc107' : 'transparent',
                    color: selectedCategory === cat ? '#000' : '#aaa',
                    fontSize: '0.8rem', fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* License Level Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 'bold' }}>License Level</label>
            <select 
              value={requiredLicense}
              onChange={(e) => setRequiredLicense(Number(e.target.value))}
              style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #444', cursor: 'pointer' }}
            >
              <option value={0}>ทั้งหมด</option>
              <option value={1}>Level 1</option>
              <option value={2}>Level 2</option>
              <option value={3}>Level 3</option>
              <option value={4}>Level 4</option>
              <option value={5}>Level 5</option>
            </select>
          </div>

          {/* ช่วงราคา */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 'bold' }}>ราคาต่ำสุด</label>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} style={{ width: '100px', padding: '8px', borderRadius: '6px', backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #444' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 'bold' }}>ราคาสูงสุด</label>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: '100px', padding: '8px', borderRadius: '6px', backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #444' }} />
            </div>
          </div>

          {/* เรียงลำดับ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 'bold' }}>เรียงลำดับ</label>
            <select value={priceSort} onChange={(e) => setPriceSort(e.target.value)} style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #444' }}>
              <option value="default">ค่าเริ่มต้น</option>
              <option value="low-to-high">ราคา: น้อยไปมาก</option>
              <option value="high-to-low">ราคา: มากไปน้อย</option>
            </select>
          </div>

          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
              setMinPrice(0);
              setMaxPrice(1000000);
              setPriceSort('default');
              setRequiredLicense(0);
            }}
            style={{ padding: '8px 15px', borderRadius: '6px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer', marginLeft: '10px' }}
          >
            ล้างค่า
          </button>
        </div>
      </div>

      <div className="weapon-grid">
        {filteredAndSortedWeapons.length > 0 ? (
          filteredAndSortedWeapons.map((weapon) => (
            <div key={weapon.id} className={`weapon-card ${getCardClass(weapon.category)}`}>
              <h3 style={{ marginTop: '0', marginBottom: '10px', color: 'white' }}>{weapon.name}</h3>
              
              <div style={{ width: '100%', height: '180px', backgroundColor: '#333', marginBottom: '10px', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <img 
                   src={weapon.image || "https://placehold.co/400x300?text=No+Image"} 
                   alt={weapon.name} 
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                   onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Error"; }}
                 />
              </div>

              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span className="badge">{weapon.category}</span>
                 <span style={{ fontSize: '0.8rem', color: '#ffc107', fontWeight: 'bold', border: '1px solid #ffc107', padding: '2px 6px', borderRadius: '4px' }}>
                   LV {weapon.required_license_level}
                 </span>
              </div>

              <p style={{ color: '#aaa', minHeight: '50px', fontSize: '0.85rem', lineHeight: '1.4' }}>{weapon.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: '15px', borderTop: '1px solid #333', paddingTop: '15px' }}>
                <div>
                  <div className="price">฿{weapon.price.toLocaleString()}</div>
                  <div className="stock">เหลือ: {weapon.stock} ชิ้น</div>
                </div>
                
                {/* ปุ่มสีเหลืองอักษรดำ */}
                <button 
                  onClick={() => navigate(`/product/${weapon.id}`)} 
                  style={{ 
                    padding: '8px 20px', 
                    backgroundColor: '#ffc107', 
                    color: 'black', 
                    border: 'none', 
                    cursor: 'pointer', 
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 10px rgba(255, 193, 7, 0.2)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ดูสินค้า
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: '#aaa', gridColumn: '1/-1', textAlign: 'center', padding: '50px', backgroundColor: '#1a1a1a', borderRadius: '12px', border: '1px dashed #444' }}>
            <h2>🚫 ไม่พบสินค้าที่ตรงตามเงื่อนไข</h2>
            <p>ลองปรับตัวกรอง หรือค้นหาด้วยคำอื่น</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;