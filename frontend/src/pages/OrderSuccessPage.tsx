import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

// 1. เพิ่ม receivedDate ใน Type เพื่อรับค่าวันที่จากหน้า CartPage
interface OrderSuccessState {
  orderId: string;
  totalPrice: number;
  totalQuantity: number;
  receivedDate?: string; // เพิ่มตัวนี้
}

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ดึงข้อมูลจาก State ที่ส่งมาจาก CartPage
  const state = location.state as OrderSuccessState | null;
  const { orderId, totalPrice, totalQuantity, receivedDate } = state || {};

  // ถ้าไม่มี Order ID ให้ดีดกลับหน้าแรก
  useEffect(() => {
    if (!orderId) {
      navigate('/'); 
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  // --- ฟังก์ชันจัดรูปแบบวันที่ภาษาไทย ---
  const formatThaiDate = (dateString: string | undefined) => {
    if (!dateString) return "ไม่ระบุวันที่";
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="container" style={{ 
      marginTop: '40px', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '80vh',
      paddingBottom: '40px'
    }}>
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '40px', 
        borderRadius: '15px', 
        textAlign: 'center', 
        maxWidth: '600px', 
        width: '100%',
        border: '1px solid #333',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
      }}>
        
        {/* ไอคอนสำเร็จ */}
        <div style={{ 
          width: '80px', 
          height: '80px', 
          backgroundColor: '#28a745', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 20px auto',
          boxShadow: '0 0 15px rgba(40, 167, 69, 0.4)'
        }}>
          <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#28a745' }}>สั่งซื้อสำเร็จ!</h1>
        <p style={{ color: '#aaa', marginBottom: '30px' }}>ขอบคุณที่อุดหนุน อาวุธของคุณพร้อมจัดเตรียมแล้ว</p>

        {/* --- ใบเสร็จ --- */}
        <div style={{ 
          backgroundColor: '#252525', 
          padding: '25px', 
          borderRadius: '10px', 
          marginBottom: '25px',
          textAlign: 'left',
          border: '1px solid #333'
        }}>
          <h3 style={{ borderBottom: '1px dashed #555', paddingBottom: '15px', marginTop: 0, color: '#ffc107', textAlign: 'center' }}>
             🧾 ใบเสร็จรับเงิน
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px', fontSize: '0.95rem' }}>
            <div style={{ color: '#aaa' }}>Order ID:</div>
            <div style={{ fontFamily: 'monospace', color: 'white', textAlign: 'right', letterSpacing: '1px' }}>
              {orderId.substring(0, 8).toUpperCase()}
            </div>
            
            <div style={{ color: '#aaa' }}>วันที่ทำรายการ:</div>
            <div style={{ color: 'white', textAlign: 'right' }}>
              {new Date().toLocaleDateString('th-TH')}
            </div>

            <div style={{ color: '#aaa' }}>จำนวนสินค้า:</div>
            <div style={{ color: 'white', textAlign: 'right' }}>
              {totalQuantity} ชิ้น
            </div>
          </div>

          <div style={{ 
            borderTop: '1px dashed #555', 
            paddingTop: '15px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>ยอดสุทธิ</span>
            <span style={{ fontSize: '1.4rem', color: '#28a745', fontWeight: 'bold' }}>
              ฿{Number(totalPrice).toLocaleString()}
            </span>
          </div>
        </div>

        {/* --- ส่วนแสดงวันนัดรับสินค้า (แก้ไขใหม่) --- */}
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#1e2a38', 
          borderRadius: '10px', 
          border: '1px solid #2c3e50',
          marginBottom: '30px'
        }}>
             <strong style={{ color: '#61dafb', display: 'block', marginBottom: '5px' }}>
               📅 กำหนดวันนัดรับสินค้า
             </strong>
             <div style={{ fontSize: '1.3rem', color: 'white', fontWeight: 'bold', margin: '5px 0' }}>
               {/* แสดงวันที่ที่รับมาจากหน้า Cart */}
               {formatThaiDate(receivedDate)}
             </div>
             <small style={{ color: '#888', fontStyle: 'italic' }}>
               (กรุณามารับสินค้าตามวันที่ระบุไว้)
             </small>
        </div>
        {/* -------------------------------------- */}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link to="/orders" style={{ textDecoration: 'none', flex: 1 }}>
            <button 
              style={{ 
                width: '100%',
                backgroundColor: 'transparent', 
                color: '#ffc107', 
                border: '1px solid #ffc107', 
                padding: '12px', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                borderRadius: '50px', 
                cursor: 'pointer'
              }}
            >
              ดูประวัติการสั่งซื้อ
            </button>
          </Link>
          
          <button 
            onClick={() => navigate('/')} 
            style={{ 
              flex: 1,
              backgroundColor: '#ffc107', 
              color: 'black', 
              padding: '12px', 
              fontSize: '1rem', 
              fontWeight: 'bold',
              border: 'none', 
              borderRadius: '50px', 
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(255, 193, 7, 0.3)'
            }}
          >
            กลับหน้าแรก
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;