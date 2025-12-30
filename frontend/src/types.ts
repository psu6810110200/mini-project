// src/types.ts

export interface UserProfile {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface LoginResponse {
  access_token: string;
  user: UserProfile;
}

// Payload สำหรับตอนสร้าง/แก้ไข (รับค่าจาก Form)
export interface WeaponPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  required_license_level: number;
  image?: string;
}

export const WeaponCategory = {
  LIGHT: 'light',
  HEAVY: 'heavy',
  EXPLOSIVE: 'explosive',
} as const;

export type WeaponCategory = typeof WeaponCategory[keyof typeof WeaponCategory];

export interface Weapon {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: WeaponCategory; // ตรงนี้ยังใช้ได้เหมือนเดิมเป๊ะ
  required_license_level: number;
  updated_at?: string;
  image?: string;
}
export interface CartItem extends Weapon {
  quantity: number;
}

export const OrderStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  weapon: Weapon; // หรือ Weapon ในแบบย่อ
}

export interface Order {
  id: string;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  order_items: OrderItem[];
}