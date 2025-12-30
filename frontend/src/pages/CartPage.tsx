// src/pages/CartPage.tsx
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { items, removeFromCart, addToCart, decreaseQuantity, totalPrice, clearCart } = useContext(CartContext)!;
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container" style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
        <h1>🛒 ตะกร้าว่างเปล่า</h1>
        <p style={{ color: '#aaa' }}>ยังไม่มีสินค้าในตะกร้าเลย ไปช้อปกันเถอะ!</p>
        <button 
          onClick={() => navigate('/')} 
          style={{ marginTop: '20px', backgroundColor: '#ffc107', color: 'black', width: 'auto', padding: '10px 20px' }}
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
        
        {/* รายการสินค้า (ด้านซ้าย) */}
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
                <div style={{ width: '60px', height: '60px', backgroundColor: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🔫
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.name}</h3>
                  <div style={{ color: '#aaa', fontSize: '0.9rem' }}>฿{item.price.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* ปุ่มปรับจำนวน */}
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'black', borderRadius: '4px', border: '1px solid #444' }}>
                  <button 
                    onClick={() => decreaseQuantity(item.id)}
                    style={{ background: 'transparent', color: 'white', padding: '5px 10px', width: 'auto' }}
                  >-</button>
                  <span style={{ padding: '0 10px', fontWeight: 'bold' }}>{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    style={{ background: 'transparent', color: 'white', padding: '5px 10px', width: 'auto' }}
                  >+</button>
                </div>

                {/* ปุ่มลบสินค้า (ถังขยะ) */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    width: 'auto', 
                    padding: '8px 12px', 
                    fontSize: '0.9rem' 
                  }}
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* สรุปยอดเงิน (ด้านขวา) */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ backgroundColor: 'white', color: 'black', padding: '25px', borderRadius: '12px' }}>
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
              onClick={() => { alert('ไปหน้าจ่ายเงิน (เร็วๆนี้)'); clearCart(); }}
              style={{ width: '100%', padding: '15px', fontSize: '1.1rem', backgroundColor: '#28a745' }}
            >
              ดำเนินการชำระเงิน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;