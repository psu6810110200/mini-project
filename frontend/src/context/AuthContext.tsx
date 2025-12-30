// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from 'react';

// 1. กำหนด Type ของ User (ปรับแก้ field ตาม database ของคุณได้เลย)
interface User {
  id: number;
  username: string;
  role: string; // เช่น 'admin', 'user'
  // เพิ่ม field อื่นๆ ตามที่ Backend ส่งมา
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  // เพิ่ม parameter rememberMe: boolean เข้าไปใน function login
  login: (token: string, user: User, rememberMe: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // เพิ่ม loading state เพื่อกันหน้าเว็บเด้งไป Login ตอนกด Refresh
  const [loading, setLoading] = useState(true);

  // 2. เช็ค Token ตอนโหลดหน้าเว็บ (Rehydration)
  useEffect(() => {
    const initAuth = () => {
      // ลองหาใน localStorage ก่อน (กรณี user ติ๊ก Remember Me ไว้)
      let token = localStorage.getItem('access_token');
      let savedUser = localStorage.getItem('user_data');

      // ถ้าไม่เจอใน localStorage ให้ลองหาใน sessionStorage (กรณีไม่ได้ติ๊ก)
      if (!token || !savedUser) {
        token = sessionStorage.getItem('access_token');
        savedUser = sessionStorage.getItem('user_data');
      }

      // ถ้าเจอ Token ที่ไหนสักที่ ให้ Set ค่ากลับเข้าไปใน State
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          // ถ้าข้อมูล error ให้เคลียร์ทิ้งเพื่อความปลอดภัย
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_data');
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('user_data');
        }
      }
      setLoading(false); // โหลดเสร็จแล้ว
    };

    initAuth();
  }, []);

  // 3. ฟังก์ชัน Login ปรับปรุงใหม่
  const login = (token: string, userData: User, rememberMe: boolean) => {
    setUser(userData);
    setIsAuthenticated(true);

    if (rememberMe) {
      // ถ้าติ๊ก Remember Me: เก็บลง localStorage (อยู่ยาวจนกว่าจะสั่งลบ)
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
    } else {
      // ถ้าไม่ติ๊ก: เก็บลง sessionStorage (ปิด Browser แล้วหาย)
      sessionStorage.setItem('access_token', token);
      sessionStorage.setItem('user_data', JSON.stringify(userData));
    }
  };

  // 4. ฟังก์ชัน Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // ลบออกจากทั้ง 2 ที่เพื่อความชัวร์
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_data');
  };

  // ถ้ายังโหลดไม่เสร็จ (กำลังเช็ค Token) ไม่ต้อง Render อะไร (หรือใส่ Loading Spinner)
  if (loading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};