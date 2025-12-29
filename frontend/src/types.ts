
export interface UserProfile {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface LoginResponse {
  access_token: string;
  user: UserProfile;
}

// [เพิ่ม] Interface สำหรับอาวุธ
export interface Weapon {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: 'light' | 'heavy' | 'explosive';
  required_license_level: number;
  updated_at?: string;
}

// [เพิ่ม] Interface สำหรับฟอร์มสร้าง/แก้ไข
export interface WeaponPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  required_license_level: number;
}