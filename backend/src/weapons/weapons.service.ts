import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWeaponDto } from './dto/create-weapon.dto';
import { UpdateWeaponDto } from './dto/update-weapon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weapon } from './entities/weapon.entity';
import { GetWeaponsFilterDto } from './dto/get-weapons-filter.dto';

@Injectable()
export class WeaponsService {
  constructor(
    @InjectRepository(Weapon)
    private weaponRepository: Repository<Weapon>,
  ) {}
  // รับค่า Filter เข้ามา
  async findAll(filterDto: GetWeaponsFilterDto): Promise<Weapon[]> {
    const { category, search } = filterDto;
    
    // สร้าง Query Builder (ตัวช่วยสร้างคำสั่ง SQL)
    const query = this.weaponRepository.createQueryBuilder('weapon');

    // 1. ถ้ามีการส่ง category มา ให้เพิ่มเงื่อนไข WHERE category = ...
    if (category) {
      query.andWhere('weapon.category = :category', { category });
    }

    // 2. ถ้ามีการส่ง search (คำค้นหา) มา ให้เพิ่มเงื่อนไขค้นหาชื่อ (ใช้ ILIKE เพื่อให้ไม่สนตัวเล็กตัวใหญ่)
    if (search) {
      query.andWhere(
        '(LOWER(weapon.name) LIKE LOWER(:search) OR LOWER(weapon.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // สั่งรันคำสั่งดึงข้อมูล
    const weapons = await query.getMany();
    return weapons;
  }
  // Create Weapon
  async create(createWeaponDto: CreateWeaponDto) {
    const weapon = this.weaponRepository.create(createWeaponDto);
    return await this.weaponRepository.save(weapon);
  }


  // Get one weapon by ID
  async findOne(id: string): Promise<Weapon> {
    const weapon = await this.weaponRepository.findOneBy({ id });
    if (!weapon) {
      throw new NotFoundException(`Weapon with ID ${id} not found`);
    }
    return weapon;
  }

  // Update a weapon
  async update(id: string, updateWeaponDto: UpdateWeaponDto): Promise<Weapon> {
    const weapon = await this.findOne(id); // Ensure it exists
    this.weaponRepository.merge(weapon, updateWeaponDto);
    return await this.weaponRepository.save(weapon);
  }

  // Delete a weapon
  async remove(id: string): Promise<void> {
    const result = await this.weaponRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Weapon with ID ${id} not found`);
    }
  }
}
