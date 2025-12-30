// src/pages/ProductDetailPage.tsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { type Weapon } from '../types';
import { AuthContext } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeapon = async () => {
      try {
        const res = await api.get(`/weapons/${id}`);
        setWeapon(res.data);
      } catch (error) {
        console.error('หาอาวุธไม่เจอ', error);
        navigate('/'); 
      } finally {
        setLoading(false);
      }
    };
    fetchWeapon();
  }, [id, navigate]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
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
    <div className="container" style={{ marginTop: '40px', color: 'white' }}>
      {/* ปุ่มย้อนกลับ (อยู่บนพื้นดำเหมือนเดิม) */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '20px', background: 'transparent', border: '1px solid #666', color: '#ccc', width: 'auto', padding: '5px 15px', cursor: 'pointer' }}
      >
        ← ย้อนกลับ
      </button>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* กล่องซ้าย: รูปสินค้า (พื้นดำเหมือนเดิม ให้เด่นขึ้นมา) */}
        <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#111', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: `2px solid ${getBadgeColor(weapon.category)}` }}>
           <h2 style={{ color: '#555' }}>[ WEAPON IMAGE ]</h2>
        </div>

        {/* ✅ กล่องขวา: รายละเอียด (ใส่พื้นขาวตามที่ขอ) */}
        <div style={{ 
            flex: '1', 
            minWidth: '300px',
            backgroundColor: 'white', // พื้นขาว
            padding: '30px',          // เว้นระยะขอบ
            borderRadius: '12px',     // มุมโค้ง
            color: '#333',            // ตัวหนังสือสีดำ
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)' // เงาเล็กน้อยให้ดูลอยเด่น
        }}>
          <span style={{ backgroundColor: getBadgeColor(weapon.category), color: 'white', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {weapon.category}
          </span>
          
          <h1 style={{ fontSize: '2.5rem', margin: '15px 0', color: 'black' }}>{weapon.name}</h1>
          <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1.1rem' }}>{weapon.description}</p>
          
          {/* เส้นขีดคั่นเปลี่ยนเป็นสีเทาอ่อน */}
          <div style={{ margin: '30px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '20px 0' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
              ฿{weapon.price.toLocaleString()}
            </div>
            <div style={{ marginTop: '10px', color: weapon.stock > 0 ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
              {weapon.stock > 0 ? `● มีสินค้า ${weapon.stock} ชิ้น` : '● สินค้าหมด'}
            </div>
            <div style={{ marginTop: '5px', color: '#666' }}>
              Requires License Level: <strong style={{ color: 'black' }}>{weapon.required_license_level}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              disabled={weapon.stock === 0}
              onClick={() => alert(`คุณต้องการซื้อ ${weapon.name} ใช่ไหม?`)}
              style={{ 
                backgroundColor: weapon.stock > 0 ? '#007bff' : '#ccc', 
                color: 'white',
                fontSize: '1.2rem', 
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                cursor: weapon.stock > 0 ? 'pointer' : 'not-allowed',
                fontWeight: 'bold'
              }}
            >
              {weapon.stock > 0 ? '🛒 สั่งซื้อทันที' : 'สินค้าหมด'}
            </button>
            
            {/* ปุ่ม Admin */}
            {auth?.user?.role === 'admin' && (
               <button 
                 onClick={() => navigate('/admin')}
                 style={{ backgroundColor: '#ffc107', color: 'black', width: 'auto', border: 'none', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
               >
                 ⚙️ แก้ไขสินค้า
               </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;