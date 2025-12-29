// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';

// กำหนดหน้าตาของ Context ว่าจะมีฟังก์ชันอะไรให้เรียกใช้บ้าง
interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// สร้าง Context ขึ้นมา (เริ่มต้นเป็น null)
export const AuthContext = createContext<AuthContextType | null>(null);

// สร้าง Provider (ตัวคลุม App เพื่อแจกจ่ายข้อมูล)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // โหลดข้อมูลจาก LocalStorage เมื่อเปิดเว็บครั้งแรก (กัน Refresh แล้วหลุด)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ฟังก์ชัน Login (บันทึก Token)
  const login = (newToken: string, newUser: UserProfile) => {
    setToken(newToken);
    setUser(newUser);
    // บันทึกลง LocalStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // ฟังก์ชัน Logout (ลบ Token)
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // window.location.href = '/login'; // บังคับเด้งไปหน้า Login
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};