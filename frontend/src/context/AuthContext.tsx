// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';

// กำหนดหน้าตาของ Context
interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  // เพิ่ม parameter rememberMe 
  login: (token: string, user: UserProfile, rememberMe?: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // เพิ่ม state นี้เพื่อบอกว่ากำลังเช็คข้อมูลในเครื่องอยู่หรือไม่
}

// สร้าง Context ขึ้นมา
export const AuthContext = createContext<AuthContextType | null>(null);

// สร้าง Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // เริ่มต้นเป็น true (กำลังโหลด)

  // โหลดข้อมูลจาก Storage เมื่อเปิดเว็บครั้งแรก
  useEffect(() => {
    // เช็คทั้ง 2 ที่ (เผื่อ user เคยติ๊ก rememberMe ไว้ หรือไม่เคย)
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    // สำคัญ: บอกว่าโหลดเสร็จแล้ว (ไม่ว่าจะเจอหรือไม่เจอก็ตาม)
    setIsLoading(false);
  }, []);

  // ฟังก์ชัน Login (ปรับปรุงให้รองรับ Remember Me)
  const login = (newToken: string, newUser: UserProfile, rememberMe: boolean = false) => {
    setToken(newToken);
    setUser(newUser);

    if (rememberMe) {
      // ถ้าติ๊ก Remember Me -> เก็บใน LocalStorage (ปิด Browser ไม่หาย)
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      // ถ้าไม่ติ๊ก -> เก็บใน SessionStorage (ปิด Browser หาย)
      sessionStorage.setItem('token', newToken);
      sessionStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  // ฟังก์ชัน Logout (ลบทุกที่)
  const logout = () => {
    setToken(null);
    setUser(null);
    
    // ลบออกให้หมดทั้ง 2 ที่เพื่อความชัวร์
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};