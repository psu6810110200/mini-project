// src/context/CartContext.tsx
import React, { createContext, useState, type ReactNode, useEffect, useContext } from 'react';
import type { Weapon, CartItem } from '../types';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext'; // ✅ 1. Import AuthContext

interface CartContextType {
  items: CartItem[];
  addToCart: (weapon: Weapon) => void;
  removeFromCart: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // ✅ 2. ดึงข้อมูล User จาก AuthContext
  const auth = useContext(AuthContext);
  const user = auth?.user;

  // ฟังก์ชันสร้างชื่อ Key สำหรับเก็บข้อมูล (แยกของใครของมัน)
  const getCartKey = (username?: string) => `cart_${username || 'guest'}`;

  // ✅ 3. Load ตะกร้าเมื่อ User เปลี่ยนคน (เช่น Login เข้ามา หรือ Logout)
  useEffect(() => {
    if (user?.username) {
      // กรณี Login: ให้ไปดึงตะกร้าเก่าของคนนั้นมาแสดง
      const savedCart = localStorage.getItem(getCartKey(user.username));
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      } else {
        setItems([]); // ถ้าไม่มีของเก่า ก็เริ่มใหม่
      }
    } else {
      // กรณี Logout / Guest: ให้เคลียร์ตะกร้าหน้าจอทิ้ง
      setItems([]); 
    }
  }, [user?.username]);

  // ✅ 4. Save ตะกร้าลง LocalStorage ทุกครั้งที่ items เปลี่ยน (เฉพาะตอน Login อยู่)
  useEffect(() => {
    if (user?.username) {
      localStorage.setItem(getCartKey(user.username), JSON.stringify(items));
    }
  }, [items, user?.username]);

  // --- ฟังก์ชันจัดการสินค้า (Logic เดิม) ---
  const addToCart = (weapon: Weapon) => {
    const existingItem = items.find((i) => i.id === weapon.id);

    if (existingItem) {
      if (existingItem.quantity >= weapon.stock) {
        toast.error('สินค้าหมดสต็อกแล้ว!');
        return;
      }
      toast.success(`เพิ่ม ${weapon.name} อีก 1 ชิ้น`);
      setItems((prev) => 
        prev.map((item) => 
          item.id === weapon.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      toast.success(`เพิ่ม ${weapon.name} ลงตะกร้าแล้ว`);
      setItems((prev) => [...prev, { ...weapon, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.info('ลบสินค้าออกจากตะกร้าแล้ว');
  };

  const decreaseQuantity = (id: string) => {
    setItems((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }).filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setItems([]);
    // ลบข้อมูลใน Storage ด้วย (เผื่อกรณีต้องการล้างข้อมูลถาวร)
    if (user?.username) {
      localStorage.removeItem(getCartKey(user.username));
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, decreaseQuantity, clearCart, totalPrice, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};