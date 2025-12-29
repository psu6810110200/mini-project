// src/api/weaponApi.ts
import api from './axios';
import type { Weapon, WeaponPayload } from '../types';

export const getWeapons = async () => {
  const response = await api.get<Weapon[]>('/weapons');
  return response.data;
};

export const getWeapon = async (id: string) => {
  const response = await api.get<Weapon>(`/weapons/${id}`);
  return response.data;
};

export const createWeapon = async (data: WeaponPayload) => {
  const response = await api.post<Weapon>('/weapons', data);
  return response.data;
};

export const updateWeapon = async (id: string, data: WeaponPayload) => {
  const response = await api.patch<Weapon>(`/weapons/${id}`, data);
  return response.data;
};

export const deleteWeapon = async (id: string) => {
  await api.delete(`/weapons/${id}`);
};