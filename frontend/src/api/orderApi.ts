import api from './axios';
import type { Order } from '../types';

export const getMyOrders = async () => {
  const response = await api.get<Order[]>('/orders/my-orders');
  return response.data;
};