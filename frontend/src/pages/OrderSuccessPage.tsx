// src/pages/OrderSuccessPage.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// กำหนด Type ของข้อมูลที่จะรับมาจากหน้า Cart
interface OrderSuccessState {
  orderId: string;
  totalPrice: number;
}

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // รับข้อมูล Order ID และยอดเงิน
  const state = location.state as OrderSuccessState | null;
  const { orderId, totalPrice } = state || {};

  // ถ้าไม่มี Order ID (คนแอบเข้าหน้านี้ตรงๆ) ให้ดีดกลับหน้าแรก
  useEffect(() => {
    if (!orderId) {
      navigate('/'); 
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="container" style={{ 
      marginTop: '60px', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '60vh' 
    }}>
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '50px', 
        borderRadius: '15px', 
        textAlign: 'center', 
        maxWidth: '500px', 
        width: '100%',
        border: '1px solid #333',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
      }}>
        
        {/* ไอคอนเครื่องหมายถูก */}
        <div style={{ 
          width: '80px', 
          height: '80px', 
          backgroundColor: '#28a745', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 20px auto' 
        }}>
          <svg style={{ width: '50px', height: '50px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>สั่งซื้อสำเร็จ!</h1>
        <p style={{ color: '#aaa', marginBottom: '30px' }}>ขอบคุณที่อุดหนุน อาวุธของคุณพร้อมจัดส่งแล้ว</p>

        {/* รายละเอียด Order */}
        <div style={{ 
          backgroundColor: '#252525', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Order ID:</span>
            <div style={{ fontFamily: 'monospace', color: '#ffc107', wordBreak: 'break-all' }}>{orderId}</div>
          </div>
          
          <hr style={{ borderColor: '#444', margin: '15px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#aaa' }}>ยอดชำระรวม:</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
              ฿{Number(totalPrice).toLocaleString()}
            </span>
          </div>
        </div>

        {/* ปุ่มกลับหน้าร้าน */}
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            backgroundColor: '#ffc107', 
            color: 'black', 
            padding: '12px 30px', 
            fontSize: '1rem', 
            fontWeight: 'bold',
            border: 'none', 
            borderRadius: '50px', 
            cursor: 'pointer',
            transition: 'transform 0.2s',
            width: '100%'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          กลับไปหน้าแรก
        </button>

      </div>
    </div>
  );
};

export default OrderSuccessPage;