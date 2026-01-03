import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // อย่าลืมสร้างโฟลเดอร์ uploads ไว้ที่ root ของโปรเจกต์ backend
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `license-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  register(
    @Body() createAuthDto: CreateAuthDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      // อนุญาตให้ผ่านได้ถ้าเป็น admin หรือถ้าต้องการบังคับก็ throw error ได้เลย
      // throw new BadRequestException('กรุณาอัปโหลดรูปภาพใบอนุญาต');
    }
    
    // ส่งชื่อไฟล์ไปบันทึก (ถ้ามีไฟล์)
    const filename = file ? file.filename : null;
    return this.authService.register(createAuthDto, filename);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
}