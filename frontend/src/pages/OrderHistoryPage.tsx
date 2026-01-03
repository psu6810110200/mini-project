import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../api/orderApi';
import type { Order } from '../types';
import { OrderStatus } from '../types';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.APPROVED: return 'green';
      case OrderStatus.REJECTED: return 'red';
      default: return '#ffc107'; 
    }
  };

  // --- ฟังก์ชันแปลงวันที่ (ใช้ร่วมกันทั้ง วันที่สั่ง และ วันที่รับ) ---
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>📜 ประวัติการสั่งซื้อ (Order History)</h2>
      
      {orders.length === 0 ? (
        <p>ยังไม่มีรายการสั่งซื้อ</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#222' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Order ID</th>
              
              {/* หัวตาราง */}
              <th style={{ padding: '10px' }}>วันที่สั่ง</th>
              <th style={{ padding: '10px' }}>ต้องรับวันที่</th>
              
              <th style={{ padding: '10px' }}>รายการสินค้า</th>
              <th style={{ padding: '10px' }}>ราคารวม</th>
              <th style={{ padding: '10px' }}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '10px', fontSize: '0.9rem', color: '#aaa' }}>{order.id}</td>
                
                {/* --- 1. วันที่สั่งซื้อ (ตัดเวลาออก) --- */}
                <td style={{ padding: '10px' }}>
                  {formatDate(order.created_at)}
                </td>

                {/* --- 2. วันที่ต้องรับสินค้า --- */}
                <td style={{ padding: '10px', color: '#00bfff', fontWeight: 'bold' }}>
                  {formatDate(order.received_date)}
                </td>

                <td style={{ padding: '10px' }}>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {order.order_items.map((item) => (
                      <li key={item.id}>
                        {item.weapon?.name || 'Unknown Weapon'} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>
                  ฿{Number(order.total_price).toLocaleString()}
                </td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    color: getStatusColor(order.status),
                    border: `1px solid ${getStatusColor(order.status)}`,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistoryPage;