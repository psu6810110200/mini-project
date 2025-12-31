// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
// ✅ Import api เพื่อนำมาตั้งค่า Header โดยตรง
import api from '../api/axios'; 

interface User {
  id: number;
  username: string;
  role: string;
  // เพิ่ม field อื่นๆ ตามที่ Backend ส่งมา
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User, rememberMe: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. เช็ค Token ตอนเริ่มโหลดหน้าเว็บ (เฉพาะกรณี Remember Me)
  useEffect(() => {
    const initAuth = () => {
      // ดึงจาก LocalStorage อย่างเดียว (เพราะ SessionStorage เราไม่ใช้แล้ว)
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user_data');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          // ✅ สำคัญ: ต้องตั้งค่า Header ให้ Axios ด้วย เพราะ Interceptor อาจจะหาไม่เจอถ้าเราไม่ได้ Login ใหม่
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

  // 2. ฟังก์ชัน Login (แบบ Refresh แล้วหลุด)
  const login = (token: string, userData: User, rememberMe: boolean) => {
    setUser(userData);
    setIsAuthenticated(true);

    // ✅ ตั้งค่า Token ให้ Axios ทันที (เพื่อให้ใช้งานได้เลยโดยไม่ต้องพึ่ง Storage)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    if (rememberMe) {
      // --- กรณีติ๊ก Remember Me: เก็บลงเครื่อง (อยู่ยาว) ---
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
    } else {
      // --- กรณีไม่ติ๊ก: ไม่เก็บลงที่ไหนเลย (Memory Only) ---
      // พอ Refresh ปุ๊บ ตัวแปร state หาย -> หลุดทันที
      // และต้องเคลียร์ของเก่าทิ้งเพื่อความชัวร์
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
    }
    
    // เคลียร์ sessionStorage เผื่อมีขยะเหลือจากเวอร์ชั่นเก่า
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_data');
  };

  // 3. ฟังก์ชัน Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // ❌ ลบ Token ออกจาก Axios Header
    delete api.defaults.headers.common['Authorization'];
    
    // ลบข้อมูลออกจาก Storage ทุกที่
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_data');
  };

  if (loading) {
    return null; // หรือใส่ Loading Spinner
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};