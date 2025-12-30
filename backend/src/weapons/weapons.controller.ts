import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { WeaponsService } from './weapons.service';
import { CreateWeaponDto } from './dto/create-weapon.dto';
import { UpdateWeaponDto } from './dto/update-weapon.dto';

import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { GetWeaponsFilterDto } from './dto/get-weapons-filter.dto';

// imports สำหรับการจัดการไฟล์
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('weapons')
export class WeaponsController {
  constructor(private readonly weaponsService: WeaponsService) {}

  @Get()
  findAll(@Query() filterDto: GetWeaponsFilterDto) {
    return this.weaponsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weaponsService.findOne(id);
  }

  // --- โซน Admin ---
  
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(UserRole.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('file', { // 'file' ต้องตรงกับชื่อ field ที่ส่งมาจาก Frontend
    storage: diskStorage({
      destination: './uploads', // โฟลเดอร์ปลายทาง
      filename: (req, file, cb) => {
        // ตั้งชื่อไฟล์ใหม่ให้ไม่ซ้ำกัน
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Body() createWeaponDto: CreateWeaponDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      // หมายเหตุ: คุณต้องเพิ่ม imageUrl ใน CreateWeaponDto และ Weapon Entity ก่อน
      (createWeaponDto as any).imageUrl = `/uploads/${file.filename}`;
    }
    return this.weaponsService.create(createWeaponDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  update(@Param('id') id: string, @Body() updateWeaponDto: UpdateWeaponDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
       // หมายเหตุ: คุณต้องเพิ่ม imageUrl ใน UpdateWeaponDto ก่อน
      (updateWeaponDto as any).imageUrl = `/uploads/${file.filename}`;
    }
    return this.weaponsService.update(id, updateWeaponDto); // id ใน Controller นี้เป็น string แต่ Service อาจรับ number ต้องเช็ค type ดีๆ
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weaponsService.remove(id);
  }
}