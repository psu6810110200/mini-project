// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { getWeapons, type WeaponsResponse } from '../api/weaponApi';
import { type Weapon, WeaponCategory } from '../types'; // Import Enum มาใช้
import './HomePage.css'; 
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 18;

  // Filter State
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL'); // ค่าที่จะส่งไป Backend (ต้องเป็นตัวเล็ก)
  
  const [priceSort, setPriceSort] = useState<string>('default');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [requiredLicense, setRequiredLicense] = useState<number>(0);

  // กำหนดตัวเลือกหมวดหมู่ (Label คือสิ่งที่โชว์, Value คือค่าจริงที่ส่งไป Backend)
  const categoryOptions = [
    { label: 'ALL', value: 'ALL' },
    { label: 'LIGHT', value: WeaponCategory.LIGHT },       // value = 'light'
    { label: 'HEAVY', value: WeaponCategory.HEAVY },       // value = 'heavy'
    { label: 'EXPLOSIVE', value: WeaponCategory.EXPLOSIVE } // value = 'explosive'
  ];

  const fetchWeapons = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: LIMIT,
        search: searchTerm || undefined,
        category: selectedCategory === 'ALL' ? undefined : selectedCategory, // ส่งค่า value (light/heavy/explosive)
        minPrice: minPrice,
        maxPrice: maxPrice,
        licenseLevel: requiredLicense,
        sort: priceSort
      };

      const response: WeaponsResponse = await getWeapons(params);
      
      setWeapons(response.data);
      setTotalPages(response.last_page);
      
      if (response.last_page > 0 && page > response.last_page) {
        setPage(1); 
      }
    } catch (error) {
      console.error('Error fetching weapons:', error);
      setWeapons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeapons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory, priceSort, requiredLicense]); 

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setPage(1);
      fetchWeapons();
    }, 500);
    return () => clearTimeout(delaySearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, minPrice, maxPrice]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const getCardClass = (category: WeaponCategory) => {
    switch (category) {
      case WeaponCategory.LIGHT: return 'card-light';
      case WeaponCategory.HEAVY: return 'card-heavy';
      case WeaponCategory.EXPLOSIVE: return 'card-explosive';
      default: return '';
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setMinPrice(0);
    setMaxPrice(1000000);
    setPriceSort('default');
    setRequiredLicense(0);
    setPage(1);
  };

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
        
        {/* Search */}
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
          {/* Categories (แก้ไขส่วนนี้) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 'bold' }}>ประเภท</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setSelectedCategory(option.value); setPage(1); }}
                  style={{
                    padding: '8px 15px', borderRadius: '20px', 
                    border: selectedCategory === option.value ? 'none' : '1px solid #444', 
                    cursor: 'pointer',
                    backgroundColor: selectedCategory === option.value ? '#ffc107' : 'transparent',
                    color: selectedCategory === option.value ? '#000' : '#aaa',
                    fontSize: '0.8rem', fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* License Level */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 'bold' }}>License Level</label>
            <select 
              value={requiredLicense}
              onChange={(e) => { setRequiredLicense(Number(e.target.value)); setPage(1); }}
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

          {/* Price Range */}
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

          {/* Sort */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 'bold' }}>เรียงลำดับ</label>
            <select value={priceSort} onChange={(e) => { setPriceSort(e.target.value); setPage(1); }} style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #444' }}>
              <option value="default">ค่าเริ่มต้น</option>
              <option value="low-to-high">ราคา: น้อยไปมาก</option>
              <option value="high-to-low">ราคา: มากไปน้อย</option>
            </select>
          </div>

          <button 
            onClick={handleClearFilters}
            style={{ padding: '8px 15px', borderRadius: '6px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}
          >
            ล้างค่า
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#ffc107' }}>Loading weapons...</div>
      ) : (
        <>
          <div className="weapon-grid">
            {weapons.length > 0 ? (
              weapons.map((weapon) => (
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
                     {/* ตรงนี้จะแสดงค่า category ตามที่ DB ส่งมา (light/heavy/explosive) */}
                     <span className="badge" style={{ textTransform: 'uppercase' }}>{weapon.category}</span>
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px', gap: '20px' }}>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: page === 1 ? '#333' : '#ffc107',
                  color: page === 1 ? '#666' : 'black',
                  border: 'none',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Previous
              </button>
              
              <span style={{ color: 'white', fontSize: '1.1rem', fontFamily: 'monospace' }}>
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: page === totalPages ? '#333' : '#ffc107',
                  color: page === totalPages ? '#666' : 'black',
                  border: 'none',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;