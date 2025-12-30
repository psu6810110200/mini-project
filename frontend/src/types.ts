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
}
export interface CartItem extends Weapon {
  quantity: number;
}