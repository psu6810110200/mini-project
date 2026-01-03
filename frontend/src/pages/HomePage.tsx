import React, { useEffect, useState } from 'react';
import { getWeapons, type WeaponsResponse } from '../api/weaponApi';
import { type Weapon, WeaponCategory } from '../types'; 
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
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  const [priceSort, setPriceSort] = useState<string>('default');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [requiredLicense, setRequiredLicense] = useState<number>(0);

  // กำหนดปุ่มและ Class ตามสีที่ต้องการ
  const categoryOptions = [
    { label: 'ALL CLASS', value: 'ALL', activeClass: 'active-all' },
    { label: 'LIGHT', value: WeaponCategory.LIGHT, activeClass: 'active-light' },
    { label: 'HEAVY', value: WeaponCategory.HEAVY, activeClass: 'active-heavy' },
    { label: 'EXPLOSIVE', value: WeaponCategory.EXPLOSIVE, activeClass: 'active-explosive' }
  ];

  const fetchWeapons = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: LIMIT,
        search: searchTerm || undefined,
        category: selectedCategory === 'ALL' ? undefined : selectedCategory,
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
  }, [page, selectedCategory, priceSort, requiredLicense]); 

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setPage(1);
      fetchWeapons();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm, minPrice, maxPrice]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ฟังก์ชันกำหนดสี Badge ในตัวการ์ดสินค้า
  const getBadgeStyle = (category: WeaponCategory) => {
    switch (category) {
      case WeaponCategory.LIGHT: return { backgroundColor: '#2ecc71', color: '#fff' }; // เขียว
      case WeaponCategory.HEAVY: return { backgroundColor: '#3498db', color: '#fff' }; // ฟ้า
      case WeaponCategory.EXPLOSIVE: return { backgroundColor: '#e74c3c', color: '#fff' }; // แดง
      default: return { backgroundColor: '#333', color: '#fff' };
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
      
      {/* Header */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
        <h1 style={{ color: '#ffc107', margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '2.5rem' }}>
          ARMORY <span style={{ color: '#fff', fontSize: '1rem', verticalAlign: 'middle', marginLeft: '10px', opacity: 0.6 }}>// CLASSIFIED ACCESS</span>
        </h1>
      </div>

      {/* Main Layout Container */}
      <div className="home-layout">
        
        {/* --- Sidebar (Left) --- */}
        <aside className="filter-sidebar">
          <div className="sidebar-header">SYSTEM FILTER</div>
          
          {/* Search */}
          <div className="filter-group">
            <div className="search-box">
              <input 
                type="text"
                placeholder="SEARCH..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="filter-group">
            <label className="filter-label">CATEGORY</label>
            <div className="category-list">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setSelectedCategory(option.value); setPage(1); }}
                  className={`cat-btn ${selectedCategory === option.value ? option.activeClass : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* License */}
          <div className="filter-group">
            <label className="filter-label">LICENSE REQUIRED</label>
            <select 
              value={requiredLicense}
              onChange={(e) => { setRequiredLicense(Number(e.target.value)); setPage(1); }}
              className="styled-input full-width"
            >
              <option value={0}>-- ALL LEVELS --</option>
              <option value={1}>LV.1 CIVILIAN</option>
              <option value={2}>LV.2 LAW ENFORCEMENT</option>
              <option value={3}>LV.3 MILITARY</option>
              <option value={4}>LV.4 SPECIAL OPS</option>
              <option value={5}>LV.5 BLACK MARKET</option>
            </select>
          </div>

          {/* Price */}
          <div className="filter-group">
            <label className="filter-label">PRICE RANGE</label>
            <div className="price-inputs-col">
              <input 
                type="number" 
                className="styled-input"
                value={minPrice} 
                onChange={(e) => setMinPrice(Number(e.target.value))} 
                placeholder="MIN"
              />
              <span className="price-to">TO</span>
              <input 
                type="number" 
                className="styled-input"
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))} 
                placeholder="MAX"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label className="filter-label">SORT BY</label>
            <select 
              value={priceSort} 
              onChange={(e) => { setPriceSort(e.target.value); setPage(1); }}
              className="styled-input full-width"
            >
              <option value="default">DEFAULT</option>
              <option value="low-to-high">PRICE: LOW ➜ HIGH</option>
              <option value="high-to-low">PRICE: HIGH ➜ LOW</option>
            </select>
          </div>

          <button onClick={handleClearFilters} className="reset-btn full-width">
            RESET SYSTEM
          </button>
        </aside>

        {/* --- Product Content (Right) --- */}
        <main className="product-content">
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
                         <span className="badge" style={{ ...getBadgeStyle(weapon.category), textTransform: 'uppercase' }}>
                           {weapon.category}
                         </span>
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
                          className="view-product-btn"
                          style={{ 
                            padding: '8px 20px', 
                            backgroundColor: '#ffc107', 
                            color: 'black', 
                            border: 'none', 
                            cursor: 'pointer', 
                            borderRadius: '50px',
                            fontWeight: 'bold',
                            transition: 'transform 0.2s, background-color 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.backgroundColor = '#ff8f00';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.backgroundColor = '#ffc107';
                          }}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination-card">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="page-btn"
                    >
                      &lt;
                    </button>
                    <div className="page-info">
                      <span className="current-page">{page}</span>
                      <span className="total-pages">/ {totalPages}</span>
                    </div>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="page-btn"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

      </div>
    </div>
  );
};

export default HomePage;