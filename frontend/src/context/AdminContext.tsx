// src/context/AdminContext.tsx
import React, { createContext, useState, useContext, type ReactNode } from 'react';
import api from '../api/axios'; 
import { getWeapons } from '../api/weaponApi';
import { getAllOrders } from '../api/orderApi';
import type { Weapon, Order, UserProfile } from '../types';

// กำหนด Type ของข้อมูลใน Context
interface AdminOrder extends Order {
  user?: UserProfile;
}

interface AdminContextType {
  weapons: Weapon[];
  orders: AdminOrder[];
  users: UserProfile[];
  loading: {
    weapons: boolean;
    orders: boolean;
    users: boolean;
  };
  fetchWeapons: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  
  // แยก Loading state เพื่อความละเอียด
  const [loading, setLoading] = useState({
    weapons: false,
    orders: false,
    users: false,
  });

  // --- Functions Fetch Data ---
  const fetchWeapons = async () => {
    setLoading(prev => ({ ...prev, weapons: true }));
    try {
      const res = await getWeapons({ page: 1, limit: 1000 }); // โหลดเยอะๆ ทีเดียว
      setWeapons(res.data);
    } catch (err) {
      console.error("Error fetching weapons:", err);
    } finally {
      setLoading(prev => ({ ...prev, weapons: false }));
    }
  };

  const fetchOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true }));
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const refreshAll = async () => {
    await Promise.all([fetchWeapons(), fetchOrders(), fetchUsers()]);
  };

  return (
    <AdminContext.Provider value={{ 
      weapons, orders, users, loading, 
      fetchWeapons, fetchOrders, fetchUsers, refreshAll 
    }}>
      {children}
    </AdminContext.Provider>
  );
};

// Hook สำหรับเรียกใช้
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};