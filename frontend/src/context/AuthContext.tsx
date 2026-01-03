// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios'; 
import { type UserProfile } from '../types'; // Import Type ที่ถูกต้องมาใช้

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserProfile, rememberMe: boolean) => void;
  logout: () => void;
  loading: boolean; // เพิ่ม loading state ให้ component อื่นเช็คได้
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. เช็ค Token ตอนเริ่มโหลดหน้าเว็บ
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');

      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          // ตั้งค่า Header ให้ Axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error("Error parsing user data:", error);
          handleLogoutCleanup();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // ฟังก์ชันช่วยล้างข้อมูล (ใช้ภายใน)
  const handleLogoutCleanup = () => {
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_data');
  };

  // 2. ฟังก์ชัน Login
  const login = (token: string, userData: UserProfile, rememberMe: boolean) => {
    setUser(userData);
    setIsAuthenticated(true);

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    if (rememberMe) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('access_token', token);
      sessionStorage.setItem('user_data', JSON.stringify(userData));
    }
  };

  // 3. ฟังก์ชัน Logout
  const logout = () => {
    handleLogoutCleanup();
    // อาจจะ Redirect ไปหน้า Login หรือ Home ด้วยก็ได้ถ้าต้องการ
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};