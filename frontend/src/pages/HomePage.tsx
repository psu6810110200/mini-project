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
  
  // 1. เพิ่ม State สำหรับกรองระดับใบอนุญาต (0 หมายถึงดูทุกระดับ)
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

  // --- Logic การกรองข้อมูลแบบครอบคลุมทุกเงื่อนไข ---
  const filteredAndSortedWeapons = weapons
    // กรองตามชื่อและรายละเอียด
    .filter(w => 
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      w.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // กรองตามประเภทสินค้า
    .filter(w => selectedCategory === 'ALL' || w.category.toLowerCase() === selectedCategory.toLowerCase())
    // กรองตามช่วงราคา
    .filter(w => w.price >= minPrice && w.price <= maxPrice)
    // 2. กรองตามระดับใบอนุญาต (แสดงเฉพาะที่ระดับไม่เกินที่กำหนด หรือถ้าเป็น 0 คือดูทั้งหมด)
    .filter(w => requiredLicense === 0 || w.required_license_level === requiredLicense)
    // เรียงลำดับราคา
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

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading weapons...</div>;

  return (
    <div className="container">
      <div style={{ color: '#ffffff', marginBottom: '20px' }}>
        <h1>คลังแสง</h1>
      </div>

      {/* --- Filter & Search Bar (ปรับปรุงใหม่) --- */}
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.75)', 
        padding: '25px', 
        borderRadius: '12px', 
        marginBottom: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        
        {/* ค้นหาชื่อ/รายละเอียด */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 'bold' }}>ค้นหาอาวุธ (ชื่อ/รายละเอียด)</label>
          <input 
            type="text"
            placeholder="ค้นหาอาวุธหรือสเปก..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #444' }}
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
                    padding: '8px 12px', borderRadius: '6px', border: '1px solid #444', cursor: 'pointer',
                    backgroundColor: selectedCategory === cat ? '#ffc107' : '#1a1a1a',
                    color: selectedCategory === cat ? '#000' : '#fff',
                    fontSize: '0.75rem', fontWeight: 'bold'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3. ส่วนกรองระดับใบอนุญาต (License Level Filter) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 'bold' }}>License Level</label>
            <select 
              value={requiredLicense}
              onChange={(e) => setRequiredLicense(Number(e.target.value))}
              style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #444', cursor: 'pointer' }}
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
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} style={{ width: '100px', padding: '8px', borderRadius: '6px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #444' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 'bold' }}>ราคาสูงสุด</label>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: '100px', padding: '8px', borderRadius: '6px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #444' }} />
            </div>
          </div>

          {/* เรียงลำดับ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 'bold' }}>เรียงลำดับ</label>
            <select value={priceSort} onChange={(e) => setPriceSort(e.target.value)} style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #444' }}>
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
              setRequiredLicense(0); // ล้างค่า License
            }}
            style={{ padding: '8px 15px', borderRadius: '6px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #444', cursor: 'pointer' }}
          >
            ล้างทั้งหมด
          </button>
        </div>
      </div>

      <div className="weapon-grid">
        {filteredAndSortedWeapons.length > 0 ? (
          filteredAndSortedWeapons.map((weapon) => (
            <div key={weapon.id} className={`weapon-card ${getCardClass(weapon.category)}`}>
              <h3 style={{ marginTop: '0', marginBottom: '10px' }}>{weapon.name}</h3>
              <div style={{ width: '100%', height: '180px', backgroundColor: '#eee', marginBottom: '10px', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <img src={weapon.image || "https://placehold.co/400x300?text=No+Image"} alt={weapon.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                 <span className="badge">{weapon.category}</span>
                 {/* แสดง Level License บนการ์ด */}
                 <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>LV: {weapon.required_license_level}</span>
              </div>
              <p style={{ color: '#555', minHeight: '50px', fontSize: '0.85rem' }}>{weapon.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: '15px' }}>
                <div>
                  <div className="price">฿{weapon.price.toLocaleString()}</div>
                  <div className="stock">คงเหลือ: {weapon.stock} ชิ้น</div>
                </div>
                <button onClick={() => navigate(`/product/${weapon.id}`)} style={{ padding: '8px 15px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>ดูรายละเอียด</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: '#aaa', gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>
            <h2>ไม่พบสินค้าที่ตรงตามเงื่อนไข</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;