import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWeaponDto } from './dto/create-weapon.dto';
import { UpdateWeaponDto } from './dto/update-weapon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weapon } from './entities/weapon.entity';

@Injectable()
export class WeaponsService {
  constructor(
    @InjectRepository(Weapon)
    private weaponRepository: Repository<Weapon>,
  ) {}
  // Create Weapon
  async create(createWeaponDto: CreateWeaponDto) {
    const weapon = this.weaponRepository.create(createWeaponDto);
    return await this.weaponRepository.save(weapon);
  }

  // Get all weapons
  async findAll(): Promise<Weapon[]> {
    return await this.weaponRepository.find();
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
