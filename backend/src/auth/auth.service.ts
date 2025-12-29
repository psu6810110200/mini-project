import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // ตัวช่วย Hash Password
import { CreateAuthDto } from './dto/create-auth.dto'; // ใช้ DTO ที่ Nest สร้างมาให้ (หรือสร้างใหม่ก็ได้)
import { LoginAuthDto } from './dto/login-auth.dto'; // *ต้องสร้างไฟล์นี้เพิ่ม หรือใช้ Any ไปก่อนก็ได้

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // --- 1. Register ---
  async register(createAuthDto: CreateAuthDto) {
    // เช็คก่อนว่า Username ซ้ำไหม (ต้องไปเขียน func findOneByUsername ใน UsersService เพิ่มทีหลัง)
    // แต่ตอนนี้ข้ามไปก่อน
    
    // Hash Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createAuthDto.password, salt);

    // สร้าง User ใหม่ (ส่ง password ที่ hash แล้วไปเก็บ)
    const newUser = await this.usersService.create({
      ...createAuthDto,
      password_hash: hashedPassword, // map ให้ตรงกับ field ใน Entity
    });

    return newUser;
  }

  // --- 2. Login ---
  async login(loginAuthDto: LoginAuthDto) {
    // ค้นหา User จาก username
    // หมายเหตุ: คุณต้องไปเพิ่ม method findByUsername ใน UsersService ก่อนนะ!
    const user = await this.usersService.findByUsername(loginAuthDto.username); 

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // ตรวจสอบ Password
    const isPasswordValid = await bcrypt.compare(loginAuthDto.password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // ถ้าผ่านหมด ให้สร้าง Token
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
  }
}