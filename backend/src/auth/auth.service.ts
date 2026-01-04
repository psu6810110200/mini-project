import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // --- 1. Register (เพิ่ม parameter filename) ---
  async register(createAuthDto: CreateAuthDto, filename: string | null) {
    // 1. ตรวจสอบ Username ซ้ำ
    const existingUser = await this.usersService.findByUsername(createAuthDto.username);
    if (existingUser) {
      throw new UnauthorizedException('Username นี้ถูกใช้งานแล้ว');
    }
    
    // 2. Hash Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createAuthDto.password, salt);

    // 3. สร้าง User ใหม่ พร้อมชื่อไฟล์รูป
    const newUser = await this.usersService.create({
      ...createAuthDto,
      password_hash: hashedPassword,
      license_image: filename, // บันทึกชื่อไฟล์
      is_verified: false, // บังคับเป็น false ไว้ก่อน
    });

    return newUser;
  }

  // --- 2. Login ---
  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.usersService.findByUsername(loginAuthDto.username); 

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(loginAuthDto.password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role,
      is_verified: user.is_verified // ใส่สถานะลงใน token ด้วยก็ได้เผื่อ Frontend ใช้
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        is_verified: user.is_verified,
        license_image: user.license_image,
        license_number: user.license_number
      }
    };
  }
}