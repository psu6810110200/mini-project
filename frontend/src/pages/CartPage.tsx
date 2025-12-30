// src/pages/CartPage.tsx
import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // ✅ 1. เพิ่มบรรทัดนี้

const CartPage = () => {
  const { items, removeFromCart, addToCart, decreaseQuantity, totalPrice, clearCart } = useContext(CartContext)!;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      toast.error('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ'); // แจ้งเตือนถ้ายังไม่ Login
      return;
    }

    try {
      setLoading(true);

      const payload = {
        items: items.map((item) => ({
          weaponId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await axios.post('http://localhost:3000/orders', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        // ✅ 2. ขึ้นข้อความแจ้งเตือน "ชำระเงินสำเร็จ" ตรงนี้
        toast.success('ชำระเงินสำเร็จ !', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        clearCart(); 
        
        // รอแป๊บนึงค่อยเปลี่ยนหน้าเพื่อให้เห็น Toast หรือจะเปลี่ยนเลยก็ได้ (Toast ของ library นี้มันค้างข้ามหน้าได้)
        setTimeout(() => {
            navigate('/success', { 
            state: { 
                orderId: response.data.orderId,
                totalPrice: totalPrice 
            } 
            });
        }, 1000); // หน่วงเวลา 1 วินาที ให้เห็นข้อความก่อนไป
      }

    } catch (error: any) {
      console.error('Checkout Error:', error);
      const message = error.response?.data?.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ';
      toast.error(message); // แจ้งเตือน Error เป็นสีแดง
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
        <h1>🛒 ตะกร้าว่างเปล่า</h1>
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
    <div className="container" style={{ marginTop: '40px', color: 'white' }}>
      <h1>🛒 ตะกร้าสินค้าของคุณ</h1>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '20px' }}>
        
        {/* รายการสินค้า */}
        <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {items.map((item) => (
            <div key={item.id} style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '15px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              border: '1px solid #333'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  🔫
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.name}</h3>
                  <div style={{ color: '#aaa', fontSize: '0.9rem' }}>฿{item.price.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'black', borderRadius: '4px', border: '1px solid #444' }}>
                  <button 
                    onClick={() => decreaseQuantity(item.id)}
                    style={{ background: 'transparent', color: 'white', padding: '5px 10px', width: 'auto', border: 'none', cursor: 'pointer' }}
                  >-</button>
                  <span style={{ padding: '0 10px', fontWeight: 'bold' }}>{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    style={{ background: 'transparent', color: 'white', padding: '5px 10px', width: 'auto', border: 'none', cursor: 'pointer' }}
                  >+</button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ backgroundColor: '#dc3545', color: 'white', width: 'auto', padding: '8px 12px', fontSize: '0.9rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* สรุปยอดเงิน */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ backgroundColor: 'white', color: 'black', padding: '25px', borderRadius: '12px', position: 'sticky', top: '20px' }}>
            <h3>สรุปรายการสั่งซื้อ</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>ยอดรวม ({items.length} รายการ)</span>
              <span>฿{totalPrice.toLocaleString()}</span>
            </div>
            <hr style={{ borderColor: '#eee' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', margin: '20px 0' }}>
              <span>ยอดสุทธิ</span>
              <span style={{ color: '#007bff' }}>฿{totalPrice.toLocaleString()}</span>
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
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'กำลังดำเนินการ...' : 'ดำเนินการชำระเงิน'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;