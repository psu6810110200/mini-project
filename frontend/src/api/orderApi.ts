import api from './axios';
import type { Order } from '../types';
import { OrderStatus } from '../types';

export const getMyOrders = async () => {
  const response = await api.get<Order[]>('/orders/my-orders');
  return response.data;
};

// ดึงรายการสั่งซื้อทั้งหมด (สำหรับ Admin)
export const getAllOrders = async () => {
  const response = await api.get<Order[]>('/orders');
  return response.data;
};

// อัปเดตสถานะออเดอร์ (Approve / Reject)
export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const response = await api.patch<Order>(`/orders/${id}/status`, { status });
  return response.data;
};