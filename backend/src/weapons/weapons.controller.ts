import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WeaponsService } from './weapons.service';
import { CreateWeaponDto } from './dto/create-weapon.dto';
import { UpdateWeaponDto } from './dto/update-weapon.dto';

import { AuthGuard } from '@nestjs/passport'; // หรือใช้ JwtAuthGuard ที่คุณอาจสร้างแยกไว้
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@Controller('weapons')
export class WeaponsController {
  constructor(private readonly weaponsService: WeaponsService) {}

  @Get()
  findAll() {
    return this.weaponsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weaponsService.findOne(id);
  }

  // --- โซน Admin ---
  // ต้อง Login (JwtAuth) และต้องเป็น ADMIN (RolesGuard)
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createWeaponDto: CreateWeaponDto) {
    return this.weaponsService.create(createWeaponDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeaponDto: UpdateWeaponDto) {
    return this.weaponsService.update(id, updateWeaponDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weaponsService.remove(id);
  }
}
