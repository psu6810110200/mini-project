// frontend/src/api/weaponApi.ts
import api from './axios';
import type { Weapon, WeaponPayload } from '../types';

// Interface สำหรับ Response ที่มี Pagination จาก Backend
export interface WeaponsResponse {
  data: Weapon[];
  total: number;
  page: number;
  last_page: number;
}

// Interface สำหรับ Params ที่ส่งไปกรองข้อมูล
export interface GetWeaponsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  licenseLevel?: number;
  sort?: string; // 'low-to-high' | 'high-to-low' | 'default'
}

// ฟังก์ชันดึงข้อมูลสินค้า (รับ Params ได้ครบทุกตัว)
export const getWeapons = async (params?: GetWeaponsParams) => {
  // axios จะแปลง object params เป็น query string ให้อัตโนมัติ 
  // เช่น /weapons?page=1&limit=18&search=glock&minPrice=1000
  const response = await api.get<WeaponsResponse>('/weapons', { params });
  return response.data;
};

// ดึงข้อมูลสินค้าชิ้นเดียว (by ID)
export const getWeapon = async (id: string) => {
  const response = await api.get<Weapon>(`/weapons/${id}`);
  return response.data;
};

// สร้างสินค้าใหม่
export const createWeapon = async (data: WeaponPayload) => {
  const response = await api.post<Weapon>('/weapons', data);
  return response.data;
};

// อัปเดตสินค้า
export const updateWeapon = async (id: string, data: WeaponPayload) => {
  const response = await api.patch<Weapon>(`/weapons/${id}`, data);
  return response.data;
};

// ลบสินค้า
export const deleteWeapon = async (id: string) => {
  await api.delete(`/weapons/${id}`);
};