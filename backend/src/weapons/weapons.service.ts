// backend/src/weapons/weapons.service.ts
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

  async findAll(filterDto: GetWeaponsFilterDto) {
    const { 
      category, 
      search, 
      page = 1, 
      limit = 18, 
      minPrice, 
      maxPrice, 
      licenseLevel, 
      sort 
    } = filterDto;
    
    const query = this.weaponRepository.createQueryBuilder('weapon');

    // Filter Category: ตอนนี้รับค่า 'light', 'heavy' ตรงๆ แล้วเทียบได้เลย (เร็วและถูกต้องที่สุด)
    if (category) {
      query.andWhere('weapon.category = :category', { category });
    }

    if (search) {
      query.andWhere(
        '(LOWER(weapon.name) LIKE LOWER(:search) OR LOWER(weapon.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (minPrice !== undefined) {
      query.andWhere('weapon.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('weapon.price <= :maxPrice', { maxPrice });
    }

    if (licenseLevel && licenseLevel > 0) {
      query.andWhere('weapon.required_license_level = :licenseLevel', { licenseLevel });
    }

    // Sorting
    if (sort === 'low-to-high') {
      query.orderBy('weapon.price', 'ASC');
    } else if (sort === 'high-to-low') {
      query.orderBy('weapon.price', 'DESC');
    } else {
      query.orderBy('weapon.id', 'ASC');
    }

    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [weapons, total] = await query.getManyAndCount();

    return {
      data: weapons,
      total,
      page,
      last_page: Math.ceil(total / limit),
    };
  }

  // --- Methods อื่นๆ คงเดิม ---
  async create(createWeaponDto: CreateWeaponDto) {
    const weapon = this.weaponRepository.create(createWeaponDto);
    return await this.weaponRepository.save(weapon);
  }

  async findOne(id: string): Promise<Weapon> {
    const weapon = await this.weaponRepository.findOneBy({ id });
    if (!weapon) {
      throw new NotFoundException(`Weapon with ID ${id} not found`);
    }
    return weapon;
  }

  async update(id: string, updateWeaponDto: UpdateWeaponDto): Promise<Weapon> {
    const weapon = await this.findOne(id);
    this.weaponRepository.merge(weapon, updateWeaponDto);
    return await this.weaponRepository.save(weapon);
  }

  async remove(id: string): Promise<void> {
    const result = await this.weaponRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Weapon with ID ${id} not found`);
    }
  }
}