// backend/src/weapons/dto/get-weapons-filter.dto.ts
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { WeaponCategory } from '../entities/weapon.entity';

export class GetWeaponsFilterDto {
  @IsOptional()
  @IsString()
  search?: string; // เอาไว้ค้นหาชื่อ (Keyword)

  @IsOptional()
  @IsEnum(WeaponCategory)
  category?: WeaponCategory; // เอาไว้กรองหมวดหมู่ (light, heavy, explosive)
}