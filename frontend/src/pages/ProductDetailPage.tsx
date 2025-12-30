// src/pages/ProductDetailPage.tsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { type Weapon } from '../types';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { addToCart } = useContext(CartContext)!;
  
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeapon = async () => {
      try {
        const res = await api.get(`/weapons/${id}`);
        setWeapon(res.data);
      } catch (error) {
        console.error('Error:', error);
        navigate('/'); 
      } finally {
        setLoading(false);
      }
    };
    fetchWeapon();
  }, [id, navigate]);

  if (loading) return <div style={{ color: '#ffc107', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (!weapon) return null;

  const getBadgeColor = (cat: string) => {
    switch (cat) {
      case 'light': return '#28a745';
      case 'heavy': return '#007bff';
      case 'explosive': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="container" style={{ marginTop: '20px', color: 'white', position: 'relative' }}>
      
      {/* 1. ปุ่มย้อนกลับแบบสั้น ชิดมุมซ้าย */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          position: 'absolute',    
          top: '0',                
          left: '0',               // ชิดขอบซ้ายสุดของ Container
          backgroundColor: '#1a1a1a', 
          border: '1px solid #ffc107', 
          color: '#ffc107',            
          padding: '4px 10px',     // ลด Padding ให้ปุ่มสั้นลง
          fontSize: '0.8rem',      
          cursor: 'pointer', 
          borderRadius: '50px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'all 0.2s',
          zIndex: 10,
          boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#ffc107';
          e.currentTarget.style.color = 'black';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#1a1a1a';
          e.currentTarget.style.color = '#ffc107';
        }}
      >
        <span>←</span> กลับ
      </button>

      {/* เพิ่ม Margin Top เพื่อเว้นระยะให้เนื้อหาไม่ทับปุ่ม */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: '45px' }}>
        
        {/* ส่วนรูปภาพ */}
        <div style={{ 
          flex: '1.5', 
          minWidth: '350px', 
          backgroundColor: '#111', 
          height: '500px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          borderRadius: '12px', 
          border: '1px solid #333', 
          overflow: 'hidden',
          padding: '20px'
        }}>
           <img 
             src={weapon.image || "https://placehold.co/600x450?text=No+Image"} 
             alt={weapon.name}
             style={{ width: '100%', height: '100%', objectFit: 'contain' }}
             onError={(e) => {
               (e.target as HTMLImageElement).src = "https://placehold.co/600x450?text=Image+Error";
             }}
           />
        </div>

        {/* ส่วนรายละเอียด */}
        <div style={{ 
            flex: '1', 
            minWidth: '300px',
            backgroundColor: '#1a1a1a', 
            padding: '30px',          
            borderRadius: '12px',     
            color: 'white',             
            border: '1px solid #333',   
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ 
              backgroundColor: getBadgeColor(weapon.category), 
              color: 'white', 
              padding: '5px 12px', 
              borderRadius: '4px', 
              fontSize: '0.9rem', 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {weapon.category}
            </span>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>ID: {weapon.id.substring(0,6)}</span>
          </div>
          
          <h1 style={{ fontSize: '2.5rem', margin: '20px 0', color: 'white', lineHeight: '1.2' }}>{weapon.name}</h1>
          <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '1.1rem' }}>{weapon.description}</p>
          
          <div style={{ margin: '30px 0', borderTop: '1px solid #333', borderBottom: '1px solid #333', padding: '25px 0' }}>
            
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffc107', textShadow: '0 0 10px rgba(255, 193, 7, 0.2)' }}>
              ฿{weapon.price.toLocaleString()}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
              <div style={{ color: weapon.stock > 0 ? '#28a745' : '#dc3545', fontWeight: 'bold', fontSize: '1.1rem' }}>
                {weapon.stock > 0 ? `✓ มีสินค้าในคลัง ${weapon.stock} ชิ้น` : '✕ สินค้าหมดชั่วคราว'}
              </div>
              <div style={{ color: '#ccc' }}>
                Requires License Level: <strong style={{ color: '#ffc107', border: '1px solid #ffc107', padding: '0 6px', borderRadius: '4px' }}>{weapon.required_license_level}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              disabled={weapon.stock === 0}
              onClick={() => addToCart(weapon)} 
              style={{ 
                backgroundColor: weapon.stock > 0 ? '#007bff' : '#ccc', 
                color: 'white',
                fontSize: '1.2rem', 
                padding: '15px 30px',
                border: 'none',
                borderRadius: '6px',
                cursor: weapon.stock > 0 ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              🛒 {weapon.stock > 0 ? 'เพิ่มลงตะกร้า' : 'สินค้าหมด'}
            </button>
            
            {auth?.user?.role === 'admin' && (
               <button 
                 onClick={() => navigate('/admin')}
                 style={{ backgroundColor: '#ffc107', color: 'black', width: 'auto', border: 'none', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
               >
                 ⚙️ แก้ไข
               </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;