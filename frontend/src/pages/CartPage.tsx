// src/pages/CartPage.tsx
import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const CartPage = () => {
  const { items, removeFromCart, addToCart, decreaseQuantity, totalPrice, clearCart } = useContext(CartContext)!;
  const auth = useContext(AuthContext); 
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // --- เพิ่ม State สำหรับเก็บวันที่ที่เลือก ---
  const [selectedDate, setSelectedDate] = useState<string>('');
  // --------------------------------------

  const handleCheckout = async () => {
    if (!auth?.isAuthenticated) {
      toast.error('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ');
      return;
    }

    // --- เพิ่มการเช็คว่าเลือกวันที่หรือยัง ---
    if (!selectedDate) {
      toast.warn('กรุณาเลือกวันที่ต้องการรับสินค้า');
      return;
    }
    // ----------------------------------

    try {
      setLoading(true);

      const payload = {
        items: items.map((item) => ({
          weaponId: item.id,
          quantity: item.quantity,
        })),
        received_date: selectedDate, // --- ส่งวันที่ไปด้วย ---
      };

      const response = await api.post('/orders', payload);

      if (response.status === 201) {
        toast.success('ชำระเงินสำเร็จ !', {
          position: "top-right",
          autoClose: 3000,
        });

        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

        clearCart();
        
        navigate('/order-success', { 
          state: { 
            orderId: response.data.orderId || response.data.id, 
            totalPrice: response.data.totalPrice || totalPrice,
            totalQuantity: totalQuantity,
            receivedDate: selectedDate
          } 
        });
      }
    } catch (error: any) {
      console.error('Checkout Error:', error);
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการชำระเงิน');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>
        <h1>🛒 ตะกร้าสินค้าของคุณว่างเปล่า</h1>
        <p style={{ color: '#aaa' }}>ยังไม่มีสินค้าในตะกร้าเลย ไปช้อปกันเถอะ!</p>
        <button 
          onClick={() => navigate('/')} 
          style={{ marginTop: '20px', backgroundColor: '#ffc107', color: 'black', width: 'auto', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          ไปเลือกซื้อสินค้า
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '40px', color: 'white', paddingBottom: '50px' }}>
      <h1 style={{ marginBottom: '30px' }}>ตะกร้าสินค้าของคุณ</h1>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* รายการสินค้า */}
        <div style={{ flex: '2', minWidth: '400px' }}>
          {items.map((item) => (
            <div key={item.id} style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '15px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '15px',
              border: '1px solid #333'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: '#333', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src={item.image || "https://placehold.co/100x100?text=No+Img"} 
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Error"; }}
                  />
                </div>

                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{item.name}</h3>
                  <div style={{ color: '#007bff', fontWeight: 'bold', marginTop: '5px' }}>
                    ฿{item.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#333', borderRadius: '5px' }}>
                  <button onClick={() => decreaseQuantity(item.id)} style={{ background: 'none', border: 'none', color: 'white', padding: '5px 12px', cursor: 'pointer' }}>-</button>
                  <span style={{ padding: '0 10px' }}>{item.quantity}</span>
                  <button onClick={() => addToCart(item)} style={{ background: 'none', border: 'none', color: 'white', padding: '5px 12px', cursor: 'pointer' }}>+</button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* สรุปราคา */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ backgroundColor: 'white', color: 'black', padding: '25px', borderRadius: '12px', position: 'sticky', top: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
            <h3 style={{ marginTop: 0 }}>สรุปรายการสั่งซื้อ</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>จำนวนสินค้า</span>
              <span>{items.reduce((acc, item) => acc + item.quantity, 0)} ชิ้น</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>ยอดรวม</span>
              <span>฿{totalPrice.toLocaleString()}</span>
            </div>
            
            <hr style={{ borderColor: '#eee' }} />

            {/* --- เพิ่ม Input เลือกวันที่ --- */}
            <div style={{ marginTop: '15px', marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>วันที่ต้องการรับสินค้า:</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ccc', 
                  borderRadius: '5px',
                  fontSize: '1rem'
                }}
                min={new Date().toISOString().split('T')[0]} // ป้องกันเลือกวันในอดีต
              />
            </div>
            {/* --------------------------- */}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', margin: '20px 0' }}>
              <span>ยอดสุทธิ</span>
              <span style={{ color: '#28a745' }}>฿{totalPrice.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '15px', 
                fontSize: '1.1rem', 
                backgroundColor: loading ? '#6c757d' : '#28a745', 
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;