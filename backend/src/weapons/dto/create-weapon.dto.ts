import { WeaponCategory } from '../entities/weapon.entity';

export class CreateWeaponDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: WeaponCategory;
  required_license_level: number;
  image?: string;
}