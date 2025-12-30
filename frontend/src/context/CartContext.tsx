// src/context/CartContext.tsx
import React, { createContext, useState, type ReactNode, useEffect } from 'react';
import type { Weapon, CartItem } from '../types';
import { toast } from 'react-toastify';

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

// แก้ไขฟังก์ชัน addToCart (ย้าย toast ออกมาข้างนอก setItems)
  const addToCart = (weapon: Weapon) => {
    // 1. เช็คก่อนว่ามีของในตะกร้าหรือยัง (เช็คจากตัวแปร items โดยตรง)
    const existingItem = items.find((i) => i.id === weapon.id);

    if (existingItem) {
      // ถ้ามีแล้ว -> เช็ค Stock ก่อน
      if (existingItem.quantity >= weapon.stock) {
        toast.error('สินค้าหมดสต็อกแล้ว!');
        return; // จบการทำงาน ไม่ไปอัปเดต State
      }

      // ถ้า Stock เหลือ -> แจ้งเตือนก่อน แล้วค่อยอัปเดต
      toast.success(`เพิ่ม ${weapon.name} อีก 1 ชิ้น`);
      
      setItems((prev) => 
        prev.map((item) => 
          item.id === weapon.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // ถ้ายังไม่มี -> แจ้งเตือนก่อน แล้วค่อยเพิ่มใหม่
      toast.success(`เพิ่ม ${weapon.name} ลงตะกร้าแล้ว`);
      
      setItems((prev) => [...prev, { ...weapon, quantity: 1 }]);
    }
  };

  // 2. ฟังก์ชันลบสินค้าออกจากตะกร้าเลย
  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.info('ลบสินค้าออกจากตะกร้าแล้ว');
  };

  // 3. ฟังก์ชันลดจำนวน (ถ้าเหลือ 1 แล้วกดลด จะหายไปเลย)
  const decreaseQuantity = (id: string) => {
    setItems((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }).filter((item) => item.quantity > 0); // กรองตัวที่เหลือ 0 ทิ้ง
    });
  };

  // 4. ล้างตะกร้า
  const clearCart = () => setItems([]);

  // 5. คำนวณยอดรวม (Derived State)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, decreaseQuantity, clearCart, totalPrice, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};