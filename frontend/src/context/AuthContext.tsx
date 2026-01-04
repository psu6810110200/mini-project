// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios'; 
import { type UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserProfile, rememberMe: boolean) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. เช็ค Token ตอนเริ่มโหลดหน้าเว็บ
  useEffect(() => {
    const initAuth = () => {
      // ✅ แก้ไข: ดึงเฉพาะจาก LocalStorage (กรณี Remember Me เท่านั้น)
      // ไม่ดึงจาก SessionStorage แล้ว เพื่อให้คนที่ไม่ได้ติ๊ก Remember Me หลุดเมื่อ Refresh
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user_data');

      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_data');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 2. ฟังก์ชัน Login
  const login = (token: string, userData: UserProfile, rememberMe: boolean) => {
    // เซ็ตค่าใน Memory (State) ก่อน เพื่อให้เว็บทำงานต่อได้ทันทีโดยไม่ต้องรีโหลด
    setUser(userData);
    setIsAuthenticated(true);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // เคลียร์ค่าเก่าทิ้งเสมอ เพื่อป้องกันความสับสน
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_data');

    if (rememberMe) {
      // ✅ กรณีติ๊ก Remember Me: เก็บลง LocalStorage (อยู่ยาว รีเฟรชไม่หาย ปิดคอมไม่หาย)
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
    } 
    
    // ❌ กรณีไม่ติ๊ก: ไม่เก็บลงที่ไหนเลย (Memory Only)
    // ผลลัพธ์: ใช้งานได้ปกติ แต่พอกด Refresh ปุ๊บ ตัวแปร state (user, isAuthenticated) จะถูกรีเซ็ตและหายไปทันที -> เด้งไปหน้า Login
  };

  // 3. ฟังก์ชัน Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
    
    // ลบทุกอย่างเกลี้ยง
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_data');
  };

  if (loading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};