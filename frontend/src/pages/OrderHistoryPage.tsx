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
      default: return '#ffc107'; // Pending สีเหลือง
    }
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
              <th style={{ padding: '10px' }}>วันที่</th>
              <th style={{ padding: '10px' }}>รายการสินค้า</th>
              <th style={{ padding: '10px' }}>ราคารวม</th>
              <th style={{ padding: '10px' }}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '10px', fontSize: '0.9rem', color: '#aaa' }}>{order.id}</td>
                <td style={{ padding: '10px' }}>
                  {new Date(order.created_at).toLocaleString('th-TH')}
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
                  ${Number(order.total_price).toLocaleString()}
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